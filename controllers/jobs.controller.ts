import type { Request, Response } from "express";
import { request as httpsReq } from "node:https";
import { IncomingMessage } from "node:http";

// ─── In-memory cache (30-minute TTL) ─────────────────────────────────────────
interface CacheEntry { data: any; expiresAt: number }
const cache = new Map<string, CacheEntry>();

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) return entry.data;
  cache.delete(key);
  return null;
}
function setCached(key: string, data: any, ttlMs = 30 * 60 * 1000) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// ─── HTTPS GET helper ─────────────────────────────────────────────────────────
function httpsGet(url: string, headers: Record<string, string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = httpsReq(
      {
        hostname: urlObj.hostname,
        path:     urlObj.pathname + urlObj.search,
        method:   "GET",
        headers:  { "Content-Type": "application/json", ...headers },
        rejectUnauthorized: false,
      },
      (res: IncomingMessage) => {
        let data = "";
        res.on("data",  (chunk: Buffer) => { data += chunk.toString(); });
        res.on("end",   () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
          catch { reject(new Error(`Non-JSON from ${urlObj.hostname}: ${data.slice(0, 200)}`)); }
        });
        res.on("error", reject);
      },
    );
    const timer = setTimeout(() => { req.destroy(); reject(new Error("Request timed out")); }, 15_000);
    req.on("close", () => clearTimeout(timer));
    req.on("error", (e) => { clearTimeout(timer); reject(e); });
    req.end();
  });
}

// ─── Normalised Job type ──────────────────────────────────────────────────────
export interface NormalisedJob {
  id:          string;
  title:       string;
  company:     string;
  location:    string;
  type:        string;   // Full-time | Part-time | Remote | Internship | Contract
  category:    string;
  description: string;
  salary:      string;
  postedAt:    string;   // ISO date string
  applyUrl:    string;
  source:      string;   // "JSearch" | "Adzuna" | "Remotive"
  logo?:       string;
  tags:        string[];
  isRemote:    boolean;
  experience:  string;   // "Fresher" | "0-1 years" | "1-3 years"
}

// ─── SOURCE 1: Remotive (FREE — no API key) ───────────────────────────────────
async function fetchRemotive(keyword: string, category: string): Promise<NormalisedJob[]> {
  const categoryMap: Record<string, string> = {
    "Software":    "software-dev",
    "Data":        "data",
    "DevOps":      "devops-sysadmin",
    "Design":      "design",
    "Marketing":   "marketing",
    "QA":          "qa",
    "Management":  "product",
    "All":         "",
  };
  const cat = categoryMap[category] || "";
  const url = `https://remotive.com/api/remote-jobs?limit=20${cat ? `&category=${cat}` : ""}${keyword ? `&search=${encodeURIComponent(keyword)}` : ""}`;

  const { body } = await httpsGet(url);
  const jobs = body?.jobs || [];

  return jobs.map((j: any): NormalisedJob => ({
    id:          `remotive-${j.id}`,
    title:       j.title || "Software Engineer",
    company:     j.company_name || "Company",
    location:    j.candidate_required_location || "Remote",
    type:        "Remote",
    category:    j.category || "Software",
    description: (j.description || "").replace(/<[^>]*>/g, "").slice(0, 300) + "…",
    salary:      j.salary || "",
    postedAt:    j.publication_date || new Date().toISOString(),
    applyUrl:    j.url || "#",
    source:      "Remotive",
    logo:        j.company_logo || "",
    tags:        (j.tags || []).slice(0, 5),
    isRemote:    true,
    experience:  "Fresher",
  }));
}

// ─── SOURCE 2: Adzuna API ─────────────────────────────────────────────────────
async function fetchAdzuna(keyword: string, location: string, page: number): Promise<NormalisedJob[]> {
  const appId  = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  const country = "in"; // India
  const what    = encodeURIComponent(keyword || "fresher software engineer");
  const where   = encodeURIComponent(location || "");
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&what=${what}${where ? `&where=${where}` : ""}&results_per_page=20&content-type=application/json&sort_by=date&title_only=${what}`;

  const { body } = await httpsGet(url);
  const results = body?.results || [];

  return results.map((j: any): NormalisedJob => ({
    id:          `adzuna-${j.id}`,
    title:       j.title || "",
    company:     j.company?.display_name || "Company",
    location:    j.location?.display_name || "India",
    type:        j.contract_time === "part_time" ? "Part-time" : "Full-time",
    category:    j.category?.label || "Technology",
    description: (j.description || "").slice(0, 300) + "…",
    salary:      j.salary_min && j.salary_max
      ? `₹${Math.round(j.salary_min / 1000)}K – ₹${Math.round(j.salary_max / 1000)}K`
      : "",
    postedAt:    j.created || new Date().toISOString(),
    applyUrl:    j.redirect_url || j.url || "#",
    source:      "Adzuna",
    logo:        "",
    tags:        [],
    isRemote:    (j.title || "").toLowerCase().includes("remote"),
    experience:  "Fresher",
  }));
}

// ─── SOURCE 3: JSearch via RapidAPI ──────────────────────────────────────────
async function fetchJSearch(keyword: string, location: string, page: number): Promise<NormalisedJob[]> {
  const apiKey = process.env.JSEARCH_API_KEY;
  if (!apiKey) return [];

  const query  = encodeURIComponent(`${keyword || "fresher software engineer"} ${location || "India"}`);
  const url    = `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&num_pages=1&date_posted=month`;

  const { body } = await httpsGet(url, {
    "x-rapidapi-key":  apiKey,
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  });
  const results = body?.data || [];

  return results.map((j: any): NormalisedJob => ({
    id:          `jsearch-${j.job_id}`,
    title:       j.job_title || "",
    company:     j.employer_name || "Company",
    location:    `${j.job_city || ""}${j.job_city && j.job_country ? ", " : ""}${j.job_country || ""}`.trim() || "India",
    type:        j.job_employment_type === "FULLTIME" ? "Full-time"
               : j.job_employment_type === "PARTTIME" ? "Part-time"
               : j.job_employment_type === "INTERN"   ? "Internship"
               : j.job_employment_type === "CONTRACTOR" ? "Contract"
               : "Full-time",
    category:    j.job_publisher || "Technology",
    description: (j.job_description || "").slice(0, 300) + "…",
    salary:      j.job_min_salary && j.job_max_salary
      ? `$${j.job_min_salary} – $${j.job_max_salary}`
      : "",
    postedAt:    j.job_posted_at_datetime_utc || new Date().toISOString(),
    applyUrl:    j.job_apply_link || j.job_google_link || "#",
    source:      "JSearch",
    logo:        j.employer_logo || "",
    tags:        (j.job_required_skills || []).slice(0, 5),
    isRemote:    j.job_is_remote || false,
    experience:  "Fresher",
  }));
}

// ─── SOURCE 4: The Muse API (Free, no key needed) ─────────────────────────────
async function fetchTheMuse(keyword: string, page: number): Promise<NormalisedJob[]> {
  const q   = encodeURIComponent(keyword || "software engineer");
  const url = `https://www.themuse.com/api/public/jobs?category=Software+Engineer&category=Data+Science&category=IT&level=Entry+Level&page=${page - 1}&descending=true`;

  const { body } = await httpsGet(url);
  const results: any[] = body?.results || [];

  return results.map((j: any): NormalisedJob => ({
    id:          `muse-${j.id}`,
    title:       j.name || "",
    company:     j.company?.name || "Company",
    location:    (j.locations || []).map((l: any) => l.name).join(", ") || "Remote",
    type:        j.type || "Full-time",
    category:    (j.categories || []).map((c: any) => c.name).join(", ") || "Technology",
    description: (j.contents || "").replace(/<[^>]*>/g, "").slice(0, 300) + "…",
    salary:      "",
    postedAt:    j.publication_date || new Date().toISOString(),
    applyUrl:    j.refs?.landing_page || "#",
    source:      "TheMuse",
    logo:        j.company?.refs?.logo_image || "",
    tags:        (j.categories || []).map((c: any) => c.name).slice(0, 3),
    isRemote:    (j.locations || []).some((l: any) => l.name?.toLowerCase().includes("remote")),
    experience:  "Entry Level",
  }));
}

// ─── Deduplicate by title + company ───────────────────────────────────────────
function dedup(jobs: NormalisedJob[]): NormalisedJob[] {
  const seen = new Set<string>();
  return jobs.filter((j) => {
    const key = `${j.title.toLowerCase().trim()}|${j.company.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── GET /api/jobs ────────────────────────────────────────────────────────────
export const getJobs = async (req: Request, res: Response) => {
  const {
    keyword   = "",
    location  = "",
    category  = "All",
    type      = "All",
    page      = "1",
    source    = "all",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const cacheKey = `jobs:${keyword}:${location}:${category}:${type}:${pageNum}:${source}`;

  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`📦 Jobs cache hit: ${cacheKey}`);
    return res.json(cached);
  }

  console.log(`🔍 Fetching jobs — keyword="${keyword}" location="${location}" category="${category}" page=${pageNum}`);

  const results = await Promise.allSettled([
    source === "all" || source === "remotive"  ? fetchRemotive(keyword, category).catch(() => []) : Promise.resolve([]),
    source === "all" || source === "adzuna"    ? fetchAdzuna(keyword, location, pageNum).catch(() => []) : Promise.resolve([]),
    source === "all" || source === "jsearch"   ? fetchJSearch(keyword, location, pageNum).catch(() => []) : Promise.resolve([]),
    source === "all" || source === "themuse"   ? fetchTheMuse(keyword, pageNum).catch(() => []) : Promise.resolve([]),
  ]);

  let jobs: NormalisedJob[] = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  jobs = dedup(jobs);

  // Filter by job type
  if (type && type !== "All") {
    jobs = jobs.filter((j) => j.type.toLowerCase().includes(type.toLowerCase()) ||
      (type === "Remote" && j.isRemote));
  }

  // Sort: newest first
  jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  // Sources that responded
  const sources = [...new Set(jobs.map((j) => j.source))];
  const hasJSearch  = !!process.env.JSEARCH_API_KEY;
  const hasAdzuna   = !!(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY);

  const response = {
    jobs,
    total:    jobs.length,
    page:     pageNum,
    sources,
    apiStatus: {
      remotive: true,
      jsearch:  hasJSearch,
      adzuna:   hasAdzuna,
      themuse:  true,
    },
  };

  setCached(cacheKey, response);
  console.log(`  → ${jobs.length} jobs from [${sources.join(", ")}]`);
  res.json(response);
};

// ─── GET /api/jobs/status ─────────────────────────────────────────────────────
export const getJobsStatus = (_req: Request, res: Response) => {
  res.json({
    configured: {
      jsearch:  !!process.env.JSEARCH_API_KEY,
      adzuna:   !!(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY),
      remotive: true,
      themuse:  true,
    },
    freeApis:  ["remotive", "themuse"],
    paidApis:  ["jsearch", "adzuna"],
  });
};

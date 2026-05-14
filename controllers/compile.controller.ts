import type { Request, Response } from "express";
import { request as httpsReq } from "node:https";
import { Buffer } from "node:buffer";

// ─── Judge0 CE config ─────────────────────────────────────────────────────────
const JUDGE0_HOST = "ce.judge0.com";
const JUDGE0_PATH = "/submissions?wait=true&base64_encoded=false";

const LANG_CONFIG: Record<string, { id: number; label: string; version: string }> = {
  python:     { id: 71, label: "Python",      version: "3.8.1"    },
  javascript: { id: 63, label: "JavaScript",  version: "Node 12.14.0" },
  cpp:        { id: 54, label: "C++",         version: "GCC 9.2.0"   },
  java:       { id: 62, label: "Java",        version: "OpenJDK 13.0.1" },
  c:          { id: 50, label: "C",           version: "GCC 9.2.0"   },
};

// ─── Judge0 status IDs → human-readable ──────────────────────────────────────
const STATUS_MAP: Record<number, string> = {
  1:  "In Queue",
  2:  "Processing",
  3:  "Accepted",
  4:  "Wrong Answer",
  5:  "Time Limit Exceeded",
  6:  "Compilation Error",
  7:  "Runtime Error (SIGSEGV)",
  8:  "Runtime Error (SIGXFSZ)",
  9:  "Runtime Error (SIGFPE)",
  10: "Runtime Error (SIGABRT)",
  11: "Runtime Error (NZEC)",
  12: "Runtime Error (Other)",
  13: "Internal Error",
  14: "Exec Format Error",
};

// ─── SQL Validator ─────────────────────────────────────────────────────────────
function validateSQL(code: string): { valid: boolean; error?: string } {
  const trimmed = code.trim().toUpperCase();
  const validStmts = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER", "WITH"];
  if (!validStmts.some((s) => trimmed.startsWith(s))) {
    return { valid: false, error: `SQL must start with one of: ${validStmts.join(", ")}` };
  }
  // Basic structural checks
  if (trimmed.startsWith("SELECT") && !trimmed.includes("FROM") && !trimmed.includes("DUAL") && !trimmed.includes("1")) {
    return { valid: false, error: "SELECT statement seems to be missing FROM clause" };
  }
  return { valid: true };
}

// ─── Java class-name normaliser ───────────────────────────────────────────────
function preprocessCode(language: string, code: string): string {
  if (language === "java") {
    return code.replace(/public\s+class\s+\w+/g, "public class Main");
  }
  return code;
}

// ─── Format compiler/runtime errors for clarity ───────────────────────────────
function formatError(stderr: string, compileOut: string, statusId: number, language: string): string {
  const raw = (compileOut || stderr || "").trim();
  if (!raw) return "";

  const statusDesc = STATUS_MAP[statusId] || "Error";

  // Already descriptive — just clean it up
  if (statusId === 6) {
    // Compilation Error
    return cleanCompileError(raw, language);
  }
  if (statusId >= 7 && statusId <= 12) {
    return cleanRuntimeError(raw, statusDesc, language);
  }
  if (statusId === 5) {
    return "⏱ Time Limit Exceeded — your solution took too long.\nTip: Check for infinite loops or use a more efficient algorithm.";
  }
  return raw;
}

function cleanCompileError(raw: string, language: string): string {
  const lines = raw.split("\n").filter((l) => l.trim());

  if (language === "cpp") {
    // Remove /tmp/xxx.cpp: prefix for cleaner output
    return lines
      .map((l) => l.replace(/^\/tmp\/[^:]+:/, "line "))
      .join("\n");
  }
  if (language === "java") {
    return lines
      .map((l) => l.replace(/^Main\.java:/, "line "))
      .join("\n");
  }
  if (language === "python") {
    // Python already gives clean tracebacks
    return raw;
  }
  return raw;
}

function cleanRuntimeError(raw: string, statusDesc: string, language: string): string {
  const lines = raw.split("\n").filter((l) => l.trim());
  const cleaned = lines
    .map((l) => l.replace(/^\/tmp\/[^:]+:/, "").replace(/^Main\.java:/, ""))
    .join("\n");

  const tip: Record<string, string> = {
    "Runtime Error (SIGSEGV)": "Segmentation fault — likely a null pointer or out-of-bounds array access.",
    "Runtime Error (SIGFPE)":  "Floating point exception — division by zero?",
    "Runtime Error (SIGABRT)": "Abort signal — check assert() calls or allocations.",
    "Runtime Error (NZEC)":    "Non-zero exit code — unhandled exception or missing return value.",
    "Runtime Error (Other)":   "Runtime error — check your logic and edge cases.",
  };

  const hint = tip[statusDesc] || "Runtime error — review edge cases.";
  return cleaned
    ? `${cleaned}\n\n💡 Hint: ${hint}`
    : `💡 ${hint}`;
}

// ─── HTTPS helper ─────────────────────────────────────────────────────────────
function judge0Post(body: object, timeoutMs = 30_000): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = httpsReq(
      {
        hostname: JUDGE0_HOST,
        path:     JUDGE0_PATH,
        method:   "POST",
        headers: {
          "Content-Type":   "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        rejectUnauthorized: false,
      },
      (res) => {
        let data = "";
        res.on("data",  (chunk: Buffer) => { data += chunk.toString(); });
        res.on("end",   () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
          catch { reject(new Error(`Non-JSON response from Judge0: ${data.slice(0, 200)}`)); }
        });
        res.on("error", reject);
      },
    );
    const timer = setTimeout(() => { req.destroy(); reject(new Error("Request timed out after 30s")); }, timeoutMs);
    req.on("close", () => clearTimeout(timer));
    req.on("error", (err) => { clearTimeout(timer); reject(err); });
    req.write(payload);
    req.end();
  });
}

// ─── Compile handler ──────────────────────────────────────────────────────────
export const compileCode = async (req: Request, res: Response) => {
  const { language, code, stdin = "" } = req.body;

  if (!language || !code) {
    return res.status(400).json({ message: "language and code are required" });
  }

  // ── SQL ──
  if (language === "sql") {
    const validation = validateSQL(code);
    if (!validation.valid) {
      return res.json({
        stdout:   "",
        stderr:   `Syntax Error: ${validation.error}`,
        exitCode: 1,
        status:   "Compilation Error",
      });
    }
    return res.json({
      stdout:   "Query validated successfully.\n(SQL execution requires a connected database — submit to run against real test cases.)",
      stderr:   "",
      exitCode: 0,
      status:   "Accepted",
      time:     "0.01",
      memory:   0,
    });
  }

  const cfg = LANG_CONFIG[language as string];
  if (!cfg) {
    return res.status(400).json({
      message: `Unsupported language "${language}". Supported: python, javascript, cpp, java, sql`,
    });
  }

  const processedCode = preprocessCode(language, code);
  console.log(`🔧 Compiling ${cfg.label} (${cfg.version}) via Judge0 CE`);

  try {
    const { status: httpStatus, body: result } = await judge0Post({
      source_code: processedCode,
      language_id: cfg.id,
      stdin:       stdin || "",
      cpu_time_limit:    10,    // seconds
      cpu_extra_time:    2,
      wall_time_limit:   15,
      memory_limit:      262144, // 256 MB
    });

    if (httpStatus !== 200 && httpStatus !== 201) {
      console.error(`Judge0 returned HTTP ${httpStatus}:`, result);
      return res.json({
        stdout:   "",
        stderr:   `Compiler service unavailable (HTTP ${httpStatus}). Please try again.`,
        exitCode: 1,
        status:   "Service Error",
      });
    }

    const statusId   = result.status?.id   || 0;
    const statusDesc = STATUS_MAP[statusId] || result.status?.description || "Unknown";
    const stdout     = result.stdout        || "";
    const compileOut = result.compile_output || "";
    const rawStderr  = result.stderr        || "";
    const exitCode   = (statusId === 3) ? 0 : 1;

    const stderr = formatError(rawStderr, compileOut, statusId, language);

    console.log(`  → ${cfg.label} [${statusDesc}] time=${result.time}s mem=${result.memory}KB`);

    return res.json({
      stdout,
      stderr,
      exitCode,
      status:   statusDesc,
      statusId,
      time:     result.time     || null,
      memory:   result.memory   || null,
      language: cfg.label,
      version:  cfg.version,
    });

  } catch (err: any) {
    const msg = err.message || "unknown error";
    console.error("Compile error:", msg);

    let stderr = `Compiler error: ${msg}`;
    if (msg.includes("timed out")) {
      stderr = "⏱ Execution timed out (30s). Check for infinite loops.";
    } else if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND")) {
      stderr = "Cannot reach the Judge0 compiler service. Check network connection.";
    }

    return res.json({
      stdout:   "",
      stderr,
      exitCode: 1,
      status:   "Error",
    });
  }
};

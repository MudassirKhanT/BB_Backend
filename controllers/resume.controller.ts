import type { Response } from "express";
import { groqRequest } from "../utils/groq.ts";

const ANALYSIS_PROMPT = (text: string) => `
You are a senior ATS (Applicant Tracking System) expert and technical recruiter with 10+ years of experience reviewing software engineering and placement resumes for companies like Google, Amazon, and top Indian product companies.

Analyze the following resume and return ONLY a valid JSON object with this exact structure (no markdown, no extra text):

{
  "atsScore": <integer 0-100>,
  "scoreBreakdown": {
    "formatting": <integer 0-20>,
    "keywords": <integer 0-25>,
    "experience": <integer 0-25>,
    "education": <integer 0-15>,
    "skills": <integer 0-15>
  },
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "improvements": [
    {
      "category": "<one of: Contact Info | Summary | Experience | Education | Skills | Formatting | Keywords | Projects | Achievements>",
      "issue": "<specific problem found>",
      "suggestion": "<clear actionable fix>"
    }
  ],
  "keywords": {
    "present": ["<keyword1>", "<keyword2>"],
    "missing": ["<keyword1>", "<keyword2>"]
  },
  "verdict": "<one-line final verdict>"
}

Resume:
---
${text.slice(0, 6000)}
---
`;

export const analyzeResume = async (req: any, res: Response) => {
  try {
    const apiKey = (process.env.GROQ_API_KEY || "").trim();
    if (!apiKey) {
      return res.status(503).json({ message: "GROQ_API_KEY is not set in .env" });
    }

    const resumeText = (req.body.resumeText || "").trim();
    if (resumeText.length < 100) {
      return res.status(400).json({ message: "Resume content is too short." });
    }

    const content = await groqRequest(
      apiKey,
      [{ role: "user", content: ANALYSIS_PROMPT(resumeText) }],
      { model: "llama-3.3-70b-versatile", temperature: 0.3, maxTokens: 4096 },
    );

    // Strip markdown code fences then grab the first { ... } block
    const stripped = content.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);

    let result: any;
    try {
      result = JSON.parse(jsonMatch ? jsonMatch[0] : stripped);
    } catch (e) {
      console.error("JSON parse failed. Content snippet:", content.slice(0, 400));
      return res.status(500).json({ message: "AI returned an unexpected format. Please try again." });
    }

    res.json(result);
  } catch (err: any) {
    console.error("Resume analyze error:", err.message);
    res.status(500).json({ message: err.message || "Analysis failed" });
  }
};

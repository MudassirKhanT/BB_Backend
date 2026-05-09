import type { Response } from "express";
import Problem from "../models/problem.model.ts";
import UserProblemStatus from "../models/userProblemStatus.model.ts";
import Course from "../models/course.model.ts";
import { judgeSubmission } from "../utils/judge.ts";

// ── Admin CRUD ────────────────────────────────────────────────────────────────

export const getAllProblemsAdmin = async (_req: any, res: Response) => {
  try {
    const problems = await Problem.find()
      .populate("course", "title slug")
      .sort({ createdAt: -1 });
    res.json(problems);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

function validateHiddenTestCases(testCases: any[]) {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error("Problem must include at least one test case.");
  }
  const hiddenCount = testCases.filter((tc) => tc.isHidden).length;
  if (hiddenCount < 50) {
    throw new Error("Every problem must have at least 50 hidden test cases.");
  }
}

export const createProblem = async (req: any, res: Response) => {
  try {
    validateHiddenTestCases(req.body.testCases || []);
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProblem = async (req: any, res: Response) => {
  try {
    if (req.body.testCases) {
      validateHiddenTestCases(req.body.testCases);
    }
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const submitProblem = async (req: any, res: Response) => {
  try {
    const { slug } = req.params;
    const { language, code } = req.body;

    if (!language || !code) {
      return res
        .status(400)
        .json({ message: "Language and code are required for submission." });
    }

    const problem = await Problem.findOne({ slug, isPublished: true });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const allTests = problem.testCases || [];
    if (!allTests.length) {
      return res
        .status(400)
        .json({ message: "No test cases configured for this problem." });
    }

    const result = await judgeSubmission(language, code, allTests);
    const status = result.status === "accepted" ? "solved" : "attempted";

    await UserProblemStatus.findOneAndUpdate(
      { user: req.user._id, problem: problem._id },
      {
        status,
        language,
        lastCode: code,
        ...(status === "solved" ? { solvedAt: new Date() } : {}),
      },
      { upsert: true, new: true },
    );

    res.json({
      status: result.status,
      passedCount: result.testResults.filter((t) => t.passed).length,
      totalCount: result.testResults.length,
      testResults: result.testResults,
      message:
        result.status === "accepted"
          ? "All test cases passed!"
          : "Some tests failed.",
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Submission failed" });
  }
};

export const deleteProblem = async (req: any, res: Response) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    await UserProblemStatus.deleteMany({ problem: req.params.id });
    res.json({ message: "Problem deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /problems/all — all published problems grouped by topic (public)
export const getAllProblems = async (req: any, res: Response) => {
  try {
    const userId = req.user?._id;
    const companyFilter = req.query.company as string | undefined;

    const query: any = { isPublished: true };
    if (companyFilter) {
      query.companies = {
        $elemMatch: {
          $regex: `^${companyFilter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
      };
    }

    const problems = await Problem.find(query)
      .select(
        "title slug difficulty frequency topicTag leetcodeUrl order course companies",
      )
      .sort({ topicTag: 1, order: 1 });

    let statusMap: Record<string, string> = {};
    if (userId) {
      const statuses = await UserProblemStatus.find({
        user: userId,
        problem: { $in: problems.map((p) => p._id) },
      });
      statuses.forEach((s: any) => {
        statusMap[s.problem.toString()] = s.status;
      });
    }

    const grouped: Record<string, any> = {};
    for (const p of problems) {
      if (!grouped[p.topicTag]) {
        grouped[p.topicTag] = {
          topic: p.topicTag,
          problems: [],
          solved: 0,
          total: 0,
        };
      }
      const status = statusMap[p._id.toString()] || null;
      grouped[p.topicTag].problems.push({
        ...p.toObject(),
        userStatus: status,
      });
      grouped[p.topicTag].total++;
      if (status === "solved") grouped[p.topicTag].solved++;
    }

    res.json({ topics: Object.values(grouped) });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to load problems" });
  }
};

// GET /problems/course/:courseSlug — grouped by topic with user status
export const getProblemsByCourse = async (req: any, res: Response) => {
  try {
    const { courseSlug } = req.params;
    const userId = req.user?._id;

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const problems = await Problem.find({
      course: course._id,
      isPublished: true,
    })
      .select("title slug difficulty frequency topicTag leetcodeUrl order")
      .sort({ topicTag: 1, order: 1 });

    // Build user status map
    let statusMap: Record<string, string> = {};
    if (userId) {
      const statuses = await UserProblemStatus.find({
        user: userId,
        problem: { $in: problems.map((p) => p._id) },
      });
      statuses.forEach((s: any) => {
        statusMap[s.problem.toString()] = s.status;
      });
    }

    // Group by topicTag
    const grouped: Record<string, any> = {};
    for (const p of problems) {
      if (!grouped[p.topicTag]) {
        grouped[p.topicTag] = {
          topic: p.topicTag,
          problems: [],
          solved: 0,
          total: 0,
        };
      }
      const status = statusMap[p._id.toString()] || null;
      grouped[p.topicTag].problems.push({
        ...p.toObject(),
        userStatus: status,
      });
      grouped[p.topicTag].total++;
      if (status === "solved") grouped[p.topicTag].solved++;
    }

    res.json({ topics: Object.values(grouped) });
  } catch (err: any) {
    console.error("getProblemsByCourse error:", err.message);
    res.status(500).json({ message: "Failed to load problems" });
  }
};

// GET /problems/potd — deterministic daily problem
export const getProblemOfTheDay = async (req: any, res: Response) => {
  try {
    // Get both coding and SQL problems for the day
    const codingProblems = await Problem.find({
      isPublished: true,
      type: "coding",
    }).select("_id");
    const sqlProblems = await Problem.find({
      isPublished: true,
      type: "sql",
    }).select("_id");

    if (!codingProblems.length && !sqlProblems.length) {
      return res.status(404).json({ message: "No problems found" });
    }

    const today = new Date().toISOString().split("T")[0];
    const hash = today.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

    let codingProblem = null;
    let sqlProblem = null;

    // Select a coding problem for today
    if (codingProblems.length) {
      const codingIndex = hash % codingProblems.length;
      codingProblem = await Problem.findById(codingProblems[codingIndex]._id);
    }

    // Select a SQL problem for today (using a different hash offset)
    if (sqlProblems.length) {
      const sqlIndex = (hash + 1) % sqlProblems.length;
      sqlProblem = await Problem.findById(sqlProblems[sqlIndex]._id);
    }

    res.json({
      codingProblem,
      sqlProblem,
      date: today,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to get problem of the day" });
  }
};

// GET /problems/:slug — single problem
export const getProblemBySlug = async (req: any, res: Response) => {
  try {
    const problem = await Problem.findOne({
      slug: req.params.slug,
      isPublished: true,
    });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    let userStatus = null;
    if (req.user?._id) {
      const s = await UserProblemStatus.findOne({
        user: req.user._id,
        problem: problem._id,
      });
      userStatus = s?.status || null;
    }

    const visibleTestCases = (problem.testCases || []).filter(
      (tc) => !tc.isHidden,
    );
    const hiddenCount = (problem.testCases || []).filter(
      (tc) => tc.isHidden,
    ).length;

    const response = {
      ...problem.toObject(),
      testCases: visibleTestCases,
      hiddenTestCaseCount: hiddenCount,
      totalTestCaseCount: (problem.testCases || []).length,
      userStatus,
    };

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to load problem" });
  }
};

// POST /problems/:slug/status — mark solved or attempted
export const updateProblemStatus = async (req: any, res: Response) => {
  try {
    const { status, language, code } = req.body;
    const userId = req.user._id;

    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    await UserProblemStatus.findOneAndUpdate(
      { user: userId, problem: problem._id },
      {
        status,
        language: language || "python",
        lastCode: code || "",
        ...(status === "solved" ? { solvedAt: new Date() } : {}),
      },
      { upsert: true, new: true },
    );

    res.json({ message: "Status updated", status });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

import { request as httpsReq } from "node:https";
import { Buffer } from "node:buffer";

const JUDGE0_HOST = "ce.judge0.com";
const JUDGE0_PATH = "/submissions?wait=true&base64_encoded=false";

const LANG_CONFIG: Record<string, { id: number }> = {
  python:     { id: 71 },
  javascript: { id: 63 },
  cpp:        { id: 54 },
  java:       { id: 62 },
  c:          { id: 50 },
};

const STATUS_NAMES: Record<number, string> = {
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
};

function preprocessCode(language: string, code: string): string {
  if (language === "java") {
    return code.replace(/public\s+class\s+\w+/g, "public class Main");
  }
  return code;
}

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
          catch { reject(new Error(`Non-JSON from Judge0: ${data.slice(0, 200)}`)); }
        });
        res.on("error", reject);
      },
    );
    const timer = setTimeout(() => { req.destroy(); reject(new Error("Judge0 timed out")); }, timeoutMs);
    req.on("close", () => clearTimeout(timer));
    req.on("error", (e) => { clearTimeout(timer); reject(e); });
    req.write(payload);
    req.end();
  });
}

export async function runCode(
  language: string,
  code: string,
  stdin: string,
): Promise<{ stdout: string; stderr: string; exitCode: number; statusDesc: string; statusId: number; time?: string; memory?: number }> {
  const cfg = LANG_CONFIG[language];
  if (!cfg) throw new Error(`Unsupported language: ${language}`);

  const { status: httpStatus, body: result } = await judge0Post({
    source_code:      preprocessCode(language, code),
    language_id:      cfg.id,
    stdin:            stdin || "",
    cpu_time_limit:   10,
    cpu_extra_time:   2,
    wall_time_limit:  15,
    memory_limit:     262144,
  });

  if (httpStatus !== 200 && httpStatus !== 201) {
    return { stdout: "", stderr: `Judge0 HTTP ${httpStatus}`, exitCode: 1, statusDesc: "Error", statusId: 0 };
  }

  const statusId   = result.status?.id   || 0;
  const statusDesc = STATUS_NAMES[statusId] || result.status?.description || "Unknown";
  const stdout     = result.stdout         || "";
  const compileOut = result.compile_output || "";
  const stderr     = compileOut || result.stderr || "";
  const exitCode   = statusId === 3 ? 0 : 1;

  return { stdout, stderr, exitCode, statusDesc, statusId, time: result.time, memory: result.memory };
}

export interface TestResult {
  input:          string;
  expectedOutput: string;
  actualOutput:   string;
  passed:         boolean;
  stderr:         string;
  statusDesc?:    string;
  time?:          string;
}

export type SubmissionStatus = "accepted" | "wrong_answer" | "runtime_error" | "compile_error" | "time_limit_exceeded";

export async function judgeSubmission(
  language: string,
  code: string,
  testCases: Array<{ input: string; expectedOutput: string }>,
): Promise<{ status: SubmissionStatus; testResults: TestResult[] }> {
  const testResults: TestResult[] = [];

  for (const tc of testCases) {
    const { stdout, stderr, exitCode, statusDesc, statusId, time } = await runCode(language, code, tc.input);

    const base: Omit<TestResult, "passed"> = {
      input:          tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput:   stdout.trim(),
      stderr,
      statusDesc,
      time,
    };

    // Compilation error — stop immediately, no further tests possible
    if (statusId === 6) {
      testResults.push({ ...base, passed: false });
      return { status: "compile_error", testResults };
    }

    // Time limit exceeded
    if (statusId === 5) {
      testResults.push({ ...base, passed: false });
      return { status: "time_limit_exceeded", testResults };
    }

    // Runtime error
    if (exitCode !== 0 || (statusId >= 7 && statusId <= 12)) {
      testResults.push({ ...base, passed: false });
      return { status: "runtime_error", testResults };
    }

    // Normalise output: trim trailing whitespace per line and the whole block
    const normalise = (s: string) =>
      s.split("\n").map((l) => l.trimEnd()).join("\n").trim();

    const actual   = normalise(stdout);
    const expected = normalise(tc.expectedOutput);
    const passed   = actual === expected;

    testResults.push({ ...base, actualOutput: actual, passed });

    if (!passed) {
      return { status: "wrong_answer", testResults };
    }
  }

  return { status: "accepted", testResults };
}

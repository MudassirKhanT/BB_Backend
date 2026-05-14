import https from "https";

export function groqRequest(
  apiKey: string,
  messages: { role: string; content: string }[],
  options: { model?: string; temperature?: number; maxTokens?: number } = {},
): Promise<string> {
  const {
    model       = "llama-3.3-70b-versatile",
    temperature = 0.7,
    maxTokens   = 2048,
  } = options;

  const bodyStr = JSON.stringify({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.groq.com",
        path:     "/openai/v1/chat/completions",
        method:   "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Content-Length": Buffer.byteLength(bodyStr),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf-8");
          try {
            const data = JSON.parse(text);
            if (data.error) return reject(new Error(data.error.message || "Groq API error"));
            const content = data.choices?.[0]?.message?.content;
            if (!content) return reject(new Error("Groq returned empty content"));
            resolve(content);
          } catch {
            reject(new Error(`Failed to parse Groq response: ${text.slice(0, 200)}`));
          }
        });
      },
    );
    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

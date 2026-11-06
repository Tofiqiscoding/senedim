import OpenAI from "openai";

/**
 * Backup AI provider: Groq (OpenAI-compatible API). Server-side only.
 * Set GROQ_API_KEY in .env.local. GROQ_MODEL is optional.
 */
export const GROQ_MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";

let client: OpenAI | null = null;

export function hasGroqKey() {
  return Boolean(process.env.GROQ_API_KEY);
}

export async function askGroq(input: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  client ??= new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });
  const response = await client.responses.create({ model: GROQ_MODEL, input });
  return response.output_text ?? "";
}

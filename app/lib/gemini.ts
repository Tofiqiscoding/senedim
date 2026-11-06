import { GoogleGenAI } from "@google/genai";

/**
 * Server-side Gemini client. Import this ONLY from server code (route handlers,
 * server components, server actions) — the API key must never reach the browser.
 *
 * Set GEMINI_API_KEY in .env.local (see .env.example). GEMINI_MODEL is optional.
 */
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";

let client: GoogleGenAI | null = null;

export function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return (client ??= new GoogleGenAI({ apiKey }));
}

/** Send a prompt and get the model's text answer back. */
export async function askGemini(input: string): Promise<string> {
  const interaction = await getClient().interactions.create({ model: GEMINI_MODEL, input });
  return interaction.output_text ?? "";
}

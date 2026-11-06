import { askGemini, hasGeminiKey } from "./gemini";
import { askGroq, hasGroqKey } from "./groq";

export const hasAnyAiKey = () => hasGeminiKey() || hasGroqKey();

/** Gemini is the main provider; Groq answers when Gemini is missing or fails. */
export async function askAi(prompt: string): Promise<string> {
  if (hasGeminiKey()) {
    try {
      const text = await askGemini(prompt);
      if (text.trim()) return text;
    } catch (err) {
      console.error("Gemini failed, trying Groq:", err);
      if (!hasGroqKey()) throw err;
    }
  }
  if (hasGroqKey()) return askGroq(prompt);
  throw new Error("No AI key configured");
}

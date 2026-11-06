import { askGemini, hasGeminiKey } from "../../lib/gemini";

// POST /api/ai   body: { "prompt": "..." }   →   { "text": "..." }
export async function POST(req: Request) {
  if (!hasGeminiKey()) {
    return Response.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 503 });
  }

  let prompt = "";
  try {
    const body = (await req.json()) as { prompt?: unknown };
    if (typeof body.prompt === "string") prompt = body.prompt.trim();
  } catch {
    return Response.json({ error: "Send JSON like { \"prompt\": \"...\" }." }, { status: 400 });
  }
  if (!prompt) return Response.json({ error: "Missing “prompt”." }, { status: 400 });
  if (prompt.length > 4000) return Response.json({ error: "Prompt is too long (max 4000 characters)." }, { status: 413 });

  try {
    return Response.json({ text: await askGemini(prompt) });
  } catch (err) {
    console.error("Gemini request failed:", err);
    return Response.json({ error: "The AI request failed. Check the key, model name and quota." }, { status: 502 });
  }
}

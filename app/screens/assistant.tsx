"use client";

import { useEffect, useRef, useState } from "react";
import { hrContext, workerContext } from "../lib/aiContext";
import { useDemo, useSession } from "../lib/store";
import { Body, Card, PageHeader } from "../shared/ui";

type Msg = { from: "user" | "ai"; text: string; error?: boolean };

const CFG = {
  worker: {
    eyebrow: "AI",
    title: "HR köməkçisi",
    intro: "İş qaydaları, məzuniyyət balansınız, sorğularınız və sənədləriniz barədə sual verin.",
    source: "Mənbə: sizin işçi profiliniz, sorğularınız və sənədləriniz",
    suggestions: ["Neçə gün məzuniyyətim qalıb?", "Sorğularımın statusu nədir?", "Sınaq müddətim nə vaxt bitir?", "Hansı sənədləri imzalamalıyam?"],
  },
  hr: {
    eyebrow: "AI",
    title: "HR analitikası",
    intro: "Bütün işçilər, sorğular və sənədlər üzrə sual verin.",
    source: "Mənbə: bütün işçilər, sorğular və sənədlər (demo məlumatı)",
    suggestions: ["Gələn həftə kim məzuniyyətdədir?", "Bu ay hansı sınaq müddətləri bitir?", "Gözləyən sorğular hansılardır?", "Hansı sənədlər imza gözləyir?"],
  },
} as const;

const ERRORS: Record<string, string> = {
  "no-key": "AI açarı quraşdırılmayıb. .env.local faylına GEMINI_API_KEY (və ehtiyat üçün GROQ_API_KEY) əlavə edib serveri yenidən başladın.",
  upstream: "AI xidməti cavab vermədi. Açarları, model adlarını və limiti yoxlayın.",
  "question-too-long": "Sual çox uzundur (maksimum 600 simvol).",
};

export default function Assistant({ role }: { role: "hr" | "worker" }) {
  const cfg = CFG[role];
  const s = useDemo();
  const session = useSession();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [msgs, busy]);

  const ask = async (question: string) => {
    const text = question.trim();
    if (!text || busy) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setQ("");
    setBusy(true);
    try {
      const data = role === "hr" ? hrContext(s) : workerContext(s, session?.role === "worker" ? session.workerId : "");
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, question: text, data }),
      });
      const json = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !json.text) throw new Error(json.error ?? "upstream");
      setMsgs((m) => [...m, { from: "ai", text: json.text! }]);
    } catch (e) {
      const key = e instanceof Error ? e.message : "upstream";
      setMsgs((m) => [...m, { from: "ai", error: true, text: ERRORS[key] ?? ERRORS.upstream }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow={cfg.eyebrow} title={cfg.title} />
      <Body>
        <Card title="Söhbət">
          <div className="flex h-[min(620px,calc(100dvh-300px))] min-h-[360px] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6" aria-live="polite">
              {msgs.length === 0 && (
                <div className="space-y-4">
                  <p className="max-w-[40em] text-[15px] text-ink/65">{cfg.intro}</p>
                  <div className="flex flex-wrap gap-2">
                    {cfg.suggestions.map((x) => (
                      <button key={x} type="button" onClick={() => ask(x)} className="border border-ink/25 px-3.5 py-2 text-[14px] transition hover:bg-mist">{x}</button>
                    ))}
                  </div>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[85%] px-4 py-3 text-[15px] leading-relaxed ${m.from === "user" ? "bg-ink text-lime" : m.error ? "bg-red-100 text-red-800" : "bg-mist"}`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    {m.from === "ai" && !m.error && <p className="mt-2 text-[12px] text-ink/45">{cfg.source}</p>}
                  </div>
                </div>
              ))}
              {busy && <div className="text-[14px] text-ink/50">Cavab hazırlanır…</div>}
              <div ref={end} />
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); ask(q); }}
              className="flex gap-2 border-t border-ink/10 p-4 sm:p-5"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                maxLength={600}
                placeholder="Sualınızı yazın…"
                aria-label="Sual"
                className="h-11 min-w-0 flex-1 border border-ink/25 px-3 text-[15px] outline-none focus:border-ink"
              />
              <button type="submit" disabled={busy || !q.trim()} className="bg-ink px-6 text-lime transition hover:bg-[#10300d] disabled:opacity-40">Göndər</button>
            </form>
          </div>
        </Card>
      </Body>
    </>
  );
}

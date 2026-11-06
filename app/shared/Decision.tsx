"use client";

import { useState } from "react";
import { tx } from "../i18n/translate";
import { actions, useDemo } from "../lib/store";
import { T } from "../i18n/LangProvider";

/** Approve / Reject with ONE note that the worker will see next to the decision. */
export default function Decision({ id, approveLabel = "Approve" }: { id: string; approveLabel?: string }) {
  const [mode, setMode] = useState<"Approved" | "Rejected" | null>(null);
  const [note, setNote] = useState("");
  const [drafting, setDrafting] = useState(false);
  const s = useDemo();

  if (!mode) {
    return (
      <span className="flex gap-1.5">
        <button type="button" onClick={() => setMode("Approved")} className="bg-ink px-3.5 py-2 text-[13px] text-lime transition hover:bg-[#10300d]"><T>{approveLabel}</T></button>
        <button type="button" onClick={() => setMode("Rejected")} className="border border-ink/25 bg-white px-3.5 py-2 text-[13px] transition hover:bg-mist"><T>Reject</T></button>
      </span>
    );
  }
  const approving = mode === "Approved";

  // AI writes the note from a few words; if the AI is unavailable a ready-made template is used instead.
  const draft = async () => {
    const req = s.requests.find((r) => r.id === id);
    const w = s.workers.find((x) => x.id === req?.workerId);
    const fallback =
      mode === "Rejected"
        ? "Təəssüf ki, sorğunuz bu dəfə təsdiqlənmədi. Zəhmət olmasa HR ilə əlaqə saxlayın və başqa tarix seçin."
        : req?.kind === "document"
          ? "Sənədiniz hazırdır, “Sənədlərim” bölməsindən yükləyə bilərsiniz."
          : req?.kind === "trip"
            ? "Ezamiyyət sorğunuz təsdiqləndi. Uğurlar!"
            : "Sorğunuz təsdiqləndi. Xoş istirahətlər! Zəhmət olmasa açıq tapşırıqları əvvəlcədən təhvil verin.";
    setDrafting(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "hr", task: "note", decision: mode, question: note,
          data: { worker: w?.name, position: w?.position, request: req && { kind: req.kind, title: req.title, from: req.from, to: req.to, workerNote: req.note }, annualLeaveDaysLeft: w?.leaveBalance },
        }),
      });
      const json = (await res.json()) as { text?: string };
      setNote(res.ok && json.text ? json.text.slice(0, 280) : fallback);
    } catch {
      setNote(fallback);
    } finally {
      setDrafting(false);
    }
  };
  return (
    <form
      className="pop flex flex-wrap items-center gap-1.5"
      onSubmit={(e) => {
        e.preventDefault();
        actions.decideRequest(id, mode, note.trim());
      }}
    >
      <input
        autoFocus
        value={note}
        onChange={(e) => setNote(e.target.value)}
        aria-label="Note for the worker"
        placeholder={tx(approving ? "Note for the worker (optional)" : "Why? The worker will see this")}
        className="h-9 w-[220px] border border-ink/25 bg-white px-2.5 text-[13px] outline-none focus:border-ink"
      />
      <button type="button" onClick={draft} disabled={drafting} className="border border-ink/25 bg-white px-3 py-2 text-[13px] transition hover:bg-mist disabled:opacity-50">
        {drafting ? "Yazılır…" : "✦ AI ilə yaz"}
      </button>
      <button type="submit" className={`px-3.5 py-2 text-[13px] ${approving ? "bg-ink text-lime" : "bg-red-700 text-white"}`}>
        <T>{approving ? `Confirm ${approveLabel.toLowerCase()}` : "Confirm reject"}</T>
      </button>
      <button type="button" onClick={() => setMode(null)} className="px-2 py-2 text-[13px] text-ink/60 hover:text-ink"><T>Cancel</T></button>
    </form>
  );
}

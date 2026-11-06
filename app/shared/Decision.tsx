"use client";

import { useState } from "react";
import { actions } from "../lib/store";

/** Approve / Reject with ONE note that the worker will see next to the decision. */
export default function Decision({ id, approveLabel = "Approve" }: { id: string; approveLabel?: string }) {
  const [mode, setMode] = useState<"Approved" | "Rejected" | null>(null);
  const [note, setNote] = useState("");

  if (!mode) {
    return (
      <span className="flex gap-1.5">
        <button type="button" onClick={() => setMode("Approved")} className="bg-ink px-3.5 py-2 text-[13px] text-lime transition hover:bg-[#10300d]">{approveLabel}</button>
        <button type="button" onClick={() => setMode("Rejected")} className="border border-ink/25 bg-white px-3.5 py-2 text-[13px] transition hover:bg-mist">Reject</button>
      </span>
    );
  }
  const approving = mode === "Approved";
  return (
    <form
      className="flex flex-wrap items-center gap-1.5"
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
        placeholder={approving ? "Note for the worker (optional)" : "Why? The worker will see this"}
        className="h-9 w-[220px] border border-ink/25 bg-white px-2.5 text-[13px] outline-none focus:border-ink"
      />
      <button type="submit" className={`px-3.5 py-2 text-[13px] ${approving ? "bg-ink text-lime" : "bg-red-700 text-white"}`}>
        {approving ? `Confirm ${approveLabel.toLowerCase()}` : "Confirm reject"}
      </button>
      <button type="button" onClick={() => setMode(null)} className="px-2 py-2 text-[13px] text-ink/60 hover:text-ink">Cancel</button>
    </form>
  );
}

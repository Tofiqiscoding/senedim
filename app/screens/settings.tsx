"use client";

import { useState } from "react";
import { actions, useDemo } from "../lib/store";
import { Body, Btn, Card, Chip, Field, Flash, inputCls, PageHeader } from "../shared/ui";

export function Settings() {
  const s = useDemo();
  const [msg, setMsg] = useState("");
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "senedim-demo-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <>
      <PageHeader eyebrow="Account" title="Settings" />
      <Body>
        <div className="grid gap-px bg-ink/15 lg:grid-cols-2">
          <Card title="Demo data">
            <div className="space-y-5 p-6">
              <p className="text-[15px] text-ink/65">
                Everything you add or change — workers, requests, documents — is kept in this browser, so the demo survives a refresh.
                Use “Reset demo” (also in the top bar) before each presentation to restore requests, decisions, workers and documents.
              </p>
              <div className="flex flex-wrap gap-2 text-[13px]">
                <Chip>{s.workers.length} workers</Chip><Chip>{s.requests.length} requests</Chip><Chip>{s.docs.length} documents</Chip>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => { actions.reset(); setMsg("Demo data restored to the original sample."); }} className="bg-ink px-5 py-3 text-lime transition hover:bg-[#10300d]">Reset demo data</button>
                <Btn onClick={exportJson}>Export JSON</Btn>
              </div>
              {msg && <Flash>{msg}</Flash>}
            </div>
          </Card>
          <Card title="Company">
            <div className="space-y-5 p-6">
              <Field label="Company name"><input className={inputCls} defaultValue="Caspian Demo LLC" /></Field>
              <div className="grid grid-cols-2 gap-5">
                <Field label="Annual leave (days)"><input className={inputCls} defaultValue="21" /></Field>
                <Field label="Probation (months)"><input className={inputCls} defaultValue="3" /></Field>
              </div>
              <p className="text-[13px] text-ink/50">Company defaults are shown for the demo; per-worker values are edited on the worker page.</p>
            </div>
          </Card>
        </div>
      </Body>
    </>
  );
}

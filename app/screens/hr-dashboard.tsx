"use client";

import Link from "next/link";
import { useState } from "react";
import { hrContext } from "../lib/aiContext";
import { DEPTS, HR_USER, TASKS, TODAY } from "../lib/seed";
import { useDemo } from "../lib/store";
import Decision from "../shared/Decision";
import { addMonths, diffDays, fmtShort, range } from "../lib/util";
import { Avatar, Card, Chip, Grid, LinkBtn, PageHeader, Progress, Stat } from "../shared/ui";
import { T } from "../i18n/LangProvider";
import { tx } from "../i18n/translate";

export default function HrDashboard() {
  const s = useDemo();
  const [aiText, setAiText] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState(false);
  const name = (id: string) => s.workers.find((w) => w.id === id)?.name ?? "—";
  const pending = s.requests.filter((r) => r.status === "Pending");
  const onboarding = Object.entries(s.tasks).filter(([id, t]) => s.workers.some((w) => w.id === id) && t.some((x) => !x));
  const expiring = s.workers
    .filter((w) => w.status === "Probation" && w.probationMonths > 0)
    .map((w) => ({ w, left: diffDays(TODAY, addMonths(w.start, w.probationMonths)) }))
    .filter((x) => x.left <= 60)
    .sort((a, b) => a.left - b.left);
  const byDept = DEPTS.map((d) => [d, s.workers.filter((w) => w.dept === d).length] as const);
  const max = Math.max(1, ...byDept.map((x) => x[1]));
  // Daily digest: computed from the data, optionally rewritten by the AI.
  const kindCount = (k: string) => pending.filter((r) => r.kind === k).length;
  const toSign = s.docs.filter((d) => d.status === "Pending").length;
  const digest = [
    pending.length ? `${pending.length} sorğu qərarınızı gözləyir (${kindCount("leave")} məzuniyyət, ${kindCount("trip")} ezamiyyət, ${kindCount("document")} sənəd).` : "Gözləyən sorğu yoxdur.",
    expiring[0] ? `${expiring[0].w.name} üçün sınaq müddəti ${expiring[0].left} gündən sonra bitir.` : "Bu yaxınlarda bitən sınaq müddəti yoxdur.",
    `${s.workers.filter((w) => w.status === "On leave").length} işçi hazırda məzuniyyətdədir, ${onboarding.length} işçinin işə qəbul siyahısı tamamlanmayıb.`,
    toSign ? `${toSign} sənəd imza gözləyir.` : "İmza gözləyən sənəd yoxdur.",
  ];
  const askDigest = async () => {
    setAiBusy(true);
    setAiErr(false);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "hr", question: "Bugünün HR icmalını 3 qısa cümlə ilə yaz: gözləyən sorğular, bitən sınaq müddətləri və imza gözləyən sənədlər.", data: hrContext(s) }),
      });
      const json = (await res.json()) as { text?: string };
      if (!res.ok || !json.text) throw new Error("ai");
      setAiText(json.text);
    } catch {
      setAiErr(true);
    } finally {
      setAiBusy(false);
    }
  };
  const activity = s.notices.filter((n) => n.to === "hr").slice(0, 5);

  return (
    <>
      <PageHeader eyebrow="Friday 6 November" title={<><T>Good morning,</T> <span className="text-leaf">{HR_USER.name.split(" ")[0]}</span></>}>
        <LinkBtn href="/hr/workers/new" icon="plus" primary><T>Add worker</T></LinkBtn>
        <LinkBtn href="/hr/contracts" icon="file"><T>Generate contract</T></LinkBtn>
      </PageHeader>
      <div className="border-b border-ink/15">
        <Grid cols="grid-cols-2 lg:grid-cols-4">
          <Stat label="Workers" value={String(s.workers.length)} note={`${s.workers.filter((w) => w.status === "Onboarding").length} onboarding now`} tone="up" />
          <Stat label="On leave today" value={String(s.workers.filter((w) => w.status === "On leave").length)} note="Approved absences" />
          <Stat label="Pending requests" value={String(pending.length)} note="Waiting for your decision" tone={pending.length ? "warn" : undefined} />
          <Stat label="Probation ending" value={String(expiring.length)} note={expiring[0] ? `${expiring[0].w.name} · ${expiring[0].left} days` : "Nothing urgent"} tone={expiring.length ? "warn" : undefined} />
        </Grid>

        <div className="mt-px bg-ink/15">
          <Card title="Günün icmalı">
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.4fr_1fr]">
              <ul className="space-y-2.5 text-[15px]">
                {digest.map((d) => (
                  <li key={d} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-leaf" />{d}</li>
                ))}
              </ul>
              <div className="space-y-3">
                <button type="button" onClick={askDigest} disabled={aiBusy} className="flex items-center gap-2 border border-ink/25 px-4 py-2.5 text-[14px] transition hover:bg-mist disabled:opacity-50">
                  {aiBusy ? <span className="flex gap-1"><i className="dot" /><i className="dot" /><i className="dot" /></span> : "✦"} AI ilə xülasə yaz
                </button>
                {aiText && <p className="pop whitespace-pre-wrap bg-mist px-4 py-3 text-[14px] leading-relaxed">{aiText}</p>}
                {aiErr && <p className="text-[13px] text-ink/55">AI hazırda əlçatan deyil — yuxarıdakı icmal verilənlərdən hesablanıb.</p>}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-px grid gap-px bg-ink/15 xl:grid-cols-[1.45fr_1fr]">
          <Card title="Pending requests" action="Open inbox" href="/hr/requests">
            {pending.length === 0 ? (
              <div className="px-6 py-12 text-center text-ink/50"><T>All caught up — no pending requests.</T></div>
            ) : (
              <ul>
                {pending.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center gap-4 border-b border-ink/10 px-5 py-4 last:border-b-0 sm:px-6">
                    <Avatar initials={name(r.workerId).split(" ").map((x) => x[0]).join("")} />
                    <div className="min-w-[160px] flex-1 leading-tight">
                      <div className="truncate text-[15px]">{name(r.workerId)} <span className="text-ink/45">· {tx(r.title)}</span></div>
                      <div className="mt-1 truncate text-[13px] text-ink/55"><T>{r.kind === "document" ? r.note || "Document request" : range(r.from, r.to)}</T></div>
                    </div>
                    <Decision id={r.id} approveLabel={r.kind === "document" ? "Generate" : "Approve"} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Expiring probation" action="Workers" href="/hr/workers">
            {expiring.length === 0 ? (
              <div className="px-6 py-12 text-center text-ink/50"><T>No probation periods ending soon.</T></div>
            ) : (
              <ul>
                {expiring.map(({ w, left }) => (
                  <li key={w.id} className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 last:border-b-0 sm:px-6">
                    <Link href={`/hr/workers/${w.id}`} className="leading-tight hover:underline">
                      <div className="text-[15px]">{w.name}</div>
                      <div className="mt-1 text-[13px] text-ink/55"><T>{`Probation ends ${fmtShort(addMonths(w.start, w.probationMonths))}`}</T></div>
                    </Link>
                    <Chip tone={left <= 14 ? "bad" : "warn"}>{left < 0 ? "overdue" : `in ${left} days`}</Chip>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="mt-px grid gap-px bg-ink/15 xl:grid-cols-3">
          <Card title="Onboarding in progress" action="Checklists" href="/hr/onboarding">
            {onboarding.length === 0 ? (
              <div className="px-6 py-12 text-center text-ink/50"><T>Nobody is onboarding.</T></div>
            ) : (
              <ul>
                {onboarding.map(([id, t]) => {
                  const done = t.filter(Boolean).length;
                  return (
                    <li key={id} className="border-b border-ink/10 px-5 py-4 last:border-b-0 sm:px-6">
                      <div className="mb-2.5 flex items-center justify-between">
                        <Link href={`/hr/workers/${id}`} className="text-[15px] hover:underline">{name(id)}</Link>
                        <span className="text-[13px] tabular-nums text-ink/60">{done}/{TASKS.length}</span>
                      </div>
                      <Progress value={(done / TASKS.length) * 100} />
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
          <Card title="Headcount by department">
            <ul className="space-y-4 px-5 py-5 sm:px-6">
              {byDept.map(([d, n]) => (
                <li key={d}>
                  <div className="mb-1.5 flex justify-between text-[14px]"><span><T>{d}</T></span><span className="tabular-nums text-ink/60">{n}</span></div>
                  <div className="h-6 bg-ink/8"><div className="bar-grow h-full bg-gradient-to-r from-cobalt to-sky" style={{ width: `${(n / max) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Recent activity" action="All" href="/hr/notifications">
            <ul className="px-5 py-3 sm:px-6">
              {activity.map((n, i) => (
                <li key={n.id} className="flex gap-4 pb-5 last:pb-2">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 h-2.5 w-2.5 bg-leaf" />
                    {i < activity.length - 1 && <span className="mt-1 w-px flex-1 bg-ink/15" />}
                  </div>
                  <div className="leading-tight">
                    <div className="text-[15px]"><T>{n.text}</T></div>
                    <div className="mt-1 text-[13px] text-ink/50"><T>{n.when}</T></div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

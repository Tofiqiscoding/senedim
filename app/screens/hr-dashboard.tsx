"use client";

import Link from "next/link";
import { HR_USER, TASKS, TODAY } from "../lib/seed";
import { useDemo } from "../lib/store";
import Decision from "../shared/Decision";
import { addMonths, diffDays, fmtShort, range } from "../lib/util";
import { Avatar, Card, Chip, Grid, LinkBtn, PageHeader, Progress, Stat } from "../shared/ui";

export default function HrDashboard() {
  const s = useDemo();
  const name = (id: string) => s.workers.find((w) => w.id === id)?.name ?? "—";
  const pending = s.requests.filter((r) => r.status === "Pending");
  const onboarding = Object.entries(s.tasks).filter(([id, t]) => s.workers.some((w) => w.id === id) && t.some((x) => !x));
  const expiring = s.workers
    .filter((w) => w.status === "Probation" && w.probationMonths > 0)
    .map((w) => ({ w, left: diffDays(TODAY, addMonths(w.start, w.probationMonths)) }))
    .filter((x) => x.left <= 60)
    .sort((a, b) => a.left - b.left);
  const byDept = ["Operations", "Sales", "IT", "Finance"].map((d) => [d, s.workers.filter((w) => w.dept === d).length] as const);
  const max = Math.max(1, ...byDept.map((x) => x[1]));
  const activity = s.notices.filter((n) => n.to === "hr").slice(0, 5);

  return (
    <>
      <PageHeader eyebrow="Friday 6 November" title={<>Good morning, <span className="text-leaf">{HR_USER.name.split(" ")[0]}</span></>}>
        <LinkBtn href="/hr/workers/new" icon="plus" primary>Add worker</LinkBtn>
        <LinkBtn href="/hr/contracts" icon="file">Generate contract</LinkBtn>
      </PageHeader>
      <div className="border-b border-ink/15">
        <Grid cols="grid-cols-2 lg:grid-cols-4">
          <Stat label="Workers" value={String(s.workers.length)} note={`${s.workers.filter((w) => w.status === "Onboarding").length} onboarding now`} tone="up" />
          <Stat label="On leave today" value={String(s.workers.filter((w) => w.status === "On leave").length)} note="Approved absences" />
          <Stat label="Pending requests" value={String(pending.length)} note="Waiting for your decision" tone={pending.length ? "warn" : undefined} />
          <Stat label="Probation ending" value={String(expiring.length)} note={expiring[0] ? `${expiring[0].w.name} · ${expiring[0].left} days` : "Nothing urgent"} tone={expiring.length ? "warn" : undefined} />
        </Grid>

        <div className="mt-px grid gap-px bg-ink/15 xl:grid-cols-[1.45fr_1fr]">
          <Card title="Pending requests" action="Open inbox" href="/hr/requests">
            {pending.length === 0 ? (
              <div className="px-6 py-12 text-center text-ink/50">All caught up — no pending requests.</div>
            ) : (
              <ul>
                {pending.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center gap-4 border-b border-ink/10 px-5 py-4 last:border-b-0 sm:px-6">
                    <Avatar initials={name(r.workerId).split(" ").map((x) => x[0]).join("")} />
                    <div className="min-w-[160px] flex-1 leading-tight">
                      <div className="truncate text-[15px]">{name(r.workerId)} <span className="text-ink/45">· {r.title}</span></div>
                      <div className="mt-1 truncate text-[13px] text-ink/55">{r.kind === "document" ? r.note || "Document request" : range(r.from, r.to)}</div>
                    </div>
                    <Decision id={r.id} approveLabel={r.kind === "document" ? "Generate" : "Approve"} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Expiring probation" action="Workers" href="/hr/workers">
            {expiring.length === 0 ? (
              <div className="px-6 py-12 text-center text-ink/50">No probation periods ending soon.</div>
            ) : (
              <ul>
                {expiring.map(({ w, left }) => (
                  <li key={w.id} className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 last:border-b-0 sm:px-6">
                    <Link href={`/hr/workers/${w.id}`} className="leading-tight hover:underline">
                      <div className="text-[15px]">{w.name}</div>
                      <div className="mt-1 text-[13px] text-ink/55">Probation ends {fmtShort(addMonths(w.start, w.probationMonths))}</div>
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
              <div className="px-6 py-12 text-center text-ink/50">Nobody is onboarding.</div>
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
                  <div className="mb-1.5 flex justify-between text-[14px]"><span>{d}</span><span className="tabular-nums text-ink/60">{n}</span></div>
                  <div className="h-6 bg-ink/8"><div className="h-full bg-gradient-to-r from-cobalt to-sky" style={{ width: `${(n / max) * 100}%` }} /></div>
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
                    <div className="text-[15px]">{n.text}</div>
                    <div className="mt-1 text-[13px] text-ink/50">{n.when}</div>
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

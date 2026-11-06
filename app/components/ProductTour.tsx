"use client";

import { useState } from "react";
import { T } from "../i18n/LangProvider";
import { tx } from "../i18n/translate";
import { buildDoc, TEMPLATES } from "../lib/doc";
import { seed, TASKS } from "../lib/seed";
import { range } from "../lib/util";

// A small, fully local demo of the product: same fake data as the real app, nothing is saved.
const demo = seed();
const TABS = ["Dashboard", "Workers", "Contracts", "Onboarding", "Requests"] as const;
type Tab = (typeof TABS)[number];
type Decision = "Pending" | "Approved" | "Rejected";

const tone: Record<Decision, string> = {
  Pending: "bg-lime/20 text-lime",
  Approved: "bg-white/15 text-white",
  Rejected: "bg-red-500/20 text-red-300",
};

function Chip({ s }: { s: Decision }) {
  return <span className={`inline-block px-2 py-1 text-[11px] md:text-xs ${tone[s]}`}><T>{s}</T></span>;
}

export default function ProductTour() {
  const [tab, setTab] = useState<Tab>("Dashboard");
  const [decided, setDecided] = useState<Record<string, Decision>>({});
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [reqFilter, setReqFilter] = useState<Decision | "All">("All");
  const [wid, setWid] = useState("w3");
  const [tpl, setTpl] = useState(TEMPLATES[0].name);
  const [pdf, setPdf] = useState(false);
  const onboarding = demo.workers.filter((w) => demo.tasks[w.id] && w.status === "Onboarding");
  const [tasks, setTasks] = useState<Record<string, boolean[]>>(() => ({ ...demo.tasks }));

  const status = (id: string, base: Decision): Decision => decided[id] ?? base;
  const reqs = demo.requests.map((r) => ({ ...r, st: status(r.id, r.status as Decision) }));
  const pending = reqs.filter((r) => r.st === "Pending");
  const nameOf = (id: string) => demo.workers.find((w) => w.id === id)?.name ?? "";
  const depts = [...new Set(demo.workers.map((w) => w.dept))];
  const list = demo.workers.filter((w) => (!dept || w.dept === dept) && (w.name + w.position).toLowerCase().includes(q.toLowerCase()));
  const worker = demo.workers.find((w) => w.id === wid) ?? demo.workers[0];
  const doc = buildDoc(tpl, worker);

  const decide = (id: string, d: Decision) => setDecided((x) => ({ ...x, [id]: d }));
  const Actions = ({ id }: { id: string }) => (
    <span className="flex gap-1.5">
      <button type="button" onClick={() => decide(id, "Approved")} className="bg-lime px-2.5 py-1 text-[11px] text-ink transition hover:bg-white md:text-xs"><T>Approve</T></button>
      <button type="button" onClick={() => decide(id, "Rejected")} className="border border-white/30 px-2.5 py-1 text-[11px] transition hover:bg-white/10 md:text-xs"><T>Reject</T></button>
    </span>
  );

  const th = "px-3 py-2 font-normal md:px-4 md:py-2.5";
  const td = "whitespace-nowrap px-3 py-2 md:px-4 md:py-2.5";

  return (
    <div className="relative grid h-[640px] grid-rows-[auto_1fr] overflow-hidden border border-white/70 bg-ink/60 backdrop-blur-sm md:h-[600px] md:grid-cols-[190px_1fr] md:grid-rows-1">
      {/* sidebar */}
      <div className="flex gap-1 overflow-x-auto border-b border-white/15 p-2 md:flex-col md:border-b-0 md:border-r md:p-3">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setPdf(false); }}
            className={`shrink-0 px-3 py-2 text-left text-sm transition ${tab === t ? "bg-lime text-ink" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
          >
            <T>{t}</T>
            {t === "Requests" && pending.length > 0 && (
              <span className={`ml-2 px-1.5 text-[11px] ${tab === t ? "bg-ink text-lime" : "bg-white/15"}`}>{pending.length}</span>
            )}
          </button>
        ))}
        <div className="mt-auto hidden px-3 pb-1 pt-4 text-[11px] leading-snug text-white/40 md:block"><T>Interactive demo — click around</T></div>
      </div>

      {/* panel */}
      <div key={tab} className="pop min-h-0 overflow-y-auto p-3 md:p-6">
        {tab === "Dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
              {([
                ["Workers", demo.workers.length],
                ["New hires", demo.workers.filter((w) => w.status === "Onboarding").length],
                ["Open requests", pending.length],
                ["Probation", demo.workers.filter((w) => w.status === "Probation").length],
              ] as [string, number][]).map(([k, v]) => (
                <div key={k} className="border border-white/15 p-3 md:p-4">
                  <div className="truncate text-[11px] text-white/50 md:text-xs"><T>{k}</T></div>
                  <div className="text-3xl tabular-nums md:text-4xl">{v}</div>
                </div>
              ))}
            </div>
            <div className="border border-white/15">
              <div className="border-b border-white/15 px-4 py-3 text-sm md:text-base"><T>Pending requests</T></div>
              {pending.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-white/50"><T>All caught up — no pending requests.</T></div>
              ) : (
                <ul>
                  {pending.slice(0, 4).map((r) => (
                    <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 last:border-b-0 md:px-4">
                      <span className="min-w-0 text-[13px] leading-tight md:text-sm">
                        {nameOf(r.workerId)} <span className="text-white/45">· <T>{r.title}</T></span>
                      </span>
                      <Actions id={r.id} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === "Workers" && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx("Search workers")} aria-label={tx("Search workers")}
                className="h-9 min-w-[160px] flex-1 border border-white/25 bg-transparent px-3 text-sm outline-none placeholder:text-white/40 focus:border-lime" />
              <button type="button" onClick={() => setDept("")} className={`px-2.5 py-1.5 text-xs transition ${!dept ? "bg-lime text-ink" : "border border-white/25 hover:bg-white/10"}`}><T>All</T></button>
              {depts.map((d) => (
                <button key={d} type="button" onClick={() => setDept(d)} className={`px-2.5 py-1.5 text-xs transition ${dept === d ? "bg-lime text-ink" : "border border-white/25 hover:bg-white/10"}`}><T>{d}</T></button>
              ))}
            </div>
            <div className="overflow-x-auto border border-white/15">
              <table className="w-full min-w-[460px] text-left text-[11px] md:text-sm">
                <thead><tr className="border-b border-white/15 text-white/45">{["Worker", "Position", "Department", "Status"].map((h) => <th key={h} className={th}><T>{h}</T></th>)}</tr></thead>
                <tbody>
                  {list.map((w) => (
                    <tr key={w.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                      <td className={td}>{w.name}</td>
                      <td className={`${td} text-white/75`}><T>{w.position}</T></td>
                      <td className={`${td} text-white/60`}><T>{w.dept}</T></td>
                      <td className={td}><span className="bg-white/10 px-2 py-1 text-[11px] md:text-xs"><T>{w.status}</T></span></td>
                    </tr>
                  ))}
                  {list.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-white/50"><T>No workers match your filters.</T></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "Contracts" && (
          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <div className="space-y-3">
              <label className="block text-xs text-white/55"><T>Worker</T>
                <select value={wid} onChange={(e) => { setWid(e.target.value); setPdf(false); }} className="mt-1.5 h-9 w-full border border-white/25 bg-ink px-2 text-sm outline-none focus:border-lime">
                  {demo.workers.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </label>
              <label className="block text-xs text-white/55"><T>Template</T>
                <select value={tpl} onChange={(e) => { setTpl(e.target.value); setPdf(false); }} className="mt-1.5 h-9 w-full border border-white/25 bg-ink px-2 text-sm outline-none focus:border-lime">
                  {TEMPLATES.map((t) => <option key={t.id} value={t.name}>{tx(t.name)}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => setPdf(true)} className="w-full bg-lime px-3 py-2.5 text-sm text-ink transition hover:bg-white"><T>Download PDF</T></button>
              {pdf && <p className="pop bg-lime/15 px-3 py-2 text-xs text-lime"><T>PDF ready (demo)</T></p>}
            </div>
            <article className="bg-white p-5 font-serif text-[12px] leading-[1.65] text-ink md:p-7 md:text-[13px]">
              <div className="text-center text-[14px] font-bold tracking-wide">{doc.title}</div>
              {doc.sub && <div className="text-center">{doc.sub}</div>}
              <div className="mb-4 mt-2 flex justify-between text-[11px] text-ink/55"><span>Bakı şəhəri</span><span>06.11.2026</span></div>
              <div className="space-y-2">{doc.body.map((l, i) => <p key={i}>{l}</p>)}</div>
              <div className="mt-6 grid grid-cols-2 gap-6 text-[11px]">
                <div><div className="mb-5 font-bold">İşəgötürən</div><div className="border-t border-ink/40 pt-1 text-ink/55">imza</div></div>
                <div><div className="mb-5 font-bold">İşçi</div><div className="border-t border-ink/40 pt-1 text-ink/55">{worker.name}</div></div>
              </div>
            </article>
          </div>
        )}

        {tab === "Onboarding" && (
          <div className="grid gap-3 md:grid-cols-2">
            {onboarding.map((w) => {
              const t = tasks[w.id];
              const done = t.filter(Boolean).length;
              return (
                <div key={w.id} className="border border-white/15 p-3 md:p-4">
                  <div className="flex items-center justify-between text-sm"><span>{w.name}</span><span className="tabular-nums text-white/55">{done}/{TASKS.length}</span></div>
                  <div className="mb-3 mt-2 h-1.5 bg-white/10"><div className="h-full bg-lime transition-[width] duration-500" style={{ width: `${(done / TASKS.length) * 100}%` }} /></div>
                  <ul className="space-y-1.5">
                    {TASKS.map((task, k) => (
                      <li key={task.t}>
                        <button type="button" onClick={() => setTasks((x) => ({ ...x, [w.id]: x[w.id].map((v, i) => (i === k ? !v : v)) }))}
                          className="flex w-full items-center gap-2.5 text-left text-[12px] transition hover:text-lime md:text-[13px]">
                          <span className={`grid h-4 w-4 shrink-0 place-items-center border text-[10px] ${t[k] ? "border-lime bg-lime text-ink" : "border-white/35"}`}>{t[k] ? "✓" : ""}</span>
                          <span className={t[k] ? "text-white/40 line-through" : ""}><T>{task.t}</T></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {tab === "Requests" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(["All", "Pending", "Approved", "Rejected"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setReqFilter(f)} className={`px-2.5 py-1.5 text-xs transition ${reqFilter === f ? "bg-lime text-ink" : "border border-white/25 hover:bg-white/10"}`}><T>{f}</T></button>
              ))}
            </div>
            <div className="overflow-x-auto border border-white/15">
              <table className="w-full min-w-[520px] text-left text-[11px] md:text-sm">
                <thead><tr className="border-b border-white/15 text-white/45">{["Worker", "Request", "Dates", "Status", ""].map((h, i) => <th key={i} className={th}><T>{h}</T></th>)}</tr></thead>
                <tbody>
                  {reqs.filter((r) => reqFilter === "All" || r.st === reqFilter).slice(0, 9).map((r) => (
                    <tr key={r.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                      <td className={td}>{nameOf(r.workerId)}</td>
                      <td className={`${td} text-white/75`}><T>{r.title}</T></td>
                      <td className={`${td} text-white/55`}>{r.kind === "document" ? "—" : <T>{range(r.from, r.to)}</T>}</td>
                      <td className={td}><Chip s={r.st} /></td>
                      <td className={td}>{r.st === "Pending" && <Actions id={r.id} />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

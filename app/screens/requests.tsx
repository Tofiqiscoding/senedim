"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { TODAY, type ReqKind, type ReqStatus } from "../lib/seed";
import { actions, useDemo, useSession } from "../lib/store";
import { range, workdays } from "../lib/util";
import Decision from "../shared/Decision";
import { Body, Card, Chip, Empty, Field, Flash, inputCls, PageHeader, Person, Select, Table, Tabs, textareaCls, toneOf } from "../shared/ui";
import { T } from "../i18n/LangProvider";
import { tx } from "../i18n/translate";

const KIND_LABEL: Record<ReqKind, string> = { leave: "Leave", trip: "Business trip", document: "Document" };
const LEAVE_TYPES = ["Annual leave", "Sick leave", "Unpaid leave"];
const DOC_TYPES = ["Work certificate", "Salary certificate", "Employment verification"];
type KindTab = "all" | ReqKind;
type StatusTab = ReqStatus | "all";

/* ------------------------------ HR: one inbox ------------------------------ */
export function HrRequests() {
  const s = useDemo();
  const [kind, setKind] = useState<KindTab>("all");
  const [st, setSt] = useState<StatusTab>("Pending");
  const worker = (id: string) => s.workers.find((w) => w.id === id);
  const ofKind = s.requests.filter((r) => kind === "all" || r.kind === kind);
  const rows = ofKind.filter((r) => st === "all" || r.status === st);
  const total = (k: KindTab) => s.requests.filter((r) => k === "all" || r.kind === k).length;
  // Smart checks shown next to pending leave requests, before HR decides.
  const checks = (r: (typeof rows)[number]) => {
    if (r.kind !== "leave" || r.status !== "Pending") return [] as { bad: boolean; text: string }[];
    const w = worker(r.workerId);
    const out: { bad: boolean; text: string }[] = [];
    const days = workdays(r.from, r.to);
    if (r.title === "Annual leave" && w && days > w.leaveBalance) out.push({ bad: true, text: `Balans kifayət etmir (${w.leaveBalance} < ${days} gün)` });
    const clash = s.requests
      .filter((o) => o.id !== r.id && o.kind === "leave" && o.status !== "Rejected" && o.from <= r.to && o.to >= r.from && worker(o.workerId)?.dept === w?.dept)
      .map((o) => worker(o.workerId)?.name ?? "");
    if (clash.length) out.push({ bad: false, text: `Eyni şöbədə üst-üstə düşür: ${clash.join(", ")}` });
    if (!out.length && w) out.push({ bad: false, text: "✓ Qaydalar yoxlandı: balans kifayətdir, toqquşma yoxdur" });
    return out;
  };
  const n = (x: ReqStatus) => ofKind.filter((r) => r.status === x).length;

  return (
    <>
      <PageHeader eyebrow="Requests" title="Requests" />
      <Body>
        <Card title="All worker requests">
          <div className="flex items-stretch border-b border-ink/10">
            <span className="flex w-[72px] shrink-0 items-center pl-5 text-[13px] text-ink/45 sm:pl-6"><T>Type</T></span>
            <div className="min-w-0 flex-1 [&>div]:border-b-0 [&>div]:pl-0">
              <Tabs<KindTab>
                value={kind}
                onChange={setKind}
                tabs={[
                  { id: "all", label: "All types", count: total("all") },
                  { id: "leave", label: "Leave", count: total("leave") },
                  { id: "trip", label: "Business trips", count: total("trip") },
                  { id: "document", label: "Documents", count: total("document") },
                ]}
              />
            </div>
          </div>
          <div className="flex items-stretch border-b border-ink/10">
            <span className="flex w-[72px] shrink-0 items-center pl-5 text-[13px] text-ink/45 sm:pl-6"><T>Status</T></span>
            <div className="min-w-0 flex-1 [&>div]:border-b-0 [&>div]:pl-0">
              <Tabs<StatusTab>
                value={st}
                onChange={setSt}
                tabs={[
                  { id: "Pending", label: "Pending", count: n("Pending") },
                  { id: "Approved", label: "Approved", count: n("Approved") },
                  { id: "Rejected", label: "Rejected", count: n("Rejected") },
                  { id: "all", label: "Any status", count: ofKind.length },
                ]}
              />
            </div>
          </div>
          {rows.length === 0 ? (
            <Empty text="Nothing here." />
          ) : (
            <Table
              head={["Worker", "Request", "Dates / purpose", "Notes", "Status", ""]}
              rows={rows.map((r) => [
                <Person key="p" name={worker(r.workerId)?.name ?? "Removed worker"} sub={worker(r.workerId)?.position} />,
                <span key="t" className="leading-tight">
                  <span className="block">{tx(r.title)}</span>
                  <span className="mt-0.5 block text-[13px] text-ink/45"><T>{KIND_LABEL[r.kind] + (r.kind === "leave" ? ` · ${workdays(r.from, r.to)} working days` : "")}</T></span>
                </span>,
                <span key="d" className="whitespace-nowrap text-ink/70"><T>{r.kind === "document" ? r.note || "—" : range(r.from, r.to)}</T></span>,
                <span key="n" className="block text-ink/60">
                  <T>{r.comment ? `HR: ${r.comment}` : r.kind === "document" ? "" : r.note || "—"}</T>
                  {checks(r).map((c) => (
                    <span key={c.text} className={`mt-1 block text-[12px] leading-snug ${c.bad ? "text-red-700" : c.text.startsWith("✓") ? "text-[#2f7a1f]" : "text-amber-800"}`}>{c.bad ? "⚠ " : c.text.startsWith("✓") ? "" : "⚠ "}{c.text}</span>
                  ))}
                </span>,
                <Chip key="s" tone={toneOf(r.status)}>{r.status}</Chip>,
                r.status === "Pending" ? <Decision key="a" id={r.id} approveLabel={r.kind === "document" ? "Generate" : "Approve"} /> : null,
              ])}
            />
          )}
        </Card>
      </Body>
    </>
  );
}

/* ------------------------- Worker: one request page ------------------------- */
export function WorkerRequests() {
  const s = useDemo();
  const session = useSession();
  const params = useSearchParams();
  const me = session?.role === "worker" ? s.workers.find((w) => w.id === session.workerId) : undefined;
  const t0 = params.get("type");
  const [kind, setKind] = useState<ReqKind>(t0 === "trip" ? "trip" : t0 === "document" ? "document" : "leave");
  const [type, setType] = useState(LEAVE_TYPES[0]);
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [dest, setDest] = useState("");
  const [from, setFrom] = useState("2026-11-23");
  const [to, setTo] = useState("2026-11-25");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (!me) return null;

  const mine = s.requests.filter((r) => r.workerId === me.id);
  const days = workdays(from, to);
  const annual = kind === "leave" && type === "Annual leave";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kind !== "document") {
      if (!from || !to || to < from) return setMsg({ ok: false, text: "The end date must be after the start date." });
      if (annual && days > me.leaveBalance) return setMsg({ ok: false, text: `You only have ${me.leaveBalance} annual leave days left.` });
      if (kind === "trip" && !dest.trim()) return setMsg({ ok: false, text: "Please enter a destination." });
    }
    actions.addRequest({
      workerId: me.id, kind,
      title: kind === "trip" ? dest.trim() : kind === "leave" ? type : docType,
      from: kind === "document" ? TODAY : from, to: kind === "document" ? TODAY : to, note,
    });
    setMsg({ ok: true, text: "Request sent to HR. You will be notified when it is reviewed." });
    setNote("");
    if (kind === "trip") setDest("");
  };

  return (
    <>
      <PageHeader eyebrow="Requests" title="Requests" />
      <Body>
        <div className="grid gap-px bg-ink/15 xl:grid-cols-[400px_1fr]">
          <Card title="New request">
            <form onSubmit={submit} className="space-y-5 p-6">
              <div role="group" aria-label="Request type" className="grid grid-cols-3 border border-ink/20">
                {(["leave", "trip", "document"] as ReqKind[]).map((k) => (
                  <button key={k} type="button" aria-pressed={kind === k} onClick={() => { setKind(k); setMsg(null); }}
                    className={`px-2 py-2.5 text-[14px] transition ${kind === k ? "bg-ink text-lime" : "hover:bg-mist"}`}>
                    <T>{KIND_LABEL[k]}</T>
                  </button>
                ))}
              </div>
              {kind === "leave" && (
                <div className="grid grid-cols-2 gap-px bg-ink/10 text-center">
                  <div className="bg-mist py-3"><div className="text-[24px] leading-none">{me.leaveBalance}</div><div className="mt-1 text-[12px] text-ink/50"><T>annual days left</T></div></div>
                  <div className="bg-mist py-3"><div className="text-[24px] leading-none">{days}</div><div className="mt-1 text-[12px] text-ink/50"><T>working days requested</T></div></div>
                </div>
              )}
              {kind === "trip" && <Field label="Destination"><input value={dest} onChange={(e) => setDest(e.target.value)} className={inputCls} placeholder={tx("e.g. Baku → Ganja")} /></Field>}
              {kind === "leave" && <Field label="Type"><Select value={type} onChange={setType} options={LEAVE_TYPES} /></Field>}
              {kind === "document" && <Field label="Document"><Select value={docType} onChange={setDocType} options={DOC_TYPES} /></Field>}
              {kind !== "document" && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="From"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} /></Field>
                  <Field label="To"><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} /></Field>
                </div>
              )}
              <Field label={kind === "leave" ? "Comment" : "Purpose"}>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className={textareaCls} placeholder={tx(kind === "document" ? "e.g. For bank" : "Optional")} />
              </Field>
              <button type="submit" className="w-full bg-ink px-4 py-3 text-lime transition hover:bg-[#10300d]"><T>Send to HR</T></button>
              {msg && <Flash tone={msg.ok ? "ok" : "bad"}>{msg.text}</Flash>}
            </form>
          </Card>
          <Card title="My requests">
            {mine.length === 0 ? (
              <Empty text="You have not sent any requests yet." />
            ) : (
              <Table
                head={["Request", "Dates / purpose", "Status", "Note from HR"]}
                rows={mine.map((r) => [
                  <span key="t" className="leading-tight">
                    <span className="block">{tx(r.title)}</span>
                    <span className="mt-0.5 block text-[13px] text-ink/45"><T>{KIND_LABEL[r.kind]}</T></span>
                  </span>,
                  <span key="d" className="whitespace-nowrap text-ink/70"><T>{r.kind === "document" ? r.note || "—" : range(r.from, r.to)}</T></span>,
                  <Chip key="s" tone={toneOf(r.status)}>{r.status === "Approved" && r.kind === "document" ? "Ready" : r.status}</Chip>,
                  <span key="c" className="text-ink/60"><T>{r.status === "Pending" ? "Waiting for HR" : r.comment || "No note"}</T></span>,
                ])}
              />
            )}
          </Card>
        </div>
      </Body>
    </>
  );
}

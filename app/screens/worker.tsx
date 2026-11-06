"use client";

import Link from "next/link";
import { useState } from "react";
import { actions, useDemo, useSession } from "../lib/store";
import { addMonths, diffDays, fmt, range } from "../lib/util";
import { TODAY } from "../lib/seed";
import { Body, Card, Chip, Field, Flash, Grid, inputCls, LinkBtn, PageHeader, Progress, Stat, toneOf } from "../shared/ui";
import { T } from "../i18n/LangProvider";
import { tx } from "../i18n/translate";

function useMe() {
  const s = useDemo();
  const session = useSession();
  return { s, me: session?.role === "worker" ? s.workers.find((w) => w.id === session.workerId) : undefined };
}

export function WorkerDashboard() {
  const { s, me } = useMe();
  if (!me) return null;
  const reqs = s.requests.filter((r) => r.workerId === me.id);
  const pending = reqs.filter((r) => r.status === "Pending");
  const toSign = s.docs.filter((d) => d.workerId === me.id && d.status === "Pending");
  const docs = s.docs.filter((d) => d.workerId === me.id && d.status !== "Draft");
  const notes = s.notices.filter((n) => n.to === me.id).slice(0, 4);
  const probation = me.status === "Probation" && me.probationMonths > 0 ? diffDays(TODAY, addMonths(me.start, me.probationMonths)) : null;

  return (
    <>
      <PageHeader eyebrow="Friday 6 November" title={<><T>Good morning,</T> <span className="text-leaf">{me.name.split(" ")[0]}</span></>}>
        <LinkBtn href="/worker/requests" icon="calendar" primary><T>Request leave</T></LinkBtn>
        <LinkBtn href="/worker/requests?type=document" icon="file"><T>Request a document</T></LinkBtn>
      </PageHeader>
      <div className="border-b border-ink/15">
        <Grid cols="grid-cols-2 lg:grid-cols-4">
          <Stat label="Annual leave left" value={String(me.leaveBalance)} note="working days" tone="up" href="/worker/requests" />
          <Stat label="Pending requests" value={String(pending.length)} note="Waiting for HR" href="/worker/requests" />
          <Stat label="To sign" value={String(toSign.length)} note={toSign[0]?.title ?? "Nothing to sign"} tone={toSign.length ? "warn" : undefined} href="/worker/documents" />
          <Stat label={probation !== null ? "Probation ends in" : "Status"} value={probation !== null ? `${Math.max(probation, 0)}d` : me.status} note={probation !== null ? fmt(addMonths(me.start, me.probationMonths)) : `Since ${fmt(me.start)}`} href="/worker/profile" />
        </Grid>
        <div className="mt-px grid gap-px bg-ink/15 xl:grid-cols-[1.45fr_1fr]">
          <Card title="My requests" action="New request" href="/worker/requests">
            {reqs.length === 0 ? (
              <div className="px-6 py-12 text-center text-ink/50"><T>No requests yet.</T></div>
            ) : (
              <ul>
                {reqs.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 last:border-b-0 sm:px-6">
                    <div className="leading-tight">
                      <div className="text-[15px]">{tx(r.title)}</div>
                      <div className="mt-1 text-[13px] text-ink/50"><T>{r.kind === "document" ? r.note : range(r.from, r.to)}</T></div>
                      {r.comment && <div className="mt-1 text-[13px] text-ink/70"><T>{`HR note: ${r.comment}`}</T></div>}
                    </div>
                    <Chip tone={toneOf(r.status)}>{r.status}</Chip>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Leave balance">
            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div>
                <div className="mb-1.5 flex justify-between text-[14px]"><span><T>Annual</T></span><span className="tabular-nums text-ink/60"><T>{`${me.leaveBalance} / 21 days`}</T></span></div>
                <Progress value={(me.leaveBalance / 21) * 100} />
              </div>
              <p className="text-[13px] text-ink/55"><T>The balance drops automatically when HR approves your annual leave.</T></p>
            </div>
          </Card>
        </div>
        <div className="mt-px grid gap-px bg-ink/15 xl:grid-cols-2">
          <Card title="My documents" action="All documents" href="/worker/documents">
            <ul>
              {docs.slice(0, 4).map((d) => (
                <li key={d.id} className="flex items-center justify-between border-b border-ink/10 px-5 py-4 last:border-b-0 sm:px-6">
                  <span className="text-[15px]">{tx(d.title)}</span>
                  <Chip tone={toneOf(d.status)}>{d.status === "Pending" ? "Awaiting your signature" : d.status}</Chip>
                </li>
              ))}
              {docs.length === 0 && <li className="px-6 py-10 text-center text-ink/50"><T>No documents yet.</T></li>}
            </ul>
          </Card>
          <Card title="Notifications" action="All" href="/worker/notifications">
            <ul>
              {notes.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 last:border-b-0 sm:px-6">
                  <Link href="/worker/notifications" className="text-[15px] hover:underline"><T>{n.text}</T></Link>
                  <span className="text-[13px] text-ink/45"><T>{n.when}</T></span>
                </li>
              ))}
              {notes.length === 0 && <li className="px-6 py-10 text-center text-ink/50"><T>Nothing new.</T></li>}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

export function WorkerProfile() {
  const { me } = useMe();
  const [email, setEmail] = useState(me?.email ?? "");
  const [phone, setPhone] = useState(me?.phone ?? "");
  const [address, setAddress] = useState(me?.address ?? "");
  const [saved, setSaved] = useState(false);
  if (!me) return null;
  const facts: [string, string][] = [
    ["Position", me.position], ["Department", me.dept], ["Start date", fmt(me.start)], ["Contract", me.contractType],
    ["Probation", me.probationMonths ? `${me.probationMonths} months` : "None"], ["FIN", me.fin],
  ];
  return (
    <>
      <PageHeader eyebrow="Account" title="My profile" />
      <Body>
        <div className="grid gap-px bg-ink/15 xl:grid-cols-[340px_1fr]">
          <div className="bg-white p-6">
            <div className="grid h-24 w-24 place-items-center bg-gradient-to-br from-sky to-cobalt text-3xl text-white">{me.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
            <div className="mt-4 text-[22px] leading-tight tracking-[-0.02em]">{me.name}</div>
            <div className="mt-1 text-ink/60">{tx(me.position)}</div>
            <div className="mt-3"><Chip tone={toneOf(me.status)}>{me.status}</Chip></div>
            <dl className="mt-5 divide-y divide-ink/10 text-[14px]">
              {facts.map(([k, v]) => <div key={k} className="flex justify-between py-2.5"><dt className="text-ink/55"><T>{k}</T></dt><dd><T>{v}</T></dd></div>)}
            </dl>
          </div>
          <Card title="Contact details">
            <form className="space-y-5 p-6" onSubmit={(e) => { e.preventDefault(); actions.updateWorker(me.id, { email, phone, address }); setSaved(true); }}>
              <p className="text-[14px] text-ink/55"><T>You can update your own contact details. Position, salary and contract are managed by HR.</T></p>
              <Field label="Email"><input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSaved(false); }} className={inputCls} /></Field>
              <Field label="Phone"><input value={phone} onChange={(e) => { setPhone(e.target.value); setSaved(false); }} className={inputCls} /></Field>
              <Field label="Address"><input value={address} onChange={(e) => { setAddress(e.target.value); setSaved(false); }} className={inputCls} /></Field>
              <button type="submit" className="bg-ink px-5 py-3 text-lime transition hover:bg-[#10300d]"><T>Save changes</T></button>
              {saved && <Flash><T>Saved. HR will see the updated details.</T></Flash>}
            </form>
          </Card>
        </div>
      </Body>
    </>
  );
}

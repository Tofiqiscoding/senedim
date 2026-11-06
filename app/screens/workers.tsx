"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEPTS, STATUSES, TODAY, type Dept, type Worker, type WorkerStatus } from "../lib/seed";
import { actions, useDemo } from "../lib/store";
import { fmt, range } from "../lib/util";
import { Avatar, Body, Btn, Card, Chip, Empty, Field, Flash, inputCls, LinkBtn, PageHeader, Person, Search, Select, Table, toneOf } from "../shared/ui";
import { T } from "../i18n/LangProvider";
import { tx } from "../i18n/translate";

export function WorkersList() {
  const s = useDemo();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All departments");
  const [st, setSt] = useState("All statuses");
  const list = s.workers.filter(
    (w) =>
      (dept === "All departments" || w.dept === dept) &&
      (st === "All statuses" || w.status === st) &&
      (w.name + w.position + w.email).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeader eyebrow="People" title="Workers">
        <LinkBtn href="/hr/workers/new" icon="plus" primary><T>Add worker</T></LinkBtn>
      </PageHeader>
      <Body>
        <Card title={`${list.length} of ${s.workers.length} workers`}>
          <div className="flex flex-wrap items-center gap-3 border-b border-ink/10 px-5 py-4 sm:px-6">
            <Search value={q} onChange={setQ} placeholder={tx("Search by name, position or email")} />
            <Select className="w-[200px]" value={dept} onChange={setDept} options={["All departments", ...DEPTS]} />
            <Select className="w-[180px]" value={st} onChange={setSt} options={["All statuses", ...STATUSES]} />
          </div>
          {list.length === 0 ? (
            <Empty text="No workers match your filters." />
          ) : (
            <Table
              head={["Worker", "Position", "Department", "Start date", "Leave left", "Status", ""]}
              rows={list.map((w) => [
                <Link key="p" href={`/hr/workers/${w.id}`} className="block hover:underline"><Person name={w.name} sub={w.email} /></Link>,
                w.position,
                w.dept,
                <span key="d" className="text-ink/70">{fmt(w.start)}</span>,
                <span key="l" className="tabular-nums"><T>{`${w.leaveBalance} days`}</T></span>,
                <Chip key="s" tone={toneOf(w.status)}>{w.status}</Chip>,
                <Link key="e" href={`/hr/workers/${w.id}`} className="text-[14px] text-ink/60 hover:text-ink"><T>Edit →</T></Link>,
              ])}
            />
          )}
        </Card>
      </Body>
    </>
  );
}

type Form = {
  name: string; email: string; phone: string; fin: string; birth: string; address: string; position: string;
  dept: Dept; start: string; status: WorkerStatus; salary: string; leaveBalance: string; probationMonths: string;
  contractType: Worker["contractType"];
};

const blank: Form = {
  name: "", email: "", phone: "+994 ", fin: "", birth: "", address: "", position: "", dept: "IT",
  start: TODAY, status: "Onboarding", salary: "", leaveBalance: "21", probationMonths: "3", contractType: "Open-ended",
};
const fromWorker = (w: Worker): Form => ({
  ...w, salary: String(w.salary), leaveBalance: String(w.leaveBalance), probationMonths: String(w.probationMonths),
});

/** One form for both "Add worker" and "Edit worker". */
export function WorkerForm({ worker }: { worker?: Worker }) {
  const router = useRouter();
  const [f, setF] = useState<Form>(worker ? fromWorker(worker) : blank);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((x) => ({ ...x, [k]: v }));
    setSaved(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.position.trim() || !f.email.includes("@")) {
      setError("Please fill in name, a valid email and position.");
      return;
    }
    setError("");
    const data = {
      ...f, name: f.name.trim(), position: f.position.trim(),
      salary: Number(f.salary) || 0, leaveBalance: Number(f.leaveBalance) || 0, probationMonths: Number(f.probationMonths) || 0,
    };
    if (worker) {
      actions.updateWorker(worker.id, data);
      setSaved(true);
    } else {
      const id = actions.addWorker(data);
      router.push(`/hr/workers/${id}`);
    }
  };

  const text = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <Field label={label}>
      <input value={f[k]} onChange={(e) => set(k, e.target.value as never)} className={inputCls} {...props} />
    </Field>
  );

  return (
    <form onSubmit={submit} className="space-y-6 p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {text("name", "Full name", { placeholder: "e.g. Tofig Changirov", required: true })}
        {text("email", "Email", { type: "email", placeholder: "name@demo.az", required: true })}
        {text("phone", "Phone")}
        {text("fin", "FIN (ID number)", { placeholder: "7 characters", maxLength: 7 })}
        {text("birth", "Date of birth", { type: "date" })}
        {text("address", "Address")}
      </div>
      <div className="grid gap-5 border-t border-ink/10 pt-6 sm:grid-cols-2">
        {text("position", "Position", { placeholder: "e.g. Product Designer", required: true })}
        <Field label="Department"><Select value={tx(f.dept)} onChange={(v) => set("dept", v as Dept)} options={[...DEPTS]} /></Field>
        {text("start", "Start date", { type: "date" })}
        <Field label="Status"><Select value={f.status} onChange={(v) => set("status", v as WorkerStatus)} options={STATUSES} /></Field>
        {text("salary", "Monthly salary (AZN)", { type: "number", min: 0, placeholder: "e.g. 2200" })}
        <Field label="Contract type"><Select value={tx(f.contractType)} onChange={(v) => set("contractType", v as Form["contractType"])} options={["Open-ended", "Fixed-term"]} /></Field>
        {text("probationMonths", "Probation (months)", { type: "number", min: 0, max: 6 })}
        {text("leaveBalance", "Annual leave left (days)", { type: "number", min: 0, max: 60 })}
      </div>
      {!worker && f.status === "Onboarding" && (
        <p className="bg-mist px-4 py-3 text-[14px] text-ink/70">
          <T>Saving creates the worker, a draft employment contract, a draft hire order and a 6-task onboarding checklist automatically.</T>
        </p>
      )}
      {error && <Flash tone="bad">{error}</Flash>}
      {saved && <Flash><T>Changes saved.</T></Flash>}
      <div className="flex gap-2">
        <button type="submit" className="bg-ink px-5 py-3 text-lime transition hover:bg-[#10300d]"><T>{worker ? "Save changes" : "Add worker"}</T></button>
        <Btn onClick={() => router.push("/hr/workers")}>{worker ? "Back to workers" : "Cancel"}</Btn>
      </div>
    </form>
  );
}

export function AddWorker() {
  return (
    <>
      <PageHeader eyebrow="People" title="Add worker" />
      <Body>
        <Card title="Worker details"><WorkerForm /></Card>
      </Body>
    </>
  );
}

export function WorkerDetail({ id }: { id: string }) {
  const s = useDemo();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const w = s.workers.find((x) => x.id === id);
  if (!w) {
    return (
      <>
        <PageHeader eyebrow="People" title="Worker not found" />
        <Body><Card title="Nothing here"><Empty text="This worker does not exist (maybe it was removed)." /></Card></Body>
      </>
    );
  }
  const docs = s.docs.filter((d) => d.workerId === id);
  const reqs = s.requests.filter((r) => r.workerId === id);
  const tasks = s.tasks[id];

  return (
    <>
      <PageHeader eyebrow="People · Workers" title={w.name}>
        <LinkBtn href="/hr/contracts" icon="file"><T>Generate document</T></LinkBtn>
      </PageHeader>
      <Body>
        <div className="grid gap-px bg-ink/15 xl:grid-cols-[340px_1fr]">
          <div className="space-y-px bg-ink/15">
            <div className="bg-white p-6">
              <Avatar initials={w.name.split(" ").map((x) => x[0]).slice(0, 2).join("")} size={88} />
              <div className="mt-4 text-[22px] leading-tight tracking-[-0.02em]">{w.name}</div>
              <div className="mt-1 text-ink/60">{tx(w.position)} · {tx(w.dept)}</div>
              <div className="mt-3 flex flex-wrap gap-2"><Chip tone={toneOf(w.status)}>{w.status}</Chip><Chip>{tx(w.contractType)}</Chip></div>
              <dl className="mt-5 divide-y divide-ink/10 text-[14px]">
                {[["Started", fmt(w.start)], ["Leave left", `${w.leaveBalance} days`], ["Salary", `${w.salary} AZN`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2.5"><dt className="text-ink/55"><T>{k}</T></dt><dd><T>{v}</T></dd></div>
                ))}
              </dl>
              {tasks && <p className="mt-4 text-[13px] text-ink/55"><T>{`Onboarding: ${tasks.filter(Boolean).length}/${tasks.length} tasks done`}</T></p>}
            </div>
            <div className="bg-white p-6">
              <div className="mb-3 text-[15px]"><T>Danger zone</T></div>
              {!confirm ? (
                <Btn onClick={() => setConfirm(true)}><T>Remove worker</T></Btn>
              ) : (
                <div className="space-y-3">
                  <p className="text-[13px] text-ink/60"><T>This removes the worker with their requests and documents.</T></p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { actions.removeWorker(id); router.replace("/hr/workers"); }} className="bg-red-700 px-4 py-2.5 text-[14px] text-white"><T>Yes, remove</T></button>
                    <Btn onClick={() => setConfirm(false)}><T>Cancel</T></Btn>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Card title="Edit worker">
            <WorkerForm key={w.id} worker={w} />
          </Card>
        </div>
        <div className="grid gap-px bg-ink/15 xl:grid-cols-2">
          <Card title={`Documents (${docs.length})`}>
            {docs.length === 0 ? <Empty text="No documents yet." /> : (
              <ul>{docs.map((d) => (
                <li key={d.id} className="flex items-center justify-between border-b border-ink/10 px-6 py-3.5 last:border-b-0">
                  <div className="leading-tight"><div>{tx(d.title)}</div><div className="mt-0.5 text-[13px] text-ink/50">{fmt(d.date)}</div></div>
                  <Chip tone={toneOf(d.status)}>{d.status}</Chip>
                </li>
              ))}</ul>
            )}
          </Card>
          <Card title={`Requests (${reqs.length})`}>
            {reqs.length === 0 ? <Empty text="No requests yet." /> : (
              <ul>{reqs.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 border-b border-ink/10 px-6 py-3.5 last:border-b-0">
                  <div className="leading-tight"><div>{tx(r.title)}</div><div className="mt-0.5 text-[13px] text-ink/50"><T>{r.kind === "document" ? r.note : range(r.from, r.to)}</T></div></div>
                  <Chip tone={toneOf(r.status)}>{r.status}</Chip>
                </li>
              ))}</ul>
            )}
          </Card>
        </div>
      </Body>
    </>
  );
}

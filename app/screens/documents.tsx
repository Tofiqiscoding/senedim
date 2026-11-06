"use client";

import { useState } from "react";
import { buildDoc, TEMPLATES } from "../lib/doc";
import type { Worker } from "../lib/seed";
import { actions, useDemo, useSession } from "../lib/store";
import { fmt } from "../lib/util";
import Icon from "../shared/Icon";
import { Body, Btn, Card, Chip, Empty, Field, Flash, inputCls, PageHeader, Person, Select, Table, Tabs, toneOf } from "../shared/ui";
import { T } from "../i18n/LangProvider";
import { tx } from "../i18n/translate";

export function Paper({ w, template, salary, probation }: { w: Worker; template: string; salary?: string; probation?: string }) {
  const doc = buildDoc(template, w, { salary, probation });
  return (
    <article className="print-area mx-auto min-h-[560px] max-w-[640px] bg-white p-8 font-serif text-[15px] leading-[1.7] text-ink shadow-[0_10px_40px_rgba(0,0,0,0.12)] sm:p-12">
      <div className="mb-1 text-center text-[17px] font-bold tracking-wide">{tx(doc.title)}</div>
      {doc.sub && <div className="mb-1 text-center">{doc.sub}</div>}
      <div className="mb-8 flex justify-between text-[13px] text-ink/60"><span>Bakı şəhəri</span><span>06.11.2026</span></div>
      <div className="space-y-3">{doc.body.map((l, i) => <p key={i}>{l}</p>)}</div>
      <div className="mt-14 grid grid-cols-2 gap-8 text-[14px]">
        <div><div className="mb-8 font-bold">İşəgötürən</div><div className="border-t border-ink/50 pt-1 text-ink/60"><T>imza</T></div></div>
        <div><div className="mb-8 font-bold">İşçi</div><div className="border-t border-ink/50 pt-1 text-ink/60">{w.name}</div></div>
      </div>
    </article>
  );
}

export function Contracts() {
  const s = useDemo();
  const [wid, setWid] = useState("");
  const [tpl, setTpl] = useState(TEMPLATES[0].name);
  const [salary, setSalary] = useState("");
  const [probation, setProbation] = useState("");
  const [saved, setSaved] = useState("");
  const w = s.workers.find((x) => x.id === wid) ?? s.workers.find((x) => x.status === "Onboarding") ?? s.workers[0];
  if (!w) return <><PageHeader eyebrow="Documents" title="Contract generator" /><Body><Card title="No workers"><Empty text="Add a worker first." /></Card></Body></>;

  return (
    <>
      <PageHeader eyebrow="Documents" title="Contract generator">
        <Btn onClick={() => { actions.addDocument({ workerId: w.id, title: tpl, status: "Pending" }); setSaved(`${tpl} saved to ${w.name}’s file and sent for signature.`); }}><T>Save to personal file</T></Btn>
        <Btn icon="doc" primary onClick={() => window.print()}><T>Download PDF</T></Btn>
      </PageHeader>
      <Body>
        <div className="grid gap-px bg-ink/15 xl:grid-cols-[380px_1fr]">
          <Card title="1 · Choose and fill">
            <div className="space-y-5 p-6">
              <Field label="Worker">
                <div className="relative">
                  <select value={w.id} onChange={(e) => { setWid(e.target.value); setSalary(""); setProbation(""); setSaved(""); }} className={`${inputCls} appearance-none pr-9`}>
                    {s.workers.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                  <Icon name="chevron" className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-ink/50" />
                </div>
              </Field>
              <Field label="Template"><Select value={tpl} onChange={(v) => { setTpl(v); setSaved(""); }} options={TEMPLATES.map((t) => t.name)} /></Field>
              <Field label="Monthly salary (AZN)"><input value={salary} onChange={(e) => setSalary(e.target.value.replace(/\D/g, ""))} placeholder={String(w.salary)} className={inputCls} /></Field>
              <Field label="Probation (months)"><input value={probation} onChange={(e) => setProbation(e.target.value.replace(/\D/g, ""))} placeholder={String(w.probationMonths)} className={inputCls} /></Field>
              <p className="border-t border-ink/10 pt-5 text-[13px] leading-snug text-ink/55">
                <T>Data is filled from the worker profile — edit the worker to change it. “Download PDF” opens the print dialog: choose “Save as PDF”. Azerbaijani letters (ə, ğ, ı, ö, ü, ş, ç) are kept.</T>
              </p>
              {saved && <Flash>{saved}</Flash>}
            </div>
          </Card>
          <Card title="2 · Preview">
            <div className="bg-[#e6e9e9] p-4 sm:p-8"><Paper w={w} template={tpl} salary={salary} probation={probation} /></div>
          </Card>
        </div>
      </Body>
    </>
  );
}

export function HrDocuments() {
  const s = useDemo();
  const [tab, setTab] = useState("all");
  const rows = s.docs.filter((d) => tab === "all" || d.status === tab);
  const c = (st: string) => s.docs.filter((d) => d.status === st).length;
  const who = (id: string) => s.workers.find((w) => w.id === id)?.name ?? "Removed worker";
  return (
    <>
      <PageHeader eyebrow="Documents" title="Document history" />
      <Body>
        <Card title="All generated documents">
          <Tabs value={tab} onChange={setTab} tabs={[
            { id: "all", label: "All", count: s.docs.length }, { id: "Signed", label: "Signed", count: c("Signed") },
            { id: "Pending", label: "Awaiting signature", count: c("Pending") }, { id: "Draft", label: "Draft", count: c("Draft") }, { id: "Ready", label: "Ready", count: c("Ready") },
          ]} />
          {rows.length === 0 ? <Empty text="No documents." /> : (
            <Table head={["Document", "Worker", "Created by", "Date", "Status"]} rows={rows.map((d) => [
              d.title, <Person key="p" name={who(d.workerId)} />, <span key="b" className="text-ink/70">{d.by}</span>, <span key="d" className="text-ink/70">{fmt(d.date)}</span>,
              <Chip key="s" tone={toneOf(d.status)}>{d.status === "Pending" ? "Awaiting signature" : d.status}</Chip>,
            ])} />
          )}
        </Card>
      </Body>
    </>
  );
}

export function WorkerDocuments() {
  const s = useDemo();
  const session = useSession();
  const me = session?.role === "worker" ? s.workers.find((w) => w.id === session.workerId) : undefined;
  const [sel, setSel] = useState<string | null>(null);
  if (!me) return null;
  // drafts are HR-internal: workers only see documents that were issued to them
  const docs = s.docs.filter((d) => d.workerId === me.id && d.status !== "Draft");
  const cur = docs.find((d) => d.id === sel) ?? docs[0];

  return (
    <>
      <PageHeader eyebrow="Documents" title="My documents">
        {cur && <Btn icon="doc" primary onClick={() => window.print()}><T>Download PDF</T></Btn>}
      </PageHeader>
      <Body>
        {docs.length === 0 ? (
          <Card title="Documents"><Empty text="You have no documents yet. Request one from the Document requests page." /></Card>
        ) : (
          <div className="grid gap-px bg-ink/15 xl:grid-cols-[400px_1fr]">
            <Card title={`${docs.length} documents`}>
              <ul>
                {docs.map((d) => (
                  <li key={d.id} className={`border-b border-ink/10 last:border-b-0 ${cur?.id === d.id ? "bg-mist" : ""}`}>
                    <div className="flex items-center gap-3 px-5 py-4">
                      <button type="button" onClick={() => setSel(d.id)} className="min-w-0 flex-1 text-left leading-tight">
                        <div className="truncate">{tx(d.title)}</div>
                        <div className="mt-1 text-[13px] text-ink/50">{fmt(d.date)}</div>
                      </button>
                      {d.status === "Pending" ? (
                        <button type="button" onClick={() => actions.signDocument(d.id)} className="bg-ink px-3 py-2 text-[13px] text-lime transition hover:bg-[#10300d]"><T>Sign</T></button>
                      ) : (
                        <Chip tone={toneOf(d.status)}>{d.status}</Chip>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title={cur ? `${tx(cur.title)} · preview` : "Preview"}>
              <div className="bg-[#e6e9e9] p-4 sm:p-8">{cur && <Paper w={me} template={tx(cur.title)} />}</div>
            </Card>
          </div>
        )}
      </Body>
    </>
  );
}

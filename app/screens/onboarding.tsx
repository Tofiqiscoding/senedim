"use client";

import Link from "next/link";
import { useState } from "react";
import { TASKS } from "../lib/seed";
import { actions, useDemo } from "../lib/store";
import { fmt } from "../lib/util";
import { Avatar, Body, Card, Chip, Empty, LinkBtn, PageHeader, Progress } from "../shared/ui";
import { T } from "../i18n/LangProvider";
import { tx } from "../i18n/translate";

export function Onboarding() {
  const s = useDemo();
  const list = s.workers.filter((w) => s.tasks[w.id]);
  const [sel, setSel] = useState<string | null>(null);
  const cur = list.find((w) => w.id === sel) ?? list[0];
  const done = (id: string) => s.tasks[id].filter(Boolean).length;

  return (
    <>
      <PageHeader eyebrow="People" title="Onboarding">
        <LinkBtn href="/hr/workers/new" icon="plus" primary><T>Offer accepted → add worker</T></LinkBtn>
      </PageHeader>
      <Body>
        {!cur ? (
          <Card title="Checklists"><Empty text="Nobody is onboarding. Adding a worker with status “Onboarding” creates a checklist automatically." /></Card>
        ) : (
          <div className="grid gap-px bg-ink/15 xl:grid-cols-[380px_1fr]">
            <Card title="New hires">
              <ul>
                {list.map((w) => (
                  <li key={w.id}>
                    <button type="button" onClick={() => setSel(w.id)} className={`block w-full border-b border-ink/10 px-6 py-5 text-left transition last:border-b-0 ${cur.id === w.id ? "bg-mist" : "hover:bg-mist/60"}`}>
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar initials={w.name.split(" ").map((x) => x[0]).slice(0, 2).join("")} />
                        <div className="flex-1 leading-tight">
                          <div>{w.name}</div>
                          <div className="mt-0.5 text-[13px] text-ink/50"><T>{`${w.position} · starts ${fmt(w.start)}`}</T></div>
                        </div>
                        <span className="text-[13px] tabular-nums text-ink/60">{done(w.id)}/{TASKS.length}</span>
                      </div>
                      <Progress value={(done(w.id) / TASKS.length) * 100} />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title={`${cur.name} · checklist`}>
              <ul>
                {TASKS.map((t, k) => {
                  const on = s.tasks[cur.id][k];
                  return (
                    <li key={t.t} className="flex items-center gap-4 border-b border-ink/10 px-6 py-4 last:border-b-0">
                      <button type="button" role="checkbox" aria-checked={on} aria-label={tx(t.t)} onClick={() => actions.toggleTask(cur.id, k)}
                        className={`grid h-6 w-6 shrink-0 place-items-center border text-[13px] transition ${on ? "border-lime bg-lime text-ink" : "border-ink/30 bg-white hover:border-ink"}`}>
                        {on ? "✓" : ""}
                      </button>
                      <div className="flex-1 leading-tight">
                        <div className={on ? "text-ink/45 line-through" : ""}><T>{t.t}</T></div>
                        <div className="mt-1 text-[13px] text-ink/50"><T>{`Responsible: ${t.owner}`}</T></div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between border-t border-ink/10 px-6 py-4">
                <Chip tone={done(cur.id) === TASKS.length ? "ok" : "warn"}>{done(cur.id) === TASKS.length ? "Completed" : `${TASKS.length - done(cur.id)} tasks left`}</Chip>
                <Link href={`/hr/workers/${cur.id}`} className="text-[14px] text-ink/60 hover:text-ink"><T>Open worker →</T></Link>
              </div>
            </Card>
          </div>
        )}
      </Body>
    </>
  );
}

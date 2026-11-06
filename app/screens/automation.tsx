"use client";

import { useState } from "react";
import { RULES } from "../lib/seed";
import { actions, useDemo } from "../lib/store";
import { Body, Card, Chip, Flash, PageHeader, Switch } from "../shared/ui";

const RULE_LABEL: Record<string, string> = Object.fromEntries(RULES.map((r) => [r.id, r.title]));

export default function Automation() {
  const s = useDemo();
  const [msg, setMsg] = useState("");
  const count = (id: string) => s.log.filter((l) => l.rule === id).length;
  const active = RULES.filter((r) => s.rules[r.id] !== false).length;

  return (
    <>
      <PageHeader eyebrow="Avtomatlaşdırma" title="Avtomatlaşdırma">
        <span className="flex items-center gap-2 border border-ink/20 px-3 py-2 text-[14px]">
          <i className="h-2 w-2 rounded-full bg-leaf pulse-dot" /> {active} / {RULES.length} qayda aktivdir
        </span>
      </PageHeader>
      <Body>
        <div className="grid gap-px bg-ink/15 xl:grid-cols-[1.2fr_1fr]">
          <Card title="Qaydalar">
            <ul>
              {RULES.map((r) => {
                const on = s.rules[r.id] !== false;
                return (
                  <li key={r.id} className="flex items-start gap-4 border-b border-ink/10 px-5 py-5 last:border-b-0 sm:px-6">
                    <div className="min-w-0 flex-1 leading-snug">
                      <div className="flex flex-wrap items-center gap-2 text-[16px]">
                        {r.title}
                        <Chip tone={on ? "ok" : "muted"}>{on ? "Aktiv" : "Söndürülüb"}</Chip>
                      </div>
                      <p className="mt-1.5 text-[14px] text-ink/60">{r.desc}</p>
                      <p className="mt-2 text-[12px] text-ink/45">Jurnalda {count(r.id)} qeyd</p>
                    </div>
                    <Switch on={on} onChange={(v) => actions.setRule(r.id, v)} label={r.title} />
                  </li>
                );
              })}
            </ul>
          </Card>

          <div className="space-y-px bg-ink/15">
            <Card title="Ayı bağla">
              <div className="space-y-4 p-5 sm:p-6">
                <p className="text-[14px] text-ink/65">Aylıq qayda: hər işçinin illik məzuniyyət balansı +2 gün artır. Nəticəni “Canlı jurnal”da və işçilərin balansında görəcəksiniz.</p>
                <button
                  type="button"
                  disabled={s.rules.accrual === false}
                  onClick={() => setMsg(`${actions.closeMonth()} işçinin balansı +2 gün artırıldı.`)}
                  className="bg-ink px-5 py-3 text-lime transition hover:bg-[#10300d] disabled:opacity-40"
                >
                  Ayı bağla (+2 gün)
                </button>
                {s.rules.accrual === false && <p className="text-[13px] text-ink/50">“Aylıq məzuniyyət artımı” qaydası söndürülüb.</p>}
                {msg && <Flash>{msg}</Flash>}
              </div>
            </Card>
            <Card title="Canlı jurnal">
              {s.log.length === 0 ? (
                <div className="px-6 py-10 text-center text-ink/50">Hələ avtomatik əməliyyat yoxdur.</div>
              ) : (
                <ul className="max-h-[420px] overflow-y-auto">
                  {s.log.map((l) => (
                    <li key={l.id} className="pop flex gap-3 border-b border-ink/10 px-5 py-3.5 last:border-b-0 sm:px-6">
                      <span className="mt-1.5 h-2 w-2 shrink-0 bg-leaf" />
                      <div className="min-w-0 flex-1 leading-snug">
                        <div className="text-[14px]">{l.text}</div>
                        <div className="mt-1 text-[12px] text-ink/45">{l.when} · {RULE_LABEL[l.rule] ?? l.rule}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </Body>
    </>
  );
}

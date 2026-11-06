"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "../i18n/LangProvider";
import Link from "next/link";
import Icon from "./Icon";

const tones = {
  ok: "bg-lime/50 text-ink",
  warn: "bg-amber-100 text-amber-900",
  bad: "bg-red-100 text-red-800",
  info: "bg-sky/15 text-[#0b5fa3]",
  muted: "bg-ink/8 text-ink/70",
};
export type Tone = keyof typeof tones;

export function Chip({ tone = "muted", children }: { tone?: Tone; children: React.ReactNode }) {
  const t = useT();
  return (
    <span className={`inline-block px-2.5 py-1 text-[12px] leading-none ${tones[tone]}`}>
      {typeof children === "string" ? t(children) : children}
    </span>
  );
}

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center bg-gradient-to-br from-sky to-cobalt text-[12px] text-white"
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="flex flex-col gap-6 border-b border-ink/15 bg-white px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-3 text-[14px] text-ink/50">{t(eyebrow)}</div>
        <h1 className="text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05] tracking-[-0.04em]">{typeof title === "string" ? t(title) : title}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Btn({
  children,
  primary = false,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  primary?: boolean;
  icon?: string;
  onClick?: () => void;
}) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-[15px] transition ${
        primary ? "bg-ink text-lime hover:bg-[#10300d]" : "border border-ink/25 bg-white hover:bg-mist"
      }`}
    >
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {typeof children === "string" ? t(children) : children}
    </button>
  );
}

function useCountUp(target: number) {
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 800);
      setV(Math.round(a + (target - a) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

export function Stat({ label, value, note, tone }: { label: string; value: string; note: string; tone?: "up" | "warn" }) {
  const t = useT();
  const isNum = /^\d+$/.test(value);
  const counted = useCountUp(isNum ? Number(value) : 0);
  return (
    <div className="flex min-h-[170px] flex-col justify-between bg-white p-5 sm:p-6">
      <div className="text-[14px] text-ink/55">{t(label)}</div>
      <div>
        <div className="text-[clamp(2.5rem,3.6vw,3.75rem)] leading-none tracking-[-0.04em] tabular-nums">{isNum ? counted : t(value)}</div>
        <div className={`mt-3 text-[13px] ${tone === "warn" ? "text-red-700" : tone === "up" ? "text-[#2f7a1f]" : "text-ink/55"}`}>
          {t(note)}
        </div>
      </div>
    </div>
  );
}

export function Card({
  title,
  action,
  href = "#",
  children,
  className = "",
}: {
  title: string;
  action?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const t = useT();
  return (
    <section className={`flex flex-col bg-white ${className}`}>
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4 sm:px-6">
        <h2 className="text-[18px] tracking-[-0.01em]">{t(title)}</h2>
        {action && (
          <Link href={href} className="flex items-center gap-1 text-[14px] text-ink/60 transition hover:text-ink">
            {t(action)}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full bg-ink/10">
      <div className="bar-grow h-full bg-leaf transition-[width] duration-500" style={{ width: `${value}%` }} />
    </div>
  );
}

/** 1px-gap grid: the thin-line look from the landing page */
export function Grid({ cols, children }: { cols: string; children: React.ReactNode }) {
  return <div className={`grid gap-px bg-ink/15 ${cols}`}>{children}</div>;
}

/* ---------- screen helpers ---------- */
export const inputCls =
  "h-10 w-full border border-ink/20 bg-white px-3 text-[15px] outline-none transition placeholder:text-ink/40 focus:border-ink";

export function toneOf(s: string): Tone {
  if (["Active", "Approved", "Signed", "Ready", "Generated", "Done", "Accepted"].includes(s)) return "ok";
  if (["Pending", "Probation", "New", "Draft"].includes(s)) return "warn";
  if (["Rejected", "Declined"].includes(s)) return "bad";
  if (["Onboarding"].includes(s)) return "info";
  return "muted";
}

export function Body({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-px border-b border-ink/15 bg-ink/15">{children}</div>;
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3 border-b border-ink/10 px-5 py-4 sm:px-6">{children}</div>;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const t = useT();
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] text-ink/55">{t(label)}</span>
      {children}
    </label>
  );
}

export function Select({
  value, onChange, options, className = "",
}: { value: string; onChange: (v: string) => void; options: string[]; className?: string }) {
  const t = useT();
  return (
    <div className={`relative ${className}`}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} appearance-none pr-9`}>
        {options.map((o) => (
          <option key={o} value={o}>{t(o)}</option>
        ))}
      </select>
      <Icon name="chevron" className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-ink/50" />
    </div>
  );
}

export function Search({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const t = useT();
  return (
    <div className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
      <Icon name="search" className="absolute left-3 top-3 h-4 w-4 text-ink/40" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={t(placeholder)} className={`${inputCls} pl-9`} />
    </div>
  );
}

export function Tabs<T extends string>({
  tabs, value, onChange,
}: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (t: T) => void }) {
  const tr = useT();
  return (
    <div className="no-scrollbar flex gap-6 overflow-x-auto overflow-y-hidden border-b border-ink/10 px-5 sm:px-6" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 py-3.5 text-[15px] transition ${
            value === t.id ? "border-ink text-ink" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          {tr(t.label)}
          {t.count !== undefined && <span className="bg-ink/8 px-1.5 text-[12px] leading-5 text-ink/70">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  const t = useT();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-[15px]">
        <thead>
          <tr className="border-b border-ink/10 text-[13px] text-ink/50">
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-normal first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6">
                {t(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-ink/10 transition-colors last:border-b-0 hover:bg-mist/70">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3.5 align-middle first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6">
                  {typeof c === "string" ? t(c) : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Person({ name, sub }: { name: string; sub?: string }) {
  const t = useT();
  const init = name.split(" ").slice(0, 2).map((w) => w[0]).join("");
  return (
    <div className="flex items-center gap-3">
      <Avatar initials={init} />
      <div className="leading-tight">
        <div>{name}</div>
        {sub && <div className="mt-0.5 text-[13px] text-ink/50">{t(sub)}</div>}
      </div>
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  const t = useT();
  return <div className="px-6 py-14 text-center text-ink/50">{t(text)}</div>;
}

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 transition-colors ${on ? "bg-ink" : "bg-ink/20"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 transition-all ${on ? "left-[22px] bg-lime" : "left-0.5 bg-white"}`} />
    </button>
  );
}

export function LinkBtn({ href, children, primary = false, icon }: { href: string; children: React.ReactNode; primary?: boolean; icon?: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2.5 text-[15px] transition ${
        primary ? "bg-ink text-lime hover:bg-[#10300d]" : "border border-ink/25 bg-white hover:bg-mist"
      }`}
    >
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </Link>
  );
}

export function Flash({ children, tone = "ok" }: { children: React.ReactNode; tone?: "ok" | "bad" }) {
  const t = useT();
  return (
    <p role="status" className={`pop px-4 py-2.5 text-[14px] ${tone === "ok" ? "bg-lime/40 text-ink" : "bg-red-100 text-red-800"}`}>
      {typeof children === "string" ? t(children) : children}
    </p>
  );
}

export const textareaCls =
  "w-full border border-ink/20 bg-white px-3 py-2 text-[15px] outline-none transition placeholder:text-ink/40 focus:border-ink";

"use client";

import { useEffect, useState } from "react";
import Mosaic from "./Mosaic";
import { useT } from "../i18n/LangProvider";

const steps = ["Hires", "Onboards", "Approves"];
const blurbs = [
  "Offer accepted — the employee, contract draft and checklist are created in one click.",
  "Every new hire gets the same 6-task checklist with a responsible person per task.",
  "Workers send leave, trip and document requests; HR approves in one click, with a full audit trail.",
];

export default function HowItWorks() {
  const t = useT();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 2600);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section id="how" className="noise relative border-b border-white/20" onMouseLeave={() => setPaused(false)}>
      <Mosaic rows={6} cols={7} seed={13} density={0.5} />
      <div className="relative z-10 grid lg:grid-cols-[var(--left)_1fr]">
        <div className="hidden border-r border-white/20 lg:block" />
        <div className="flex h-[200px] items-end border-b border-white/20 px-6 pb-8 md:px-9 lg:h-[310px] lg:pl-[78px]">
          {t("How It Works")}
        </div>
      </div>
      <div className="relative z-10 grid lg:grid-cols-[var(--left)_1fr]">
        <div className="relative hidden border-r border-white/20 lg:block">
          <span className="absolute left-9 top-[26px] h-section whitespace-nowrap">{t("HR that")}</span>
        </div>
        <div>
          <span className="h-section block px-6 pt-6 md:px-9 lg:hidden">{t("HR that")}</span>
          {steps.map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => {
                setActive(i);
                setPaused(true);
              }}
              onFocus={() => setActive(i)}
              className={`h-section block w-full border-b border-white/20 px-6 py-5 text-left transition-colors duration-500 last:border-b-0 md:px-9 lg:pl-[36px] ${
                i === active ? "text-lime" : "text-white/30"
              }`}
            >
              {t(s)}
              <span
                className={`block max-w-[26em] text-[17px] leading-snug tracking-normal text-white/70 transition-all duration-500 ${
                  i === active ? "mt-2 max-h-20 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                }`}
              >
                {t(blurbs[i])}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

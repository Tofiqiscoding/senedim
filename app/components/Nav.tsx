"use client";

import Link from "next/link";
import { LangSwitch, useT } from "../i18n/LangProvider";
import { useEffect, useState } from "react";

export function Logo({ className = "", href = "#top" }: { className?: string; href?: string }) {
  return (
    <a href={href} className={`relative inline-block tracking-[-0.04em] ${className}`}>
      senedim
      <span aria-hidden className="absolute -right-2.5 -top-0.5 grid grid-cols-2 gap-px">
        <i className="block h-[5px] w-[5px] bg-sky" />
        <i className="block h-[5px] w-[5px] bg-lime" />
        <i className="block h-[5px] w-[5px] bg-transparent" />
        <i className="block h-[5px] w-[5px] bg-sky/60" />
      </span>
    </a>
  );
}

const links = [
  ["Products", "#products"],
  ["How it works", "#how"],
  ["Teams", "#teams"],
  ["Security", "#secure"],
];

export default function Nav() {
  const t = useT();
  const [light, setLight] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const on = [...document.querySelectorAll('[data-nav="light"]')].some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= 30 && r.bottom >= 30;
        });
        setLight(on);
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex h-[60px] items-stretch justify-between border-b backdrop-blur-md transition-colors duration-300 ${
        light ? "border-ink/15 bg-white/90 text-ink" : "border-white/20 bg-ink/60 text-white"
      }`}
    >
      <div className="flex items-center gap-8 pl-7">
        <Logo className="text-[26px]" />
        <nav className="ml-2 hidden items-center gap-10 text-[15px] opacity-80 md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="transition hover:opacity-100">
              {t(l)}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex items-stretch text-[15px]">
        <div className="mr-4 hidden items-center sm:flex">
          <LangSwitch light={light} />
        </div>
        <Link href="/login" className="hidden items-center px-6 opacity-80 transition hover:opacity-100 sm:flex">
          {t("Login")}
        </Link>
        <Link href="/login" className="flex items-center bg-lime px-6 text-ink transition hover:bg-leaf sm:px-8">
          {t("Open Demo")}
        </Link>
      </div>
    </header>
  );
}

import Link from "next/link";
import { T } from "../i18n/LangProvider";

const cols: [string, string[]][] = [
  ["Navigate", ["Home", "Products", "How it works", "Teams"]],
  ["Roles", ["HR", "Worker"]],
];

export default function Footer() {
  return (
    <footer className="noise relative border-t border-white/20 bg-ink">
      <div className="relative z-10 grid gap-10 px-6 py-12 md:px-9 lg:grid-cols-[var(--left)_repeat(2,minmax(0,1fr))_auto] lg:pt-[44px]">
        <p className="max-w-[16em] text-[15px] leading-snug text-white/70">
          <T>senedim saves time, removes lost approvals and keeps every new hire’s paperwork in order.</T>
        </p>
        {cols.map(([h, items]) => (
          <div key={h}>
            <div className="mb-8 text-[15px] text-white/50"><T>{h}</T></div>
            <ul className="space-y-3 text-[15px]">
              {items.map((i) => (
                <li key={i}>
                  <a href="#top" className="transition hover:text-lime">
                    <T>{i}</T>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex gap-8 text-[15px] lg:items-start">
          <Link href="/login"><T>Login</T></Link>
          <Link href="/login"><T>Open Demo</T></Link>
        </div>
      </div>

      <div aria-hidden className="relative z-10 overflow-hidden border-t border-white/20 px-6 md:px-9">
        <div className="-mb-[0.18em] translate-y-[8%] select-none text-center text-[clamp(5rem,19vw,20rem)] leading-[0.9] tracking-[-0.06em] text-[#eef1ee]">
          senedim<span className="text-sky">+</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-3 border-t border-white/20 px-6 py-6 text-[15px] text-white/45 sm:flex-row md:px-9">
        <span><T>© 2026 senedim. All Rights Reserved.</T></span>
        <span className="flex gap-10">
          <a href="#top"><T>Terms of Use</T></a>
          <a href="#top"><T>Privacy Policy</T></a>
        </span>
      </div>
    </footer>
  );
}

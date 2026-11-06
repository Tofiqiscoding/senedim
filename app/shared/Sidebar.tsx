"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "../components/Nav";
import { HR_USER } from "../lib/seed";
import { signOut, useDemo, useSession } from "../lib/store";
import Icon from "./Icon";
import { nav, type Badge, type Role } from "./nav";
import { tx } from "../i18n/translate";
import { T } from "../i18n/LangProvider";

export default function Sidebar({ role, open, onClose }: { role: Role; open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const demo = useDemo();
  // Explicit open/close choices. Without a choice a group is open only if it holds the current page.
  const [choice, setChoice] = useState<Record<string, boolean>>({});

  const me = session?.role === "worker" ? demo.workers.find((w) => w.id === session.workerId) : null;
  const name = role === "hr" ? HR_USER.name : me?.name ?? "";
  const title = role === "hr" ? HR_USER.title : me?.position ?? "";
  const home = role === "hr" ? "/hr" : "/worker";
  const viewer = role === "hr" ? "hr" : me?.id ?? "";

  const isActive = (href: string) =>
    href === home ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const counts: Record<Badge, number> = {
    requests: demo.requests.filter((r) => r.status === "Pending").length,
    document: demo.docs.filter((d) => d.workerId === viewer && d.status === "Pending").length,
    notices: demo.notices.filter((n) => n.to === viewer && n.unread).length,
  };
  const showBadge = (b?: Badge) => (b ? counts[b] : 0);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-ink/60 backdrop-blur-sm transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`noise fixed inset-y-0 left-0 z-40 flex w-[288px] flex-col border-r border-white/20 bg-ink text-white transition-transform duration-300 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="relative z-10 flex h-[60px] shrink-0 items-center justify-between border-b border-white/20 px-6">
          <Logo href="/" className="text-[26px]" />
          <span className="bg-lime px-2 py-0.5 text-[12px] text-ink"><T>{role === "hr" ? "HR" : "Worker"}</T></span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="text-white/60 lg:hidden">
            <Icon name="x" />
          </button>
        </div>

        <nav className="no-scrollbar relative z-10 flex-1 overflow-y-auto py-3" aria-label="Main">
          {nav[role].map((g) => {
            const hasActive = g.items.some((i) => isActive(i.href));
            const expanded = choice[g.id] ?? hasActive;
            return (
              <div key={g.id} className="mb-1">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setChoice((c) => ({ ...c, [g.id]: !expanded }))}
                  className="flex w-full items-center gap-3 px-6 py-2.5 text-left text-[13px] text-white/55 transition hover:text-white"
                >
                  <Icon name={g.icon} className="h-4 w-4" />
                  <span className="flex-1"><T>{g.label}</T></span>
                  <Icon name="chevron" className={`h-4 w-4 transition-transform ${expanded ? "" : "-rotate-90"}`} />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} inert={!expanded}>
                  <ul className="ml-[39px] overflow-hidden border-l border-white/15">
                    {g.items.map((i) => {
                      const active = isActive(i.href);
                      const n = showBadge(i.badge);
                      return (
                        <li key={i.href}>
                          <Link
                            href={i.href}
                            onClick={onClose}
                            className={`flex items-center justify-between py-2 pl-5 pr-6 text-[15px] transition ${active ? "bg-lime text-ink" : "text-white/85 hover:bg-white/[0.06] hover:text-white"}`}
                          >
                            <T>{i.label}</T>
                            {n > 0 && (
                              <span className={`grid h-5 min-w-5 place-items-center px-1.5 text-[11px] ${active ? "bg-ink text-lime" : "bg-white/15 text-white"}`}>
                                {n}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="relative z-10 shrink-0 border-t border-white/20 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center bg-gradient-to-br from-sky to-cobalt text-sm">
              {name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[15px]">{name}</div>
              <div className="truncate text-[13px] text-white/50"><T>{title}</T></div>
            </div>
            <button
              type="button"
              aria-label="Sign out"
              title={tx("Sign out")}
              onClick={() => {
                signOut();
                router.replace("/login");
              }}
              className="text-white/50 transition hover:text-lime"
            >
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

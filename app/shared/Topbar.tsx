"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { seed } from "../lib/seed";
import { actions, signOut, useDemo, useSession } from "../lib/store";
import Icon from "./Icon";
import { titleFor, type Role } from "./nav";

export default function Topbar({ role, onMenu }: { role: Role; onMenu: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const session = useSession();
  const demo = useDemo();
  const { group, label } = titleFor(role, pathname);
  const viewer = session?.role === "worker" ? session.workerId : "hr";
  const unread = demo.notices.filter((n) => n.to === viewer && n.unread).length;

  const reset = () => {
    actions.reset(); // requests, decisions, workers, documents, notifications → original sample data
    setConfirm(false);
    // a worker that only existed in the edited data (added during the demo) is gone after a reset
    if (session?.role === "worker" && !seed().workers.some((w) => w.id === session.workerId)) {
      signOut();
      router.replace("/login");
    }
  };

  return (
    <header className="flex h-[60px] shrink-0 items-stretch justify-between border-b border-ink/15 bg-white">
      <div className="flex min-w-0 items-center gap-4 pl-4 lg:pl-8">
        <button type="button" onClick={onMenu} aria-label="Open menu" className="lg:hidden">
          <Icon name="menu" className="h-6 w-6" />
        </button>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] text-ink/50">{group}</div>
          <div className="truncate text-[17px]">{label}</div>
        </div>
      </div>
      <div className="flex items-stretch">
        <div className="hidden items-center gap-2 border-l border-ink/15 px-5 text-[13px] text-ink/50 lg:flex">
          <Icon name="clock" className="h-4 w-4" />
          Demo date · Fri 6 Nov 2026
        </div>
        <div className="flex items-center gap-1.5 border-l border-ink/15 px-3 sm:px-4">
          {confirm ? (
            <>
              <button type="button" onClick={reset} className="bg-red-700 px-3 py-2 text-[13px] text-white">Yes, reset all</button>
              <button type="button" onClick={() => setConfirm(false)} className="px-2 py-2 text-[13px] text-ink/60 hover:text-ink">Cancel</button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirm(true)}
              title="Reset requests, decisions, workers and documents to the original sample data"
              className="border border-ink/25 px-3 py-2 text-[13px] transition hover:bg-mist"
            >
              Reset demo
            </button>
          )}
        </div>
        <Link
          href={role === "hr" ? "/hr/notifications" : "/worker/notifications"}
          aria-label="Notifications"
          className="relative grid w-[60px] place-items-center border-l border-ink/15 transition hover:bg-mist"
        >
          <Icon name="bell" />
          {unread > 0 && (
            <span className="absolute right-[12px] top-[12px] grid h-[18px] min-w-[18px] place-items-center rounded-full bg-leaf px-1 text-[11px] text-ink">
              {unread}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHydrated, useSession } from "../lib/store";
import type { Role } from "./nav";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/** Layout for a signed-in user. Redirects to /login (or to the right app) when the role does not match. */
export default function Shell({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();
  const session = useSession();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const allowed = session?.role === role;

  useEffect(() => {
    if (!hydrated) return;
    if (!session) router.replace("/login");
    else if (session.role !== role) router.replace(session.role === "hr" ? "/hr" : "/worker");
  }, [hydrated, session, role, router]);

  // The shell is always rendered (so Next can prerender it); it stays invisible until the
  // browser confirms that the signed-in role matches, then redirects otherwise.
  return (
    <div className={`relative flex h-dvh overflow-hidden bg-mist text-ink ${allowed ? "" : "invisible"}`} aria-hidden={!allowed}>
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={role} onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

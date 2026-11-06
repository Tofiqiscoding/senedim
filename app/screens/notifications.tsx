"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { actions, useDemo, useSession } from "../lib/store";
import Icon from "../shared/Icon";
import { Body, Btn, Card, Empty, PageHeader, Tabs } from "../shared/ui";

export function Notifications() {
  const s = useDemo();
  const session = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const me = session?.role === "worker" ? session.workerId : "hr";
  const mine = s.notices.filter((n) => n.to === me);
  const shown = mine.filter((n) => tab === "all" || n.unread);
  const unread = mine.filter((n) => n.unread).length;

  return (
    <>
      <PageHeader eyebrow="Account" title="Notifications">
        <Btn onClick={() => actions.markAllRead(me)}>Mark all as read</Btn>
      </PageHeader>
      <Body>
        <Card title="Inbox">
          <Tabs value={tab} onChange={setTab} tabs={[{ id: "all", label: "All", count: mine.length }, { id: "unread", label: "Unread", count: unread }]} />
          {shown.length === 0 ? (
            <Empty text="You’re all caught up." />
          ) : (
            <ul>
              {shown.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => { actions.markRead(n.id); router.push(n.href); }} className="flex w-full items-start gap-4 border-b border-ink/10 px-6 py-4 text-left transition last:border-b-0 hover:bg-mist/60">
                    <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center ${n.unread ? "bg-ink text-lime" : "bg-ink/8 text-ink/60"}`}>
                      <Icon name={n.icon} className="h-4 w-4" />
                    </span>
                    <span className="flex-1 leading-tight">
                      <span className="block text-[15px]">{n.text}</span>
                      <span className="mt-1 block text-[13px] text-ink/55">{n.sub}</span>
                    </span>
                    <span className="flex items-center gap-3 text-[13px] text-ink/45">
                      {n.when}
                      {n.unread && <span className="h-2 w-2 rounded-full bg-leaf" />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Body>
    </>
  );
}

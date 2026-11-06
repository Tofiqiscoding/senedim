import { useSyncExternalStore } from "react";
import { seed, TASKS, TODAY, type Doc, type ReqKind, type State, type Worker } from "./seed";
import { workdays } from "./util";

/* ------------------------------------------------------------------ *
 * Demo data store: lives in the browser (localStorage), so every
 * change (add worker, approve request…) survives a refresh and is
 * shared between the HR and Worker screens.
 * ------------------------------------------------------------------ */
const KEY = "senedim-demo-v1";
const SESSION_KEY = "senedim-session";
const SERVER = seed();

let cache: State | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((f) => f());

function read(): State {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      if (parsed.v === SERVER.v) return (cache = parsed);
    }
  } catch {}
  return (cache = seed());
}

function write(next: State) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  emit();
}

function mutate(fn: (s: State) => void) {
  const next = structuredClone(read());
  fn(next);
  write(next);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cache = null;
    if (e.key === KEY || e.key === SESSION_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export const useDemo = (): State => useSyncExternalStore(subscribe, read, () => SERVER);

/* ---------- session ---------- */
export type Session = { role: "hr" } | { role: "worker"; workerId: string };
let sRaw: string | null | undefined;
let sVal: Session | null = null;

function readSession(): Session | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SESSION_KEY);
  } catch {}
  if (raw !== sRaw) {
    sRaw = raw;
    try {
      sVal = raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      sVal = null;
    }
  }
  return sVal;
}

export const useSession = (): Session | null => useSyncExternalStore(subscribe, readSession, () => null);
const noop = () => () => {};
/** false during server render + hydration, true afterwards (client only) */
export const useHydrated = (): boolean => useSyncExternalStore(noop, () => true, () => false);

export function signIn(s: Session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {}
  emit();
}
export function signOut() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
  emit();
}

/* ---------- actions ---------- */
const nid = (s: State, p: string) => `${p}${s.seq++}`;
function notify(s: State, to: string, text: string, sub: string, icon: string, href: string) {
  s.notices.unshift({ id: nid(s, "n"), to, text, sub, when: "Just now", unread: true, icon, href });
}
const nameOf = (s: State, id: string) => s.workers.find((w) => w.id === id)?.name ?? "Worker";

export const actions = {
  addWorker(input: Omit<Worker, "id" | "leaveBalance"> & { leaveBalance?: number }): string {
    let id = "";
    mutate((s) => {
      id = nid(s, "w");
      s.workers.push({ ...input, id, leaveBalance: input.leaveBalance ?? 21 });
      if (input.status === "Onboarding") {
        // "Offer accepted" automation: checklist + contract draft + order draft
        s.tasks[id] = TASKS.map(() => false);
        s.docs.push(
          { id: nid(s, "x"), workerId: id, title: "Employment contract", status: "Draft", date: TODAY, by: "Leyla Hacıyeva" },
          { id: nid(s, "x"), workerId: id, title: "Order of hire", status: "Draft", date: TODAY, by: "Leyla Hacıyeva" },
        );
      }
      notify(s, "hr", `Worker added · ${input.name}`, input.status === "Onboarding" ? "Contract draft and onboarding checklist created" : input.position, "user", `/hr/workers/${id}`);
    });
    return id;
  },

  updateWorker(id: string, patch: Partial<Worker>) {
    mutate((s) => {
      const w = s.workers.find((x) => x.id === id);
      if (w) Object.assign(w, patch);
    });
  },

  removeWorker(id: string) {
    mutate((s) => {
      s.workers = s.workers.filter((w) => w.id !== id);
      s.requests = s.requests.filter((r) => r.workerId !== id);
      s.docs = s.docs.filter((d) => d.workerId !== id);
      delete s.tasks[id];
      s.notices = s.notices.filter((n) => n.to !== id);
    });
  },

  addRequest(r: { workerId: string; kind: ReqKind; title: string; from: string; to: string; note: string }) {
    mutate((s) => {
      s.requests.unshift({ ...r, id: nid(s, "r"), status: "Pending", comment: "", created: TODAY });
      const kind = r.kind === "leave" ? "leave request" : r.kind === "trip" ? "business trip" : "document request";
      notify(s, "hr", `New ${kind} · ${nameOf(s, r.workerId)}`, r.title, r.kind === "document" ? "file" : "calendar", "/hr/requests");
    });
  },

  decideRequest(id: string, status: "Approved" | "Rejected", comment = "") {
    mutate((s) => {
      const r = s.requests.find((x) => x.id === id);
      if (!r || r.status !== "Pending") return;
      r.status = status;
      r.comment = comment;
      const w = s.workers.find((x) => x.id === r.workerId);
      if (status === "Approved") {
        if (r.kind === "leave" && r.title === "Annual leave" && w) w.leaveBalance = Math.max(0, w.leaveBalance - workdays(r.from, r.to));
        if (r.kind === "document") s.docs.unshift({ id: nid(s, "x"), workerId: r.workerId, title: r.title, status: "Ready", date: TODAY, by: "Leyla Hacıyeva" });
      }
      const what = r.kind === "document" ? `${r.title} request` : r.title;
      const page = r.kind === "document" && status === "Approved" ? "/worker/documents" : "/worker/requests";
      const fallback = status === "Approved" && r.kind === "document" ? "Ready in My documents" : "HR has reviewed your request";
      notify(s, r.workerId, `${what} ${status.toLowerCase()}`, comment ? `HR note: ${comment}` : fallback, status === "Approved" ? "check" : "x", page);
    });
  },

  addDocument(d: { workerId: string; title: string; status: Doc["status"] }) {
    mutate((s) => {
      s.docs.unshift({ ...d, id: nid(s, "x"), date: TODAY, by: "Leyla Hacıyeva" });
      if (d.status === "Pending") notify(s, d.workerId, `${d.title} is ready for your signature`, "Open My documents to sign", "file", "/worker/documents");
    });
  },

  signDocument(id: string) {
    mutate((s) => {
      const d = s.docs.find((x) => x.id === id);
      if (!d) return;
      d.status = "Signed";
      notify(s, "hr", `${d.title} signed · ${nameOf(s, d.workerId)}`, "Signature saved in the audit trail", "check", "/hr/documents");
    });
  },

  toggleTask(workerId: string, k: number) {
    mutate((s) => {
      const t = s.tasks[workerId];
      if (t) t[k] = !t[k];
    });
  },

  markRead(id: string) {
    mutate((s) => {
      const n = s.notices.find((x) => x.id === id);
      if (n) n.unread = false;
    });
  },
  markAllRead(to: string) {
    mutate((s) => s.notices.forEach((n) => n.to === to && (n.unread = false)));
  },

  reset() {
    write(seed());
  },
};

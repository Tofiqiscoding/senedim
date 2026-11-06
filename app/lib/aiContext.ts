import type { State } from "./seed";
import { addMonths } from "./util";

/** What the AI is allowed to see. A worker only ever gets their OWN record. */
export function workerContext(s: State, workerId: string) {
  const w = s.workers.find((x) => x.id === workerId);
  if (!w) return {};
  return {
    me: {
      name: w.name, position: w.position, department: w.dept, startDate: w.start, status: w.status,
      annualLeaveDaysLeft: w.leaveBalance, probationMonths: w.probationMonths,
      probationEnds: w.probationMonths ? addMonths(w.start, w.probationMonths) : null,
      contractType: w.contractType, monthlySalaryAZN: w.salary,
    },
    requests: s.requests.filter((r) => r.workerId === workerId).map((r) => ({
      kind: r.kind, title: r.title, from: r.from, to: r.to, status: r.status, myNote: r.note, hrNote: r.comment,
    })),
    documents: s.docs.filter((d) => d.workerId === workerId && d.status !== "Draft").map((d) => ({ title: d.title, status: d.status, createdOn: d.date, createdBy: d.by })),
    companyPolicy: { annualLeaveDaysPerYear: 21, sickLeaveDays: 10, unpaidLeaveDays: 5, defaultProbationMonths: 3 },
  };
}

export function hrContext(s: State) {
  const name = (id: string) => s.workers.find((w) => w.id === id)?.name ?? "removed";
  return {
    workers: s.workers.map((w) => ({
      name: w.name, position: w.position, department: w.dept, startDate: w.start, status: w.status,
      annualLeaveDaysLeft: w.leaveBalance, probationEnds: w.probationMonths ? addMonths(w.start, w.probationMonths) : null,
      monthlySalaryAZN: w.salary, contractType: w.contractType, email: w.email, phone: w.phone,
    })),
    requests: s.requests.map((r) => ({
      worker: name(r.workerId), kind: r.kind, title: r.title, from: r.from, to: r.to, status: r.status, workerNote: r.note, hrNote: r.comment, sentOn: r.created,
    })),
    documents: s.docs.map((d) => ({ worker: name(d.workerId), title: d.title, status: d.status, createdOn: d.date, createdBy: d.by })),
    onboarding: Object.entries(s.tasks).map(([id, t]) => ({ worker: name(id), tasksDone: t.filter(Boolean).length, tasksTotal: t.length })),
  };
}

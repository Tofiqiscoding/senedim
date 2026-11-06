// Types + seed ("demo") data. Today in the demo is Friday, 6 November 2026.
export const TODAY = "2026-11-06";

export const DEPTS = ["Operations", "Sales", "IT", "Finance", "Marketing", "Legal"] as const;
export type Dept = (typeof DEPTS)[number];
export type WorkerStatus = "Active" | "Probation" | "Onboarding" | "On leave";
export const STATUSES: WorkerStatus[] = ["Active", "Probation", "Onboarding", "On leave"];

export type Worker = {
  id: string;
  name: string;
  email: string;
  phone: string;
  fin: string;
  birth: string;
  address: string;
  position: string;
  dept: Dept;
  start: string;
  status: WorkerStatus;
  salary: number;
  leaveBalance: number;
  probationMonths: number;
  contractType: "Open-ended" | "Fixed-term";
};

export type ReqKind = "leave" | "trip" | "document";
export type ReqStatus = "Pending" | "Approved" | "Rejected";
export type Req = {
  id: string; workerId: string; kind: ReqKind; title: string; from: string; to: string;
  note: string; status: ReqStatus; comment: string; created: string;
};

export type DocStatus = "Draft" | "Pending" | "Signed" | "Ready";
export type Doc = { id: string; workerId: string; title: string; status: DocStatus; date: string; by: string };

export type Notice = { id: string; to: string; text: string; sub: string; when: string; unread: boolean; icon: string; href: string };

export const TASKS = [
  { t: "Sign employment contract", owner: "HR" },
  { t: "Upload personal documents", owner: "Worker" },
  { t: "Equipment & workplace", owner: "IT" },
  { t: "Accounts & access", owner: "IT" },
  { t: "Training plan", owner: "HR" },
  { t: "Meet the team", owner: "HR" },
];

export type State = {
  v: number;
  seq: number;
  workers: Worker[];
  requests: Req[];
  docs: Doc[];
  tasks: Record<string, boolean[]>;
  notices: Notice[];
};

export const HR_USER = { name: "Leyla Hacıyeva", title: "HR Manager", email: "hr@demo.az" };

const ascii = (s: string) =>
  s.toLowerCase().replace(/[əƏ]/g, "e").replace(/[ıİ]/g, "i").replace(/[öÖ]/g, "o").replace(/[üÜ]/g, "u")
    .replace(/[şŞ]/g, "s").replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g");
export const emailFor = (name: string) => ascii(name).replace(/ /g, ".") + "@demo.az";

const W = (
  n: number, name: string, position: string, dept: Dept, start: string, status: WorkerStatus,
  salary: number, leaveBalance: number, probationMonths = 3, contractType: Worker["contractType"] = "Open-ended",
): Worker => ({
  id: "w" + n, name, email: emailFor(name), position, dept, start, status, salary, leaveBalance, probationMonths, contractType,
  phone: `+994 ${["50", "51", "55", "70", "77", "99"][n % 6]} ${String(300 + n * 37).slice(0, 3)} ${String(10 + n * 3)} ${String(20 + n * 5)}`,
  fin: ["5AB1C23", "7KD9F41", "2MX3P88", "9QR5T12", "4LN7Z60", "6HV2B35", "1CE8W74", "3PY4K09", "8TU6D51", "0GS1J27", "5RB9N43", "2XA7M16"][n - 1] ?? "0000000",
  birth: `${1972 + ((n * 3) % 26)}-${String(((n * 5) % 12) + 1).padStart(2, "0")}-${String(((n * 7) % 27) + 1).padStart(2, "0")}`,
  address: ["Nasimi", "Yasamal", "Narimanov", "Khatai", "Sabail", "Binagadi", "Nizami", "Garadagh"][n % 8] + " district, Baku",
});

const R = (id: string, workerId: string, kind: ReqKind, title: string, from: string, to: string, note: string,
  status: ReqStatus = "Pending", comment = ""): Req => ({ id, workerId, kind, title, from, to, note, status, comment, created: "2026-11-05" });

export function seed(): State {
  return {
    v: 4,
    seq: 100,
    workers: [
      W(1, "Mahmud Ahmadov", "Product Designer", "IT", "2022-06-01", "Active", 2400, 13),
      W(2, "Hummet Azimzada", "Sales Manager", "Sales", "2020-01-20", "Active", 3600, 9, 0),
      W(3, "Tofig Changirov", "Marketing Specialist", "Marketing", "2026-11-01", "Onboarding", 2100, 21, 3, "Fixed-term"),
      W(4, "Togrul Baxisov", "Developer", "IT", "2026-11-15", "Onboarding", 2900, 21),
      W(5, "Sadiq Aslanli", "Accountant", "Finance", "2026-10-05", "Probation", 1900, 21, 3),
      W(6, "Bret Pit", "Sales Specialist", "Sales", "2026-05-12", "Probation", 1700, 15, 6),
      W(7, "Faiq Tahirli", "Operations Specialist", "Operations", "2023-02-10", "Active", 1800, 11, 0),
      W(8, "Rahib Imamquliyev", "Legal Advisor", "Legal", "2026-09-07", "Probation", 2600, 21, 3),
      W(9, "Qafar Bagirov", "Backend Developer", "IT", "2021-09-01", "Active", 3400, 7, 0, "Fixed-term"),
      W(10, "Hummet Azimzada", "Financial Analyst", "Finance", "2022-02-14", "Active", 2300, 16, 0),
      W(11, "Walter White", "Quality Control Manager", "Operations", "2019-04-08", "Active", 3000, 4, 0),
      W(12, "Donald Trump", "Marketing Director", "Marketing", "2024-01-22", "On leave", 4500, 6, 0, "Fixed-term"),
    ],
    requests: [
      R("r1", "w1", "leave", "Annual leave", "2026-11-12", "2026-11-16", "Family trip"),
      R("r2", "w7", "leave", "Sick leave", "2026-11-09", "2026-11-11", "Medical note attached"),
      R("r3", "w8", "leave", "Unpaid leave", "2026-11-25", "2026-11-26", ""),
      R("r4", "w10", "leave", "Annual leave", "2026-12-01", "2026-12-05", ""),
      R("r5", "w6", "leave", "Annual leave", "2026-11-20", "2026-11-24", "", "Approved"),
      R("r6", "w12", "leave", "Annual leave", "2026-11-03", "2026-11-14", "", "Approved"),
      R("r7", "w1", "leave", "Sick leave", "2026-10-20", "2026-10-21", "", "Approved"),
      R("r8", "w9", "leave", "Annual leave", "2026-11-17", "2026-11-19", "", "Rejected", "Release week — please reschedule."),
      R("t1", "w2", "trip", "Baku → Ganja", "2026-11-17", "2026-11-18", "Client meeting"),
      R("t2", "w9", "trip", "Baku → Istanbul", "2026-12-01", "2026-12-04", "Tech conference"),
      R("t3", "w11", "trip", "Baku → Sumqayıt", "2026-11-05", "2026-11-06", "Site inspection", "Approved"),
      R("t4", "w6", "trip", "Baku → Shamakhi", "2026-11-12", "2026-11-12", "Client visit", "Approved"),
      R("t5", "w1", "trip", "Baku → Ganja", "2026-10-03", "2026-10-04", "User research", "Rejected", "Not in this quarter’s budget."),
      R("d1", "w3", "document", "Work certificate", "2026-11-06", "2026-11-06", "For bank"),
      R("d2", "w13", "document", "Employment verification", "2026-11-05", "2026-11-05", "For embassy"),
      R("d3", "w1", "document", "Work certificate", "2026-11-04", "2026-11-04", "For visa", "Approved"),
      R("d4", "w10", "document", "Salary certificate", "2026-11-03", "2026-11-03", "For mortgage", "Approved"),
    ],
    docs: [
      { id: "x1", workerId: "w1", title: "Employment contract", status: "Signed", date: "2022-06-01", by: "Leyla Hacıyeva" },
      { id: "x2", workerId: "w1", title: "Order of hire", status: "Signed", date: "2022-06-01", by: "Leyla Hacıyeva" },
      { id: "x3", workerId: "w1", title: "Work certificate", status: "Ready", date: "2026-11-04", by: "Leyla Hacıyeva" },
      { id: "x4", workerId: "w1", title: "NDA", status: "Pending", date: "2026-11-02", by: "Leyla Hacıyeva" },
      { id: "x5", workerId: "w3", title: "Employment contract", status: "Pending", date: "2026-10-28", by: "Leyla Hacıyeva" },
      { id: "x6", workerId: "w3", title: "Order of hire", status: "Signed", date: "2026-10-28", by: "Leyla Hacıyeva" },
      { id: "x7", workerId: "w4", title: "Employment contract", status: "Draft", date: "2026-11-05", by: "Leyla Hacıyeva" },
      { id: "x8", workerId: "w4", title: "Order of hire", status: "Draft", date: "2026-11-05", by: "Leyla Hacıyeva" },
      { id: "x9", workerId: "w5", title: "Employment contract", status: "Signed", date: "2026-10-05", by: "Leyla Hacıyeva" },
      { id: "x10", workerId: "w5", title: "NDA", status: "Signed", date: "2026-10-06", by: "Leyla Hacıyeva" },
      { id: "x11", workerId: "w10", title: "Salary certificate", status: "Ready", date: "2026-11-03", by: "Leyla Hacıyeva" },
    ],
    tasks: {
      w3: [true, true, true, true, false, false],
      w4: [true, true, false, false, false, false],
      w5: [true, true, true, true, true, true],
    },
    notices: [
      { id: "n1", to: "hr", text: "New leave request · Mahmud Ahmadov", sub: "Annual leave, 12 – 16 Nov", when: "2 h ago", unread: true, icon: "calendar", href: "/hr/requests" },
      { id: "n2", to: "hr", text: "Probation ends in 6 days · Brett Pit", sub: "Decide to confirm or extend", when: "1 h ago", unread: true, icon: "clock", href: "/hr/workers/w6" },
      { id: "n3", to: "hr", text: "Document request · Tofig Changirov", sub: "Work certificate for bank", when: "Today", unread: true, icon: "file", href: "/hr/requests" },
      { id: "n4", to: "w1", text: "Your sick leave was approved", sub: "20 – 21 Oct", when: "Yesterday", unread: false, icon: "check", href: "/worker/requests" },
      { id: "n5", to: "w1", text: "Work certificate is ready", sub: "You can view and download it in My documents", when: "2 days ago", unread: true, icon: "file", href: "/worker/documents" },
      { id: "n6", to: "w1", text: "Please sign the NDA", sub: "Your signature is the last step", when: "3 days ago", unread: true, icon: "doc", href: "/worker/documents" },
    ],
  };
}

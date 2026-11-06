const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const utc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, (m || 1) - 1, d || 1);
};

export const fmt = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
export const fmtShort = (iso: string) => {
  if (!iso) return "—";
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
};
export const range = (a: string, b: string) => (a === b ? fmtShort(a) : `${fmtShort(a)} – ${fmtShort(b)}`);

export const diffDays = (a: string, b: string) => Math.round((utc(b) - utc(a)) / 86400000);

export function addMonths(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1 + n, d));
  return t.toISOString().slice(0, 10);
}

/** working days (Mon–Fri) between two dates, inclusive */
export function workdays(from: string, to: string) {
  if (!from || !to || utc(to) < utc(from)) return 0;
  let n = 0;
  for (let t = utc(from); t <= utc(to); t += 86400000) {
    const day = new Date(t).getUTCDay();
    if (day !== 0 && day !== 6) n++;
  }
  return n;
}

export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

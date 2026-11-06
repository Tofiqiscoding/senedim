import Mosaic from "./Mosaic";
import { T } from "../i18n/LangProvider";
import { seed } from "../lib/seed";
import { range } from "../lib/util";

// Example data comes from the same demo data the app uses.
const demo = seed();
const nameOf = (id: string) => demo.workers.find((w) => w.id === id)?.name ?? "";
const rows = demo.requests.filter((r) => r.status === "Pending").slice(0, 5);
const stats: [string, number][] = [
  ["Workers", demo.workers.length],
  ["New hires", demo.workers.filter((w) => w.status === "Onboarding").length],
  ["Open requests", demo.requests.filter((r) => r.status === "Pending").length],
  ["Probation", demo.workers.filter((w) => w.status === "Probation").length],
];

function AppFrame() {
  return (
    <div className="absolute inset-0 grid grid-cols-[18%_1fr] gap-3 p-3 md:p-6">
      <div className="hidden flex-col gap-2 border border-white/15 p-3 md:flex">
        {["Dashboard", "Workers", "Contracts", "Onboarding", "Requests"].map((m, i) => (
          <div key={m} className={`px-3 py-2 text-sm ${i === 0 ? "bg-lime text-ink" : "text-white/60"}`}>
            <T>{m}</T>
          </div>
        ))}
      </div>
      <div className="col-span-2 grid min-h-0 grid-rows-[auto_1fr] gap-3 md:col-span-1">
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {stats.map(([k, v]) => (
            <div key={k} className="border border-white/15 p-2 md:p-4">
              <div className="truncate text-[10px] text-white/50 md:text-xs"><T>{k}</T></div>
              <div className="text-xl md:text-4xl">{v}</div>
            </div>
          ))}
        </div>
        <div className="min-h-0 overflow-hidden border border-white/15">
          <div className="border-b border-white/15 px-3 py-2 text-[11px] md:px-4 md:py-3 md:text-base"><T>Pending requests</T></div>
          <table className="w-full text-left text-[10px] md:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/45">
                {["Worker", "Request", "Dates", "Status"].map((h) => (
                  <th key={h} className="px-3 py-1.5 font-normal md:px-4 md:py-2.5"><T>{h}</T></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/10 last:border-b-0">
                  <td className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2.5">{nameOf(r.workerId)}</td>
                  <td className="whitespace-nowrap px-3 py-1.5 text-white/80 md:px-4 md:py-2.5"><T>{r.title}</T></td>
                  <td className="whitespace-nowrap px-3 py-1.5 text-white/60 md:px-4 md:py-2.5">{r.kind === "document" ? "—" : <T>{range(r.from, r.to)}</T>}</td>
                  <td className="px-3 py-1.5 md:px-4 md:py-2.5"><span className="bg-lime/20 px-1.5 py-0.5 text-lime md:px-2 md:py-1"><T>Pending</T></span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Spotlight() {
  return (
    <section className="noise relative">
      <Mosaic rows={8} cols={7} seed={21} density={0.5} />
      <div className="relative z-10 px-6 pb-16 pt-32 md:px-9 md:pb-24 md:pt-40">
        <h2 className="h-display mb-12 md:mb-16">
          <T>Product Tour –</T>
          <br />
          <span className="text-lime"><T>From Offer to Day One</T></span>
        </h2>
        <div className="relative aspect-video w-full border border-white/70 bg-ink/50 backdrop-blur-sm">
          <AppFrame />
          <button
            type="button"
            aria-label="Play demo video"
            className="absolute bottom-3 right-3 grid h-[44px] w-[44px] place-items-center bg-leaf transition hover:bg-lime md:bottom-6 md:right-6 md:h-[64px] md:w-[64px]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-7 md:w-7" fill="#020801">
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

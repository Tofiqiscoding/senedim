import Mosaic from "./Mosaic";
import { T } from "../i18n/LangProvider";

function AppFrame() {
  return (
    <div className="absolute inset-0 grid grid-cols-[18%_1fr] gap-3 p-4 opacity-70 md:p-8">
      <div className="hidden flex-col gap-2 border border-white/15 p-3 md:flex">
        {["Dashboard", "Workers", "Contracts", "Onboarding", "Leave"].map((m, i) => (
          <div key={m} className={`px-3 py-2 text-sm ${i === 0 ? "bg-lime text-ink" : "text-white/60"}`}>
            <T>{m}</T>
          </div>
        ))}
      </div>
      <div className="col-span-2 grid grid-rows-[auto_1fr] gap-3 md:col-span-1">
        <div className="grid grid-cols-4 gap-3">
          {[["Headcount", "142"], ["New hires", "6"], ["Open requests", "11"], ["Expiring", "4"]].map(([k, v]) => (
            <div key={k} className="border border-white/15 p-3 md:p-4">
              <div className="text-xs text-white/50"><T>{k}</T></div>
              <div className="text-2xl md:text-4xl">{v}</div>
            </div>
          ))}
        </div>
        <div className="border border-white/15" />
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
            className="absolute left-1/2 top-1/2 grid h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 place-items-center bg-leaf transition hover:bg-lime md:h-[84px] md:w-[84px]"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-9 md:w-9" fill="#020801">
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

import { T } from "../i18n/LangProvider";

const stats = [
  { n: "01", big: "<1 min", cap: "to generate a contract, instead of ~20 minutes by hand", bg: "bg-sky" },
  { n: "02", big: "1 click", cap: "to approve a request, with a full audit trail", bg: "bg-cobalt" },
  { n: "03", big: "6 tasks", cap: "onboarding checklist created for every new hire", bg: "bg-[#001a6a]" },
  { n: "04", big: "AZ · EN", cap: "Azerbaijani and English interface", bg: "bg-[#000d39]" },
];

function PixelCluster() {
  // soft blurred pixel graphic, as in the original "Proven Results" block
  const cells: [number, number, string][] = [
    [1, 0, "#eaffe6"], [2, 0, "#d9f7d2"], [3, 0, "#dcecfa"], [1, 1, "#a2fa8e"], [2, 1, "#cdeec6"],
    [3, 1, "#bfdcf5"], [4, 1, "#e8f2fb"], [2, 2, "#e4f6e0"], [3, 2, "#168ae2"], [4, 2, "#cfe6f8"],
    [3, 3, "#dbeaf7"], [4, 3, "#ecf4fb"], [3, 4, "#eef5fb"],
  ];
  return (
    <div aria-hidden className="relative h-[170px] w-[190px]">
      {cells.map(([x, y, c], i) => (
        <i key={i} className="absolute block h-8 w-8 blur-[1.5px]" style={{ left: x * 32, top: y * 32, background: c }} />
      ))}
    </div>
  );
}

export default function Results() {
  return (
    <section data-nav="light" className="grid bg-white text-ink lg:grid-cols-[var(--left)_1fr]">
      <div className="flex min-h-[320px] flex-col justify-between p-6 md:p-9 lg:min-h-[600px]">
        <h2 className="text-[clamp(2.5rem,3.9vw,4rem)] leading-[1.02] tracking-[-0.03em]">
          <T>What you get.</T>
          <br />
          <span className="text-sky"><T>Less paperwork.</T></span>
        </h2>
        <div className="hidden lg:block">
          <PixelCluster />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.n} className={`${s.bg} flex min-h-[300px] flex-col justify-between p-6 text-white lg:min-h-[600px]`}>
            <span className="text-[15px]">{s.n}</span>
            <div>
              <div className="text-[clamp(3rem,5vw,5.5rem)] leading-none tracking-[-0.04em]"><T>{s.big}</T></div>
              <p className="mt-4 max-w-[12em] text-[17px] leading-snug text-white/85"><T>{s.cap}</T></p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { T } from "../i18n/LangProvider";

const teams = [
  "HR",
  "Finance",
  "Operations",
  "IT",
  "Sales",
  "Legal",
  "Customer support",
  "Management",
];

export default function Teams() {
  return (
    <>
      <section id="teams" className="noise relative bg-ink">
        <div className="relative z-10 grid lg:grid-cols-[var(--left)_1fr]">
          <div className="hidden border-r border-white/20 lg:block" />
          <div>
            <div className="px-6 pb-10 pt-24 md:px-9 lg:pt-32">
              <h2 className="h-section">
                <T>Built for</T>
                <br />
                <span className="text-lime"><T>Every Team</T></span>
              </h2>
            </div>
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)]">
              <ul className="px-6 pb-12 md:px-9">
                {teams.map((t) => (
                  <li
                    key={t}
                    className="border-t border-white/20 py-4 text-[clamp(1.5rem,2.2vw,2.4rem)] tracking-[-0.01em] transition-colors first:border-t-0 hover:text-lime"
                  >
                    <T>{t}</T>
                  </li>
                ))}
                <li className="border-t border-white/20 pt-6 text-white/50"><T>And other departments</T></li>
              </ul>
              <div className="relative min-h-[260px] overflow-hidden bg-gradient-to-br from-[#0033cc] via-[#168ae2] to-[#001a6a]">
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:48px_48px]" />
                <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-lime/40 blur-[70px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="noise relative border-t border-white/20 bg-ink">
        <div className="relative z-10 grid gap-10 px-6 py-16 md:px-9 lg:grid-cols-[1fr_auto_auto] lg:items-start lg:gap-16 lg:py-20">
          <h2 className="h-section">
            <T>Built to</T>
            <br />
            <span className="text-lime"><T>Connect</T></span>
          </h2>
          <p className="max-w-[17em] text-[15px] leading-snug lg:pt-3">
            <T>Connect with the tools your company already uses — e-signature, messaging and payroll — with no extra overhead and no missed steps.</T>
          </p>
          <span className="text-[clamp(1.5rem,2.2vw,2.4rem)] tracking-[-0.01em] lg:pt-0"><T>Integrations</T></span>
        </div>
        <div className="relative z-10 grid grid-cols-2 border-t border-white/20 md:grid-cols-3 lg:grid-cols-6">
          {["ASAN İmza", "Telegram", "Email", "1C Payroll", "Google Calendar", "Active Directory"].map((n) => (
            <div key={n} className="flex min-h-[160px] flex-col justify-between border-b border-r border-white/20 p-6 last:border-r-0 lg:border-b-0">
              <span className="text-sm text-white/40"><T>Roadmap</T></span>
              <span className="text-[clamp(1.2rem,1.7vw,1.7rem)] tracking-[-0.01em]">{n}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

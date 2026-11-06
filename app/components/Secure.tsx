import { T } from "../i18n/LangProvider";

function Shield() {
  return (
    <svg viewBox="0 0 220 280" className="relative z-10 h-[250px] w-[196px]" aria-hidden>
      <defs>
        <linearGradient id="sh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#168ae2" />
          <stop offset="1" stopColor="#0033cc" />
        </linearGradient>
      </defs>
      <path d="M110 4 L206 40 V130 C206 200 160 250 110 276 C60 250 14 200 14 130 V40 Z" fill="url(#sh)" />
      {/* pixel check mark */}
      {[[54, 118], [80, 144], [106, 170], [132, 144], [158, 118], [184, 92]].map(([x, y], i) => (
        <rect key={i} x={x - 6} y={y - 6} width="26" height="26" fill="#fff" />
      ))}
    </svg>
  );
}

const badges = [
  ["Role-based", "access"],
  ["Full audit", "trail"],
  ["AZ labor-code", "templates"],
];

export default function Secure() {
  return (
    <section id="secure" className="noise relative border-t border-white/20 bg-ink">
      <div className="relative z-10 grid lg:grid-cols-[var(--left)_1fr]">
        <div className="relative grid min-h-[320px] place-items-center overflow-hidden bg-[#00123d] lg:min-h-[640px]">
          {[300, 480, 660].map((s) => (
            <span
              key={s}
              aria-hidden
              className="absolute rounded-full border border-sky/40"
              style={{ width: s, height: s, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
            />
          ))}
          <Shield />
        </div>
        <div className="flex flex-col">
          <div className="flex-1 px-6 py-12 md:px-9 lg:py-0 lg:pt-[28px]">
            <h2 className="h-section">
              <T>Secure.</T>
              <br />
              <span className="text-sky"><T>Trusted.</T></span>
            </h2>
            <p className="mt-10 max-w-[28em] text-[15px] leading-snug lg:mt-[84px] lg:pl-[28px]">
              <T>Each role sees only its own screens and data. Every approval is logged with who signed and when — and every PDF prints Azerbaijani letters (ə, ğ, ı, ö, ü, ş, ç) correctly.</T>
            </p>
          </div>
          <div className="grid grid-cols-2 border-t border-white/20 lg:grid-cols-4">
            {badges.map(([a, b]) => (
              <div key={a} className="grid min-h-[200px] place-items-center border-r border-white/20 p-6 text-center text-[clamp(1.2rem,1.8vw,1.9rem)] leading-tight tracking-[-0.01em] lg:min-h-[326px]">
                <span>
                  <T>{a}</T>
                  <br />
                  <T>{b}</T>
                </span>
              </div>
            ))}
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

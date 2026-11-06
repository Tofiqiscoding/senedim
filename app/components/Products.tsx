import { T } from "../i18n/LangProvider";

const chip = {
  ok: "bg-lime/15 text-lime border-lime/30",
  warn: "bg-amber-400/10 text-amber-300 border-amber-300/30",
  bad: "bg-red-500/10 text-red-400 border-red-400/30",
};

function Avatar({ n }: { n: string }) {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky to-cobalt text-[11px]">
      {n}
    </span>
  );
}

function Table({
  title,
  cols,
  rows,
}: {
  title: string;
  cols: string[];
  rows: { who: string; cells: string[]; status: [string, keyof typeof chip] }[];
}) {
  return (
    <div className="overflow-hidden rounded-t-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent">
      <div className="border-b border-white/15 px-7 py-6 text-2xl"><T>{title}</T></div>
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-3 border-b border-white/15 px-7 py-3 text-[11px] uppercase tracking-wider text-white/50">
        {cols.map((c) => (
          <span key={c}><T>{c}</T></span>
        ))}
      </div>
      {rows.map((r) => (
        <div
          key={r.who}
          className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr] items-center gap-3 border-b border-white/10 px-7 py-[18px] text-[15px] last:border-b-0"
        >
          <span className="flex items-center gap-3">
            <Avatar n={r.who.split(" ").map((w) => w[0]).join("")} />
            <T>{r.who}</T>
          </span>
          {r.cells.map((c) => (
            <span key={c} className="text-white/85">
              <T>{c}</T>
            </span>
          ))}
          <span>
            <span className={`inline-block rounded-md border px-3 py-1 text-[13px] ${chip[r.status[1]]}`}><T>{r.status[0]}</T></span>
          </span>
        </div>
      ))}
    </div>
  );
}

function FeatureCard({ n, title, text, children }: { n: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="noise relative grid min-h-[480px] overflow-hidden bg-ink p-6 text-white md:p-9 lg:grid-cols-[var(--left)_minmax(0,1fr)_1.3fr] lg:gap-6">
      <span className="relative z-10 text-[clamp(1.5rem,2.2vw,2.4rem)]">{n}</span>
      <div className="relative z-10 flex flex-col justify-between gap-10 py-6 lg:py-0">
        <h3 className="h-card max-w-[9em]"><T>{title}</T></h3>
        <p className="max-w-[17em] text-[15px] leading-snug text-white/85"><T>{text}</T></p>
      </div>
      <div className="relative z-10 -mr-9 mt-6 self-end lg:mt-[60px]">{children}</div>
    </div>
  );
}

function Product1() {
  return (
    <div className="border-t border-ink/15">
      <div className="grid lg:grid-cols-[var(--left)_1fr]">
        <div className="p-6 md:p-9"><T>Our Products</T></div>
        <div className="relative px-6 pb-10 pt-6 md:px-9 md:pt-9">
          <h3 className="h-section max-w-[8em]">
            <T>Document</T>
            <br />
            <T>Generator</T>
          </h3>
          <span className="absolute right-9 top-9">#1</span>
        </div>
      </div>
      <div className="space-y-4 px-6 pb-24 md:px-9">
        <FeatureCard
          n="01"
          title="Contract in One Click"
          text="Pick an employee and a template. Data fills in automatically and the PDF is ready in seconds."
        >
          <Table
            title="Documents"
            cols={["Name", "Template", "Date", "Status"]}
            rows={[
              { who: "Aysel Məmmədova", cells: ["Contract", "12 Nov"], status: ["Signed", "ok"] },
              { who: "Rauf Quliyev", cells: ["Hire order", "11 Nov"], status: ["Signed", "ok"] },
              { who: "Nigar Əliyeva", cells: ["NDA", "11 Nov"], status: ["Pending", "warn"] },
              { who: "Tural Səfərov", cells: ["Certificate", "09 Nov"], status: ["Draft", "bad"] },
            ]}
          />
        </FeatureCard>
        <FeatureCard
          n="02"
          title="Personal File & Document History"
          text="Every contract, order and certificate lives in the employee’s file — nothing is lost in email."
        >
          <Table
            title="Aysel Məmmədova"
            cols={["Document", "Type", "Version", "Status"]}
            rows={[
              { who: "Employment contract", cells: ["Contract", "v2"], status: ["Signed", "ok"] },
              { who: "Order of hire", cells: ["Order", "v1"], status: ["Signed", "ok"] },
              { who: "NDA", cells: ["Agreement", "v1"], status: ["Pending", "warn"] },
              { who: "Leave order", cells: ["Order", "v1"], status: ["Draft", "bad"] },
            ]}
          />
        </FeatureCard>
      </div>
    </div>
  );
}

function Product2() {
  return (
    <div className="grid border-t border-ink/15 lg:grid-cols-2">
      <div className="flex flex-col">
        <div className="relative px-6 pb-10 pt-6 md:px-9 md:pt-9">
          <h3 className="h-section max-w-[7em]">
            <T>Onboarding</T>
            <br />
            <T>Flow</T>
          </h3>
          <span className="absolute right-9 top-9">#2</span>
        </div>
        <div className="mt-auto">
          {[
            ["Offer Accepted → Everything Created", "Worker, contract draft and checklist appear automatically."],
            ["Same Checklist for Every Hire", "Documents, equipment, accounts, training, meet the team."],
            ["Candidate Self-Service", "New hires fill in data and upload documents before day one."],
          ].map(([t, d], i) => (
            <div key={t} className={`border-t border-ink/15 px-6 py-6 md:px-9 ${i === 0 ? "border-l-[6px] border-l-cobalt bg-mist" : ""}`}>
              <div className="text-[clamp(1.2rem,1.7vw,1.6rem)]"><T>{t}</T></div>
              <p className="mt-1 text-[15px] text-ink/60"><T>{d}</T></p>
            </div>
          ))}
        </div>
      </div>
      <div className="noise relative flex min-h-[640px] flex-col items-center justify-center gap-0 overflow-hidden bg-ink p-8 text-white">
        <div className="relative z-10 w-full max-w-[380px] rounded-2xl border border-white/15 bg-white/[0.06] p-5">
          <div className="flex items-center gap-3">
            <Avatar n="NƏ" />
            <div className="flex-1 leading-tight">
              <div>Nigar Əliyeva</div>
              <div className="text-sm text-white/50"><T>Designer · Offer accepted</T></div>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-ink">✓</span>
          </div>
          <div className="mt-4 text-xl"><T>Start date: 1 December</T></div>
        </div>
        <div className="flow-line relative z-10 h-14 w-px" />
        <div className="glow relative z-10 grid h-[150px] w-[150px] place-items-center rounded-[28px] border-[3px] border-sky bg-ink text-6xl tracking-tighter whitespace-nowrap">
          s<span className="text-sky">d</span>
        </div>
        <div className="flow-line relative z-10 h-14 w-px" />
        <div className="relative z-10 w-full max-w-[380px] rounded-2xl border border-white/15 bg-white/[0.06] p-5 text-[15px]">
          {["Worker profile created", "Contract draft prepared", "6-task onboarding added", "HR notified"].map((l) => (
            <div key={l} className="flex items-center justify-between border-b border-white/10 py-2 last:border-b-0">
              <T>{l}</T>
              <span className="text-lime">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Product3() {
  const rows = [
    ["HR Approval", "One click to approve or reject — with a comment — from any device."],
    ["Live Leave Balance", "The balance is shown before submitting and decreases when approved."],
    ["Document Requests", "Workers ask for a work certificate and HR generates it in one click."],
    ["Instant Notifications", "Everyone gets an in-app message the moment a status changes."],
  ];
  const people = [
    ["Worker", "Sends the request", "AM"],
    ["HR", "Approves in one click", "LH"],
  ];
  return (
    <div className="border-t border-ink/15">
      <div className="relative px-6 pb-10 pt-6 md:px-9 md:pt-9 lg:pl-[calc(var(--left)+36px)]">
        <h3 className="h-section"><T>Leave & Requests</T></h3>
        <span className="absolute right-9 top-9">#3</span>
      </div>
      <div className="grid lg:grid-cols-[var(--left)_1fr]">
        <div className="relative min-h-[480px] border-y border-ink/15 bg-[#eef0f0] p-6">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#cfd4d4_1px,transparent_1px),linear-gradient(90deg,#cfd4d4_1px,transparent_1px)] [background-size:36px_36px]" />
          <div className="relative flex h-full flex-col justify-center gap-4 text-ink">
            {people.map(([n, r, i], k) => (
              <div key={n} className="relative flex items-center gap-3 rounded-xl bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)]" style={{ marginLeft: k * 10 }}>
                <span className="grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-sky to-cobalt text-sm text-white">{i}</span>
                <div className="leading-tight">
                  <div className="text-[15px]"><T>{n}</T></div>
                  <div className="text-sm text-ink/50"><T>{r}</T></div>
                </div>
                {k === 0 && (
                  <span className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-lime shadow-[0_0_0_8px_rgba(162,250,142,0.35)]">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          {rows.map(([t, d], i) => (
            <div
              key={t}
              className={`grid gap-4 border-t border-ink/15 px-6 py-10 first:border-t-0 md:grid-cols-2 md:px-9 ${i === 0 ? "bg-ink text-white" : ""}`}
            >
              <div className="text-[clamp(1.4rem,2.1vw,2.2rem)] tracking-[-0.01em]"><T>{t}</T></div>
              <p className="max-w-[22em] text-[15px] leading-snug"><T>{d}</T></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Product4() {
  const bars = [
    ["Probation Alerts", "bg-[#0033cc]", "01"],
    ["Contract Expiry Tracking", "bg-[#00269b]", "02"],
    ["Missing Document Reminders", "bg-[#001a6a]", "03"],
    ["Offboarding Checklist", "bg-[#000d39]", "04"],
    ["Audit Trail & E-Signature", "bg-ink", "05"],
  ];
  return (
    <div className="grid border-t border-ink/15 lg:grid-cols-2">
      <div className="relative flex min-h-[420px] flex-col justify-between p-6 md:p-9">
        <h3 className="h-section">
          <T>Alerts &</T>
          <br />
          <T>Approvals</T>
        </h3>
        <span className="absolute right-9 top-9">#4</span>
        <p className="max-w-[14em]"><T>Nothing expires, nothing gets lost & every step is signed.</T></p>
      </div>
      <div className="text-white">
        {bars.map(([t, bg, n], i) => (
          <div key={t} className={`${bg} relative px-9 ${i < 3 ? "py-8" : i === 3 ? "pb-[88px] pt-8" : "min-h-[360px] pt-8"}`}>
            <div className="text-[clamp(1.4rem,2.1vw,2.2rem)] tracking-[-0.01em]"><T>{t}</T></div>
            <span className="absolute right-9 top-9 text-[15px]">{n}</span>
            {i === 4 && (
              <div className="absolute inset-x-9 bottom-9 flex items-end justify-between gap-6">
                <p className="max-w-[18em] text-[15px] leading-snug">
                  <T>Worker → HR. Mock signature today, ASAN İmza in production.</T>
                </p>
                <div aria-hidden className="grid grid-cols-3 gap-[3px]">
                  {["bg-white", "bg-white", "bg-white", "bg-white", "bg-lime/30", "bg-white", "bg-white", "bg-lime", "bg-lime/30"].map((c, k) => (
                    <i key={k} className={`block h-5 w-5 ${c}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <section id="products" data-nav="light" className="bg-white text-ink">
      <Product1 />
      <Product2 />
      <Product3 />
      <Product4 />
    </section>
  );
}

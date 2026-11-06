// Blurred blue/green pixel mosaic used as the dark-section backdrop (deterministic, SSR-safe).
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const palette = ["#0033cc", "#00269b", "#168ae2", "#a2fa8e", "#67bd53", "#7d8590", "#001a6a", "#0033cc"];

export default function Mosaic({
  rows = 5,
  cols = 7,
  seed = 1,
  density = 0.42,
}: {
  rows?: number;
  cols?: number;
  seed?: number;
  density?: number;
}) {
  const r = mulberry32(seed);
  const cells = Array.from({ length: rows * cols }, () => {
    const on = r() < density;
    const color = palette[Math.floor(r() * palette.length)];
    const delay = r() * 7;
    const o = 0.35 + r() * 0.55;
    return on ? { color, delay, o } : null;
  });
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-ink">
      <div
        className="absolute inset-[-4%] grid blur-[16px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {cells.map((c, i) => (
          <div
            key={i}
            className={c ? "mosaic-cell" : ""}
            style={c ? { background: c.color, opacity: c.o, animationDelay: `-${c.delay}s` } : undefined}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/60" />
    </div>
  );
}

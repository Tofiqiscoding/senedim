// Row of black / blue / green / white pixel blocks, like the divider before "Built for…" on the original.
const cols = 20;
const rows = 4;
const colors = ["bg-ink", "bg-cobalt", "bg-lime", "bg-white", "bg-white", "bg-white", "bg-ink", "bg-white"];

// pure per-cell hash → [0,1)
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const cells = Array.from({ length: cols * rows }, (_, i) => {
  const bias = Math.floor(i / cols) / rows; // denser toward the bottom
  return hash(i + 1) < 0.15 + bias * 0.7 ? colors[Math.floor(hash(i + 101) * colors.length)] : "bg-white";
});

export default function PixelDivider() {
  return (
    <div aria-hidden data-nav="light" className="grid overflow-hidden bg-white" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {cells.map((c, i) => (
        <i key={i} className={`block aspect-square ${c}`} />
      ))}
    </div>
  );
}

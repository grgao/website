"use client";

export function HudFrame() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-(--z-frame)"
      style={{ padding: "var(--frame-inset)" }}
    >
      <div className="relative h-full w-full">
        {/* Corner brackets */}
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />

        {/* Side gridlines */}
        <SideTicks side="left" />
        <SideTicks side="right" />

        {/* Scanlines + faint vignette */}
        <div className="scanlines absolute inset-0 opacity-50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 55%, oklch(0 0 0 / 0.55) 100%)",
          }}
        />
      </div>
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map: Record<typeof pos, string> = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  };
  return (
    <svg
      className={`absolute ${map[pos]} text-primary/80`}
      width={64}
      height={64}
      viewBox="0 0 64 64"
      fill="none"
    >
      <path
        d="M2 24 L2 2 L24 2"
        stroke="currentColor"
        strokeWidth={1.25}
      />
      <path d="M2 38 L2 32" stroke="currentColor" strokeWidth={1.25} />
      <path d="M32 2 L38 2" stroke="currentColor" strokeWidth={1.25} />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SideTicks({ side }: { side: "left" | "right" }) {
  const ticks = Array.from({ length: 9 });
  return (
    <div
      className={`absolute top-1/2 ${side === "left" ? "left-1" : "right-1"} -translate-y-1/2 flex flex-col gap-3 text-primary/70`}
    >
      {ticks.map((_, i) => (
        <div
          key={i}
          className={`h-px ${i === 4 ? "w-4 bg-primary" : "w-2 bg-current/60"}`}
        />
      ))}
    </div>
  );
}

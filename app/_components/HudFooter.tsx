"use client";

const TICKER_ITEMS = [
  "SYS::OK",
  "TELEMETRY · LIVE",
  "API LATENCY 42MS",
  "PILOT.GAO@FIRETIGER",
  "CARDINALITY -90%",
  "QUERY 17000MS → 980MS",
  "GO · TS · PYTHON · GRAFANA · OTEL",
  "GRAFANA SINK · STABLE",
  "AUTH OK",
  "BUILDING SF · 2026",
];

export function HudFooter() {
  return (
    <footer
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-(--z-header) font-mono"
      style={{ padding: "0 calc(var(--frame-inset) + 64px) calc(var(--frame-inset) + 12px)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 -z-10"
        style={{
          background:
            "linear-gradient(0deg, oklch(0.07 0.014 245 / 0.9) 0%, oklch(0.07 0.014 245 / 0.55) 55%, transparent 100%)",
        }}
      />
      <div className="flex items-end justify-between gap-6">
        {/* Left: sound toggle (mock) */}
        <div className="pointer-events-auto flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-primary">
          <button
            type="button"
            className="border border-primary/50 px-2.5 py-1 hover:border-primary hover:bg-primary/10 transition-colors"
          >
            SOUND : OFF
          </button>
          <span className="hidden sm:inline text-foreground/45">
            BGM · KOH-LANTA · 432HZ
          </span>
        </div>

        {/* Center: scrolling ticker */}
        <div className="hidden md:block max-w-[40rem] flex-1 overflow-hidden border-y border-primary/30 py-1">
          <div className="ticker-track flex gap-10 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-accent">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i} className="text-shadow-cyan">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right: scroll prompt */}
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-primary/80">
          <div className="text-shadow-hud">SCROLL TO DESCEND</div>
          <div className="mt-1 flex items-center justify-end gap-1.5 text-foreground/55 text-[9px]">
            <span>↓</span>
            <span>WHEEL · TRACKPAD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

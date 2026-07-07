"use client";

import { useEffect, useState } from "react";

export function HudHeader() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setTime(`${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="pointer-events-none fixed top-0 left-0 right-0 z-(--z-header)"
      style={{ padding: "calc(var(--frame-inset) + 12px) calc(var(--frame-inset) + 64px)" }}
    >
      {/* Soft fade behind header so content underneath remains readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.07 0.014 245 / 0.85) 0%, oklch(0.07 0.014 245 / 0.5) 60%, transparent 100%)",
        }}
      />
      <div className="flex items-start justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
        {/* Left: identity callsign */}
        <div className="flex items-center gap-3">
          <Diamond />
          <div className="leading-tight">
            <div className="text-primary/90 text-shadow-hud">GRACE.E.GAO</div>
            <div className="text-foreground/55 text-[9px]">SYSTEMS ENGINEER // FIRETIGER</div>
          </div>
        </div>

        {/* Right: clock + version */}
        <div className="text-right leading-tight">
          <div className="text-primary/90">{time}</div>
          <div className="text-foreground/45 text-[9px]">BUILD v2.6.0 · STABLE</div>
        </div>
      </div>
    </header>
  );
}

function Diamond() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className="text-primary">
      <path
        d="M11 1 L21 11 L11 21 L1 11 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
      />
      <path d="M11 5 L17 11 L11 17 L5 11 Z" fill="currentColor" />
    </svg>
  );
}

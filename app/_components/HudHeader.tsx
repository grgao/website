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
            <div className="text-foreground/55 text-[9px]">PILOT // CALL-SIGN G-301</div>
          </div>
        </div>

        {/* Middle: decorative crest */}
        <div className="hidden md:flex flex-1 items-center justify-center pt-1">
          <Crest />
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

function Crest() {
  return (
    <svg
      width="260"
      height="18"
      viewBox="0 0 260 18"
      fill="none"
      className="text-primary/70"
      aria-hidden
    >
      {/* flanking rails with end dots */}
      <circle cx="4" cy="9" r="1.5" fill="currentColor" />
      <line x1="10" y1="9" x2="96" y2="9" stroke="currentColor" strokeWidth="1" />
      <line x1="164" y1="9" x2="250" y2="9" stroke="currentColor" strokeWidth="1" />
      <circle cx="256" cy="9" r="1.5" fill="currentColor" />

      {/* tick marks along the rails */}
      <line x1="40" y1="6" x2="40" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="68" y1="7" x2="68" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="192" y1="7" x2="192" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="220" y1="6" x2="220" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />

      {/* center diamond cluster */}
      <path d="M130 2 L137 9 L130 16 L123 9 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M130 5.5 L133.5 9 L130 12.5 L126.5 9 Z" fill="currentColor" />
      <path d="M112 9 L117 6 L117 12 Z" fill="currentColor" opacity="0.7" />
      <path d="M148 9 L143 6 L143 12 Z" fill="currentColor" opacity="0.7" />
    </svg>
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

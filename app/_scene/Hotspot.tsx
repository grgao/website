"use client";

import { Html } from "@react-three/drei";
import type { Experience } from "../_data/content";

const ACCENT = {
  primary: {
    dot: "bg-primary",
    border: "border-primary/60",
    text: "text-primary",
    glow: "shadow-[0_0_24px_oklch(0.84_0.16_78_/_0.35)]",
  },
  accent: {
    dot: "bg-accent",
    border: "border-accent/60",
    text: "text-accent",
    glow: "shadow-[0_0_24px_oklch(0.82_0.16_198_/_0.35)]",
  },
  danger: {
    dot: "bg-danger",
    border: "border-danger/60",
    text: "text-danger",
    glow: "shadow-[0_0_24px_oklch(0.7_0.21_28_/_0.35)]",
  },
} as const;

export function Hotspot({ exp }: { exp: Experience }) {
  const a = ACCENT[exp.accent];
  return (
    <group position={exp.worldPos}>
      <Html
        center
        distanceFactor={10}
        zIndexRange={[20, 0]}
        wrapperClass="pointer-events-none"
      >
        <div
          className={`flex items-center gap-2 ${a.text}`}
          style={{ maxWidth: "26rem" }}
        >
          <span className={`size-2 rounded-full ${a.dot} hud-pulse shrink-0`} />
          <span className="h-px w-8 bg-current opacity-60 shrink-0" />
          <div
            className={`border ${a.border} bg-background/85 px-2.5 py-1.5 backdrop-blur-sm ${a.glow} whitespace-nowrap`}
          >
            <div className="font-mono text-[9px] uppercase tracking-widest opacity-70">
              {exp.status} · {exp.location}
            </div>
            <div className="font-display text-[13px] uppercase tracking-wider leading-tight">
              {exp.company}
            </div>
            <div className="font-mono text-[10px] text-foreground/80">
              {exp.role}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

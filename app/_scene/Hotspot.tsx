"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  EXPERIENCES,
  SKILLS,
  STOPS,
  type Stop,
} from "../_data/content";

const ACCENT = {
  primary: {
    dot: "bg-primary",
    border: "border-primary/60",
    text: "text-primary",
    glow: "shadow-[0_0_24px_oklch(0.78_0.19_355_/_0.35)]",
  },
  accent: {
    dot: "bg-accent",
    border: "border-accent/60",
    text: "text-accent",
    glow: "shadow-[0_0_24px_oklch(0.76_0.16_300_/_0.35)]",
  },
} as const;

type Props = {
  stop: Stop;
  index: number;
  active: boolean;
  /** Another stop is active, fade back so the open card owns the view. */
  dimmed: boolean;
};

// Distance from the parked camera to its stop (~10 world units), so the
// active card renders at roughly CSS-pixel scale 1.
const HTML_DISTANCE_FACTOR = 10;

export function Hotspot({ stop, index, active, dimmed }: Props) {
  const a = ACCENT[stop.accent];
  const depthRef = useRef<HTMLDivElement>(null);
  const worldPos = useMemo(() => new THREE.Vector3(...stop.worldPos), [stop]);

  // Atmospheric fade: farther boxes recede instead of all floating at
  // full strength on top of the scene. Written per frame (no CSS
  // transition on this wrapper, camera motion already smooths it).
  useFrame(({ camera }) => {
    const el = depthRef.current;
    if (!el) return;
    const dist = camera.position.distanceTo(worldPos);
    const opacity = THREE.MathUtils.clamp(1.5 - dist / 40, 0.2, 1);
    const blur = THREE.MathUtils.clamp((dist - 14) / 18, 0, 3);
    el.style.opacity = opacity.toFixed(3);
    el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
  });

  return (
    <group position={stop.worldPos}>
      <Html
        center
        distanceFactor={HTML_DISTANCE_FACTOR}
        zIndexRange={[20, 0]}
        wrapperClass="pointer-events-none"
      >
        <div ref={depthRef}>
          <div
            className={`flex items-center gap-2 ${a.text} transition-opacity duration-500`}
            style={{ opacity: dimmed ? 0.3 : 1 }}
          >
            <span className={`size-2 rounded-full ${a.dot} hud-pulse shrink-0`} />
            <span className="h-px w-8 bg-current opacity-60 shrink-0" />
            <div
              className={`border ${a.border} bg-background/90 backdrop-blur-md ${a.glow} overflow-hidden transition-all duration-600 ease-out ${
                active ? "px-4 py-3" : "px-2.5 py-1.5"
              }`}
              style={{ width: active ? "26rem" : "14.5rem" }}
            >
              {/* Header, always visible. Numbered so the flight order reads
                  at a glance. */}
              <div className="flex items-start gap-2.5">
                <div className="border border-current/50 px-1.5 py-0.5 font-display text-sm leading-tight shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[9px] uppercase tracking-widest opacity-70 whitespace-nowrap">
                    {headerLine(stop)}
                    <span className="opacity-60"> · {String(index + 1).padStart(2, "0")}/{STOPS.length}</span>
                  </div>
                  <div className="font-display text-[13px] uppercase tracking-wider leading-tight whitespace-nowrap">
                    {stop.label}
                  </div>
                  <div className="font-mono text-[10px] text-foreground/80 whitespace-nowrap">
                    {stop.sublabel}
                  </div>
                </div>
              </div>

              {/* Body, unfolds when this stop is the active scroll target.
                  Fixed inner width so the collapsed box doesn't inherit the
                  body's intrinsic width. */}
              <div
                className="grid transition-all duration-600 ease-out"
                style={{
                  gridTemplateRows: active ? "1fr" : "0fr",
                  opacity: active ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <div className="mt-3 w-[23rem] border-t border-current/20 pt-3">
                    <StopBody stop={stop} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

function headerLine(stop: Stop): string {
  if (stop.kind === "experience") {
    const exp = EXPERIENCES.find((e) => e.id === stop.id);
    return exp ? `${exp.status} · ${exp.location}` : stop.kind;
  }
  return "EQUIPMENT MANIFEST";
}

function StopBody({ stop }: { stop: Stop }) {
  if (stop.kind === "experience") {
    const exp = EXPERIENCES.find((e) => e.id === stop.id);
    if (!exp) return null;
    return (
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/55">
          {exp.start} → {exp.end}
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {exp.highlights.map((h, i) => (
            <li
              key={i}
              className="flex gap-2 font-sans text-xs/5 text-foreground/85 whitespace-normal"
            >
              <span className="mt-1.5 size-1 shrink-0 bg-current" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // loadout
  return (
    <div className="flex flex-col gap-3">
      <ChipGroup title="LANGUAGES" items={SKILLS.languages} />
      <ChipGroup title="PLATFORMS" items={SKILLS.platforms} />
    </div>
  );
}

function ChipGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/55">
        {title}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {items.map((s) => (
          <span
            key={s}
            className="border border-current/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-foreground/85"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

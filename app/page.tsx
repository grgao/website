"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HudFrame } from "./_components/HudFrame";
import { HudHeader } from "./_components/HudHeader";
import { HudFooter } from "./_components/HudFooter";
import { Reticle } from "./_components/Reticle";
import { HeroSection, ContactSection } from "./_components/Sections";
import { useScrollProgress } from "./_hooks/useScrollProgress";
import { STOPS } from "./_data/content";

const HeroScene = dynamic(
  () => import("./_scene/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

/**
 * Tracks which stop spacer currently covers the middle of the viewport.
 * Measured per frame so it follows the Lenis snap animation exactly.
 */
function useActiveStop() {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let raf = 0;
    let current = -1;
    const tick = () => {
      const vh = window.innerHeight;
      const els = document.querySelectorAll<HTMLElement>("[data-stop]");
      let next = -1;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= vh * 0.4 && r.bottom >= vh * 0.6) {
          next = Number(el.dataset.stop);
        }
      });
      if (next !== current) {
        current = next;
        setActive(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return active;
}

export default function Home() {
  const { progressRef, velocityRef } = useScrollProgress();
  const activeStop = useActiveStop();

  return (
    <main className="relative">
      {/* Sticky 3D canvas, stays pinned while content scrolls over it */}
      <div className="sticky top-0 h-svh w-full z-(--z-canvas)">
        <HeroScene
          scrollProgressRef={progressRef}
          scrollVelocityRef={velocityRef}
          activeStop={activeStop}
        />
      </div>

      {/* Scroll content layered above the canvas. -mt pulls it back over the sticky parent. */}
      <div className="relative z-(--z-content) -mt-[100svh]">
        <HeroSection />
        {/* One empty snap spacer per stop, the destination content lives in
            the world-anchored boxes, which expand when their spacer settles. */}
        {STOPS.map((stop, i) => (
          <section
            key={stop.id}
            data-snap
            data-stop={i}
            className="min-h-screen"
          />
        ))}
        <ContactSection />
      </div>

      {/* Persistent HUD chrome */}
      <Reticle muted={activeStop !== -1} />
      <HudHeader />
      <HudFooter />
      <HudFrame />
    </main>
  );
}

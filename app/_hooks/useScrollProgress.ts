"use client";

import Lenis from "lenis";
import Snap from "lenis/snap";
import { useEffect, useRef } from "react";

export function useScrollProgress() {
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onScroll = ({
      scroll,
      limit,
      velocity,
    }: {
      scroll: number;
      limit: number;
      velocity: number;
    }) => {
      progressRef.current = limit > 0 ? scroll / limit : 0;
      velocityRef.current = velocity;
    };
    lenis.on("scroll", onScroll);

    // Mandatory snap — always settle onto the nearest section so the camera
    // parks exactly on a stop keyframe (an expanded box is always centered).
    const snap = new Snap(lenis, {
      type: "mandatory",
      velocityThreshold: 1,
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });

    const snapIds: number[] = [];
    const registerSnaps = () => {
      snapIds.forEach((id) => snap.remove(id));
      snapIds.length = 0;
      document.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
        const id = snap.add(el.offsetTop);
        if (typeof id === "number") snapIds.push(id);
      });
    };
    // Wait a tick so layout settles before measuring offsetTop.
    const raf1 = requestAnimationFrame(registerSnaps);
    window.addEventListener("resize", registerSnaps);

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(raf1);
      window.removeEventListener("resize", registerSnaps);
      snap.destroy();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return { progressRef, velocityRef, lenisRef };
}

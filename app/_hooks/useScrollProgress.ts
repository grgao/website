"use client";

import Lenis from "lenis";
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

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return { progressRef, velocityRef, lenisRef };
}

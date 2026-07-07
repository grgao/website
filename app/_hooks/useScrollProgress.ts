"use client";

import Lenis from "lenis";
import Snap from "lenis/snap";
import { useEffect, useRef } from "react";

type MeasureFn = () => void;

// Layout measurements that must rerun when scroll or viewport geometry
// changes. One registry instead of a rAF polling loop per consumer:
// callbacks run on every Lenis scroll frame, on resize, and once at
// registration, so idle frames cost nothing.
const measureFns = new Set<MeasureFn>();

export function onScrollMeasure(fn: MeasureFn): () => void {
  measureFns.add(fn);
  fn();
  return () => {
    measureFns.delete(fn);
  };
}

function runMeasures() {
  measureFns.forEach((fn) => fn());
}

export function useScrollProgress() {
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  // Normalized scroll progress (0..1) of each [data-snap] section top, in
  // document order. CameraRig maps these to curve keyframes so camera and
  // snap points stay aligned even if section heights drift from 100vh.
  const snapProgressRef = useRef<number[]>([]);
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
      runMeasures();
    };
    lenis.on("scroll", onScroll);

    // Mandatory snap: always settle onto the nearest section so the camera
    // parks exactly on a stop keyframe (an expanded box is always centered).
    const snap = new Snap(lenis, {
      type: "mandatory",
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });

    // Camera keyframe alignment reads normalized section offsets; snap
    // elements track their own rects via Snap's ResizeObservers.
    const measureSnapProgress = () => {
      const limit =
        document.documentElement.scrollHeight - window.innerHeight;
      const progresses: number[] = [];
      document.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
        progresses.push(limit > 0 ? el.offsetTop / limit : 0);
      });
      snapProgressRef.current = progresses;
      runMeasures();
    };

    const removeSnaps: (() => void)[] = [];
    // Wait a tick so layout settles before measuring offsetTop.
    const raf1 = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
        removeSnaps.push(snap.addElement(el, { align: ["start"] }));
      });
      measureSnapProgress();
    });
    window.addEventListener("resize", measureSnapProgress);

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(raf1);
      window.removeEventListener("resize", measureSnapProgress);
      removeSnaps.forEach((remove) => remove());
      snap.destroy();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return { progressRef, velocityRef, snapProgressRef, lenisRef };
}

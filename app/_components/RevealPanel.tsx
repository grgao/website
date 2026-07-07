"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { onScrollMeasure } from "../_hooks/useScrollProgress";

type Props = {
  children: ReactNode;
  className?: string;
};

// Open when this fraction of the panel is in view; close when it drops
// below the lower bound (hysteresis prevents flicker at the boundary).
const OPEN_AT = 0.5;
const CLOSE_AT = 0.35;

/**
 * Wraps section content. While the panel is offscreen or barely visible,
 * the content is collapsed (thin horizontal strip + blur). When the section
 * settles into view (e.g. after a scroll snap) it unfurls open. Scrolling
 * away reverses it. Visibility is remeasured on every scroll frame via the
 * shared measurement registry.
 */
export function RevealPanel({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  useEffect(() => {
    return onScrollMeasure(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visiblePx = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      const frac = visiblePx / Math.min(r.height || 1, vh);
      const next = openRef.current ? frac > CLOSE_AT : frac > OPEN_AT;
      if (next !== openRef.current) {
        openRef.current = next;
        setOpen(next);
      }
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      <div
        className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "scale(1)" : "scale(0.96)",
          clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(42% 0% 42% 0%)",
          filter: open ? "blur(0px)" : "blur(6px)",
          willChange: "transform, opacity, filter, clip-path",
        }}
      >
        {children}
      </div>
    </div>
  );
}

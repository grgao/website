"use client";

import { useEffect, useState } from "react";

export function Reticle() {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-(--z-header) flex items-center justify-center transition-opacity duration-700"
      style={{ opacity: past ? 0 : 0.75 }}
    >
      <svg
        width={220}
        height={220}
        viewBox="0 0 220 220"
        className="text-primary"
      >
        {/* Outer ring with gaps */}
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <circle cx="110" cy="110" r="92" strokeDasharray="2 10" opacity="0.5" />
          <circle cx="110" cy="110" r="60" strokeDasharray="36 8" opacity="0.7" />
        </g>

        {/* Crosshair */}
        <g stroke="currentColor" strokeWidth="1">
          <line x1="110" y1="20" x2="110" y2="48" />
          <line x1="110" y1="172" x2="110" y2="200" />
          <line x1="20" y1="110" x2="48" y2="110" />
          <line x1="172" y1="110" x2="200" y2="110" />
        </g>

        {/* Center dot */}
        <circle cx="110" cy="110" r="1.5" fill="currentColor" />

        {/* Corner brackets */}
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <path d="M64 64 L64 76 M64 64 L76 64" />
          <path d="M156 64 L144 64 M156 64 L156 76" />
          <path d="M64 156 L64 144 M64 156 L76 156" />
          <path d="M156 156 L156 144 M156 156 L144 156" />
        </g>

        {/* Coordinate labels */}
        <g
          fill="currentColor"
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="1.4"
        >
          <text x="110" y="14" textAnchor="middle">N</text>
          <text x="110" y="214" textAnchor="middle">S</text>
          <text x="6" y="113">W</text>
          <text x="204" y="113">E</text>
        </g>
      </svg>
    </div>
  );
}

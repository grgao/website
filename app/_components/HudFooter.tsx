"use client";

import { useEffect, useState } from "react";

const STATIC_ITEMS = [
  "SYS::OK",
  "TELEMETRY · LIVE",
  "PILOT.GAO@FIRETIGER",
  "CARDINALITY -90%",
  "QUERY 17000MS → 980MS",
  "GO · TS · PYTHON · GRAFANA · OTEL",
  "BUILDING SF · 2026",
];

/** Pull a readable GPU model out of the WebGL renderer string.
 *  Raw values look like "ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)". */
function detectGpu(): string | undefined {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return undefined;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const raw: string = ext
      ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);
    if (!raw) return undefined;

    let name = raw;
    const angle = raw.match(/^ANGLE \((.*)\)$/);
    if (angle) {
      const parts = angle[1].split(",").map((p) => p.trim());
      name = parts[1] ?? parts[0];
    }
    name = name.replace(/^ANGLE Metal Renderer:\s*/i, "").replace(/\s*\/.*$/, "");
    return name.slice(0, 28);
  } catch {
    return undefined;
  }
}

type BatteryState = { level: number; charging: boolean };

type BatteryManager = {
  level: number;
  charging: boolean;
  addEventListener: (type: string, cb: () => void) => void;
  removeEventListener: (type: string, cb: () => void) => void;
};

function useTelemetry() {
  const [fps, setFps] = useState<number>();
  const [gpu, setGpu] = useState<string>();
  const [tz, setTz] = useState<string>();
  const [online, setOnline] = useState(true);
  const [battery, setBattery] = useState<BatteryState>();

  useEffect(() => {
    setGpu(detectGpu());
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Battery is Chrome-only; skip silently elsewhere.
    let bm: BatteryManager | undefined;
    const onBattery = () => {
      if (bm) setBattery({ level: bm.level, charging: bm.charging });
    };
    (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> })
      .getBattery?.()
      .then((manager) => {
        bm = manager;
        onBattery();
        manager.addEventListener("levelchange", onBattery);
        manager.addEventListener("chargingchange", onBattery);
      })
      .catch(() => {});

    setOnline(navigator.onLine);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);

    // Real frame rate of the page (same thread as the WebGL scene).
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
      cancelAnimationFrame(raf);
      bm?.removeEventListener("levelchange", onBattery);
      bm?.removeEventListener("chargingchange", onBattery);
    };
  }, []);

  return { fps, gpu, tz, online, battery };
}

export function HudFooter() {
  const { fps, gpu, tz, online, battery } = useTelemetry();

  const items = [
    `LINK · ${online ? "NOMINAL" : "LOST"}`,
    ...(fps !== undefined ? [`${fps} FPS`] : []),
    ...(gpu ? [`GPU · ${gpu}`] : []),
    ...(battery
      ? [
          `PWR ${Math.round(battery.level * 100)}%${battery.charging ? " · CHARGING" : ""}`,
        ]
      : []),
    ...(tz ? [`TZ · ${tz.replaceAll("_", " ")}`] : []),
    ...STATIC_ITEMS,
  ];

  return (
    <footer
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-(--z-header) font-mono"
      style={{ padding: "0 calc(var(--frame-inset) + 64px) calc(var(--frame-inset) + 12px)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 -z-10"
        style={{
          background:
            "linear-gradient(0deg, oklch(0.07 0.014 245 / 0.9) 0%, oklch(0.07 0.014 245 / 0.55) 55%, transparent 100%)",
        }}
      />
      <div className="flex items-end justify-between gap-6">
        {/* Left: sound toggle (mock) */}
        <div className="pointer-events-auto flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-primary">
          <button
            type="button"
            className="border border-primary/50 px-2.5 py-1 hover:border-primary hover:bg-primary/10 transition-colors"
          >
            SOUND : OFF
          </button>
        </div>

        {/* Center: scrolling ticker with live telemetry */}
        <div className="hidden md:block max-w-[40rem] flex-1 overflow-hidden border-y border-primary/30 py-1">
          <div className="ticker-track flex gap-10 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-accent">
            {[...items, ...items].map((t, i) => (
              <span key={i} className="text-shadow-cyan">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right: scroll prompt */}
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-primary/80">
          <div className="text-shadow-hud">SCROLL TO DESCEND</div>
          <div className="mt-1 flex items-center justify-end gap-1.5 text-foreground/55 text-[9px]">
            <span>↓</span>
            <span>WHEEL · TRACKPAD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

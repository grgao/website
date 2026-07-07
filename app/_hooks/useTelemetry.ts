"use client";

import { useEffect, useState } from "react";

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

/** Real device/session telemetry for the HUD: frame rate, GPU model,
 *  timezone, online state, and battery (where the API exists). */
export function useTelemetry() {
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

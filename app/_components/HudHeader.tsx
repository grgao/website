"use client";

import { useEffect, useState } from "react";

/** Pull a readable GPU model out of the WebGL renderer string.
 *  Raw values look like "ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)". */
function detectGpu(): string | undefined {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ?? canvas.getContext("webgl");
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

function useHudTelemetry() {
  const [time, setTime] = useState("--:--:--");
  const [fps, setFps] = useState<number>();
  const [gpu, setGpu] = useState<string>();
  const [tz, setTz] = useState<string>();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setTime(`${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setGpu(detectGpu());
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);

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
    };
  }, []);

  return { time, fps, gpu, tz, online };
}

export function HudHeader() {
  const { time, fps, gpu, tz, online } = useHudTelemetry();

  return (
    <header
      className="pointer-events-none fixed top-0 left-0 right-0 z-(--z-header)"
      style={{ padding: "calc(var(--frame-inset) + 12px) calc(var(--frame-inset) + 64px)" }}
    >
      {/* Soft fade behind header so content underneath remains readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.07 0.014 245 / 0.85) 0%, oklch(0.07 0.014 245 / 0.5) 60%, transparent 100%)",
        }}
      />
      <div className="flex items-start justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
        {/* Left: identity callsign */}
        <div className="flex items-center gap-3">
          <Diamond />
          <div className="leading-tight">
            <div className="text-primary/90 text-shadow-hud">GRACE.E.GAO</div>
            <div className="text-foreground/55 text-[9px]">PILOT // CALL-SIGN G-301</div>
          </div>
        </div>

        {/* Middle: live telemetry */}
        <div className="hidden md:flex items-center gap-2 text-[10px] text-foreground/70">
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`size-1.5 rounded-full hud-pulse ${online ? "bg-success" : "bg-danger"}`}
            />
            LINK · {online ? "NOMINAL" : "LOST"}
          </span>
          {fps !== undefined && (
            <>
              <span className="text-foreground/30">|</span>
              <span>{fps} FPS</span>
            </>
          )}
          {gpu && (
            <>
              <span className="text-foreground/30">|</span>
              <span>GPU · {gpu}</span>
            </>
          )}
          {tz && (
            <>
              <span className="text-foreground/30">|</span>
              <span>TZ · {tz.replaceAll("_", " ")}</span>
            </>
          )}
        </div>

        {/* Right: clock + version */}
        <div className="text-right leading-tight">
          <div className="text-primary/90">{time}</div>
          <div className="text-foreground/45 text-[9px]">BUILD v2.6.0 · STABLE</div>
        </div>
      </div>
    </header>
  );
}

function Diamond() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className="text-primary">
      <path
        d="M11 1 L21 11 L11 21 L1 11 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
      />
      <path d="M11 5 L17 11 L11 17 L5 11 Z" fill="currentColor" />
    </svg>
  );
}

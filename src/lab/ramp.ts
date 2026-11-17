import { useEffect, useState } from "react";

export type Ramp = "hide" | "run" | "done";

export function useRamp(phase: Ramp, from: number, to: number, ms: number): number {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (phase === "hide") {
      setValue(from);
      return;
    }
    if (phase === "done") {
      setValue(to);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(to);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setValue(from + (to - from) * t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, from, to, ms]);

  return value;
}

export function grouped(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function clock(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

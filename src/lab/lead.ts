import { useEffect, useRef, useState } from "react";

const DURATION = 3800;

function ease(amount: number): number {
  const x1 = 0.22;
  const y1 = 0.6;
  const x2 = 0.2;
  const y2 = 1;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const at = (t: number, a: number, b: number, c: number) => ((a * t + b) * t + c) * t;
  let t = amount;
  for (let i = 0; i < 8; i += 1) {
    const x = at(t, ax, bx, cx) - amount;
    const slope = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(slope) < 1e-5) break;
    t = Math.min(1, Math.max(0, t - x / slope));
  }
  return at(t, ay, by, cy);
}

export function useLead(lowered: boolean, up: readonly number[], down: readonly number[]): number[] {
  const current = useRef<number[]>([...up]);
  const [values, setValues] = useState<number[]>([...up]);

  useEffect(() => {
    const goal = lowered ? down : up;
    const start = current.current.slice();
    const arrived = start.every((value, index) => Math.abs(value - goal[index]) < 0.05);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (arrived || reduce) {
      current.current = [...goal];
      setValues(current.current);
      return;
    }
    const began = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / DURATION);
      const eased = ease(t);
      const next = start.map((value, index) => value + (goal[index] - value) * eased);
      current.current = next;
      setValues(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [lowered, up, down]);

  return values;
}

export function leadNumber(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

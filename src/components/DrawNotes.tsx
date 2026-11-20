import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Locale } from "../lab/script";

type Tool = "pen" | "mark" | "eraser";
type Ink = "ink" | "blue" | "red";
type Mark = "yellow" | "green" | "pink";

interface Point {
  x: number;
  y: number;
  p: number;
}

interface Stroke {
  tool: "pen" | "mark";
  color: string;
  points: Point[];
}

const INK: Record<Ink, string> = {
  ink: "#173246",
  blue: "#1a4f9c",
  red: "#d21f14",
};

const MARK: Record<Mark, string> = {
  yellow: "#ffe14a",
  green: "#7dff6a",
  pink: "#ff8ad4",
};

const STORE = "latent-heat-ink";

function loadStrokes(): Stroke[] {
  try {
    const raw = sessionStorage.getItem(STORE);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const stroke = item as Stroke;
      if (stroke.tool !== "pen" && stroke.tool !== "mark") return [];
      if (typeof stroke.color !== "string" || !Array.isArray(stroke.points)) return [];
      const points = stroke.points.filter(
        (point) => Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.p),
      );
      if (points.length === 0) return [];
      return [{ tool: stroke.tool, color: stroke.color, points }];
    });
  } catch {
    return [];
  }
}

function paint(canvas: HTMLCanvasElement, strokes: readonly Stroke[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const stroke of strokes) {
    drawStroke(ctx, stroke, width, height);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, width: number, height: number) {
  const highlight = stroke.tool === "mark";
  const pressure = stroke.points.reduce((sum, point) => sum + point.p, 0) / stroke.points.length;
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = highlight ? 0.45 : 1;
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = highlight ? 28 : 2.2 + pressure * 3.4;
  ctx.beginPath();
  const first = stroke.points[0];
  ctx.moveTo(first.x * width, first.y * height);
  if (stroke.points.length === 1) {
    ctx.lineTo(first.x * width + 0.2, first.y * height);
  } else {
    for (let index = 1; index < stroke.points.length - 1; index += 1) {
      const current = stroke.points[index];
      const next = stroke.points[index + 1];
      ctx.quadraticCurveTo(
        current.x * width,
        current.y * height,
        ((current.x + next.x) / 2) * width,
        ((current.y + next.y) / 2) * height,
      );
    }
    const last = stroke.points[stroke.points.length - 1];
    ctx.lineTo(last.x * width, last.y * height);
  }
  ctx.stroke();
}

function toPoint(event: PointerEvent): Point {
  return {
    x: event.clientX / window.innerWidth,
    y: event.clientY / window.innerHeight,
    p: event.pressure > 0 ? event.pressure : 0.5,
  };
}

function hitsStroke(stroke: Stroke, x: number, y: number) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const radius = stroke.tool === "mark" ? 36 : 28;
  const limit = radius * radius;
  const points = stroke.points;
  for (let index = 0; index < points.length; index += 1) {
    const startX = points[index].x * width;
    const startY = points[index].y * height;
    const end = points[Math.min(index + 1, points.length - 1)];
    const endX = end.x * width;
    const endY = end.y * height;
    const dx = endX - startX;
    const dy = endY - startY;
    const length = dx * dx + dy * dy;
    const t = length === 0 ? 0 : Math.max(0, Math.min(1, ((x - startX) * dx + (y - startY) * dy) / length));
    const px = x - (startX + t * dx);
    const py = y - (startY + t * dy);
    if (px * px + py * py <= limit) return true;
  }
  return false;
}

export function DrawNotes({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>(loadStrokes());
  const historyRef = useRef<Stroke[][]>([]);
  const activeRef = useRef<Stroke | null>(null);
  const eraseFrom = useRef<Stroke[] | null>(null);
  const toolRef = useRef<Tool | null>(null);
  const colorRef = useRef<string>(INK.ink);
  const activePointer = useRef<number | null>(null);
  const lastPen = useRef(0);
  const touchStarted = useRef(0);
  const activeWasTouch = useRef(false);
  const [tool, setTool] = useState<Tool | null>(null);
  const [color, setColor] = useState<Ink>("ink");
  const [mark, setMark] = useState<Mark>("yellow");
  const [ink, setInk] = useState(strokesRef.current.length);
  const [past, setPast] = useState(0);
  const zh = locale === "zh-Hant";
  toolRef.current = tool;
  colorRef.current = tool === "mark" ? MARK[mark] : INK[color];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const redraw = () => paint(canvas, strokesRef.current);
    redraw();
    window.addEventListener("resize", redraw);
    return () => window.removeEventListener("resize", redraw);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!tool) return;
    root.classList.add("is-drawing");
    window.getSelection()?.removeAllRanges();
    const onDock = (event: Event) => event.target instanceof Element && Boolean(event.target.closest(".draw-dock"));
    const block = (event: Event) => {
      if (onDock(event)) return;
      event.preventDefault();
    };
    const clearSelection = () => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) selection.removeAllRanges();
    };
    const capture: AddEventListenerOptions = { capture: true, passive: false };
    document.addEventListener("touchstart", block, capture);
    document.addEventListener("touchmove", block, capture);
    document.addEventListener("selectstart", block, true);
    document.addEventListener("contextmenu", block, true);
    document.addEventListener("selectionchange", clearSelection);
    return () => {
      root.classList.remove("is-drawing");
      document.removeEventListener("touchstart", block, capture);
      document.removeEventListener("touchmove", block, capture);
      document.removeEventListener("selectstart", block, true);
      document.removeEventListener("contextmenu", block, true);
      document.removeEventListener("selectionchange", clearSelection);
    };
  }, [tool]);

  function redraw() {
    const canvas = canvasRef.current;
    if (canvas) paint(canvas, strokesRef.current);
  }

  function remember() {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(strokesRef.current));
    } catch {
      /* a full private-mode store should not block the pen */
    }
    setInk(strokesRef.current.length);
    setPast(historyRef.current.length);
  }

  function notePen(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (event.pointerType === "pen") lastPen.current = performance.now();
  }

  function isPalm(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (event.pointerType !== "touch") return false;
    const native = event.nativeEvent;
    if (native.width > 24 || native.height > 24) return true;
    return performance.now() - lastPen.current < 1200;
  }

  function onDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    notePen(event);
    if (!toolRef.current || event.button !== 0 || isPalm(event)) return;
    if (
      event.pointerType === "pen" &&
      activeWasTouch.current &&
      activeRef.current &&
      performance.now() - touchStarted.current < 500
    ) {
      strokesRef.current = strokesRef.current.slice(0, -1);
      activeRef.current = null;
    }
    event.preventDefault();
    activePointer.current = event.pointerId;
    activeWasTouch.current = event.pointerType === "touch";
    if (event.pointerType === "touch") touchStarted.current = performance.now();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* the stroke still follows the pointer if capture is unavailable */
    }
    if (toolRef.current === "eraser") {
      eraseFrom.current = strokesRef.current;
      strokesRef.current = strokesRef.current.filter((stroke) => !hitsStroke(stroke, event.clientX, event.clientY));
      redraw();
      return;
    }
    const point = toPoint(event.nativeEvent);
    const stroke: Stroke = {
      tool: toolRef.current,
      color: colorRef.current,
      points: [point],
    };
    historyRef.current = [...historyRef.current, strokesRef.current.slice()].slice(-50);
    activeRef.current = stroke;
    strokesRef.current = [...strokesRef.current, stroke];
    redraw();
  }

  function onMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    notePen(event);
    if (isPalm(event) || (activePointer.current !== null && event.pointerId !== activePointer.current)) return;
    if ((event.buttons & 1) === 0 && activeRef.current === null && eraseFrom.current === null) return;
    if (eraseFrom.current) {
      strokesRef.current = strokesRef.current.filter((stroke) => !hitsStroke(stroke, event.clientX, event.clientY));
      redraw();
      return;
    }
    const stroke = activeRef.current;
    if (!stroke) return;
    const batch = event.nativeEvent.getCoalescedEvents?.() ?? [];
    const samples = batch.length > 0 ? batch : [event.nativeEvent];
    samples.forEach((item) => stroke.points.push(toPoint(item)));
    redraw();
  }

  function onUp(event: ReactPointerEvent<HTMLCanvasElement>) {
    notePen(event);
    if (activePointer.current !== null && event.pointerId !== activePointer.current) return;
    activePointer.current = null;
    if (eraseFrom.current) {
      if (eraseFrom.current.length !== strokesRef.current.length) {
        historyRef.current = [...historyRef.current, eraseFrom.current].slice(-50);
      }
      eraseFrom.current = null;
      remember();
      return;
    }
    if (!activeRef.current) return;
    activeRef.current = null;
    remember();
  }

  function choose(next: Tool) {
    setTool((current) => (current === next ? null : next));
  }

  function chooseColor(next: Ink) {
    setColor(next);
    setTool("pen");
  }

  function chooseMark(next: Mark) {
    setMark(next);
    setTool("mark");
  }

  function undo() {
    const previous = historyRef.current.pop();
    if (!previous) return;
    activeRef.current = null;
    eraseFrom.current = null;
    strokesRef.current = previous;
    redraw();
    remember();
  }

  function clearNotes() {
    if (strokesRef.current.length === 0) return;
    historyRef.current = [...historyRef.current, strokesRef.current].slice(-50);
    activeRef.current = null;
    eraseFrom.current = null;
    strokesRef.current = [];
    redraw();
    remember();
  }

  const names = {
    pen: zh ? "筆" : "Pen",
    mark: zh ? "螢光筆" : "Highlight",
    eraser: zh ? "擦膠" : "Eraser",
    undo: zh ? "還原" : "Undo",
    clear: zh ? "清除" : "Clear",
    ink: zh ? "黑" : "Black",
    blue: zh ? "藍" : "Blue",
    red: zh ? "紅" : "Red",
    yellow: zh ? "黃" : "Yellow",
    green: zh ? "綠" : "Green",
    pink: zh ? "粉" : "Pink",
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`draw-layer ${tool ? "is-live" : ""}`}
        data-testid="draw-layer"
        data-tool={tool ?? "off"}
        aria-hidden={tool ? undefined : true}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onContextMenu={(event) => event.preventDefault()}
      />
      <div className="draw-dock" role="toolbar" aria-label={zh ? "書寫" : "Draw"}>
        <div className="draw-pen-wrap">
          <button type="button" data-testid="draw-pen" aria-pressed={tool === "pen"} onClick={() => choose("pen")}>
            <PenIcon />
            <span>{names.pen}</span>
          </button>
          {tool === "pen" ? (
            <div className="draw-colors" role="group" aria-label={zh ? "顏色" : "Colour"}>
              {(Object.keys(INK) as Ink[]).map((name) => (
                <button
                  key={name}
                  type="button"
                  className="draw-color"
                  data-testid={`draw-color-${name}`}
                  aria-label={names[name]}
                  aria-pressed={color === name}
                  style={{ background: INK[name] }}
                  onClick={() => chooseColor(name)}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="draw-pen-wrap">
          <button
            type="button"
            data-testid="draw-mark"
            className="draw-mark"
            aria-pressed={tool === "mark"}
            style={tool === "mark" ? { background: MARK[mark], color: "#173246" } : undefined}
            onClick={() => choose("mark")}
          >
            <MarkIcon />
            <span>{names.mark}</span>
          </button>
          {tool === "mark" ? (
            <div className="draw-colors" role="group" aria-label={zh ? "螢光筆顏色" : "Highlight colour"}>
              {(Object.keys(MARK) as Mark[]).map((name) => (
                <button
                  key={name}
                  type="button"
                  className="draw-color"
                  data-testid={`draw-mark-${name}`}
                  aria-label={names[name]}
                  aria-pressed={mark === name}
                  style={{ background: MARK[name] }}
                  onClick={() => chooseMark(name)}
                />
              ))}
            </div>
          ) : null}
        </div>
        <button type="button" data-testid="draw-eraser" aria-pressed={tool === "eraser"} onClick={() => choose("eraser")}>
          <EraserIcon />
          <span>{names.eraser}</span>
        </button>
        <button type="button" data-testid="draw-undo" disabled={past === 0} onClick={undo}>
          <UndoIcon />
          <span>{names.undo}</span>
        </button>
        <button type="button" data-testid="draw-clear" disabled={ink === 0} onClick={clearNotes}>
          <ClearIcon />
          <span>{names.clear}</span>
        </button>
      </div>
    </>
  );
}

function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 4.5 19.5 10 9 20.5 3.5 21 4 15.5 Z" />
      <path d="M13 6.5 17.5 11" />
    </svg>
  );
}

function MarkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 16.5 14.5 7l3 3L8 19.5H5Z" />
      <path d="M13.2 8.3 16.2 5.3 19.2 8.3 16.2 11.3Z" />
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 15.5 12.5 7l5 5L9 20.5H5.5Z" />
      <path d="M8 20.5h12" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 8H4.5V4.5" />
      <path d="M5 8.2A8 8 0 1 1 6.2 16" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14" />
      <path d="M9 8V5.5h6V8" />
      <path d="M7 8l.8 11h8.4L17 8" />
    </svg>
  );
}

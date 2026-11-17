import type { Locale } from "../lab/script";
import { grouped } from "../lab/ramp";

const CRYSTALS = [
  { x: 378, y: 188, s: 1, d: 0, role: "loose" },
  { x: 442, y: 176, s: 1.15, d: 0.15, role: "loose" },
  { x: 512, y: 186, s: 1, d: 0.3, role: "loose" },
  { x: 360, y: 222, s: 0.9, d: 0.1, role: "loose" },
  { x: 424, y: 214, s: 1.2, d: 0, role: "cover" },
  { x: 498, y: 220, s: 1.05, d: 0, role: "cover" },
  { x: 392, y: 252, s: 1, d: 0, role: "cover" },
  { x: 458, y: 246, s: 1.15, d: 0, role: "cover" },
  { x: 524, y: 254, s: 0.85, d: 0.4, role: "loose" },
  { x: 430, y: 276, s: 0.95, d: 0, role: "cover" },
];

function Tag({
  x,
  y,
  en,
  zh,
  locale,
  className,
}: {
  x: number;
  y: number;
  en: string;
  zh: string;
  locale: Locale;
  className?: string;
}) {
  return (
    <text className={className ? `tag ${className}` : "tag"} x={x} y={y}>
      {locale === "zh-Hant" ? zh : en}
    </text>
  );
}

function Crystal({ x, y, s, d, role }: { x: number; y: number; s: number; d: number; role: string }) {
  const w = 36 * s;
  const h = 28 * s;
  return (
    <g className={`ice-bit ${role}`} style={{ animationDelay: `${d}s` }}>
      <polygon points={`${x},${y + h * 0.35} ${x + w * 0.45},${y} ${x + w},${y + h * 0.4} ${x + w * 0.5},${y + h}`} />
      <polygon className="ice-shine" points={`${x + 4},${y + h * 0.45} ${x + w * 0.42},${y + 6} ${x + w * 0.48},${y + h * 0.55}`} />
    </g>
  );
}

export function FusionRig({
  step,
  joules,
  powered,
  locale,
  fault,
}: {
  step: number;
  joules: number | null;
  powered: boolean;
  locale: Locale;
  fault: string | null;
}) {
  const zh = locale === "zh-Hant";
  return (
    <svg
      className="scene fusion"
      data-ice={step >= 2 ? "yes" : "no"}
      data-heater={step >= 3 ? "yes" : "no"}
      data-power={powered ? "yes" : "no"}
      data-melted={step >= 4 ? "yes" : "no"}
      data-fault={fault ?? "none"}
      viewBox="0 0 1360 560"
      role="img"
      aria-label={zh ? "熔解實驗裝置" : "Fusion apparatus"}
    >
      <defs>
        <linearGradient id="iceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#d7f1fb" />
          <stop offset="1" stopColor="#7eb6d6" />
        </linearGradient>
        <marker id="arrowIn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="#ff6a3c" />
        </marker>
        <radialGradient id="heatBlob" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff2a1a" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#ff6a3c" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ff2a1a" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#1c2833" floodOpacity="0.18" />
        </filter>
      </defs>

      <rect className="bench" x="0" y="508" width="1360" height="52" />
      <rect className="bench-lip" x="0" y="508" width="1360" height="8" />

      <g className="supply" filter="url(#soft)">
        <rect x="24" y="360" width="176" height="96" rx="10" />
        <text className="readout" x="112" y="400" textAnchor="middle">
          12 V a.c.
        </text>
        <circle className="lamp" cx="58" cy="428" r="8" />
        <line className="lever" x1="132" y1="438" x2="132" y2="416" />
        <Tag x={28} y={480} en="Power supply" zh="電源" locale={locale} />
      </g>

      <path className="lead" d="M112 360 C 112 300, 70 250, 70 188" />

      <g className="meter" filter="url(#soft)">
        <rect x="16" y="36" width="228" height="154" rx="10" />
        <rect className="screen" x="28" y="72" width="204" height="64" rx="6" />
        <text className="digits" x="130" y="116" textAnchor="middle" data-testid="lab-joules">
          {joules === null ? "—" : `${grouped(joules)} J`}
        </text>
        <Tag x={20} y={28} en="Joulemeter" zh="焦耳計" locale={locale} className="tag-hot" />
      </g>

      <path className="lead hot" d="M244 100 C 340 20, 410 -10, 460 -40.4" />

      <line className="stand" x1="648" y1="28" x2="648" y2="508" />
      <rect className="boss" x="632" y="158" width="32" height="16" rx="3" />
      <line className="clamp" x1="636" y1="166" x2="468" y2="166" />
      <Tag x={668} y={48} en="Stand" zh="鐵架" locale={locale} />

      <g className="funnel-set" filter="url(#soft)">
        <path className="funnel" d="M320 168 H600 L548 328 H372 Z" />
        <ellipse className="rim" cx="460" cy="168" rx="140" ry="16" />
        <rect className="stem" x="452" y="328" width="16" height="36" />
        <path className="funnel-pool" d="M400 286 H522 L506 324 H416 Z" />
        <Tag x={214} y={214} en="Funnel" zh="漏斗" locale={locale} />
        <Tag x={188} y={248} en="Crushed ice" zh="碎冰" locale={locale} className="ice-label tag-ice" />
      </g>

      <g className="immersion" data-testid="heater-body">
        <circle className="heat-blob" cx="460" cy="268" r="58" />
        <rect className="rod" x="452" y="150" width="16" height="150" rx="6" />
        <path
          className="coil"
          data-testid="coil"
          d="M428 236 h64 v14 h-64 v14 h64 v14 h-64 v14 h64 v14 h-64"
        />
        <Tag x={668} y={292} en="Heater" zh="加熱器" locale={locale} className="tag-hot" />
      </g>

      <g className="main-ice">
        {CRYSTALS.map((bit) => (
          <Crystal key={`${bit.x}-${bit.y}`} {...bit} />
        ))}
      </g>

      <g className="lump">
        <polygon points="500,96 556,82 572,126 514,142" />
        <path d="M512 100 l44 32 M556 100 l-44 32" />
      </g>

      <g className="beaker-a" filter="url(#soft)">
        <path className="beaker" d="M392 372 H548 L530 476 H410 Z" />
        <path className="melt" d="M414 430 H526 L516 468 H424 Z" />
        <g className="drips">
          <circle cx="460" cy="366" r="4.5" />
          <circle cx="460" cy="366" r="4" />
          <circle cx="460" cy="366" r="3.4" />
          <circle cx="460" cy="366" r="3" />
          <circle cx="460" cy="366" r="2.6" />
        </g>
        <Tag x={404} y={500} en="Beaker A" zh="燒杯 A" locale={locale} className="tag-water" />
      </g>

      <g className="control" transform="translate(500, 0)" filter="url(#soft)">
        <line className="stand" x1="648" y1="28" x2="648" y2="508" />
        <Tag x={668} y={48} en="Stand" zh="鐵架" locale={locale} />
        <Tag x={668} y={120} en="Control" zh="對照" locale={locale} className="tag-control" />
        <Tag x={668} y={156} en="Crushed ice" zh="碎冰" locale={locale} className="ice-label tag-ice" />
        <g className="funnel-set">
          <path className="funnel" d="M320 168 H600 L548 328 H372 Z" />
          <ellipse className="rim" cx="460" cy="168" rx="140" ry="16" />
          <rect className="stem" x="452" y="328" width="16" height="36" />
          <path className="control-pool" d="M400 286 H522 L506 324 H416 Z" />
        </g>
        <g className="control-ice">
          {CRYSTALS.map((bit) => (
            <Crystal key={`b-${bit.x}-${bit.y}`} x={bit.x} y={bit.y} s={bit.s} d={bit.d} role="cover" />
          ))}
        </g>
        <g className="beaker-b">
          <path className="beaker" d="M392 372 H548 L530 476 H410 Z" />
          <path className="control-water" d="M414 430 H526 L516 468 H424 Z" />
          <g className="drips">
            <circle cx="460" cy="366" r="4.5" />
            <circle cx="460" cy="366" r="4" />
            <circle cx="460" cy="366" r="3.4" />
            <circle cx="460" cy="366" r="3" />
            <circle cx="460" cy="366" r="2.6" />
          </g>
          <Tag x={404} y={500} en="Beaker B" zh="燒杯 B" locale={locale} className="tag-control" />
        </g>
      </g>

      <g className="fault fault-cold">
        <text className="fault-label" x="500" y="168">
          −5°C
        </text>
        <path className="frost" d="M430 200 l8 -14 l8 14" />
        <path className="frost" d="M470 188 l6 -12 l6 12" />
        <path className="frost" d="M510 206 l7 -12 l7 12" />
      </g>
      <g className="fault fault-room">
        <path className="room-ray" markerEnd="url(#arrowIn)" d="M180 200 L310 190" />
        <path className="room-ray" markerEnd="url(#arrowIn)" d="M170 270 L320 250" />
        <path className="room-ray" markerEnd="url(#arrowIn)" d="M700 200 L820 190" />
        <path className="room-ray" markerEnd="url(#arrowIn)" d="M1280 240 L1100 210" />
        <circle className="room-drip" cx="460" cy="360" r="4.2" />
        <circle className="room-drip" cx="460" cy="360" r="3.4" />
        <circle className="room-drip" cx="960" cy="360" r="4.2" />
        <circle className="room-drip" cx="960" cy="360" r="3.4" />
      </g>
    </svg>
  );
}

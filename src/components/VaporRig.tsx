import type { Locale } from "../lab/script";
import { clock } from "../lab/ramp";

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

export function VaporRig({
  step,
  balance,
  seconds,
  locale,
  fault,
}: {
  step: number;
  balance: number | null;
  seconds: number | null;
  locale: Locale;
  fault: string | null;
}) {
  const zh = locale === "zh-Hant";
  return (
    <svg
      className="scene vapor"
      data-wrap={step >= 2 ? "yes" : "no"}
      data-heater={step >= 3 ? "yes" : "no"}
      data-boil={step >= 4 ? "yes" : "no"}
      data-timed={step >= 5 ? "yes" : "no"}
      data-fault={fault ?? "none"}
      viewBox="0 0 1460 560"
      role="img"
      aria-label={zh ? "汽化實驗裝置" : "Vaporization apparatus"}
    >
      <defs>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c5ecf8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1478a8" stopOpacity="0.78" />
        </linearGradient>
        <radialGradient id="waterHeat" cx="50%" cy="70%" r="55%">
          <stop offset="0" stopColor="#ff4d3a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff4d3a" stopOpacity="0" />
        </radialGradient>
        <marker id="arrowOut" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="#ff6a3c" />
        </marker>
        <marker id="arrowIn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="#1d4e89" />
        </marker>
        <radialGradient id="heatBlob" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff2a1a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff2a1a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="waterClip">
          <path d="M300 230 C340 244 450 244 490 230 L484 386 C448 398 342 398 306 386 Z" />
        </clipPath>
      </defs>

      <rect className="bench" x="0" y="508" width="1460" height="52" />
      <rect className="bench-lip" x="0" y="508" width="1460" height="8" />

      <g className="watch">
        <circle cx="88" cy="150" r="64" />
        <circle className="face" cx="88" cy="150" r="50" />
        <text className="digits" x="88" y="162" textAnchor="middle" data-testid="lab-clock">
          {seconds === null ? "—" : clock(seconds)}
        </text>
        <Tag x={36} y={236} en="Stopwatch" zh="秒錶" locale={locale} className="tag-read" />
      </g>

      <g className="beaker-set">
      <g className="jacket">
        <path d="M254 176 L272 392 L518 392 L536 176 Q395 198 254 176 Z" />
        <path className="cotton" d="M286 210 Q395 228 504 210" />
        <path className="cotton" d="M280 280 Q395 300 510 280" />
        <path className="cotton" d="M278 350 Q395 370 512 350" />
        <Tag x={168} y={250} en="Insulation" zh="保溫層" locale={locale} className="tag-insul" />
      </g>

      <path className="glass" d="M292 176 L286 400 L504 400 L498 176" />
      <rect className="glass-foot" x="274" y="400" width="242" height="16" />
      <Tag x={196} y={190} en="Beaker A" zh="燒杯 A" locale={locale} />
      <Tag x={196} y={330} en="Water" zh="水" locale={locale} className="tag-water" />

      <g className="immersion" data-testid="heater-body">
        <circle className="heat-blob" cx="394" cy="350" r="62" />
        <rect className="rod" x="386" y="148" width="18" height="172" rx="6" />
        <path className="coil" data-testid="coil" d="M366 310 h56 v16 h-56 v16 h56 v16 h-56 v16 h56 v14 h-56" />
        <line className="callout" x1="428" y1="360" x2="568" y2="360" />
        <Tag x={576} y={366} en="Heater" zh="加熱器" locale={locale} className="tag-hot" />
      </g>

      <g className="water" data-testid="water-body">
        <path d="M300 230 C340 244 450 244 490 230 L484 386 C448 398 342 398 306 386 Z" />
        <ellipse className="surface" cx="395" cy="230" rx="96" ry="14" />
        <circle className="heat-glow" cx="394" cy="340" r="54" clipPath="url(#waterClip)" />
        <g className="bubbles" clipPath="url(#waterClip)">
          {Array.from({ length: 14 }, (_, index) => (
            <circle
              key={index}
              cx={348 + (index % 7) * 14}
              cy={300 + (index % 4) * 16}
              r={2.5 + (index % 3)}
              style={{ animationDelay: `${(index % 7) * 0.35}s`, animationDuration: `${1.6 + (index % 4) * 0.4}s` }}
            />
          ))}
        </g>
      </g>

      <path className="glass-shine" d="M312 190 L308 378" />

      <g className="steam">
        <path d="M340 168 q10 -22 0 -44 q12 -18 0 -34" />
        <path d="M380 160 q14 -24 0 -48" />
        <path d="M420 168 q-10 -20 6 -42 q10 -16 0 -30" />
        <path d="M450 158 q12 -18 0 -40" />
      </g>

      <g className="lid-no">
        <ellipse cx="395" cy="170" rx="90" ry="11" />
        <path d="M360 150 l70 32 M430 150 l-70 32" />
      </g>
      <circle className="jump" cx="508" cy="210" r="5" />
      <circle className="return-drop" cx="478" cy="200" r="4" />

      <line className="stand" x1="560" y1="36" x2="560" y2="508" />
      <rect className="boss" x="544" y="140" width="32" height="16" rx="3" />
      <line className="clamp" x1="548" y1="148" x2="404" y2="148" />
      <Tag x={576} y={46} en="Stand" zh="鐵架" locale={locale} />

      <path className="lead" d="M395 -87.2 C 520 -20, 660 20, 760 130" />

      <g className="supply">
        <rect x="748" y="120" width="180" height="100" rx="8" />
        <text className="readout" x="838" y="158" textAnchor="middle">
          500 W
        </text>
        <circle className="lamp" cx="790" cy="186" r="7" />
        <line className="lever" x1="860" y1="194" x2="860" y2="176" />
        <Tag x={780} y={244} en="Power supply" zh="電源" locale={locale} />
      </g>
      </g>

      <g className="balance">
        <path className="chassis" d="M260 416 H530 V432 H496 V508 H294 V432 H260 Z" />
        <rect className="screen" x="312" y="446" width="168" height="44" rx="4" />
        <text className="digits" x="396" y="476" textAnchor="middle" data-testid="lab-balance">
          {balance === null ? "—" : `${balance.toFixed(1)} g`}
        </text>
        <Tag x={150} y={478} en="Balance" zh="電子天平" locale={locale} className="tag-read" />
      </g>

      <g className="control" transform="translate(740, 0)">
        <line className="stand" x1="560" y1="36" x2="560" y2="508" />
        <Tag x={576} y={46} en="Stand" zh="鐵架" locale={locale} />
        <Tag x={576} y={86} en="Control" zh="對照" locale={locale} className="tag-control" />
        <g className="jacket">
          <path d="M254 176 L272 392 L518 392 L536 176 Q395 198 254 176 Z" />
          <path className="cotton" d="M286 210 Q395 228 504 210" />
          <path className="cotton" d="M280 280 Q395 300 510 280" />
          <path className="cotton" d="M278 350 Q395 370 512 350" />
        </g>
        <path className="glass" d="M292 176 L286 400 L504 400 L498 176" />
        <rect className="glass-foot" x="274" y="400" width="242" height="16" />
        <Tag x={576} y={210} en="Beaker B" zh="燒杯 B" locale={locale} className="tag-control" />
        <g className="water">
          <path d="M300 230 C340 244 450 244 490 230 L484 386 C448 398 342 398 306 386 Z" />
          <ellipse className="surface" cx="395" cy="230" rx="96" ry="14" />
        </g>
        <path className="glass-shine" d="M312 190 L308 378" />
        <g className="balance">
          <path className="chassis" d="M260 416 H530 V432 H496 V508 H294 V432 H260 Z" />
          <rect className="screen" x="312" y="446" width="168" height="44" rx="4" />
          <text className="digits" x="396" y="476" textAnchor="middle">
            {balance === null ? "—" : "652.1 g"}
          </text>
        </g>
      </g>

      <g className="fault fault-loss">
        <path className="loss-ray" markerEnd="url(#arrowOut)" d="M250 250 L150 210" />
        <path className="loss-ray" markerEnd="url(#arrowOut)" d="M248 330 L140 370" />
        <path className="loss-ray" markerEnd="url(#arrowOut)" d="M540 250 L660 210" />
        <path className="loss-ray" markerEnd="url(#arrowOut)" d="M536 340 L670 390" />
        <path className="gain-ray" markerEnd="url(#arrowIn)" d="M160 290 L270 300" />
        <path className="gain-ray" markerEnd="url(#arrowIn)" d="M690 300 L545 315" />
      </g>
      <g className="fault fault-back">
        <circle className="back-drop" cx="350" cy="186" r="4" />
        <circle className="back-drop" cx="410" cy="178" r="3.4" />
        <circle className="back-drop" cx="470" cy="190" r="4.2" />
      </g>
      <g className="fault fault-jump">
        <circle className="out-drop" cx="500" cy="220" r="5" />
        <circle className="out-drop" cx="520" cy="200" r="4" />
        <circle className="out-drop" cx="300" cy="210" r="4.5" />
      </g>
      <g className="fault fault-lid">
        <ellipse className="lid-on" cx="395" cy="158" rx="118" ry="20" />
        <ellipse className="lid-knob" cx="395" cy="142" rx="18" ry="7" />
        <text className="fault-label lid-word" x="360" y="132">
          {zh ? "蓋" : "Lid"}
        </text>
        <circle className="lid-drop" cx="360" cy="176" r="4.5" />
        <circle className="lid-drop" cx="430" cy="174" r="4" />
      </g>
    </svg>
  );
}

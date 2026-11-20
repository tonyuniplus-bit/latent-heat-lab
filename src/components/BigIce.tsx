import type { Locale } from "../lab/script";

function Coil({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect className="rod" x={x + 32} y={y - 108} width="16" height="116" rx="6" />
      <path className="coil" d={`M${x} ${y} h80 v14 h-80 v14 h80 v14 h-80 v14 h80 v14 h-80`} />
    </g>
  );
}

function Touch({ cx, cy }: { cx: number; cy: number }) {
  return <ellipse className="compare-touch" cx={cx} cy={cy} rx="16" ry="9" />;
}

export function BigIce({ locale }: { locale: Locale }) {
  const zh = locale === "zh-Hant";
  return (
    <svg
      className="scene compare"
      viewBox="0 0 1460 560"
      role="img"
      data-testid="lab-big-ice-page"
      aria-label={zh ? "大塊冰的接觸面積比碎冰小" : "A big piece has less contact area than crushed ice"}
    >
      <text className="compare-title" x="70" y="48">
        {zh ? "一大塊" : "One big piece"}
      </text>
      <text className="compare-title" x="790" y="48">
        {zh ? "碎冰" : "Crushed ice"}
      </text>
      <line className="compare-split" x1="730" y1="28" x2="730" y2="536" />

      <g>
        <polygon className="compare-ice" points="330,246 560,210 620,360 400,460 220,360 286,268" />
        <Coil x={268} y={180} />
        <Touch cx={328} cy={248} />
        <text className="tag tag-hot" x="400" y="150">
          {zh ? "加熱器" : "Heater"}
        </text>
        <text className="compare-note" x="70" y="500">
          {zh ? "接觸面積" : "Contact area"}
        </text>
        <rect className="compare-bar" x="250" y="482" width="36" height="22" rx="4" />
        <text className="compare-less" x="300" y="500">
          {zh ? "較小" : "Smaller"}
        </text>
      </g>

      <g>
        <polygon className="compare-ice" points="900,118 1000,96 1036,158 930,172" />
        <polygon className="compare-ice" points="860,186 978,170 986,228 868,246" />
        <polygon className="compare-ice" points="852,252 980,236 992,312 846,324" />
        <polygon className="compare-ice" points="1004,258 1148,248 1124,372 972,352" />
        <polygon className="compare-ice" points="1088,150 1220,132 1236,236 1100,228" />
        <polygon className="compare-ice" points="1092,236 1224,250 1196,348 1072,318" />
        <Coil x={988} y={180} />
        <Touch cx={1016} cy={176} />
        <Touch cx={984} cy={206} />
        <Touch cx={986} cy={246} />
        <Touch cx={1036} cy={254} />
        <Touch cx={1072} cy={198} />
        <Touch cx={1074} cy={240} />
        <text className="tag tag-hot" x="1268" y="210">
          {zh ? "加熱器" : "Heater"}
        </text>
        <text className="compare-note" x="790" y="500">
          {zh ? "接觸面積" : "Contact area"}
        </text>
        {Array.from({ length: 6 }, (_, index) => (
          <rect key={index} className="compare-bar" x={980 + index * 44} y="482" width="36" height="22" rx="4" />
        ))}
        <text className="compare-more" x="1252" y="500">
          {zh ? "較大" : "Larger"}
        </text>
      </g>
    </svg>
  );
}

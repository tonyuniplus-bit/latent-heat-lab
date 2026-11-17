export type Locale = "en" | "zh-Hant";

export interface Line {
  en: string;
  zh: string;
}

export interface LabStep {
  title: Line;
  action: Line;
  cautions: Line[];
  see: Line[];
  kind?: "deviations";
}

export interface Deviation {
  id: string;
  title: Line;
  why: Line;
  effect: "high" | "low";
}

export interface Experiment {
  id: "fusion" | "vapor";
  name: Line;
  aim: Line;
  steps: LabStep[];
  deviations: Deviation[];
}

export const EXPERIMENTS: readonly Experiment[] = [
  {
    id: "fusion",
    name: { en: "Fusion of ice", zh: "冰的熔解" },
    aim: {
      en: "ℓf = E / m, with a joulemeter and a control funnel.",
      zh: "ℓf = E / m，用焦耳計和對照漏斗。",
    },
    steps: [
      {
        title: { en: "Both funnels together", zh: "兩個漏斗一起" },
        action: { en: "Funnel A and the control, each over a dry beaker", zh: "漏斗 A 和對照漏斗，各自放在乾燒杯上" },
        cautions: [{ en: "Both beakers start dry", zh: "兩個燒杯一開始都要是乾的" }],
        see: [],
      },
      {
        title: { en: "Ice in both", zh: "兩邊一起加冰" },
        action: { en: "Crushed melting ice goes into both funnels together", zh: "正在熔化的碎冰同時放進兩邊" },
        cautions: [
          { en: "Crush it — better contact with the heater", zh: "要壓碎，才能貼着加熱器" },
          { en: "Already melting — colder ice makes ℓf too high", zh: "必須正在熔化，太冷會令 ℓf 偏大" },
          { en: "Drip rates match before you switch on", zh: "開啟前兩邊滴速要接近" },
        ],
        see: [{ en: "Ice at 0°C", zh: "冰在 0°C" }],
      },
      {
        title: { en: "Heater in A only", zh: "加熱器只放進 A" },
        action: { en: "Lower the heater into funnel A. The control has none", zh: "加熱器只放進漏斗 A，對照沒有加熱器" },
        cautions: [{ en: "Ice must cover the whole coil", zh: "冰要蓋住整條發熱圈" }],
        see: [],
      },
      {
        title: { en: "Switch on A", zh: "只開 A" },
        action: { en: "Both keep dripping. A is faster; B is only the room", zh: "兩邊繼續滴。A 較快，B 只受室溫" },
        cautions: [
          { en: "Read the joulemeter at start and finish", zh: "開始和結束都要讀焦耳計" },
          { en: "Add ice if the coil becomes exposed", zh: "發熱圈露出來就要加冰" },
        ],
        see: [
          { en: "Start 23 876 J", zh: "初讀數 23 876 J" },
          { en: "End 40 896 J", zh: "末讀數 40 896 J" },
        ],
      },
      {
        title: { en: "Same rate again", zh: "滴速再接近" },
        action: { en: "Switch off. Wait until both drip slowly, then remove the beakers", zh: "關掉。兩邊滴速再接近才拿走燒杯" },
        cautions: [{ en: "B is what the room melted", zh: "B 是房間熔掉的冰" }],
        see: [
          { en: "A + water 0.14 kg", zh: "A 加水 0.14 kg" },
          { en: "B + water 0.09 kg", zh: "B 加水 0.09 kg" },
        ],
      },
      {
        title: { en: "Result", zh: "結果" },
        action: { en: "Subtract the control, then E / m", zh: "減去對照，再算 E / m" },
        cautions: [{ en: "Do not use the whole 0.14 kg", zh: "不要用整個 0.14 kg" }],
        see: [
          { en: "E = 17 020 J", zh: "E = 17 020 J" },
          { en: "m = 0.05 kg", zh: "m = 0.05 kg" },
          { en: "ℓf = 3.4 × 10⁵ J/kg", zh: "ℓf = 3.4 × 10⁵ J/kg" },
        ],
      },
      {
        title: { en: "What shifts the result", zh: "什麼令結果偏差" },
        action: { en: "Press Show and watch that case on the bench", zh: "按「看看」，在實驗桌上觀看" },
        cautions: [],
        see: [],
        kind: "deviations",
      },
    ],
    deviations: [
      {
        id: "cold",
        title: { en: "Ice below 0°C", zh: "冰低於 0°C" },
        why: { en: "Some energy only warms the ice", zh: "一部分能量只用來升溫" },
        effect: "high",
      },
      {
        id: "room",
        title: { en: "Heat from the room", zh: "房間的熱" },
        why: { en: "Extra ice melts, so m is too big", zh: "多熔了冰，m 偏大" },
        effect: "low",
      },
    ],
  },
  {
    id: "vapor",
    name: { en: "Vaporization of water", zh: "水的汽化" },
    aim: {
      en: "ℓv = Pt / m. Two beakers; only A has the 500 W heater.",
      zh: "ℓv = Pt / m。兩個燒杯，只有 A 有 500 W 加熱器。",
    },
    steps: [
      {
        title: { en: "Both beakers together", zh: "兩個燒杯一起" },
        action: { en: "Beaker A and the control, each on a balance", zh: "燒杯 A 和對照燒杯，各自放在天平上" },
        cautions: [{ en: "Do not knock the balance", zh: "不要碰撞天平" }],
        see: [],
      },
      {
        title: { en: "Wrap both, no lid", zh: "兩邊包住，不要加蓋" },
        action: { en: "Insulation around both beakers", zh: "兩個燒杯側面都加上保溫" },
        cautions: [
          { en: "Less heat escapes to the room", zh: "減少熱散到房間" },
          { en: "A lid sends steam back in", zh: "加蓋會令蒸氣掉回去" },
        ],
        see: [],
      },
      {
        title: { en: "Heater in A only", zh: "加熱器只放進 A" },
        action: { en: "Lower the 500 W coil into A. The control has none", zh: "500 W 發熱圈只放進 A，對照沒有加熱器" },
        cautions: [{ en: "The whole coil must be under water", zh: "整條發熱圈要在水面下" }],
        see: [{ en: "P = 500 W", zh: "P = 500 W" }],
      },
      {
        title: { en: "Start at boiling", zh: "沸騰才開始" },
        action: { en: "Read A's balance and start the watch together", zh: "同時讀 A 的天平和開秒錶" },
        cautions: [{ en: "Not while the water is still warming", zh: "水還在升溫時不要開始" }],
        see: [
          { en: "652.1 g", zh: "652.1 g" },
          { en: "t = 0", zh: "t = 0" },
        ],
      },
      {
        title: { en: "Boil for 2 min", zh: "沸騰 2 分鐘" },
        action: { en: "A boils. The control is not heated", zh: "A 沸騰。對照沒有加熱" },
        cautions: [
          { en: "Drops jumping out → result too low", zh: "水點跳出 → 結果偏小" },
          { en: "Steam dripping back → result too high", zh: "蒸氣滴回 → 結果偏大" },
        ],
        see: [
          { en: "t = 2 min", zh: "t = 2 分鐘" },
          { en: "627.3 g", zh: "627.3 g" },
        ],
      },
      {
        title: { en: "Result", zh: "結果" },
        action: { en: "E = Pt, m = loss in mass", zh: "E = Pt，m = 減少的質量" },
        cautions: [{ en: "Higher than the standard 2.26 × 10⁶", zh: "高於標準值 2.26 × 10⁶" }],
        see: [
          { en: "E = 60 000 J", zh: "E = 60 000 J" },
          { en: "m = 0.0248 kg", zh: "m = 0.0248 kg" },
          { en: "ℓv = 2.42 × 10⁶ J/kg", zh: "ℓv = 2.42 × 10⁶ J/kg" },
        ],
      },
      {
        title: { en: "What shifts the result", zh: "什麼令結果偏差" },
        action: { en: "Press Show and watch that case on the bench", zh: "按「看看」，在實驗桌上觀看" },
        cautions: [],
        see: [],
        kind: "deviations",
      },
    ],
    deviations: [
      {
        id: "loss",
        title: { en: "Heat lost to the room", zh: "熱散到房間" },
        why: { en: "The heater supplies extra energy", zh: "加熱器要多供能量" },
        effect: "high",
      },
      {
        id: "back",
        title: { en: "Steam drips back", zh: "蒸氣滴回去" },
        why: { en: "The balance hardly falls", zh: "天平幾乎沒有下降" },
        effect: "high",
      },
      {
        id: "jump",
        title: { en: "Drops jump out", zh: "水點跳出" },
        why: { en: "Liquid leaves, not steam", zh: "離開的是液體，不是蒸氣" },
        effect: "low",
      },
      {
        id: "lid",
        title: { en: "A lid", zh: "加蓋" },
        why: { en: "Vapour condenses and falls back", zh: "蒸氣凝結後掉回去" },
        effect: "high",
      },
    ],
  },
];

export function say(line: Line, locale: Locale): string {
  return locale === "zh-Hant" ? line.zh : line.en;
}

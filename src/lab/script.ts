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
        title: { en: "Heaters in both", zh: "兩邊都放下加熱器" },
        action: { en: "Lower a heater into each funnel. Only A's is switched on", zh: "兩個漏斗都放下加熱器。只有 A 開啟" },
        cautions: [
          { en: "Ice must cover the whole coil", zh: "冰要蓋住整條發熱圈" },
          { en: "The water already in the beakers will be thrown away", zh: "燒杯裡已有的水稍後要倒掉" },
        ],
        see: [],
      },
      {
        title: { en: "Throw the water and switch on", zh: "倒掉水並開啟" },
        action: { en: "Throw the drip water away. Put empty beakers under both funnels and switch on A", zh: "倒掉滴下水。兩邊同時放上空燒杯，並開啟 A" },
        cautions: [
          { en: "The empty beakers and A's heater start together", zh: "空燒杯和 A 的加熱器同一刻開始" },
          { en: "The control heater stays off", zh: "對照的加熱器保持關閉" },
          { en: "Read the joulemeter at start and finish", zh: "開始和結束都要讀焦耳計" },
          { en: "Add ice if the coil becomes exposed", zh: "發熱圈露出來就要加冰" },
        ],
        see: [
          { en: "Start 0 J", zh: "初讀數 0 J" },
          { en: "End 17 020 J", zh: "末讀數 17 020 J" },
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
        why: { en: "It reaches 0°C quickly, then the heater keeps melting it", zh: "很快升到 0°C，加熱器仍繼續熔化" },
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
      en: "ℓv = Pt / m. Both beakers have a heater; only A is on.",
      zh: "ℓv = Pt / m。兩個燒杯都有加熱器，只有 A 開啟。",
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
        title: { en: "Heaters in both", zh: "兩邊都放下加熱器" },
        action: { en: "Lower a 500 W coil into each beaker. Leave both switched off", zh: "兩個燒杯都放下 500 W 發熱圈。兩邊都先關閉" },
        cautions: [{ en: "The whole coil must be under water", zh: "整條發熱圈要在水面下" }],
        see: [{ en: "P = 500 W", zh: "P = 500 W" }],
      },
      {
        title: { en: "Both at 100°C", zh: "兩邊都是 100°C" },
        action: { en: "Both thermometers read 100°C. The heaters are still off", zh: "兩個溫度計都是 100°C。加熱器都還未開啟" },
        cautions: [
          { en: "No boiling yet", zh: "這時還未沸騰" },
          { en: "The control is at 100°C too", zh: "對照也是 100°C" },
        ],
        see: [{ en: "Both 652.1 g", zh: "兩邊都是 652.1 g" }],
      },
      {
        title: { en: "Switch on and boil", zh: "開啟並沸騰" },
        action: { en: "Switch on A's heater. Boiling starts and the watch runs for 2 min", zh: "開啟 A 的加熱器。開始沸騰，秒錶走 2 分鐘" },
        cautions: [
          { en: "The control heater stays off", zh: "對照的加熱器保持關閉" },
          { en: "The control loses a little by evaporation", zh: "對照因蒸發少了一點" },
          { en: "Drops jumping out → result too low", zh: "水點跳出 → 結果偏小" },
          { en: "Steam dripping back → result too high", zh: "蒸氣滴回 → 結果偏大" },
          { en: "The result still uses only A's loss", zh: "結果仍然只用 A 的減少" },
        ],
        see: [
          { en: "t = 2 min", zh: "t = 2 分鐘" },
          { en: "A 627.3 g", zh: "A 627.3 g" },
          { en: "B 651.2 g", zh: "B 651.2 g" },
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
        id: "warm",
        title: { en: "Water below 100°C", zh: "水低於 100°C" },
        why: { en: "It rises from 80°C to 100°C, then boils", zh: "由 80°C 升到 100°C 才沸騰" },
        effect: "high",
      },
      {
        id: "back",
        title: { en: "Steam drips back", zh: "蒸氣滴回去" },
        why: { en: "From the lid, back onto the balance", zh: "從蓋上滴回天平" },
        effect: "high",
      },
      {
        id: "jump",
        title: { en: "Drops jump out", zh: "水點跳出" },
        why: { en: "Liquid leaves, not steam", zh: "離開的是液體，不是蒸氣" },
        effect: "low",
      },
    ],
  },
];

export function say(line: Line, locale: Locale): string {
  return locale === "zh-Hant" ? line.zh : line.en;
}

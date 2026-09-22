export type ModelKey = "pa19" | "pa20" | "pa43" | "pa04" | "pa14" | "pacrc03";

export interface ModelInfo {
  url: string;
  code: string;
  name: string;
  /** Short label for rails, tags and in-scene captions. */
  short: string;
  kind: "bottle" | "closure";
  blurb: string;
  chips: string[];
  /** Measured from the CAD source, in millimetres. */
  heightMm: number;
  diameterMm: number;
  neck: string;
  material: string;
}

const model = (file: string) => `${import.meta.env.BASE_URL}models/${file}`;

/**
 * The GLBs are exported at true scale (metres, Y-up, base centred on the origin),
 * so scenes can stand them side by side without any per-model normalisation.
 */
export const MODELS: Record<ModelKey, ModelInfo> = {
  pa19: {
    url: model("pa19-30cc.glb"),
    code: "PA19",
    name: "30 cc HDPE Bottle",
    short: "30 cc",
    kind: "bottle",
    blurb:
      "Our most compact round for low-count oral solid dosage packs — moulded and 100% visually inspected under ISO Class 8 cleanroom conditions.",
    chips: ["HDPE", "30 cc", "SP 400 thread"],
    heightMm: 54.5,
    diameterMm: 37,
    neck: "28 mm",
    material: "HDPE",
  },
  pa20: {
    url: model("pa20-40cc.glb"),
    code: "PA20",
    name: "40 cc HDPE Bottle",
    short: "40 cc",
    kind: "bottle",
    blurb:
      "A wide 33 mm neck on a small-format body, built for fast, clean filling of tablets and capsules on high-speed lines.",
    chips: ["HDPE", "40 cc", "33 mm neck"],
    heightMm: 59.5,
    diameterMm: 38,
    neck: "33 mm",
    material: "HDPE",
  },
  pa43: {
    url: model("pa43-120cc.glb"),
    code: "PA43",
    name: "120 cc HDPE Bottle",
    short: "120 cc",
    kind: "bottle",
    blurb:
      "A slim, tall round with a 38 mm neck — pairs directly with our 38 mm child-resistant closure.",
    chips: ["HDPE", "120 cc", "38 mm neck"],
    heightMm: 96,
    diameterMm: 47.5,
    neck: "38 mm",
    material: "HDPE",
  },
  pa04: {
    url: model("pa04-150cc.glb"),
    code: "PA04",
    name: "150 cc HDPE Bottle",
    short: "150 cc",
    kind: "bottle",
    blurb:
      "The workhorse of the range. A 38 mm neck and generous label panel for mid-count prescription and OTC packs.",
    chips: ["HDPE", "150 cc", "38 mm neck"],
    heightMm: 94,
    diameterMm: 55.5,
    neck: "38 mm",
    material: "HDPE",
  },
  pa14: {
    url: model("pa14-950cc.glb"),
    code: "PA14",
    name: "950 cc HDPE Bottle",
    short: "950 cc",
    kind: "bottle",
    blurb:
      "High-capacity round with a 53 mm neck for bulk counts and institutional packs — the same cleanroom standard at thirty times the volume.",
    chips: ["HDPE", "950 cc", "53 mm neck"],
    heightMm: 165,
    diameterMm: 98.5,
    neck: "53 mm",
    material: "HDPE",
  },
  pacrc03: {
    url: model("pacrc03-38mm.glb"),
    code: "PACRC03",
    name: "38 mm CR Closure",
    short: "38 mm CRC",
    kind: "closure",
    blurb:
      "Two-piece push-and-turn child-resistant closure with liner, engineered to meet US 16 CFR 1700.20 requirements.",
    chips: ["PP", "38 mm", "Child-Resistant"],
    heightMm: 17.5,
    diameterMm: 45,
    neck: "Fits 38 mm",
    material: "PP",
  },
};

/** Bottles in ascending capacity — the order used wherever the family stands together. */
export const BOTTLE_KEYS: ModelKey[] = ["pa19", "pa20", "pa43", "pa04", "pa14"];
export const ALL_KEYS: ModelKey[] = [...BOTTLE_KEYS, "pacrc03"];

/** Scene units per metre: 1 unit = 10 cm keeps camera maths in a comfortable range. */
export const WORLD_SCALE = 10;
export const unitsOf = (mm: number) => (mm / 1000) * WORLD_SCALE;

/** Height at which PACRC03's origin sits when fully threaded onto PA04 (liner on the lip). */
export const PA04_CAP_SEAT_Y = 0.812;

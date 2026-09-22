import { ALL_KEYS } from "./pa-models";
import { clamp01, range, smooth } from "./scroll";

// Shared by the showroom's DOM shell and its (lazily loaded) WebGL scene, so both agree on
// where each product sits along the scroll without the shell importing three.js.

export const STEPS = ALL_KEYS.length;

/** Scroll positions: one per product, plus a final stretch that pulls the closure apart. */
export const TRAVEL = STEPS - 1 + 0.9;

/** Track progress (0..1) → continuous position along the shelf (0 … TRAVEL). */
export const positionOf = (progress: number) => clamp01(progress) * TRAVEL;

/** Continuous scroll position → how far the closure is pulled apart (0 assembled, 1 apart). */
export const explodeAt = (pos: number) => smooth(range(pos, STEPS - 1 + 0.12, STEPS - 1 + 0.68));

export interface TurnState {
  /** Extra yaw the visitor has dragged onto the focused product, in radians. */
  value: number;
  /** Timestamp until which the idle turntable stays paused. */
  until: number;
}

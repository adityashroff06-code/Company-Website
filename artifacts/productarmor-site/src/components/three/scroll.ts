import { useEffect, useRef, useState, type RefObject } from "react";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Progress of `p` through the window [a, b], clamped to 0..1. */
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Tailwind's `lg` breakpoint: below it, stage copy stacks under the scene instead of beside it. */
export const STACKED_BELOW = 1024;

/**
 * Whether to mount the scroll-driven WebGL stages at all. Visitors who prefer reduced motion,
 * or whose browser cannot create a WebGL context, get the classic static layout instead.
 * Lives here (not in Stage) so pages can ask without pulling three.js into the main bundle.
 */
export function supportsImmersive() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export interface ScrollState {
  /** 0 → 1 across the element's sticky travel (its height minus one viewport). */
  progress: number;
  /** Pointer position in -1..1 viewport space, for parallax. */
  pointerX: number;
  pointerY: number;
}

/**
 * Tracks how far a tall "scroll track" element has travelled past the top of the viewport.
 * Native scrolling is left untouched — the value lives in a ref so per-frame consumers
 * (the WebGL scene, caption styles) can read it without re-rendering React.
 */
export function useScrollState(track: RefObject<HTMLElement | null>) {
  const state = useRef<ScrollState>({ progress: 0, pointerX: 0, pointerY: 0 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      state.current.progress = travel > 0 ? clamp01(-rect.top / travel) : 0;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    const onPointer = (e: PointerEvent) => {
      state.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      state.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    measure();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [track]);

  return state;
}

/**
 * True while the element is on (or near) screen — used to park render loops and video.
 * `initial` is what to assume before the observer first reports: stages that must paint
 * immediately start `true`; anything that should wait to load starts `false`.
 */
export function useInView(ref: RefObject<HTMLElement | null>, rootMargin = "0px", initial = true) {
  const [inView, setInView] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => setInView(entries[entries.length - 1].isIntersecting),
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Scroll the page so a track sits at `progress` (0..1) of its sticky travel. */
export function scrollTrackTo(track: HTMLElement, progress: number, behavior: ScrollBehavior = "smooth") {
  const travel = track.offsetHeight - window.innerHeight;
  const top = track.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + travel * clamp01(progress), behavior });
}

/**
 * Drives caption layers from scroll without React renders. Each child marked with
 * `data-from` / `data-to` (and optional `data-hold="start|end"`) fades and drifts in over
 * its window. Layers stay in the accessibility tree and tab order at all times; if keyboard
 * focus lands inside one that is currently faded out, the page scrolls to bring it on stage.
 */
export function useScrollCaptions(
  root: RefObject<HTMLElement | null>,
  state: RefObject<ScrollState>,
  active: boolean,
) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // Optional per-layer tuning: data-fade (window length, in progress units) and data-drift (px).
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-from]")).map((node) => ({
      node,
      from: Number(node.dataset.from),
      to: Number(node.dataset.to),
      hold: node.dataset.hold ?? "",
      fade: Number(node.dataset.fade ?? 0.035),
      drift: Number(node.dataset.drift ?? 28),
      last: -1,
    }));

    // Browsers re-dispatch focusin on the active element when the window or tab regains focus;
    // that is not the visitor moving focus, so it must never scroll the page.
    let restoring = false;
    const onWindowBlur = () => {
      restoring = true;
    };
    const onWindowFocus = () => {
      setTimeout(() => {
        restoring = false;
      }, 0);
    };
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focus", onWindowFocus);

    const onFocus = (e: FocusEvent) => {
      if (restoring) return;
      const target = e.target as HTMLElement | null;
      const layer = layers.find((l) => target && l.node.contains(target));
      const track = el.parentElement;
      if (!layer || !track || layer.last > 0.6) return;
      // "instant", not "auto": the site sets `scroll-behavior: smooth`, and focus must not lag.
      scrollTrackTo(track, layer.hold === "start" ? 0 : layer.from + layer.fade + 0.01, "instant");
    };
    el.addEventListener("focusin", onFocus);

    let raf = 0;
    const tick = () => {
      const p = state.current?.progress ?? 0;
      for (const l of layers) {
        const fadeIn = l.hold === "start" ? 1 : smooth(range(p, l.from, l.from + l.fade));
        const fadeOut = l.hold === "end" ? 1 : 1 - smooth(range(p, l.to - l.fade, l.to));
        const o = Math.min(fadeIn, fadeOut);
        if (Math.abs(o - l.last) < 0.002 && !(o === 0 && l.last !== 0) && !(o === 1 && l.last !== 1)) continue;
        l.last = o;
        const drift = (fadeIn < 1 ? 1 - fadeIn : -(1 - fadeOut)) * l.drift;
        l.node.style.opacity = o.toFixed(3);
        l.node.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0)`;
        l.node.style.pointerEvents = o > 0.6 ? "auto" : "none";
      }
      raf = requestAnimationFrame(tick);
    };
    if (active) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("focusin", onFocus);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", onWindowFocus);
    };
  }, [root, state, active]);
}

export interface StageBands {
  /** Bumped whenever any band moves, so per-frame readers know to re-frame. */
  version: number;
  /** Top and bottom of each `[data-band]` element, as fractions of the stage height. */
  bands: Record<string, { top: number; bottom: number }>;
  /** Stage height in CSS pixels at the last measurement. */
  height: number;
  /**
   * True when the copy stacks under the scene. Read from the same media query the `lg:` classes
   * use (viewport width, scrollbar included) — the canvas width excludes the scrollbar, so the
   * scene must not decide this from its own size or the two disagree just below the breakpoint.
   */
  stacked: boolean;
}

const isStacked = () =>
  typeof window !== "undefined" && !window.matchMedia(`(min-width: ${STACKED_BELOW}px)`).matches;

/**
 * Measures where marked blocks of copy sit inside a stage, so the WebGL scene can seat its
 * subject in the space the copy leaves free — whatever the screen size or headline length.
 * Uses offset geometry, so caption fade/drift transforms never disturb the reading.
 */
export function useStageBands(stage: RefObject<HTMLElement | null>) {
  const bands = useRef<StageBands>({ version: 0, bands: {}, height: 0, stacked: isStacked() });

  useEffect(() => {
    const root = stage.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-band]"));
    const measure = () => {
      const height = root.offsetHeight || 1;
      const next: StageBands["bands"] = {};
      for (const node of nodes) {
        let top = 0;
        let walk: HTMLElement | null = node;
        while (walk && walk !== root) {
          top += walk.offsetTop;
          walk = walk.offsetParent as HTMLElement | null;
        }
        next[node.dataset.band ?? ""] = { top: top / height, bottom: (top + node.offsetHeight) / height };
      }
      const prev = bands.current;
      const stacked = isStacked();
      const moved =
        prev.height !== height ||
        prev.stacked !== stacked ||
        Object.keys(next).some((k) => {
          const a = prev.bands[k];
          const b = next[k];
          return !a || Math.abs(a.top - b.top) > 0.004 || Math.abs(a.bottom - b.bottom) > 0.004;
        });
      if (moved) bands.current = { version: prev.version + 1, bands: next, height, stacked };
    };
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    nodes.forEach((n) => ro.observe(n));
    const mql = window.matchMedia(`(min-width: ${STACKED_BELOW}px)`);
    mql.addEventListener("change", measure);
    measure();
    return () => {
      ro.disconnect();
      mql.removeEventListener("change", measure);
    };
  }, [stage]);

  return bands;
}

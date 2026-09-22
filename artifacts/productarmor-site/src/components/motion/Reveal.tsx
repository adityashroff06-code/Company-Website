/**
 * Reveal — the site's one scroll-reveal, on framer-motion (brief §4.4, design-system §5.2).
 *
 * Every <Reveal> watches its own element and, once a quarter of it is on screen, animates
 * opacity 0→1, y 16→0, scale 0.985→1 over --dur-reveal on --ease-out. A <RevealGroup> parent
 * staggers siblings that enter together by 60 ms. Under prefers-reduced-motion: reduce both
 * render their children unanimated, with no inline style at all.
 *
 * Why each element observes itself instead of inheriting a parent's whileInView: framer only
 * propagates variants to children that exist when the parent enters view, and most of this
 * site's lists mount after a CMS fetch. Per-element observers fire immediately for content
 * that arrives already on screen, so nothing can be left invisible.
 *
 * Why the animation features load lazily: framer's domAnimation bundle is ~14 KB gz and the
 * entry has a 180 KB budget (brief §7). A Reveal that mounts before the chunk arrives mounts
 * static and visible (initial={false}); once the features are in, it snaps to hidden only if
 * it has not been on screen yet, and reveals normally from there. Whatever the visitor saw
 * before the chunk arrived is never touched, nothing remounts, and a slow or failed chunk
 * hides nothing.
 *
 * Scroll position is never read here. The pinned 3D stages keep their ref-and-rAF pattern
 * (three/scroll.ts) and Reveal never touches it.
 */
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { LazyMotion, m, useReducedMotion } from "framer-motion";

const loadFeatures = () => import("./features").then((mod) => mod.default);
const MotionReadyContext = createContext(false);

/** Mount once around the app. `strict` guarantees nothing imports the full `motion` bundle. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    loadFeatures().then(
      () => {
        if (alive) setReady(true);
      },
      () => {
        /* the features never arrived: every Reveal simply stays a plain element */
      },
    );
    return () => {
      alive = false;
    };
  }, []);
  return (
    <MotionReadyContext.Provider value={ready}>
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionReadyContext.Provider>
  );
}

/* ── Timing: --dur-reveal and --ease-out, read from the stylesheet so index.css stays the
      single source of truth. The fallback is the same pair of values. ─────────────────── */
type Curve = [number, number, number, number];
type Timing = { duration: number; ease: Curve };
const FALLBACK: Timing = { duration: 0.56, ease: [0.22, 1, 0.36, 1] };
let cached: Timing | null = null;

function revealTiming(): Timing {
  if (cached) return cached;
  if (typeof window === "undefined") return FALLBACK;
  const root = getComputedStyle(document.documentElement);
  const rawDuration = root.getPropertyValue("--dur-reveal").trim();
  const n = parseFloat(rawDuration);
  const curve = root.getPropertyValue("--ease-out").match(/-?\d*\.?\d+/g)?.map(Number);
  const durationOk = Number.isFinite(n) && n > 0;
  const curveOk = curve !== undefined && curve.length === 4;
  const timing: Timing = {
    duration: durationOk ? (rawDuration.endsWith("ms") ? n / 1000 : n) : FALLBACK.duration,
    ease: curveOk ? (curve as Curve) : FALLBACK.ease,
  };
  // Cache only a complete read; a stylesheet that has not applied yet is retried on the next call.
  if (durationOk && curveOk) cached = timing;
  return timing;
}

const HIDDEN = { opacity: 0, y: 16, scale: 0.985 };
const VISIBLE = { opacity: 1, y: 0, scale: 1 };

/* ── Group stagger ─────────────────────────────────────────────────────────────────────── */
type Group = { nextDelay(): number };
const GroupContext = createContext<Group | null>(null);

/**
 * Siblings whose observers fire within 150 ms of each other are one batch and are staggered;
 * an element that enters on its own later starts a new batch with no delay.
 */
function createGroup(stagger: number, cap: number): Group {
  let last = -Infinity;
  let count = 0;
  return {
    nextDelay() {
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      if (now - last > 150) count = 0;
      last = now;
      return Math.min(count++, cap) * stagger;
    },
  };
}

/**
 * True once `amount` of the element has been on screen — or, for an element taller than two
 * viewports, half a viewport of it, since a pure fraction could never be reached. Fires
 * immediately for elements that mount already in view. Disconnects after the first entry.
 */
function useEnteredView(ref: RefObject<HTMLElement | null>, amount: number, active: boolean) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!active || entered) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setEntered(true);
      return;
    }
    const height = el.getBoundingClientRect().height;
    const viewport = window.innerHeight || 0;
    const threshold =
      height > 0 && viewport > 0 ? Math.max(0, Math.min(amount, (viewport * 0.5) / height)) : amount;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio >= threshold - 0.01)) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount, active, entered]);
  return entered;
}

/* ── Components ────────────────────────────────────────────────────────────────────────── */
export type RevealTag =
  | "div"
  | "section"
  | "article"
  | "li"
  | "ul"
  | "ol"
  | "figure"
  | "p"
  | "span"
  | "header"
  | "footer"
  | "aside"
  | "nav"
  | "form"
  | "dl";

export interface RevealProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "style" | "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
  > {
  /** Rendered element; the animation is on this element itself. */
  as?: RevealTag;
  /** Extra delay in seconds, added to any group stagger. */
  delay?: number;
  /** Fraction of the element that must be on screen before it reveals (brief: 0.25). */
  amount?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Reveal({ as = "div", delay = 0, amount = 0.25, style, children, ...rest }: RevealProps) {
  const ready = useContext(MotionReadyContext);
  const reduced = useReducedMotion() === true;
  const group = useContext(GroupContext);
  const ref = useRef<HTMLElement>(null);
  const entered = useEnteredView(ref, amount, !reduced);
  // Fixed once, at mount: an element that mounts before the animation features arrived is
  // shown static (initial={false}) rather than hidden, so a slow chunk never blanks the page.
  const staticMountRef = useRef<boolean | null>(null);
  if (staticMountRef.current === null) staticMountRef.current = !ready;
  // The delay is fixed at the moment the element enters view, so a group can stagger exactly
  // the siblings that arrived together.
  const delayRef = useRef<number | null>(null);
  if (entered && delayRef.current === null) delayRef.current = delay + (group?.nextDelay() ?? 0);

  if (reduced) {
    return createElement(as, { ref, style, ...rest }, children);
  }

  const Tag = m[as] as typeof m.div;
  const { duration, ease } = revealTiming();
  const staticMount = staticMountRef.current === true;
  // Visible while the features are pending, and once the element has entered. A static-mounted
  // element that has not entered by the time the features land is hidden instantly — it is
  // off screen by definition — and then reveals like any other.
  const visible = entered || !ready;
  const snapHidden = staticMount && ready && !entered;
  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement>}
      style={style}
      initial={staticMount ? false : HIDDEN}
      animate={visible ? VISIBLE : HIDDEN}
      transition={snapHidden ? { duration: 0 } : { duration, ease, delay: delayRef.current ?? 0 }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export interface RevealGroupProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element — usually the grid or list container. */
  as?: RevealTag;
  /** Seconds between siblings that enter together (brief: 60 ms). */
  stagger?: number;
  /** Longest run of staggered siblings before the delay stops growing. */
  cap?: number;
  children?: ReactNode;
}

/** A container whose <Reveal> descendants are staggered when they enter the viewport together. */
export function RevealGroup({ as: Tag = "div", stagger = 0.06, cap = 8, children, ...rest }: RevealGroupProps) {
  const group = useMemo(() => createGroup(stagger, cap), [stagger, cap]);
  return (
    <GroupContext.Provider value={group}>
      <Tag {...rest}>{children}</Tag>
    </GroupContext.Provider>
  );
}

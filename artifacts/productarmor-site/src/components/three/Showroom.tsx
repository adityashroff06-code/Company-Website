import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Download, Rotate3d } from "lucide-react";
import { R3FErrorBoundary } from "./boundary";
import { MODELS, ALL_KEYS, type ModelKey } from "./pa-models";
import { useScrollState, useInView, useStageBands, scrollTrackTo } from "./scroll";
import { STEPS, TRAVEL, positionOf, explodeAt, type TurnState } from "./showroom-steps";

// Plain DOM only: the spec panel, rail and layout render with the page. The WebGL shelf
// (three.js, all six models) is split off and streamed in behind them.
const ShowroomScene = lazy(() => import("./ShowroomScene"));

const CLOSURE_PARTS = [
  { title: "Outer shell", text: "Push-down overcap that engages only under deliberate pressure." },
  { title: "Inner closure", text: "Threaded PP closure that carries the 38 mm continuous thread." },
  { title: "Wad liner", text: "Compressible liner that seats against the bottle lip." },
];

function SpecPanel({ modelKey, exploded }: { modelKey: ModelKey; exploded: boolean }) {
  const m = MODELS[modelKey];
  const specs = [
    { label: m.kind === "closure" ? "Size" : "Capacity", value: m.short },
    { label: "Neck", value: m.neck },
    { label: "Height", value: `${m.heightMm} mm` },
    { label: "Diameter", value: `${m.diameterMm} mm` },
  ];
  return (
    <div key={modelKey} className="pa-spec-swap">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300 mb-2">{m.code}</p>
      <h3 className="pa-stage-title text-white mb-3">{m.name}</h3>
      <p className="text-sm sm:text-base leading-relaxed text-white/80 mb-5 max-w-md">{m.blurb}</p>
      <dl className="grid grid-cols-4 lg:grid-cols-2 gap-x-4 gap-y-3 lg:gap-y-4 max-w-md border-t border-white/15 pt-4 lg:pt-5">
        {specs.map((s) => (
          <div key={s.label}>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">{s.label}</dt>
            <dd className="text-sm sm:text-lg font-semibold tabular-nums text-white mt-0.5">{s.value}</dd>
          </div>
        ))}
      </dl>
      {m.kind === "closure" && (
        <ol
          className={`hidden lg:block mt-6 space-y-2.5 max-w-md transition-opacity duration-500 ${exploded ? "opacity-100" : "opacity-0"}`}
          aria-hidden={!exploded}
        >
          {CLOSURE_PARTS.map((p, n) => (
            <li key={p.title} className="flex gap-3 text-sm">
              <span className="shrink-0 w-5 h-5 rounded-full border border-white/40 text-[10px] font-semibold text-white/90 flex items-center justify-center mt-0.5">
                {n + 1}
              </span>
              <span className="text-white/80">
                <span className="font-semibold text-white">{p.title}.</span> {p.text}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/*
 * The range as a walk down a shelf: one pinned stage, scroll moves from product to product.
 * Blocks marked `data-band` are measured so that, on stacked (phone/tablet) layouts, the scene
 * seats each product between the header row and the spec panel — whatever their heights.
 */
export default function Showroom() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const state = useScrollState(track);
  const layout = useStageBands(stage);
  const inView = useInView(track, "200px");
  const yaw = useRef<TurnState>({ value: 0, until: 0 });
  const drag = useRef<{ id: number; x: number; base: number } | null>(null);
  const [step, setStep] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [hinted, setHinted] = useState(false);

  // Promote scroll position to React state — setState bails out unless the value changed,
  // so this only re-renders when the focused product (or the exploded flag) actually flips.
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const tick = () => {
      const pos = positionOf(state.current.progress);
      setStep(Math.min(STEPS - 1, Math.round(pos)));
      setExploded(explodeAt(pos) > 0.5);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, state]);

  // Each product gets a fresh turntable.
  useEffect(() => {
    yaw.current.value = 0;
  }, [step]);

  const goTo = (i: number) => {
    if (track.current) scrollTrackTo(track.current, i / TRAVEL, "smooth");
  };

  const active = ALL_KEYS[step];

  return (
    <section
      ref={track}
      className="relative bg-ink-900"
      style={{ height: `${Math.round(TRAVEL * 78 + 100)}vh` }}
      aria-label="Product range, shown at true scale in 3D"
    >
      <div
        ref={stage}
        className="sticky top-0 h-screen supports-[height:100dvh]:h-dvh w-full overflow-hidden pa-backdrop-dark [--pa-backdrop-at:38%_46%]"
      >
        {/* If WebGL or the 3D chunk fails, the spec panel still walks the range on its own. */}
        <div className="absolute inset-0" aria-hidden="true">
          <R3FErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <ShowroomScene state={state} layout={layout} yaw={yaw} active={inView} />
            </Suspense>
          </R3FErrorBoundary>
        </div>

        {/* Drag-to-turn surface over the product. Vertical swipes and the wheel still scroll the page. */}
        <div
          className="absolute inset-x-0 top-16 bottom-[46%] lg:bottom-0 lg:right-[42%] cursor-grab active:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(e) => {
            drag.current = { id: e.pointerId, x: e.clientX, base: yaw.current.value };
            e.currentTarget.setPointerCapture(e.pointerId);
            setHinted(true);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || d.id !== e.pointerId) return;
            yaw.current.value = d.base + (e.clientX - d.x) * 0.012;
            yaw.current.until = Date.now() + 2400;
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
        />

        <div className="absolute inset-0 pt-16 pointer-events-none">
          <div className="relative h-full container-width">
            <div
              data-band="header"
              className="absolute top-[3%] lg:top-[4%] inset-x-4 sm:inset-x-6 lg:inset-x-8 flex items-center justify-between gap-4"
            >
              <div className="section-tag-light mb-0!">The Range · True to Scale</div>
              <div className="text-xs font-semibold tabular-nums text-white/80">
                {String(step + 1).padStart(2, "0")} <span className="text-white/60">/ {String(STEPS).padStart(2, "0")}</span>
              </div>
            </div>

            {/* On phones the panel clears the floating WhatsApp button instead of sitting under it */}
            <div
              data-band="panel"
              className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 bottom-24 sm:bottom-[5%] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-[58%] pointer-events-auto"
            >
              <div aria-live="polite">
                <SpecPanel modelKey={active} exploded={exploded} />
              </div>
              <div className="hidden lg:flex flex-row gap-3 mt-7">
                <Link href="/contact" className="btn-light text-primary">
                  Request a Sample Kit
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/downloads"
                  className="inline-flex items-center gap-2 justify-center px-7 py-3.5 rounded-lg border border-white/25 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all duration-200"
                >
                  Data Sheets
                  <Download size={16} />
                </Link>
              </div>
            </div>

            {/* Rail: where you are on the shelf, and a way to jump along it */}
            <nav
              aria-label="Jump to product"
              className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-1 pointer-events-auto"
            >
              {ALL_KEYS.map((k, i) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === step ? "true" : undefined}
                  className="group flex items-center gap-3 py-1.5 text-left"
                >
                  <span
                    className={`h-px transition-all duration-300 ${i === step ? "w-8 bg-white" : "w-4 bg-white/50 group-hover:w-6 group-hover:bg-white/80"}`}
                  />
                  <span
                    className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${i === step ? "text-white" : "text-white/70 group-hover:text-white"}`}
                  >
                    {MODELS[k].short}
                  </span>
                </button>
              ))}
            </nav>

            <div
              className={`absolute bottom-[3%] left-1/2 lg:left-[29%] -translate-x-1/2 hidden lg:flex items-center gap-2 text-white/70 text-xs font-medium transition-opacity duration-700 ${hinted ? "opacity-0" : "opacity-100"}`}
              aria-hidden="true"
            >
              <Rotate3d size={14} />
              Drag to turn · scroll to walk the range
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

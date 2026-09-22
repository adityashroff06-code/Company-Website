import { lazy, Suspense, useRef, type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { R3FErrorBoundary } from "./boundary";
import { MODELS } from "./pa-models";
import { useScrollState, useScrollCaptions, useInView, useStageBands } from "./scroll";

// Everything in this file is plain DOM, so the headline, copy and layout render with the page.
// Only the WebGL scene (three.js, the models) is split off and streamed in behind it.
const HomeJourneyScene = lazy(() => import("./HomeJourneyScene"));

/*
 * The Home journey: one pinned stage, four chapters of copy, and a 3D scene behind them that
 * native scroll drives from the hero bottle, through capping and the true-to-scale range, into
 * a wall of live line footage. See HomeJourneyScene for the choreography.
 *
 * Blocks marked `data-band` are measured so that, on stacked (phone/tablet) layouts, the scene
 * can seat its subject in whatever space the copy leaves free.
 */
export default function HomeJourney({ hero }: { hero: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const state = useScrollState(track);
  const layout = useStageBands(stage);
  const inView = useInView(track, "200px");
  useScrollCaptions(stage, state, inView);

  return (
    <section
      ref={track}
      className="relative bg-[#07172e]"
      style={{ height: "540vh" }}
      aria-label="Product Armor packaging, from bottle to production line"
    >
      <div ref={stage} className="sticky top-0 h-screen supports-[height:100dvh]:h-dvh w-full overflow-hidden bg-white">
        {/* Backdrop: bright studio for the hero, deepening to navy as you step inside */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_72%_46%,#eaf1fc_0%,#ffffff_62%)]" />
        <div
          data-from="0.09"
          data-to="2"
          data-hold="end"
          data-fade="0.13"
          data-drift="0"
          style={{ opacity: 0 }}
          className="absolute inset-0 bg-[radial-gradient(110%_85%_at_50%_42%,#1d4478_0%,#0f2a4d_48%,#07172e_100%)]"
        />

        {/* The scene — purely visual, so it never intercepts scroll, taps or text selection.
            If WebGL or the 3D chunk fails, the chapters simply play over the backdrop. */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <R3FErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <HomeJourneyScene state={state} layout={layout} active={inView} />
            </Suspense>
          </R3FErrorBoundary>
        </div>

        {/* Legibility scrim for the footage chapter — bright cleanroom footage needs a firm base */}
        <div
          data-from="0.8"
          data-to="2"
          data-hold="end"
          data-fade="0.1"
          data-drift="0"
          style={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(7,23,46,0.97)_0%,rgba(7,23,46,0.82)_36%,rgba(7,23,46,0.3)_68%,rgba(7,23,46,0)_100%)]"
        />

        {/* ── Chapter copy ── */}
        <div className="absolute inset-0 pt-16 pointer-events-none">
          <div className="relative h-full container-width">
            {/* 1 · Hero */}
            <div
              data-from="-1"
              data-to="0.11"
              data-hold="start"
              className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 bottom-[6%] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2"
            >
              <div data-band="hero" className="lg:-translate-y-6 max-w-xl lg:max-w-[46%] mx-auto lg:mx-0 text-center lg:text-left">
                {hero}
              </div>
            </div>

            {/* 2 · Capping */}
            <div
              data-from="0.19"
              data-to="0.43"
              style={{ opacity: 0 }}
              className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 bottom-[8%] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 flex justify-center lg:justify-end"
            >
              <div data-band="cap" className="max-w-md text-center lg:text-left">
                <div className="section-tag-light">{MODELS.pacrc03.code} · Child-Resistant Closure</div>
                <h2 className="pa-stage-title text-white mb-4">Sealed with a push and a turn.</h2>
                <p className="text-white/80 leading-relaxed mb-5">{MODELS.pacrc03.blurb}</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {["38 mm", "Two-piece PP", "Lined", "Matched to PA04 · PA43"].map((c) => (
                    <span key={c} className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white/90">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3 · The range */}
            <div
              data-from="0.5"
              data-to="0.78"
              style={{ opacity: 0 }}
              className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 bottom-[7%] lg:bottom-auto lg:top-[7%] flex justify-center"
            >
              <div data-band="range" className="max-w-4xl text-center">
                <div className="section-tag-light">The Range · True to Scale</div>
                <h2 className="pa-stage-title text-white mb-3">From 30 cc to 950 cc. One standard of care.</h2>
                <p className="text-white/80 leading-relaxed mb-4 max-w-xl mx-auto">
                  Five HDPE bottle formats and a matched child-resistant closure — every one moulded,
                  inspected and packed inside our ISO Class 8 cleanroom.
                </p>
                <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[#a9c4f0] hover:text-white transition-colors">
                  Walk through the range
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* 4 · Into the line */}
            <div
              data-from="0.91"
              data-to="2"
              data-hold="end"
              style={{ opacity: 0 }}
              className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 bottom-[9%]"
            >
              <div className="pa-on-footage max-w-xl">
                <div className="section-tag-light">Inside Our Facility</div>
                <h2 className="pa-stage-title text-white mb-4">Precision, In Motion.</h2>
                <p className="text-white/90 leading-relaxed mb-6">
                  Step inside our ISO Class 8 cleanroom — where bottles and closures are moulded, conveyed,
                  inspected and packed by an automated line that never lets quality slip.
                </p>
                <Link
                  href="/technology"
                  className="inline-flex items-center gap-2 bg-[#07172e]/55 hover:bg-[#07172e]/75 border border-white/30 backdrop-blur text-white font-medium px-7 py-3 rounded-lg transition-all duration-200"
                >
                  Explore Technology
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          data-from="-1"
          data-to="0.05"
          data-hold="start"
          data-drift="0"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-[#4164a8]/70 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">Scroll</span>
          <ChevronDown size={16} className="pa-scroll-cue" />
        </div>
      </div>
    </section>
  );
}

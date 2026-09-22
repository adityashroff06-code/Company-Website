import { useEffect, useRef, useState, type ReactNode } from "react";
import { videoSrc, videoWebm, posterSrc } from "./videos";
import { useScrollState, useScrollCaptions, useInView, range, smooth } from "@/components/three/scroll";

export interface FilmClip {
  /** Path under public/videos/, e.g. "loops/tech-moulding.mp4". */
  file: string;
  /** Poster name under public/videos/posters/, without extension. */
  poster: string;
  tag: string;
  title: string;
  text: string;
}

interface ImmersiveFilmProps {
  clips: FilmClip[];
  ariaLabel: string;
  /** Rendered under the final chapter's copy — a link onward, typically. */
  children?: ReactNode;
}

/**
 * Footage you walk into rather than press play on. The film opens as a window in the page,
 * widens to fill the screen as you scroll, and cuts from clip to clip with the chapters.
 * Always muted, never clickable; it plays only while on screen and rests on its poster
 * frame for visitors who prefer reduced motion.
 */
export default function ImmersiveFilm({ clips, ariaLabel, children }: ImmersiveFilmProps) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const state = useScrollState(track);
  // Starts false: the streams must not attach until the section is genuinely approaching.
  const near = useInView(track, "400px", false);
  const [armed, setArmed] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true,
  );

  // Attach the streams only once the section is approaching.
  useEffect(() => {
    if (near) setArmed(true);
  }, [near]);

  useScrollCaptions(stage, state, near && !reduced);

  const n = clips.length;
  const OPEN = 0.2; // share of the scroll spent widening the window
  const startOf = (k: number) => (k === 0 ? 0 : OPEN + ((1 - OPEN) * k) / n);
  const endOf = (k: number) => (k === n - 1 ? 2 : startOf(k + 1));

  useEffect(() => {
    if (reduced || !near) {
      videos.current.forEach((v) => v?.pause());
      return;
    }
    let raf = 0;
    const tick = () => {
      const p = state.current.progress;
      const open = smooth(range(p, 0, OPEN));
      const f = frame.current;
      if (f) {
        f.style.setProperty("--open", open.toFixed(4));
      }
      videos.current.forEach((v, k) => {
        if (!v) return;
        const o = k === 0 ? 1 : smooth(range(p, startOf(k) - 0.035, startOf(k) + 0.035));
        v.style.opacity = o.toFixed(3);
        const onStage = p > startOf(k) - 0.09 && p < endOf(k) + 0.05;
        if (onStage && v.paused) v.play().catch(() => {});
        else if (!onStage && !v.paused) v.pause();
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near, reduced, armed, n]);

  if (reduced) {
    return (
      <section className="bg-navy section-pad" aria-label={ariaLabel}>
        <div className="container-width grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clips.map((c) => (
            <figure key={c.file} className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5">
              <img src={posterSrc(c.poster)} alt="" loading="lazy" className="w-full aspect-video object-cover" />
              <figcaption className="p-6">
                <div className="section-tag-light">{c.tag}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed text-white/65">{c.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        {children && <div className="container-width mt-10">{children}</div>}
      </section>
    );
  }

  return (
    <section ref={track} className="relative bg-ink-900" style={{ height: `${150 + n * 85}vh` }} aria-label={ariaLabel}>
      <div ref={stage} className="sticky top-0 h-screen supports-[height:100dvh]:h-dvh w-full overflow-hidden">
        <div ref={frame} className="pa-film-frame absolute inset-0 bg-black">
          {clips.map((c, k) => {
            const mp4 = videoSrc(c.file);
            const webm = videoWebm(c.file);
            const blob = mp4.startsWith("blob:");
            return (
              <div key={c.file} className="absolute inset-0">
                {k === 0 && (
                  <img src={posterSrc(c.poster)} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
                )}
                {armed && (
                  <video
                    ref={(el) => {
                      videos.current[k] = el;
                    }}
                    poster={posterSrc(c.poster)}
                    muted
                    loop
                    playsInline
                    preload={k === 0 ? "auto" : "metadata"}
                    disablePictureInPicture
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ opacity: k === 0 ? 1 : 0 }}
                    className="pa-film-video absolute inset-0 w-full h-full object-cover pointer-events-none"
                    {...(blob ? { src: mp4 } : {})}
                  >
                    {!blob && <source src={mp4} type="video/mp4" />}
                    {!blob && webm && <source src={webm} type="video/webm" />}
                  </video>
                )}
              </div>
            );
          })}
          {/* Bright cleanroom footage needs a firm base under the copy to hold contrast */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(7,23,46,0.97)_0%,rgba(7,23,46,0.8)_34%,rgba(7,23,46,0.28)_66%,rgba(7,23,46,0.15)_100%)]" />
        </div>

        <div className="absolute inset-0 pt-16 pointer-events-none">
          <div className="relative h-full container-width">
            {clips.map((c, k) => (
              <div
                key={c.file}
                data-from={k === 0 ? OPEN * 0.55 : startOf(k)}
                data-to={endOf(k)}
                data-hold={k === n - 1 ? "end" : undefined}
                style={{ opacity: 0 }}
                className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 bottom-[10%]"
              >
                <div className="pa-on-footage max-w-xl">
                  <div className="section-tag-light">{c.tag}</div>
                  <h2 className="pa-stage-title text-white mb-4">{c.title}</h2>
                  <p className="text-white/90 leading-relaxed">{c.text}</p>
                  {k === n - 1 && children && <div className="mt-6">{children}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

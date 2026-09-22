import { useEffect, useRef, useState } from "react";

interface AmbientVideoProps {
  src: string;
  /** Optional VP9 fallback for browsers without an H.264 decoder. */
  webmSrc?: string | null;
  poster: string;
  /** Sizing + shape classes for the wrapper — give it an aspect-* class. */
  className?: string;
  /** Small caption chip shown bottom-left. */
  label?: string;
  ariaLabel: string;
}

/**
 * Muted, looping footage that behaves like a premium page element:
 * loads only when near the viewport, plays only while visible, and fades in from
 * its poster. Never clickable: under reduced motion it simply rests on the poster frame.
 */
export default function AmbientVideo({
  src,
  webmSrc,
  poster,
  className = "",
  label,
  ariaLabel,
}: AmbientVideoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true,
  );

  // Load the video element only once the section approaches the viewport.
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        // read the latest entry — transitions can arrive batched
        if (entries[entries.length - 1].isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "320px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play while visible, pause when scrolled away.
  useEffect(() => {
    const el = wrap.current;
    const v = vid.current;
    if (!el || !v || !near) return;
    if (reduced) return;
    // play() can race source selection (React appends <source> children after
    // the element is inserted) — if it fails, load and retry once playable. A rejection caused
    // by our own pause() (AbortError) is not a failure, and nothing restarts while off screen.
    let visible = typeof IntersectionObserver === "undefined";
    const tryPlay = () => {
      v.play().catch((err: unknown) => {
        if ((err as { name?: string } | null)?.name === "AbortError" || !visible) return;
        v.addEventListener(
          "canplay",
          () => {
            if (visible) v.play().catch(() => {});
          },
          { once: true },
        );
        try {
          v.load();
        } catch {
          /* noop */
        }
      });
    };
    if (typeof IntersectionObserver === "undefined") {
      tryPlay();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) tryPlay();
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, reduced]);

  return (
    <div ref={wrap} className={`relative overflow-hidden bg-navy/5 ${className}`}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {near && !reduced && (
        <video
          ref={vid}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={ariaLabel}
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          /* Blob sources (preview builds) are a single known-good stream — attach directly. */
          {...(src.startsWith("blob:") ? { src } : {})}
        >
          {!src.startsWith("blob:") && <source src={src} type="video/mp4" />}
          {webmSrc && <source src={webmSrc} type="video/webm" />}
        </video>
      )}
      {label && (
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-navy/70 backdrop-blur text-white/90 text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#93b4e8]" />
          {label}
        </span>
      )}
    </div>
  );
}

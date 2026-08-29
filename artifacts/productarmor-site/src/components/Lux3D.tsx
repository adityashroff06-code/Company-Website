import { useEffect, useRef, useState } from "react";

/*
 * Lux3D — interactive 3-D imagery toolkit for the luxe design language.
 *
 * TiltFrame: pointer-tracked perspective tilt with a moving specular glare,
 *   a depth-shifted shadow that leans away from the light, and an inner
 *   parallax so the media drifts against the frame. Children marked with
 *   className "lux3d-float" levitate on their own Z-plane.
 * ImageReveal: self-observing scroll reveal — a clip-path curtain sweeps the
 *   image in while it settles from a gentle overzoom.
 *
 * Both are inert for touch pointers and prefers-reduced-motion.
 */

type TiltProps = {
  children: React.ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
  /** glare strength 0..1 */
  glare?: number;
};

export function TiltFrame({ children, className, max = 7, glare = 0.22 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--tilt-y", `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty("--tilt-x", `${(py - 0.5) * -max * 2}deg`);
    el.style.setProperty("--glare-x", `${px * 100}%`);
    el.style.setProperty("--glare-y", `${py * 100}%`);
    el.style.setProperty("--glare-o", String(glare));
    el.style.setProperty("--shadow-x", `${(0.5 - px) * 28}px`);
    el.style.setProperty("--shadow-y", `${(0.5 - py) * 22 + 18}px`);
    el.style.setProperty("--par-x", `${(0.5 - px) * 12}px`);
    el.style.setProperty("--par-y", `${(0.5 - py) * 10}px`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    ["--tilt-x", "--tilt-y", "--par-x", "--par-y"].forEach(v => el.style.setProperty(v, "0"));
    el.style.setProperty("--glare-o", "0");
    el.style.setProperty("--shadow-x", "0px");
    el.style.setProperty("--shadow-y", "18px");
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`lux3d ${className ?? ""}`}>
      <div className="lux3d-inner">
        {children}
        <div className="lux3d-glare" aria-hidden="true" />
      </div>
    </div>
  );
}

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** curtain direction */
  from?: "left" | "right" | "bottom";
  delayMs?: number;
};

export function ImageReveal({ children, className, from = "left", delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  // React state (not classList) so the classes survive parent re-renders,
  // e.g. when the content API resolves after the observer has fired.
  const [stage, setStage] = useState<"pending" | "visible" | "settled">("pending");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let settle: ReturnType<typeof setTimeout>;
    let fired = false;
    const show = () => {
      if (fired) return;
      fired = true;
      setStage("visible");
      // once the curtain finishes, lift the clip so tilt shadows can escape the box
      settle = setTimeout(() => setStage("settled"), 1100 + delayMs);
    };
    if (typeof IntersectionObserver === "undefined") { show(); return; }
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { obs.disconnect(); show(); } }),
      { threshold: 0.18 }
    );
    obs.observe(el);
    // safety net: never leave an image stranded behind the curtain if the
    // observer misbehaves (prerender, hidden tabs, exotic browsers)
    const fallback = setTimeout(show, 3000);
    return () => { obs.disconnect(); clearTimeout(settle); clearTimeout(fallback); };
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`img-reveal img-reveal-${from} ${stage !== "pending" ? "visible" : ""} ${stage === "settled" ? "settled" : ""} ${className ?? ""}`}
      style={delayMs ? ({ "--reveal-delay": `${delayMs}ms` } as React.CSSProperties) : undefined}
    >
      {/* dedicated zoom layer so the settle-zoom never fights the tilt transform */}
      <div className="img-reveal-zoomer">{children}</div>
    </div>
  );
}

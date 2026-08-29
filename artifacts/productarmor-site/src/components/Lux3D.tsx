import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }),
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`img-reveal img-reveal-${from} ${className ?? ""}`}
      style={delayMs ? ({ "--reveal-delay": `${delayMs}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

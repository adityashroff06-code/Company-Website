import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import { ShieldCheck, BadgeCheck } from "lucide-react";
import { CenteredModel, StudioRig, R3FErrorBoundary, usePrefersReducedMotion } from "./Stage";
import { MODELS } from "./pa-models";

useGLTF.preload(MODELS.pa04.url);

function HeroBottle({ animate }: { animate: boolean }) {
  const outer = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const intro = useRef(0);

  useFrame((state, delta) => {
    const o = outer.current;
    const s = spin.current;
    if (!o || !s) return;
    // Entrance: eased scale-up + rise
    intro.current = THREE.MathUtils.damp(intro.current, 1, 2.4, delta);
    const t = intro.current;
    o.scale.setScalar(0.88 + 0.12 * t);
    o.position.y = -0.4 * (1 - t);
    if (animate) {
      // Slow idle turn + cursor parallax, both critically damped
      s.rotation.y += delta * 0.3;
      o.rotation.y = THREE.MathUtils.damp(o.rotation.y, state.pointer.x * 0.26, 2.5, delta);
      o.rotation.x = THREE.MathUtils.damp(o.rotation.x, -state.pointer.y * 0.14, 2.5, delta);
    }
  });

  return (
    <group ref={outer}>
      <Float speed={animate ? 1.15 : 0} rotationIntensity={animate ? 0.25 : 0} floatIntensity={animate ? 0.55 : 0}>
        <group ref={spin}>
          <CenteredModel url={MODELS.pa04.url} size={2.7} />
        </group>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => setInView(entries[entries.length - 1].isIntersecting),
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrap} className="relative h-[340px] sm:h-[420px] lg:h-[540px] w-full select-none" aria-hidden="true">
      <R3FErrorBoundary
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-56 h-56 rounded-full bg-primary/5" />
          </div>
        }
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.2, 5.6], fov: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={inView ? "always" : "never"}
          style={{ touchAction: "pan-y" }}
        >
          <StudioRig shadowY={-1.52} shadowScale={6} shadowOpacity={0.3} />
          <Suspense fallback={null}>
            <HeroBottle animate={!reduced} />
          </Suspense>
        </Canvas>
      </R3FErrorBoundary>

      {/* Floating certification chips */}
      <div className="pa-chip-float absolute top-8 right-2 lg:right-4 hidden sm:flex items-center gap-2 bg-white/75 backdrop-blur border border-border rounded-full px-3.5 py-2 shadow-sm">
        <BadgeCheck size={15} className="text-[#4164a8]" />
        <span className="text-xs font-semibold text-navy">ISO 9001:2015 Certified</span>
      </div>
      <div className="pa-chip-float pa-chip-float-delay absolute bottom-10 left-0 lg:left-2 hidden sm:flex items-center gap-2 bg-white/75 backdrop-blur border border-border rounded-full px-3.5 py-2 shadow-sm">
        <ShieldCheck size={15} className="text-[#4164a8]" />
        <span className="text-xs font-semibold text-navy">Child-Resistant Expertise</span>
      </div>
    </div>
  );
}

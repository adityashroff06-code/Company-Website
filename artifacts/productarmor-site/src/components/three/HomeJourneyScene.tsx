import { Suspense, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { RealModel, StudioRig, FloorGlow, FootageWall, StageLoadBar } from "./Stage";
import { MODELS, BOTTLE_KEYS, PA04_CAP_SEAT_Y, unitsOf, type ModelKey } from "./pa-models";
import { range, smooth, lerp, type ScrollState, type StageBands } from "./scroll";

// The hero pair is needed for first paint; the rest of the family streams in behind it.
useGLTF.preload(MODELS.pa04.url);
useGLTF.preload(MODELS.pacrc03.url);

/*
 * One continuous shot, driven by native scroll:
 *   0.00 – 0.12  hero            the 150 cc bottle, closure hovering above it
 *   0.13 – 0.42  capping         the closure descends and threads onto the neck
 *   0.44 – 0.78  the range       all five bottles stand together at true scale
 *   0.70 – 1.00  into the line   a wall of live line footage rises behind them and the
 *                                camera flies in until the footage is the whole screen
 */

/** Where each bottle stands in the family line-up (scene units, 1 = 10 cm). */
const LINEUP_X: Record<string, number> = {
  pa19: -1.637,
  pa20: -1.041,
  pa43: -0.393,
  pa04: 0.341,
  pa14: 1.33,
};
const HERO_X = LINEUP_X.pa04;
const LINEUP_SPAN = 4.1;

export const JOURNEY_FOV = 30;
const TAN = Math.tan(THREE.MathUtils.degToRad(JOURNEY_FOV / 2));
const WALL = { w: 8, h: 4.5, y: 3.3, z: -3.2 };

const BOTTLE_TOP = unitsOf(MODELS.pa04.heightMm);
const CAP_HEIGHT = unitsOf(MODELS.pacrc03.heightMm);
const CAP_HOVER = 0.42;

interface Shot {
  p: number;
  pos: THREE.Vector3;
  look: THREE.Vector3;
  /** Where the subject sits on screen, as a fraction of the viewport (+x right, +y up). */
  shiftX: number;
  shiftY: number;
}

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/**
 * Stacked layouts (copy under the scene): seat a subject of `height` × `width`, centred on
 * `lookY`, in the screen band between `top` and `bottom` (fractions from the top of the stage).
 * `dir` is the direction from the subject to the camera.
 */
function bandShot(
  p: number,
  at: { x: number; lookY: number; height: number; width: number },
  band: { top: number; bottom: number },
  aspect: number,
  dir: [number, number, number],
): Shot {
  const span = Math.max(0.16, band.bottom - band.top);
  const visible = Math.max(at.height / (span * 0.88), at.width / (0.9 * aspect));
  const dist = visible / (2 * TAN);
  const d = v3(...dir).normalize().multiplyScalar(dist);
  return {
    p,
    pos: v3(at.x + d.x, at.lookY + d.y, d.z),
    look: v3(at.x, at.lookY, 0),
    shiftX: 0,
    shiftY: 0.5 - (band.top + band.bottom) / 2,
  };
}

function shotsFor(aspect: number, layout: StageBands, viewportH: number): Shot[] {
  // Decided by the shell from the CSS breakpoint itself, so scene and copy can never disagree.
  const stacked = layout.stacked;
  // Close enough that the footage wall overfills the viewport at any aspect ratio.
  const wallD = Math.min(WALL.h / (2 * TAN), WALL.w / (2 * TAN * aspect)) * 0.93;
  const wallLook = v3(0, WALL.y, WALL.z);
  const wallShots: Shot[] = [
    { p: 0.87, pos: v3(0, 2.55, stacked ? 6.2 : 5.4), look: wallLook, shiftX: 0, shiftY: 0 },
    { p: 1.0, pos: v3(0, WALL.y, WALL.z + wallD), look: wallLook, shiftX: 0, shiftY: 0 },
  ];

  if (stacked) {
    // The free band runs from under the fixed navbar to just above each chapter's copy.
    const navBottom = 64 / Math.max(1, layout.height || viewportH) + 0.015;
    const above = (name: string, fallback: number) => ({
      top: navBottom,
      bottom: Math.max(navBottom + 0.16, (layout.bands[name]?.top ?? fallback) - 0.04),
    });
    const heroPair = { x: HERO_X, lookY: (BOTTLE_TOP + CAP_HOVER + CAP_HEIGHT) / 2 + 0.03, height: BOTTLE_TOP + CAP_HOVER + CAP_HEIGHT + 0.12, width: 0.75 };
    const capped = { x: HERO_X, lookY: (PA04_CAP_SEAT_Y + CAP_HEIGHT) / 2, height: PA04_CAP_SEAT_Y + CAP_HEIGHT + 0.25, width: 0.75 };
    const lineup = { x: 0, lookY: 1.02, height: 2.2, width: LINEUP_SPAN };
    return [
      bandShot(0.0, heroPair, above("hero", 0.5), aspect, [0, 0.02, 1]),
      bandShot(0.1, heroPair, above("hero", 0.5), aspect, [-0.06, 0.03, 1]),
      bandShot(0.21, capped, above("cap", 0.6), aspect, [0.3, 0.2, 0.93]),
      bandShot(0.42, capped, above("cap", 0.6), aspect, [0.2, 0.14, 0.97]),
      bandShot(0.58, lineup, above("range", 0.62), aspect, [0, 0.05, 1]),
      bandShot(0.72, lineup, above("range", 0.62), aspect, [0.07, 0.06, 1]),
      ...wallShots,
    ];
  }

  // Side by side: hero and capping sit beside their copy; the range stands in the space under
  // its (centred) copy, however many lines the headline wraps to.
  const underRange = { top: Math.min(0.6, (layout.bands.range?.bottom ?? 0.4) + 0.03), bottom: 0.97 };
  const lineup = { x: 0, lookY: 1.02, height: 2.2, width: LINEUP_SPAN };
  return [
    { p: 0.0, pos: v3(HERO_X, 0.78, 3.8), look: v3(HERO_X, 0.68, 0), shiftX: 0.24, shiftY: -0.02 },
    { p: 0.1, pos: v3(HERO_X - 0.35, 0.82, 3.7), look: v3(HERO_X, 0.68, 0), shiftX: 0.24, shiftY: -0.02 },
    { p: 0.21, pos: v3(HERO_X + 1.05, 1.22, 2.25), look: v3(HERO_X, 0.87, 0), shiftX: -0.22, shiftY: 0 },
    { p: 0.42, pos: v3(HERO_X + 0.7, 1.02, 2.7), look: v3(HERO_X, 0.8, 0), shiftX: -0.22, shiftY: 0 },
    bandShot(0.58, lineup, underRange, aspect, [0, 0.035, 1]),
    bandShot(0.72, lineup, underRange, aspect, [0.06, 0.04, 1]),
    ...wallShots,
  ];
}

function JourneyScene({
  state,
  layout,
  active,
}: {
  state: RefObject<ScrollState>;
  layout: RefObject<StageBands>;
  active: boolean;
}) {
  const size = useThree((s) => s.size);

  const world = useRef<THREE.Group>(null);
  const hero = useRef<THREE.Group>(null);
  const heroSpin = useRef<THREE.Group>(null);
  const cap = useRef<THREE.Group>(null);
  const capSpin = useRef<THREE.Group>(null);
  const family = useRef<Record<string, THREE.Group | null>>({});
  const labels = useRef<Record<string, HTMLDivElement | null>>({});

  const rig = useRef({
    ready: false,
    look: new THREE.Vector3(),
    wantPos: new THREE.Vector3(),
    wantLook: new THREE.Vector3(),
    shiftX: 0,
    shiftY: 0,
    intro: 0,
    idleTurn: 0,
    shotsKey: "",
    shots: [] as Shot[],
  });
  const glow = useRef(0);
  const wallOpacity = useRef(0);
  const wallPlaying = useRef(false);

  useFrame(({ camera, clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const p = state.current?.progress ?? 0;
    const r = rig.current;
    const damp = THREE.MathUtils.damp;

    // Re-plan the shots only when the viewport or the measured copy layout changes.
    const bands = layout.current;
    const key = `${size.width}x${size.height}:${bands?.version ?? 0}`;
    if (r.shotsKey !== key && bands) {
      r.shotsKey = key;
      r.shots = shotsFor(size.width / Math.max(1, size.height), bands, size.height);
    }
    const shots = r.shots;
    if (shots.length < 2) return;

    // ── Camera: blend between the two shots that bracket the current progress ──
    let i = 0;
    while (i < shots.length - 2 && p > shots[i + 1].p) i++;
    const a = shots[i];
    const b = shots[i + 1];
    const t = smooth(range(p, a.p, b.p));
    r.wantPos.lerpVectors(a.pos, b.pos, t);
    r.wantLook.lerpVectors(a.look, b.look, t);
    const wantShiftX = lerp(a.shiftX, b.shiftX, t);
    const wantShiftY = lerp(a.shiftY, b.shiftY, t);
    // First frame, or back from a hidden/throttled tab: cut straight to the shot instead of easing.
    if (!r.ready || rawDelta > 0.2) {
      r.ready = true;
      if (rawDelta > 0.2) r.intro = 1;
      camera.position.copy(r.wantPos);
      r.look.copy(r.wantLook);
      r.shiftX = wantShiftX;
      r.shiftY = wantShiftY;
    } else {
      // A little inertia turns stepped wheel input into one continuous move.
      const k = 5.5;
      camera.position.set(
        damp(camera.position.x, r.wantPos.x, k, delta),
        damp(camera.position.y, r.wantPos.y, k, delta),
        damp(camera.position.z, r.wantPos.z, k, delta),
      );
      r.look.set(
        damp(r.look.x, r.wantLook.x, k, delta),
        damp(r.look.y, r.wantLook.y, k, delta),
        damp(r.look.z, r.wantLook.z, k, delta),
      );
      r.shiftX = damp(r.shiftX, wantShiftX, k, delta);
      r.shiftY = damp(r.shiftY, wantShiftY, k, delta);
    }
    camera.lookAt(r.look);
    // Re-frame the subject beside (or above) the copy without swinging the camera off-axis.
    (camera as THREE.PerspectiveCamera).setViewOffset(
      size.width,
      size.height,
      -r.shiftX * size.width,
      r.shiftY * size.height,
      size.width,
      size.height,
    );

    // ── Hero bottle: eased entrance, slow turn, cursor parallax that settles before the fly-in ──
    r.intro = damp(r.intro, 1, 2.2, delta);
    if (hero.current) {
      hero.current.scale.setScalar(0.92 + 0.08 * r.intro);
      hero.current.position.y = 0.12 * (1 - r.intro);
    }
    if (heroSpin.current) heroSpin.current.rotation.y += delta * 0.22;
    if (world.current) {
      const calm = 1 - smooth(range(p, 0.78, 0.9));
      const px = state.current?.pointerX ?? 0;
      const py = state.current?.pointerY ?? 0;
      world.current.rotation.y = damp(world.current.rotation.y, px * 0.1 * calm, 2.5, delta);
      world.current.rotation.x = damp(world.current.rotation.x, py * 0.035 * calm, 2.5, delta);
    }

    // ── Closure: hover → descend onto the neck → thread down a turn and a half ──
    const descend = smooth(range(p, 0.13, 0.29));
    const thread = smooth(range(p, 0.29, 0.41));
    if (cap.current && capSpin.current) {
      const hover = BOTTLE_TOP + CAP_HOVER + Math.sin(clock.elapsedTime * 1.15) * 0.03 * (1 - descend);
      const touch = BOTTLE_TOP + 0.006;
      cap.current.position.y = lerp(lerp(hover, touch, descend), PA04_CAP_SEAT_Y, thread);
      cap.current.rotation.x = 0.36 * (1 - descend);
      cap.current.rotation.z = -0.2 * (1 - descend);
      r.idleTurn += delta * 0.5 * (1 - descend);
      capSpin.current.rotation.y = r.idleTurn - thread * Math.PI * 3;
    }

    // ── The rest of the family lands one by one ──
    BOTTLE_KEYS.forEach((key, n) => {
      const g = family.current[key];
      if (g) {
        const arrive = smooth(range(p, 0.43 + n * 0.022, 0.53 + n * 0.022));
        g.visible = arrive > 0.001;
        g.scale.setScalar(Math.max(0.001, arrive));
        g.position.y = (1 - arrive) * 0.45;
      }
      const label = labels.current[key];
      if (label) {
        const o = smooth(range(p, 0.55 + n * 0.012, 0.6 + n * 0.012)) * (1 - smooth(range(p, 0.75, 0.8)));
        label.style.opacity = o.toFixed(3);
      }
    });

    glow.current = smooth(range(p, 0.12, 0.3)) * 0.3 * (1 - smooth(range(p, 0.9, 0.98)));
    wallOpacity.current = smooth(range(p, 0.7, 0.83));
    wallPlaying.current = p > 0.62;
  });

  const labelTop = (key: ModelKey) =>
    key === "pa04" ? PA04_CAP_SEAT_Y + CAP_HEIGHT + 0.2 : unitsOf(MODELS[key].heightMm) + 0.2;

  return (
    <>
      <StudioRig shadowY={0} shadowScale={10} shadowOpacity={0.42} shadowFar={1} />
      <FloorGlow radius={4.2} opacity={glow} />

      <group ref={world}>
        {/* Hero: PA04 150 cc with its matched 38 mm CR closure */}
        <group position={[HERO_X, 0, 0]}>
          <group ref={hero}>
            <group ref={heroSpin}>
              <Suspense fallback={null}>
                <RealModel url={MODELS.pa04.url} />
              </Suspense>
              <group ref={cap} position={[0, BOTTLE_TOP + CAP_HOVER, 0]}>
                <group ref={capSpin}>
                  <Suspense fallback={null}>
                    <RealModel url={MODELS.pacrc03.url} />
                  </Suspense>
                </group>
              </group>
            </group>
          </group>
        </group>

        {BOTTLE_KEYS.filter((k) => k !== "pa04").map((key) => (
          <group key={key} position={[LINEUP_X[key], 0, 0]}>
            <group
              ref={(g) => {
                family.current[key] = g;
              }}
              visible={false}
            >
              <Suspense fallback={null}>
                <RealModel url={MODELS[key].url} />
              </Suspense>
            </group>
          </group>
        ))}

        {BOTTLE_KEYS.map((key) => (
          <Html
            key={key}
            position={[LINEUP_X[key], labelTop(key), 0]}
            center
            zIndexRange={[5, 0]}
            style={{ pointerEvents: "none" }}
          >
            <div
              ref={(el) => {
                labels.current[key] = el;
              }}
              style={{ opacity: 0 }}
              className="flex flex-col items-center gap-0.5 whitespace-nowrap select-none"
            >
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {MODELS[key].code}
              </span>
              <span className="text-xs sm:text-base font-semibold text-white">{MODELS[key].short}</span>
              <span className="mt-1 h-5 w-px bg-white/30" />
            </div>
          </Html>
        ))}
      </group>

      <FootageWall
        file="loops/products-line.mp4"
        poster="products-line"
        width={WALL.w}
        height={WALL.h}
        position={[0, WALL.y, WALL.z]}
        opacity={wallOpacity}
        playing={wallPlaying}
        active={active}
      />
    </>
  );
}

/** The WebGL half of the Home journey — loaded lazily so the page's copy never waits on three.js. */
export default function HomeJourneyScene({
  state,
  layout,
  active,
}: {
  state: RefObject<ScrollState>;
  layout: RefObject<StageBands>;
  active: boolean;
}) {
  return (
    <>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: JOURNEY_FOV, near: 0.1, far: 80, position: [HERO_X, 0.78, 3.8] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
        style={{ pointerEvents: "none" }}
      >
        <JourneyScene state={state} layout={layout} active={active} />
      </Canvas>
      <StageLoadBar tone="light" />
    </>
  );
}

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { RealModel, ExplodableClosure, StudioRig, FloorGlow, StageLoadBar } from "./Stage";
import { MODELS, ALL_KEYS, unitsOf } from "./pa-models";
import { range, smooth, lerp, type ScrollState, type StageBands } from "./scroll";
import { STEPS, positionOf, explodeAt, type TurnState } from "./showroom-steps";

ALL_KEYS.forEach((k) => useGLTF.preload(MODELS[k].url));

/*
 * A walk down the shelf. Every product is modelled at true scale and stands on one floor;
 * scrolling glides the camera from one to the next. Framing tightens only partially for the
 * small formats, and a millimetre rule stands beside each bottle, so the jump from 30 cc to
 * 950 cc is felt rather than read. The closure step ends by pulling the cap into its parts.
 */

const SPACING = 1.9;
const FOV = 28;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
/** The closure floats at eye level and leans toward the viewer instead of sitting flat on the floor. */
const CLOSURE_LIFT = 0.55;

const stationX = (i: number) => (i - (STEPS - 1) / 2) * SPACING;

interface Station {
  x: number;
  /** Vertical centre of the framed subject, and the height the camera frames. */
  centerY: number;
  frame: number;
  /** Real height in scene units — drives the rule. Zero for the floating closure. */
  rule: number;
  radius: number;
}

const STATIONS: Station[] = ALL_KEYS.map((key, i) => {
  const m = MODELS[key];
  const h = unitsOf(m.heightMm);
  return m.kind === "closure"
    ? { x: stationX(i), centerY: CLOSURE_LIFT + 0.1, frame: 0.6, rule: 0, radius: 0 }
    : { x: stationX(i), centerY: h * 0.5, frame: h, rule: h, radius: unitsOf(m.diameterMm) / 2 };
});
const TALLEST = Math.max(...STATIONS.map((s) => s.frame));
/** The closure needs more room in frame once its parts separate. */
const CLOSURE_FRAME_EXPLODED = 1.05;

/** A standing rule with a tick every 10 mm and a longer one every 50 mm. */
function HeightRule({
  height,
  offset,
  labelRef,
}: {
  height: number;
  offset: number;
  labelRef: (el: HTMLSpanElement | null) => void;
}) {
  const geometry = useMemo(() => {
    const pts: number[] = [0, 0, 0, 0, height, 0];
    const ticks = Math.floor(height / 0.1 + 1e-6);
    for (let n = 0; n <= ticks; n++) {
      const y = n * 0.1;
      const len = n % 5 === 0 ? 0.09 : 0.045;
      pts.push(0, y, 0, len, y, 0);
    }
    pts.push(0, height, 0, 0.13, height, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [height]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group position={[offset, 0, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#c7d8f5" transparent opacity={0.55} toneMapped={false} />
      </lineSegments>
      <Html position={[0.16, height, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
        <span
          ref={labelRef}
          style={{ opacity: 0 }}
          className="block -translate-y-1/2 whitespace-nowrap text-[11px] font-semibold tabular-nums text-brand-100"
        >
          {Math.round(height * 1000) / 10} mm
        </span>
      </Html>
    </group>
  );
}

function Shelf({
  state,
  layout,
  yaw,
}: {
  state: RefObject<ScrollState>;
  layout: RefObject<StageBands>;
  yaw: RefObject<TurnState>;
}) {
  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(1, size.height);

  const stations = useRef<(THREE.Group | null)[]>([]);
  const turntables = useRef<(THREE.Group | null)[]>([]);
  const ruleLabels = useRef<(HTMLSpanElement | null)[]>([]);
  const closureTilt = useRef<THREE.Group>(null);
  const explode = useRef(0);
  const glow = useRef(0.32);
  const rig = useRef({ ready: false, x: 0, y: 0, d: 4, shiftY: 0, spin: 0, lastFocus: -1 });

  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const damp = THREE.MathUtils.damp;
    const r = rig.current;
    // Below the `lg` breakpoint the spec panel sits under the product instead of beside it.
    const stacked = layout.current?.stacked === true;
    // Dwell on each product, then travel: the middle of every step holds the camera still.
    const pos = positionOf(state.current?.progress ?? 0);
    const i = Math.min(STEPS - 2, Math.floor(pos));
    const t = smooth(range(pos - i, 0.22, 0.78));
    const a = STATIONS[i];
    const b = STATIONS[i + 1];
    explode.current = explodeAt(pos);

    // Stacked layouts seat the product in the band between the header row and the spec panel;
    // side-by-side layouts use the full height and shift the product left of the panel.
    let bandTop = 0;
    let bandBottom = 1;
    if (stacked) {
      const bands = layout.current?.bands ?? {};
      bandTop = (bands.header?.bottom ?? 0.16) + 0.015;
      bandBottom = Math.max(bandTop + 0.2, (bands.panel?.top ?? 0.6) - 0.03);
    }
    const span = bandBottom - bandTop;
    // The tallest product fills `fillMax` of the stage; smaller ones fill less (∝ √height),
    // so every product is presentable yet the range still reads as small-to-large.
    const fillMax = stacked ? span * 0.86 : 0.6;
    const distFor = (s: Station, n: number) => {
      const frame = n === STEPS - 1 ? lerp(s.frame, CLOSURE_FRAME_EXPLODED, explode.current) : s.frame;
      const fill = fillMax * Math.sqrt(Math.min(1, frame / TALLEST));
      const fitHeight = frame / fill / (2 * TAN);
      const fitWidth = (frame * 0.8) / (2 * TAN * aspect * (stacked ? 0.62 : 0.4));
      return Math.max(fitHeight, fitWidth);
    };
    const wantX = lerp(a.x, b.x, t);
    const wantY = lerp(a.centerY, b.centerY, t);
    // Pull back a touch mid-travel so the move reads as a glide, not a slide.
    const wantD = lerp(distFor(a, i), distFor(b, i + 1), t) * (1 + Math.sin(t * Math.PI) * 0.14);
    const wantShiftY = stacked ? 0.5 - (bandTop + bandBottom) / 2 : 0;

    // First frame, or back from a hidden/throttled tab: cut straight to the shot instead of easing.
    if (!r.ready || rawDelta > 0.2) {
      r.ready = true;
      r.x = wantX;
      r.y = wantY;
      r.d = wantD;
      r.shiftY = wantShiftY;
    } else {
      r.x = damp(r.x, wantX, 5, delta);
      r.y = damp(r.y, wantY, 5, delta);
      r.d = damp(r.d, wantD, 5, delta);
      r.shiftY = damp(r.shiftY, wantShiftY, 5, delta);
    }
    const px = state.current?.pointerX ?? 0;
    const py = state.current?.pointerY ?? 0;
    camera.position.set(r.x + px * r.d * 0.035, r.y + r.d * 0.085 - py * r.d * 0.02, r.d);
    camera.lookAt(r.x, r.y, 0);
    (camera as THREE.PerspectiveCamera).setViewOffset(
      size.width,
      size.height,
      (stacked ? 0 : 0.2) * size.width,
      r.shiftY * size.height,
      size.width,
      size.height,
    );

    // Only the product in focus holds the stage; its neighbours step in and out during travel.
    const at = Math.min(pos, STEPS - 1);
    stations.current.forEach((g, n) => {
      if (!g) return;
      const presence = 1 - smooth(range(Math.abs(at - n), 0.3, 0.8));
      g.visible = presence > 0.002;
      g.scale.setScalar(Math.max(0.001, presence));
      // drei's <Html> ignores parent visibility, so the rule's caption is faded by hand.
      const label = ruleLabels.current[n];
      if (label) label.style.opacity = presence.toFixed(3);
    });

    // Idle turn pauses while (and just after) the visitor is dragging.
    const idle = Date.now() > (yaw.current?.until ?? 0);
    r.spin += delta * (idle ? 0.28 : 0);
    const focus = Math.round(at);
    // A newly focused product starts from a fresh turntable — reset here, in the same frame the
    // focus flips, rather than a React commit later.
    if (r.lastFocus !== focus) {
      if (r.lastFocus !== -1 && yaw.current) yaw.current.value = 0;
      r.lastFocus = focus;
    }
    turntables.current.forEach((g, n) => {
      if (!g) return;
      const drag = n === focus ? (yaw.current?.value ?? 0) : 0;
      g.rotation.y = damp(g.rotation.y, r.spin + drag, 8, delta);
    });

    if (closureTilt.current) {
      // Lean the cap toward the viewer, then level it out as it comes apart.
      closureTilt.current.rotation.x = lerp(0.62, 0.18, explode.current);
      closureTilt.current.position.y = CLOSURE_LIFT - explode.current * 0.12;
    }
  });

  return (
    <>
      <StudioRig shadowY={0} shadowScale={14} shadowOpacity={0.4} shadowFar={1} />
      <FloorGlow radius={7} opacity={glow} />
      {ALL_KEYS.map((key, i) => (
        <group key={key} position={[stationX(i), 0, 0]}>
          <group
            ref={(g) => {
              stations.current[i] = g;
            }}
          >
            {MODELS[key].kind === "closure" ? (
              <group ref={closureTilt} position={[0, CLOSURE_LIFT, 0]}>
                <group
                  ref={(g) => {
                    turntables.current[i] = g;
                  }}
                >
                  <Suspense fallback={null}>
                    <ExplodableClosure url={MODELS[key].url} explode={explode} />
                  </Suspense>
                </group>
              </group>
            ) : (
              <>
                <group
                  ref={(g) => {
                    turntables.current[i] = g;
                  }}
                >
                  <Suspense fallback={null}>
                    <RealModel url={MODELS[key].url} />
                  </Suspense>
                </group>
                <HeightRule
                  height={STATIONS[i].rule}
                  offset={STATIONS[i].radius + 0.16}
                  labelRef={(el) => {
                    ruleLabels.current[i] = el;
                  }}
                />
              </>
            )}
          </group>
        </group>
      ))}
    </>
  );
}

/** The WebGL half of the showroom — loaded lazily so the page never waits on three.js. */
export default function ShowroomScene({
  state,
  layout,
  yaw,
  active,
}: {
  state: RefObject<ScrollState>;
  layout: RefObject<StageBands>;
  yaw: RefObject<TurnState>;
  active: boolean;
}) {
  return (
    <>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: FOV, near: 0.05, far: 80, position: [stationX(0), 0.4, 3] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
        style={{ pointerEvents: "none" }}
      >
        <Shelf state={state} layout={layout} yaw={yaw} />
      </Canvas>
      <StageLoadBar tone="dark" />
    </>
  );
}

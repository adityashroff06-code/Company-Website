import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useProgress, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { videoSrc, videoWebm, posterSrc } from "@/components/video/videos";
import { WORLD_SCALE } from "./pa-models";

export { R3FErrorBoundary } from "./boundary";

// Clones share the cached GLTF materials, so nothing here may mutate a material.
function tuneMaterials(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    }
  });
}

/** Loads a GLB, centers it at the origin and scales its largest dimension to `size`. */
export function CenteredModel({ url, size = 2.6 }: { url: string; size?: number }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    tuneMaterials(clone);
    const box = new THREE.Box3().setFromObject(clone);
    const dims = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = size / Math.max(dims.x, dims.y, dims.z);
    const group = new THREE.Group();
    clone.position.set(-center.x, -center.y, -center.z);
    group.add(clone);
    group.scale.setScalar(scale);
    return group;
  }, [scene, size]);
  return <primitive object={object} />;
}

/**
 * Loads a GLB at its true size (1 scene unit = 10 cm), standing on the origin.
 * Every model shares one scale, so a 30 cc bottle really is dwarfed by a 950 cc one.
 */
export function RealModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    tuneMaterials(clone);
    clone.scale.setScalar(WORLD_SCALE);
    return clone;
  }, [scene]);
  return <primitive object={object} />;
}

/** PACRC03 part groups, by GLB node name, with how far each travels when the cap is pulled apart. */
const CLOSURE_PARTS: Record<string, number> = {
  cap_skirt: 1,
  cap_top: 1,
  cap_rim: 1,
  cap_top_marks: 1,
  inner_closure: 0,
  inner_thread: 0,
  wad_liner: -0.8,
};

/**
 * The CR closure with its outer shell, inner threaded closure and liner separable.
 * `explode.current` (0..1) is read every frame — 0 is assembled, 1 is fully apart.
 */
export function ExplodableClosure({
  url,
  explode,
  spread = 0.028,
}: {
  url: string;
  explode: RefObject<number>;
  /** Travel of the outer shell at full explosion, in metres (model space). */
  spread?: number;
}) {
  const { scene } = useGLTF(url);
  const { object, parts } = useMemo(() => {
    const clone = scene.clone(true);
    tuneMaterials(clone);
    clone.scale.setScalar(WORLD_SCALE);
    const found: { node: THREE.Object3D; baseY: number; factor: number }[] = [];
    for (const [name, factor] of Object.entries(CLOSURE_PARTS)) {
      const node = clone.getObjectByName(name);
      if (node) found.push({ node, baseY: node.position.y, factor });
    }
    return { object: clone, parts: found };
  }, [scene]);

  useFrame(() => {
    const e = explode.current ?? 0;
    for (const p of parts) p.node.position.y = p.baseY + p.factor * spread * e;
  });

  return <primitive object={object} />;
}

/** Soft studio lighting, built procedurally — no external HDR downloads. */
export function StudioRig({
  shadowY = -1.5,
  shadowScale = 6.5,
  shadowOpacity = 0.32,
  shadowFar = 3.2,
  shadows = true,
}: {
  shadowY?: number;
  shadowScale?: number;
  shadowOpacity?: number;
  shadowFar?: number;
  shadows?: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={0.6} />
      <Environment resolution={256} frames={8}>
        <Lightformer form="rect" intensity={2.8} color="#ffffff" position={[0, 5, 1.5]} rotation={[-Math.PI / 2.3, 0, 0]} scale={[9, 6, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#dbe7fb" position={[6, 1.2, -2.5]} rotation={[0, -Math.PI / 2.5, 0]} scale={[5, 8, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#ffffff" position={[-5.5, 0.6, 3.5]} rotation={[0, Math.PI / 2.8, 0]} scale={[5, 7, 1]} />
        <Lightformer form="rect" intensity={0.65} color="#e8f0fd" position={[0, -4, 1]} rotation={[Math.PI / 2.2, 0, 0]} scale={[9, 9, 1]} />
      </Environment>
      {shadows && (
        <ContactShadows
          position={[0, shadowY, 0]}
          opacity={shadowOpacity}
          scale={shadowScale}
          blur={2.7}
          far={shadowFar}
          resolution={512}
          color="#0f2a4d"
        />
      )}
    </>
  );
}

/** A soft pool of light on the floor so models feel grounded against a dark backdrop. */
export function FloorGlow({
  radius = 6,
  color = "#9db9ec",
  opacity,
  position = [0, 0, 0],
}: {
  radius?: number;
  color?: string;
  /** Read every frame, so the pool can fade with scroll. */
  opacity: RefObject<number>;
  position?: [number, number, number];
}) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.45, "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(() => {
    if (mat.current) mat.current.opacity = opacity.current ?? 0;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], position[1] - 0.002, position[2]]} renderOrder={-1}>
      <circleGeometry args={[radius, 64]} />
      <meshBasicMaterial ref={mat} map={texture} color={color} transparent depthWrite={false} toneMapped={false} opacity={0} />
    </mesh>
  );
}

/**
 * Line footage as a texture: muted, looping, never clicked. The poster frame stays on the wall
 * until the stream is genuinely presenting frames, so there is never a black flash. The caller
 * says when it should run via `playing.current`; `active` (a prop, not a ref) additionally
 * pauses it from React when the stage leaves the screen — the frame loop is parked at that
 * moment, so a pause that lived only inside useFrame would never fire.
 */
function useFootageTexture(file: string, poster: string, playing: RefObject<boolean>, active: boolean) {
  const [map, setMap] = useState<THREE.Texture | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const nextTry = useRef(0);

  useEffect(() => {
    let disposed = false;
    const owned: THREE.Texture[] = [];

    new THREE.TextureLoader().load(posterSrc(poster), (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      owned.push(tex);
      setMap((current) => current ?? tex);
    });

    const v = document.createElement("video");
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "auto";
    v.crossOrigin = "anonymous";
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    const mp4 = videoSrc(file);
    const webm = videoWebm(file);
    if (mp4.startsWith("blob:")) {
      v.src = mp4;
    } else {
      for (const [src, type] of [[mp4, "video/mp4"], [webm, "video/webm"]] as const) {
        if (!src) continue;
        const source = document.createElement("source");
        source.src = src;
        source.type = type;
        v.appendChild(source);
      }
    }
    // Swap in the live texture only once a decoded frame has actually advanced.
    const onFirstFrames = () => {
      if (disposed || v.currentTime <= 0) return;
      v.removeEventListener("timeupdate", onFirstFrames);
      const tex = new THREE.VideoTexture(v);
      tex.colorSpace = THREE.SRGBColorSpace;
      owned.push(tex);
      setMap(tex);
    };
    v.addEventListener("timeupdate", onFirstFrames);
    v.load();
    video.current = v;

    return () => {
      disposed = true;
      v.removeEventListener("timeupdate", onFirstFrames);
      v.pause();
      v.removeAttribute("src");
      while (v.firstChild) v.removeChild(v.firstChild);
      v.load();
      video.current = null;
      owned.forEach((t) => t.dispose());
    };
  }, [file, poster]);

  useEffect(() => {
    if (!active) video.current?.pause();
  }, [active]);

  useFrame(() => {
    const v = video.current;
    if (!v) return;
    const want = active && playing.current === true;
    if (!want) {
      if (!v.paused) v.pause();
      return;
    }
    // A rejected play() (autoplay policy, source still resolving) is retried once a second,
    // not once a frame.
    if (v.paused && performance.now() >= nextTry.current) {
      nextTry.current = performance.now() + 1000;
      v.play().catch(() => {});
    }
  });

  return map;
}

/** A cinema-scale screen inside the scene, playing production-line footage. */
export function FootageWall({
  file,
  poster,
  width,
  height,
  position,
  opacity,
  playing,
  active,
}: {
  file: string;
  poster: string;
  width: number;
  height: number;
  position: [number, number, number];
  opacity: RefObject<number>;
  playing: RefObject<boolean>;
  /** False while the stage is off screen: footage is paused even though no frames render. */
  active: boolean;
}) {
  const map = useFootageTexture(file, poster, playing, active);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const o = opacity.current ?? 0;
    if (mat.current) mat.current.opacity = o;
    if (mesh.current) mesh.current.visible = o > 0.003;
  });
  return (
    <mesh ref={mesh} position={position} visible={false}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial ref={mat} map={map} transparent toneMapped={false} opacity={0} key={map ? map.uuid : "empty"} />
    </mesh>
  );
}
/** Thin load bar for a stage — fades out once every queued model has arrived. */
export function StageLoadBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { active, progress } = useProgress();
  const done = !active || progress >= 100;
  return (
    <div
      aria-hidden="true"
      className={`absolute left-0 right-0 bottom-0 h-[3px] transition-opacity duration-700 ${done ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className={`h-full origin-left transition-transform duration-300 ${tone === "dark" ? "bg-[#93b4e8]" : "bg-[#4164a8]"}`}
        style={{ transform: `scaleX(${Math.max(0.04, progress / 100)})` }}
      />
    </div>
  );
}

export function usePrefersReducedMotion() {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true,
    [],
  );
}

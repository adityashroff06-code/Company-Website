import { useEffect, useRef, useState } from "react";

/*
 * ProductViewer3D — interactive 3-D product models built procedurally in
 * Three.js from Product Armor's own 2-D engineering drawings (dimensions in
 * mm, scene scale 1:10). The confidential drawings themselves stay out of
 * the repo; only the published dimensions live here.
 *
 *   bottle — PA19: 30 cc / 28 mm neck HDPE bottle
 *            body Ø36.91 × 54.48 h, finish Ø27.38 × 10.24, shoulder R5.48
 *   crCap  — PACRC03: 38 mm PP child-resistant closure
 *            Ø45.00 × 17.31 h, knurled outer wall
 *
 * Three.js is loaded on demand (dynamic import) the first time the viewer
 * approaches the viewport, so the main bundle stays lean. Drag to rotate
 * (mouse or touch) with inertia; gentle auto-rotation while idle.
 */

export type ProductModel = "bottle" | "crCap";

const SPECS: Record<ProductModel, { chip: string; label: string }> = {
  bottle: { chip: "PA19 · 30 cc · 28 mm NECK", label: "HDPE bottle, modelled from drawing PA.19.30.28/9" },
  crCap: { chip: "PACRC03 · 38 mm · CR CLOSURE", label: "PP child-resistant closure, modelled from drawing PACRC.03.38A/7.50" },
};

function buildBottle(THREE: typeof import("three")) {
  const s = 0.1; // mm -> scene units
  const pts: [number, number][] = [
    [0, 0.9], [6, 0.7], [11, 0.5], [14.5, 1.0], [16.5, 1.7], [17.7, 2.7], [18.3, 4.0],
    [18.455, 5.3], [18.455, 38.6],                       // body wall Ø36.91
    [18.2, 40.3], [17.4, 41.9], [16.1, 43.1], [14.5, 43.9], [13.1, 44.3], // shoulder R5.48
    [12.445, 44.6], [12.445, 53.9],                      // neck below finish
    [12.3, 54.48], [11.3, 54.48], [10.795, 54.1],        // rim, mouth Ø21.59
    [10.795, 51.6],                                      // inner lip
  ];
  const profile = pts.map(([r, y]) => new THREE.Vector2(r * s, y * s));
  const body = new THREE.LatheGeometry(profile, 72);

  // 28 mm finish: helical thread wrapped around the neck
  const turns = 2.1, y0 = 45.8, y1 = 52.6, rad = 12.95;
  const helix: InstanceType<typeof THREE.Vector3>[] = [];
  for (let i = 0; i <= 140; i++) {
    const t = i / 140;
    const a = t * turns * Math.PI * 2;
    helix.push(new THREE.Vector3(Math.cos(a) * rad * s, (y0 + (y1 - y0) * t) * s, Math.sin(a) * rad * s));
  }
  const thread = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helix), 200, 0.72 * s, 10, false);

  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xf5f6f2, roughness: 0.42, metalness: 0,
    clearcoat: 0.25, clearcoatRoughness: 0.5, side: THREE.DoubleSide,
  });
  const group = new THREE.Group();
  group.add(new THREE.Mesh(body, mat), new THREE.Mesh(thread, mat));
  return { group, height: 54.48 * s, camDist: 17 };
}

function buildCrCap(THREE: typeof import("three")) {
  const s = 0.1;
  const pts: [number, number][] = [
    [0, 17.31], [19.4, 17.31],                            // flat top
    [20.9, 17.0], [21.9, 16.2], [22.5, 15.1],            // top round
    [22.5, 0.6], [22.35, 0],                              // outer wall Ø45
    [21.3, 0], [21.3, 1.1], [19.6, 1.4],                  // bottom rim return
    [19.6, 13.6], [12, 14.2], [0, 14.2],                  // inner cavity ceiling
  ];
  const profile = pts.map(([r, y]) => new THREE.Vector2(r * s, y * s));
  const shell = new THREE.LatheGeometry(profile, 96);

  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xfafbf8, roughness: 0.3, metalness: 0,
    clearcoat: 0.4, clearcoatRoughness: 0.35, side: THREE.DoubleSide,
  });

  // knurled grip: instanced ribs around the outer wall
  const ribCount = 88;
  const rib = new THREE.BoxGeometry(0.85 * s, 11.6 * s, 0.7 * s);
  const ribs = new THREE.InstancedMesh(rib, mat, ribCount);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < ribCount; i++) {
    const a = (i / ribCount) * Math.PI * 2;
    q.setFromAxisAngle(up, -a);
    m.compose(
      new THREE.Vector3(Math.cos(a) * 22.75 * s, 9.4 * s, Math.sin(a) * 22.75 * s),
      q,
      new THREE.Vector3(1, 1, 1)
    );
    ribs.setMatrixAt(i, m);
  }

  const group = new THREE.Group();
  group.add(new THREE.Mesh(shell, mat), ribs);
  group.rotation.x = 0.32; // tip forward so the top face reads
  return { group, height: 17.31 * s, camDist: 10.5 };
}

export default function ProductViewer3D({ model, className }: { model: ProductModel; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);     // near viewport -> load three
  const [ready, setReady] = useState(false);     // renderer live
  const [dragged, setDragged] = useState(false); // hide the hint after first grab

  // arm on approach, with the same fallback discipline as ImageReveal
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setArmed(true); return; }
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { obs.disconnect(); setArmed(true); } }),
      { rootMargin: "320px" }
    );
    obs.observe(el);
    const fallback = setTimeout(() => setArmed(true), 3000);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);

  useEffect(() => {
    if (!armed) return;
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.55;

      const { group, height, camDist } = model === "bottle" ? buildBottle(THREE) : buildCrCap(THREE);
      group.position.y = -height / 2;
      const pivot = new THREE.Group();
      pivot.add(group);
      scene.add(pivot);

      // soft contact shadow: radial-gradient disc under the model
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
      g.addColorStop(0, "rgba(10,22,38,0.34)");
      g.addColorStop(1, "rgba(10,22,38,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(height * 0.75, 48),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
      );
      disc.rotation.x = -Math.PI / 2;
      disc.position.y = -height / 2 - 0.02;
      scene.add(disc);

      scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe4ec, 0.5));
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(3, 6, 4);
      const rim = new THREE.DirectionalLight(0xcfe0ff, 0.45);
      rim.position.set(-4, 3, -5);
      scene.add(key, rim);

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, height * 0.12, camDist);
      camera.lookAt(0, 0, 0);

      const resize = () => {
        const w = host.clientWidth, h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      // drag-to-rotate with inertia; auto-rotate while idle
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let dragging = false, lastX = 0, lastY = 0, velY = 0, lastInteraction = 0;
      let pitch = 0;
      const onDown = (e: PointerEvent) => {
        dragging = true; lastX = e.clientX; lastY = e.clientY;
        lastInteraction = performance.now();
        setDragged(true);
        host.style.cursor = "grabbing";
        try { host.setPointerCapture(e.pointerId); } catch { /* stale pointer id — capture is a nicety */ }
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        pivot.rotation.y += dx * 0.011;
        velY = dx * 0.011;
        pitch = Math.max(-0.5, Math.min(0.6, pitch + dy * 0.006));
        pivot.rotation.x = pitch;
        lastInteraction = performance.now();
      };
      const onUp = () => { dragging = false; host.style.cursor = "grab"; };
      host.addEventListener("pointerdown", onDown);
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerup", onUp);
      host.addEventListener("pointercancel", onUp);
      host.style.cursor = "grab";
      host.style.touchAction = "pan-y"; // vertical page scroll still works on touch

      let raf = 0, prev = performance.now();
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min((now - prev) / 1000, 0.05);
        prev = now;
        if (!dragging) {
          pivot.rotation.y += velY;
          velY *= 0.94;
          if (!reduced && now - lastInteraction > 1600) pivot.rotation.y += 0.28 * dt;
        }
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(tick);
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        host.removeEventListener("pointerdown", onDown);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerup", onUp);
        host.removeEventListener("pointercancel", onUp);
        pmrem.dispose();
        renderer.dispose();
        scene.traverse(o => {
          const mesh = o as { geometry?: { dispose(): void }; material?: { dispose(): void } };
          mesh.geometry?.dispose();
          mesh.material?.dispose();
        });
        renderer.domElement.remove();
      };
    })();

    return () => { disposed = true; cleanup?.(); };
  }, [armed, model]);

  const spec = SPECS[model];
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gradient-to-b from-white to-[#e9edf4] ring-1 ring-[#0a1626]/10 shadow-sm ${className ?? ""}`}
      aria-label={spec.label}
      role="img"
    >
      <div ref={hostRef} className="absolute inset-0" data-ready={ready || undefined} />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="lux-kicker text-[#0a1626]/30">Rendering 3-D…</span>
        </div>
      )}
      <span className="lux-kicker text-[#0a1626]/45 absolute top-4 left-4 pointer-events-none">{spec.chip}</span>
      <span
        className={`lux-kicker text-[#0a1626]/35 absolute bottom-3.5 right-4 pointer-events-none transition-opacity duration-700 ${dragged ? "opacity-0" : "opacity-100"}`}
      >
        Drag to rotate
      </span>
    </div>
  );
}

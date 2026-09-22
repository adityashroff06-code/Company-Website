# Redesign — progress and remaining work

Living checklist for the design-elevation programme in
[`PRODUCT-ARMOR-REDESIGN-PROMPT.md`](../PRODUCT-ARMOR-REDESIGN-PROMPT.md). Update it in the
same commit as each phase. Measured numbers come from `docs/baseline/` and
`docs/qa/phase-N/`; nothing here is asserted without a screenshot or an audit behind it.

**Last updated:** 22 September 2026 · **state:** Phases 0–2 complete on `main` =
`redesign/design-elevation` · **next:** Phase 3

---

## Done

### Foundation
- [x] Scroll-driven 3D layer (Home journey, Products showroom, `Stage.tsx` rigs) and the
      ambient-video layer committed — `3df3cbe`.
- [x] Repository consolidated on GitHub: `main` is the redesign line; the previous, unrelated
      `main` is preserved as `main-before-redesign` and as a merge parent — `2a12f1d`.
- [x] Root `README.md` with status, numbers and layout — `e16c0b7`.

### Phase 0 — recon and baseline (`a49cce4`, `3581b78`)
- [x] Every claim in the brief checked against the code; deviations recorded
      (`docs/baseline/README.md` §3).
- [x] `docs/design-system.md` written from brief §4, with measured WCAG ratios for the ramp.
- [x] Build, typecheck and bundle baseline from the production build: build passes;
      4 typecheck errors (all `src/admin/AdminDashboard.tsx`); entry JS 163.5 KB gz;
      three chunk 284.0 KB gz.
- [x] Screenshots of all 13 routes at 1440×900, 768×1024, 390×844; pinned stages at
      0 / .25 / .5 / .75 / 1; reduced-motion pass.
- [x] Contrast + payload audit: 180 of 968 text nodes fail AA; 8.7 % of characters above weight 600.
- [x] Zero-dependency verification tooling (`docs/qa/tools/`): headless Chrome over CDP from
      PowerShell — capture, audit, contrast maths, read-only server.

### Phase 1 — tokens, type, weight cap, codemod (`740b432`)
- [x] Primitive token layer in `index.css` (ink / brand / surface / hairline / eco ramp, 8-step
      type scale with companions, space, `--pa-radius-*`, shadows, `--ease-*`, `--dur-*`).
- [x] Semantic tokens re-pointed at the ramp; every `hsl(var(--x))` wrapper gone; orange
      `--accent` removed in light and dark.
- [x] Variable Inter (`opsz,wght@14..32,300..700`); `font-optical-sizing`; feature settings.
- [x] Hex literals in non-admin `.tsx` 262 → 7 (all three.js colour arguments); Tailwind
      default-palette utilities 97 → 0; `font-bold/black` → `font-semibold` (27);
      Georgia / Menlo out of Career; SVG attributes on `currentColor`; stats on `tabular-nums`.
- [x] Verified on the build: 0 % of rendered characters above 600; AA failures 180 → 141;
      968 text nodes and no overflow on every route at three viewports; typecheck still 4;
      bundles unchanged (`docs/qa/phase-1/README.md`).

### Phase 2 — primitives (the "Phase 2" commit; decisions in `docs/design-system.md` §11)
- [x] `src/components/motion/Reveal.tsx` on framer-motion (`LazyMotion` + `m.*`, strict):
      opacity 0→1, y 16→0, scale 0.985→1, `--dur-reveal`, `--ease-out`, revealing once 25 % of
      the element is on screen (half a viewport for anything taller than two viewports); each
      element observes itself, so lists that mount after a CMS fetch still reveal; children are
      returned unanimated under `prefers-reduced-motion`.
- [x] `RevealGroup` — 60 ms stagger between siblings that enter together; an element entering
      alone later starts with no delay.
- [x] framer's animation features load as their own chunk (`motion/features.ts`, 14.0 KB gz);
      until they arrive every `Reveal` is a plain, visible element. Entry JS 163.2 → 177.5 KB gz,
      inside the 180 KB budget (bundled synchronously it measured 189.4 KB).
- [x] `.reveal` and the seven `querySelectorAll(".reveal")` observers deleted; Career's private
      `.career-reveal` system (inline `<style>`, eighth observer, 20 usages) migrated; `Reveal`
      on **all 13 routes** (was 7). Header bands stay unwrapped until Phase 7 removes them.
- [x] `Chapter` — `light` / `gallery`; `gallery` scopes `.dark`, whose block in `index.css` now
      maps the semantic layer to the ramp (design-system §3.4, plus `--navy` → white so the
      `.heading-*` classes flip); `--space-chapter` padding; `Container` on `--measure-content` +
      `--gutter`. Built as the replacement for `.section-pad` / `.container-width`, which the
      pages keep until Phases 4–7 re-set them.
- [x] `Surface` — borderless: `--card` (now `--surface-1` on light, `--ink-800` on dark),
      `--shadow-card`, hover `translateY(-2px)` + `--shadow-lift` over `--dur-base`,
      `scale(1.02)` on the `media` slot only. Built as the replacement for `.card-standard`,
      which the pages keep until Phases 4–7.
- [x] `Eyebrow` (`text-eyebrow uppercase`, primary / muted), `SpecList` (hairline-ruled `<dl>`,
      tabular numerals, 1–2 columns), `MediaFrame` (`--pa-radius-xl`, `--shadow-media`, ratio,
      caption), `Button` (primary / outline / light, 48 px targets, `--ring` focus outline,
      wouter `Link` for in-app hrefs).
- [x] `/dev/primitives` check page renders every variant inside a light and a gallery
      `Chapter`; registered only when `import.meta.env.MODE !== "production"` (production bundle
      verified clean by grep; `vite build --mode qa` keeps it for screenshots). Route table
      unchanged.
- [x] `cn()` extended so tailwind-merge knows the type scale — plain tailwind-merge was
      dropping `text-body` / `text-eyebrow` next to colour utilities.
- [x] Verified on the build: typecheck still 4 (admin); entry 177.5 KB gz, three chunk
      284.0 KB gz, CSS 16.6 KB gz; 13 routes × 3 viewports × 2 motion settings and the check
      page captured; audit compared with Phase 1 (`docs/qa/phase-2/README.md`).

---

## Next — Phase 3 · chrome

Done when the navbar is verified transparent → blurred in screenshots at scroll 0 and 400.

- [ ] Navbar: transparent over the hero; `backdrop-blur-xl` + `--surface-0/80` + hairline once
      `scrollY > 20`; dropdowns `--pa-radius-lg`, `--shadow-lift`, no border, 160 ms fade+rise;
      **search collapses to an icon below `lg`** (fixes the "Contact Us" wrap at 768 px).
      Use `Container` and `Button` from Phase 2.
- [ ] Footer: editorial four-column on `--ink-900` (a `Chapter theme="gallery"` or the `.dark`
      scope directly), hairline rules, links in `--brand-300`; replaces `text-white/40`
      (52 failing nodes) and the `text-white/30` "Admin" link.
- [ ] Breadcrumb on the new tokens.
- [ ] WhatsApp float: `--surface-0` pill, `--hairline`, `--ink-700` text, green glyph only
      (fixes white-on-green 1.98:1, 13 nodes); the same treatment for the WhatsApp buttons on
      Home and Contact.
- [ ] Verify nav at scroll 0 and 400 by screenshot. Watch the entry budget: 2.5 KB of headroom
      remain after framer-motion.

## Phase 4 · Home

- [ ] Hero re-score: split the 158-character headline on the first comma at runtime —
      first clause `display-1`, remainder `body-lg` in `--ink-500`, one `<h1>` with a nested
      `<span>`, every word verbatim; "sustainable" stays in `--eco-600`.
- [ ] `display-1` at 320 px overflows by 17 px ("pharmaceutical" 288.6 px in 272 px):
      `overflow-wrap: anywhere` / `hyphens: auto` or a lower floor below 360 px.
- [ ] In the pinned journey the 46 % copy column cannot hold `display-1` (7 lines ≈ 640 px):
      full-width headline seated by `useStageBands`, or a height-aware clamp — decide by
      screenshot at 1366×768 and 1440×900.
- [ ] Chapter themes across the page (`Chapter`, at most three flips); chapters 2–4 restaged on
      `GalleryRig` (Phase 5 rig). `.section-pad` / `.container-width` → `Chapter` / `Container`.
- [ ] Stats band: display-weight tabular numerals on `--surface-1` with hairline dividers.
- [ ] Products section: `Surface` on a generous grid, whatever count `content.json` holds.
- [ ] Certifications: `--surface-0` tiles with real padding (fixes `text-accent` 2.88:1 on
      glass); client logos greyscale 55 % → colour on hover.
- [ ] Replace the Unsplash `onError` fallbacks (Home ×3, Technology, Products) with a
      `--surface-2` placeholder carrying the product code (`MediaFrame` already paints `--muted`
      behind media).
- [ ] Journey scrubs at 60 fps; hero legible at 320 and 1920 px.

## Phase 5 · 3D materials, GalleryRig, configurator

- [ ] `src/components/three/paMaterials.ts`: new `MeshPhysicalMaterial` instances per
      (variant × mesh role), cached in a module map, disposed on unmount — **never mutate a
      material reached through `useGLTF`**. HDPE: roughness 0.38, clearcoat 0.22 /
      0.45, sheen 0.30 / 0.6 / `#dfe8f5`, ior 1.51, envMapIntensity 1.15; natural resin
      transmission 0.12 / thickness 2.4 / attenuation 0.6; opaque white `#F2F4F6`. PP closure:
      roughness 0.50, clearcoat 0.10, slightly darker.
- [ ] Procedural roughness map on a `<canvas>` (value noise, `repeat(4,8)`, ±0.06), built the
      way `FloorGlow` builds its texture.
- [ ] Canvas colour pipeline on all three canvases: `ACESFilmicToneMapping`, exposure 1.05,
      `SRGBColorSpace`, `powerPreference: "high-performance"`.
- [ ] `GalleryRig`: near-black backdrop, hard key ≈ 35°, cool rim `#9db9ec` ≈ 145°, warm low
      fill, tight `ContactShadows`, floor gradient via the `FloorGlow` technique. Lift
      `StudioRig`'s key and add a top strip. No `@react-three/postprocessing`.
- [ ] `ProductConfigurator` under the Showroom on `/products`: resin (Natural / White / Amber /
      Opaque White) × format (five bottles from `MODELS`) × closure (38 mm CR / none);
      drag-to-turn reusing the Showroom yaw logic; `SpecList` from `MODELS`;
      `Button` "Request this configuration" deep-linking to
      `/contact?config=pa04-natural-crc38`, and `Contact.tsx` renders the summary line.
      Every switch is a material swap or visibility toggle — no loading state.
- [ ] Before/after screenshots of the same bottle in the PR body; the knurled skirt must catch
      the rim light in a screenshot.

## Phase 6 · Technology + Quality scenes, Products spreads

- [ ] Technology: `ScrollScene` of the 38 mm closure assembling from its three parts,
      cross-cut with `tech-moulding` / `tech-capfeed` / `tech-robot` on a `FootageWall`;
      widen `ExplodableClosure`'s API deliberately (per-group offset ref) instead of reaching
      into its internals. Process steps become a numbered editorial sequence on hairlines.
- [ ] Quality: one bottle rotating slowly under a scanning light sweep behind the inspection
      copy, with `quality-vision` / `quality-leaktest` footage; not a pinned journey.
      Certification tiles: `Surface` with room for the logo chips.
- [ ] Products detail rows: full-width editorial spreads, `MediaFrame` bleeding to one edge,
      tight text column, `SpecList` specs.
- [ ] Both new stages degrade cleanly with WebGL off; `frameloop` parked off-screen;
      canvases `aria-hidden`; `useStageBands` for any new pinned stage.

## Phase 7 · the nine remaining pages

About, Contact, Industries, Applications, Case Studies, Downloads, FAQ, Management Team, Career.

- [ ] No page still uses `.section-pad` or the `bg-primary` header band (that band holds 40 of
      the remaining AA failures); `.card-standard` and `.btn-*` retire with them, then their
      definitions leave `index.css`.
- [ ] Chapter themes, the type scale, `Surface`, `Button`; About keeps `ImmersiveFilm` and its
      `floorClips`.
- [ ] Contact: 48 px fields, `--pa-radius-md`, hairline borders, visible focus ring; renders
      the configurator summary when `?config=` is present.
- [ ] Career: re-set on the system properly (its `<h1>` is 1.1 rem on phones by inheritance of
      the old nowrap sizing). Its reveal system already moved to `Reveal` in Phase 2.
- [ ] No new WebGL on these pages.

## Phase 8 · assets, performance, accessibility

- [ ] Compress the six live GLBs with `@gltf-transform/cli optimize --compress meshopt
      --texture-compress webp` (≤ 600 KB per bottle, ≤ 900 KB closure); keep originals in
      `assets-src/models/`; wire the meshopt decoder into the existing `useGLTF` calls after
      checking the installed drei / three APIs. **Stop and report if the CLI cannot be fetched.**
      (The two orphan GLBs are already absent from this branch — §5E.1 done.)
- [ ] `hero-bg.jpg` → 1600 px WebP + AVIF ≤ 120 KB, same `/images/hero-bg.jpg` path.
- [ ] Preload fan-out: `HomeJourneyScene` mounts all six GLBs under `visible={false}` and
      `ShowroomScene` preloads all six — Home and Products pull 20 MB / 18 MB before any
      scroll. Preload the first two shelf products; stream the rest as the walk approaches.
- [ ] `About.tsx` still requests `facility.mp4`, which no longer exists (404 every visit; WebM
      plays): add an H.264 encode at the loop budget or drop the `<source>`, and retire the LFS
      rule in `.gitattributes`. `facility.webm` (7.8 MB): re-encode or lazy-attach like
      `AmbientVideo`.
- [ ] Entry JS budget: 177.5 KB gz of 180 after framer-motion. If Phases 3–7 need room,
      lazy-load the two admin routes in `App.tsx` (they are statically imported into the entry
      today) — the route table itself stays as it is.
- [ ] Contrast sweep of every `text-white/NN` (40 ×4, 50 ×9, 60 ×23, 65 ×12, 70 ×13, 80 ×18)
      against its actual background — computed, not eyeballed; `docs/qa/tools/audit.ps1`
      must report 0 failures. Visible focus ring on every interactive element (the `Button`
      primitive's `:focus-visible` rule becomes the global one).
- [ ] Budgets measured and recorded in `docs/budgets.md`: LCP ≤ 2.0 s, CLS ≤ 0.02,
      INP ≤ 200 ms (mid-tier mobile, 4G), entry JS ≤ 180 KB gz, three chunk ≤ 320 KB gz,
      60 fps through every pinned stage, `dpr={[1, 1.75]}` kept on journey canvases.

## Phase 9 · full QA

- [ ] All 13 routes × 3 viewports × 2 motion settings verified by screenshot; pinned stages at
      five scroll positions; WebGL-off pass (`capture.ps1 -NoWebGL`); 320 px pass.
- [ ] Final check against brief §11: could this page be any B2B manufacturer's; does colour
      carry meaning; one subject per screen; does the 3D show something a photograph could not.

---

## Housekeeping (outside the phases)

- [ ] `pnpm-workspace.yaml` in the local checkout ends with a pnpm placeholder,
      `allowBuilds: esbuild: set this to true or false` — decide `true`/`false` before the next
      `pnpm install` on Replit; not committed.
- [ ] `vite.config.ts` dev proxy (`/api` → 127.0.0.1:5000, `/images|/videos` → `/site`) exists
      only in the local checkouts; decide whether it belongs in the repo.
- [ ] Set `ADMIN_PASSWORD` in every deployed environment (a development fallback is in code).
- [ ] Three local checkouts hold the same working copy (`Updated Company's Website\`,
      `…\Update_1.1`, `Downloads\Update_1.1`); the root-level model exports and the 229 MB
      `Videos\` folder are not in git.
- [ ] The root-level scratch files from the Replit era (`color.js`, `diff.patch`, `diff2.patch`,
      `parse_diff.js`, `restore_colors.js`, `reverse_sed.sh`, `test_regex.js`,
      `text-diff.patch`) are still tracked on this line; delete them in a housekeeping commit.
- [ ] Optional: self-host `InterVariable.woff2` (~345 KB) to get the `cv11` / `ss01` glyph
      variants the brief specifies; Google's build ignores them.
- [ ] Optional: configure `git config user.name` / `user.email` (commits currently take the
      auto-derived Windows domain identity).

## How to resume

1. Read `docs/design-system.md` §11 (decisions log) and the latest `docs/qa/phase-N/README.md`.
2. Work on `redesign/design-elevation` (or any branch that fast-forwards it); build and verify
   per `docs/qa/tools/README.md` (Windows: the mirror procedure; Replit: the plain commands).
   Screenshots of the check page: build with `vite build --mode qa --outDir dist/qa` and
   capture `/dev/primitives`.
3. Commit with the phase in the message, update this file and the README status table in the
   same commit, then push the commit to both `main` and `redesign/design-elevation` on
   `origin` — always a fast-forward, never a force push.

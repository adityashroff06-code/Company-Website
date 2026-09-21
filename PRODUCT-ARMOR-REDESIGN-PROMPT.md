# Product Armor — Design Elevation Prompt for Claude Code

> **How to use (not part of the prompt).** Open Claude Code at the repo root
> (`Update_1.1/`). Paste everything below the `═══` line as your first message.
> It is written to be executed **one phase per session** — after each phase, let
> it commit, then start the next session with: *"Continue the Product Armor
> redesign. Read `PRODUCT-ARMOR-REDESIGN-PROMPT.md` and `docs/design-system.md`,
> then execute Phase N."* (Keep this file at the repo root under that name.)
> Phase 1 is the one that matters most; everything else inherits from it.

═══════════════════════════════════════════════════════════════════════════

You are redesigning the **Product Armor Packaging** marketing site. The content
is finished and correct. Your job is to raise the *design language* to the level
of Apple's product pages, Airbnb's warmth, and BMW's cinematic product staging —
with 3D as the spine of the experience, not an ornament.

Read this document fully before touching a file. Then execute **Phase 0** only,
and stop for review.

---

## 1 · Codebase facts (verified — do not re-derive)

**App:** `artifacts/productarmor-site` (pnpm workspace package `@workspace/productarmor-site`)

| | |
|---|---|
| Stack | Vite `^7.3.2` · React `19.1.0` · TypeScript 5.9 · Tailwind `^4.1.14` **(CSS-first)** · wouter · TanStack Query |
| 3D | `three@^0.185` · `@react-three/fiber@^9.7` · `@react-three/drei@^10.7` |
| Motion | `framer-motion@^12.23.24` — declared in `devDependencies`, **imported in zero files**, so it never reaches a bundle |
| UI | shadcn "new-york" / Radix — `src/components/ui/` holds only `card`, `toast`, `toaster`, `tooltip`; nothing imports `ui/card`, and cards use the `.card-standard` CSS class |
| Tokens | `src/index.css` — `@theme inline` + `:root` / `.dark` HSL triplets. **There is no `tailwind.config.js`.** |
| Font | Inter, static weights 400–800, Google Fonts `<link>` in `index.html` |
| Content | Fetched at runtime via `useGetSiteContent()` from `@workspace/api-client-react`, served from `artifacts/api-server/data/content.json` |

**Build — both env vars are mandatory or Vite throws:**

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/productarmor-site build
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/productarmor-site dev
```

`pnpm typecheck` has **pre-existing** failures from the unbuilt
`@workspace/api-client-react` dist. They are unrelated to you. Record the exact
error count in Phase 0 and make sure it never goes up.

### Routes (wouter, `src/App.tsx`)
`/` `/products` `/industries` `/applications` `/technology` `/downloads`
`/case-studies` `/career` `/faq` `/about` `/management-team` `/quality`
`/contact` — plus `/admin`, `/admin/dashboard` (**out of scope, do not touch**).

### The 3D layer that already exists — keep and extend, do not rewrite

```
src/components/three/
  Stage.tsx            CenteredModel · RealModel · ExplodableClosure ·
                       StudioRig · FloorGlow · FootageWall · StageLoadBar
  scroll.ts            useScrollState · useScrollCaptions · useStageBands ·
                       useInView · supportsImmersive · range/smooth/lerp
  pa-models.ts         MODELS registry, true-scale (1 unit = 10 cm), WORLD_SCALE=10
  HomeJourney.tsx      540vh pinned stage, 4 chapters  → Home
  HomeJourneyScene.tsx camera shot list, cap-threading, family line-up, footage wall
  Showroom.tsx         560vh pinned shelf walk, drag-to-turn, spec rail → Products
  ShowroomScene.tsx    per-product staging + closure explode
  Hero3D.tsx           the simpler Home hero — still a WebGL Canvas, dpr [1,2]
  boundary.tsx         R3FErrorBoundary (re-exported from Stage.tsx)
```

`Hero3D` is **not** the no-WebGL fallback — it is itself a canvas. The true
fallback is the static markup that `Home.tsx` / `Products.tsx` render when
`supportsImmersive()` returns false.

This architecture is **good** and hard-won. Specifically preserve:

- Scroll progress lives in a **ref**, read inside `useFrame` — zero React
  re-renders per frame. Never convert this to state or to a scroll library.
- `useStageBands` measures `[data-band]` copy blocks so the camera can seat the
  subject in whatever space the copy leaves free. Any new pinned stage must use it.
- `supportsImmersive()` gates WebGL; reduced-motion and no-WebGL users get the
  classic static layout. **Every page must stay complete and legible with WebGL off.**
- `frameloop={<in-view> ? "always" : "never"}` parks the renderer off-screen on
  all three canvases.
- Canvases are `aria-hidden`; the Showroom spec panel is `aria-live="polite"`.
- `Stage.tsx` comment: *"Clones share the cached GLTF materials, so nothing here
  may mutate a material."* This is load-bearing — see §5A.

### Assets (`artifacts/productarmor-site/public/`)

- `models/` — 6 referenced GLBs, **17.8 MB uncompressed**, plus two orphans with
  zero code references: `pa19-bottle.glb`, `pacrc03-closure.glb` (1.9 MB).
- `videos/loops/` — 7 clips × mp4 + webm, each with a first-frame poster in
  `videos/posters/`; plus an 8th, `videos/facility.webm` (7.8 MB) with
  `posters/facility.jpg`, used by `About.tsx`.
- `images/hero-bg.jpg` — **3.4 MB**, referenced only through
  `content.json → hero.backgroundImage`, rendered at `opacity-[0.06]`.
- `images/clients/` (14 logos), `images/certifications/` (5).

---

## 2 · The design problem, stated precisely

The site is competent and generic. The specific failures:

1. **Stripe layout.** All eleven inner pages open with the identical
   `<section className="bg-primary section-pad">` header band, then alternate
   `bg-white` / `bg-secondary` / `bg-navy` sections, then close on a `bg-primary`
   CTA (About, Management Team, Products, Quality) or a `bg-navy` one
   (Applications, Case Studies, Downloads, FAQ, Industries, Technology). Home is
   the only exception. Colour is doing the job that space, scale and rhythm
   should be doing.
2. **Weight instead of hierarchy.** `font-extrabold` / `font-black` everywhere.
   The 158-character hero headline runs at `heading-hero`
   (`text-4xl sm:text-5xl lg:text-6xl font-extrabold`) in the non-immersive
   branch and at `pa-stage-hero-title` (weight 800) in the immersive one. Either
   way it becomes a wall.
3. **197 hardcoded hex literals across 24 `.tsx` files.** Exactly **7** are
   legitimate — three.js colour arguments in `Stage.tsx` (4 `Lightformer`,
   1 `ContactShadows`, 1 `FloorGlow` default) and 1 `lineBasicMaterial` in
   `ShowroomScene.tsx`. The other **190** — `#4164a8` ×90, `#0f2a4e` ×53,
   `#93b4e8` ×17 — are Tailwind arbitrary values in JSX, including 22 that hide
   inside `three/` (`bg-[#07172e]`, `text-[#a9c4f0]`, the radial-gradient
   backdrops). They sit next to a token system that already defines those exact
   colours. The theme cannot be changed in one place today.
4. **Palette collisions.** `#32CD32` neon lime on "sustainable"; `#25D366`
   WhatsApp green floating over navy; light-mode `--accent` is blue
   (`217 65% 74%`) while `--accent-border` is orange (`hsl(24 90% 45%)`) — a
   real inconsistency.
5. **Motion is decoration.** One `.reveal` class (24px rise, 600ms), applied 43
   times across **7 of 13 pages** — Home 14, Technology 9, Applications 6,
   Industries 5, Downloads 4, FAQ 3, Case Studies 2 — and **zero** times on
   About, Contact, Products, Quality, Management Team, Career. Meanwhile
   `framer-motion` sits installed and unused.
6. **3D materials are flat.** `tuneMaterials()` only disables shadows. The GLBs
   render as matte white plastic. Real pharma HDPE is *translucent*, has a faint
   anisotropic sheen, a visible parting line and threads that catch light.
   `toneMapping`, `outputColorSpace` and `onCreated` appear **zero times** in the
   codebase, so every canvas renders on three's defaults and reads washed out.
7. **3D is confined to two pages.** Technology, Quality, About, Industries,
   Applications and Case Studies are text-and-card pages.
8. **Cards are SaaS cards.** `bg-card rounded-xl shadow-sm border border-card-border`.
9. **Contrast.** Body copy on navy at `text-white/50` (×9) and `text-white/60`
   (×20) spans **14 files**; adding `text-white/65` (×12) makes it 16. None of
   these clear WCAG AA as body text.
10. **A 3.4 MB hero image is downloaded to be shown at 6% opacity**, and 1.9 MB
    of orphaned GLBs ship in every build.

---

## 3 · The target design language

Do not imitate these brands' *looks*. Take their **operating principles** and
apply them to a pharmaceutical packaging manufacturer.

**From Apple — one idea per screen.**
Scroll behaves like a camera. Display type is large but *light* (600 max, never
800), tightly tracked (−0.03em), and surrounded by far more space than feels
comfortable. Copy is caption to the object, not competition for it. At most two
type sizes visible at once. Backgrounds are near-white or near-black — never a
mid-tone stripe.

**From Airbnb — warmth and generosity.**
Soft radii (16–24px), depth from a single diffuse shadow rather than a border,
hover as a physical lift, comfortable touch targets, photographic media given
room to breathe.

**From BMW — cinematic product staging and editorial precision.**
The product lit against near-black with one key and one cool rim. Wide-tracked
uppercase eyebrows (0.22em). Hairline rules instead of boxes. Spec data in
tabular numerals on a ruled grid. A configurator where a click changes the
object in front of you. Motion is confident and fast (220–320ms), never bouncy.

**The synthesis for Product Armor:** the product is a white bottle on a white
background — an Apple-grade gift and an invisibility trap. Resolve it by
alternating *chapter theme*, never section stripe: white "specification"
chapters where the object is a diagram, black "gallery" chapters where it is a
lit object. A page gets **at most three theme flips**, and each one must land on
a narrative beat.

---

## 4 · Design system — write these exact values

Create `docs/design-system.md` documenting the below, then implement it in
`src/index.css`. Every later phase reads from that doc.

### 4.1 Typography

Swap the `index.html` Google Fonts link to the **variable** axis:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap" rel="stylesheet">
```

Set `font-optical-sizing: auto` and `font-feature-settings: "cv11" 1, "ss01" 1`
on `body`; `font-variant-numeric: tabular-nums` on every spec value, stat and
counter.

| Token | Size (fluid) | Line | Tracking | Weight |
|---|---|---|---|---|
| `--text-display-1` | `clamp(2.75rem, 1.5rem + 4.4vw, 5.25rem)` | 0.96 | −0.035em | 600 |
| `--text-display-2` | `clamp(2.25rem, 1.4rem + 3vw, 3.75rem)` | 1.02 | −0.030em | 600 |
| `--text-title-1` | `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)` | 1.10 | −0.022em | 600 |
| `--text-title-2` | `1.5rem` | 1.20 | −0.018em | 600 |
| `--text-body-lg` | `1.1875rem` | 1.60 | −0.006em | 400 |
| `--text-body` | `1.0625rem` | 1.65 | −0.004em | 400 |
| `--text-caption` | `0.8125rem` | 1.50 | 0 | 500 |
| `--text-eyebrow` | `0.6875rem` | 1 | **0.22em** | 600, uppercase |

**Hard rules.** Maximum font weight on the site is **600** — delete every
`font-extrabold`, `font-black` and `font-bold` on headings (keep `font-semibold`
for UI labels). Body measure capped at `62ch`; display measure at `18ch`.

**The hero headline is 158 characters / 19 words and must not be edited.**
Re-score it typographically instead: set the first clause — everything up to the
first comma, *"Delivering sustainable pharmaceutical Bottles and Closures for
global healthcare"* — at `display-1`, and the remainder at `body-lg` in
`--ink-500` directly beneath it, inside one `<h1>` with a nested `<span>`. Every
word verbatim, in order. Split on the first `,` at runtime so a CMS edit to the
headline still renders correctly.

### 4.2 Colour

Replace the current `:root` block with a real ramp. Keep the brand blue's
identity; fix its relationships.

```
--ink-900   #071628   page black, gallery chapters
--ink-800   #0D2038
--ink-700   #12304F   headings on light
--ink-600   #1B4374
--ink-500   #55637A   body on light
--ink-400   #8996A8   captions

--brand-700 #2E4E88
--brand-600 #3A5D9F   primary action
--brand-500 #4A72B8
--brand-400 #7B9BD6
--brand-300 #A9C4F0   accents on dark
--brand-100 #E4ECF9
--brand-50  #F3F7FD

--surface-0 #FFFFFF
--surface-1 #FAFBFD
--surface-2 #F1F4F8
--hairline  rgba(11,31,59,0.08)

--eco-600   #2E8B6B   replaces the neon lime on "sustainable"
```

- Delete `#32CD32`. The word "sustainable" stays; it renders in `--eco-600`.
- Align `--accent` / `--accent-border` — both from the brand ramp. Remove the
  orange `hsl(24 90% 45%)`.
- Dark mode's `--accent: 24 90% 55%` (orange) contradicts light mode. Unify on
  `--brand-300`.
- The WhatsApp float keeps `#25D366` inside its icon only; the pill itself is
  `--surface-0` with `--hairline` and `--ink-700` text.
- **Codemod all 190 non-WebGL hex literals to token classes — including the 22
  that hide inside `three/` as Tailwind arbitrary values.** Acceptance:
  `grep -rhoiE '#[0-9a-f]{6}' src --include=*.tsx | wc -l` drops from **197 to
  7**, and every survivor is a three.js colour argument
  (`Lightformer`, `ContactShadows`, `FloorGlow`, `lineBasicMaterial`) — none
  inside a `className`.

### 4.3 Space, surfaces, elevation

```
--space-chapter: clamp(6rem, 10vw, 11rem)   /* replaces .section-pad */
--space-block:   clamp(3rem, 5vw, 5rem)
--gutter:        clamp(1.5rem, 4vw, 2.5rem)
--measure-content: 1240px
--measure-media:   1440px

--pa-radius-sm: 6px   --pa-radius-md: 12px   --pa-radius-lg: 18px
--pa-radius-xl: 24px  --pa-radius-2xl: 32px

--shadow-card:  0 1px 2px rgba(11,31,59,.04), 0 8px 24px -12px rgba(11,31,59,.14)
--shadow-lift:  0 2px 4px rgba(11,31,59,.05), 0 20px 40px -16px rgba(11,31,59,.20)
--shadow-media: 0 32px 64px -32px rgba(7,22,40,.45)
```

**Name the radius tokens `--pa-radius-*`.** The existing `@theme inline` block
already derives `--radius-sm/md/lg/xl` from `--radius: 0.5rem` (4/6/8/12px) and
Radix components depend on them; a bare `--radius-lg` would silently collide.
Either use the `--pa-` prefix or raise `--radius` and let the existing
`calc()` chain follow — but do not define both.

Cards lose their borders. Depth comes from `--surface-1` against `--surface-0`
plus `--shadow-card`. Hover: `translateY(-2px)` + `--shadow-lift` over 240ms,
and `scale(1.02)` on contained media only.

### 4.4 Motion

No `--ease-*` or `--dur-*` custom property exists yet. The curve
`cubic-bezier(0.22, 1, 0.36, 1)` is already hardcoded inline in four places
(`.pa-hero-reveal`, `.pa-chip-float`, `.pa-chip-float-delay`, `.pa-spec-swap`).
Promote it to a token and point those four at it:

```
--ease-out:      cubic-bezier(0.22, 1, 0.36, 1)    /* the existing curve */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)
--dur-fast: 160ms  --dur-base: 240ms  --dur-slow: 320ms  --dur-reveal: 560ms
```

Delete the `.reveal` class (and the seven `querySelectorAll(".reveal")`
IntersectionObserver blocks that drive it) and build
`src/components/motion/Reveal.tsx` on **framer-motion** — already installed,
currently imported nowhere:

- `opacity 0→1`, `y 16→0`, `scale 0.985→1`, `--dur-reveal`, `--ease-out`
- `viewport={{ once: true, amount: 0.25 }}`
- sibling stagger 60ms via a `<RevealGroup>` parent
- returns children unanimated when `prefers-reduced-motion: reduce`

Apply it to **all 13 routes** — the 43-uses-across-7-pages distribution is the bug.

**Never** add smooth-scroll hijacking, Lenis, Locomotive, GSAP or ScrollTrigger.
The existing native-scroll + rAF + ref pattern is correct and is why the pinned
stages are smooth.

---

## 5 · 3D — the spine

### 5A · Materials (highest-impact change on the whole site)

Create `src/components/three/paMaterials.ts`.

`Stage.tsx`'s `tuneMaterials()` only toggles shadow flags today, and its comment
warns that clones share cached GLTF materials. So: **build new material
instances and assign them to the clone's meshes. Never mutate a material reached
through `useGLTF`.** Cache one instance per (variant × mesh role) in a module
map and dispose on unmount.

**HDPE bottle** (`MeshPhysicalMaterial`)

```
roughness 0.38 · metalness 0 · clearcoat 0.22 · clearcoatRoughness 0.45
sheen 0.30 · sheenRoughness 0.6 · sheenColor #dfe8f5
ior 1.51 · envMapIntensity 1.15
natural resin:  transmission 0.12 · thickness 2.4 · attenuationDistance 0.6
opaque white:   transmission 0    · color #F2F4F6
```

Break the CG-perfect surface with a **procedurally generated** roughness map —
build it on a `<canvas>` exactly the way `FloorGlow` already builds its radial
gradient texture, so no new asset ships. Low-amplitude value noise, `repeat(4,8)`,
roughness ±0.06.

**PP closure:** `roughness 0.50`, `clearcoat 0.10`, no transmission, a touch
darker than the bottle. The knurled skirt must catch the rim light — verify in a
screenshot, not by reading the code.

**Canvas colour pipeline** — currently unset on all three canvases, which is why
the renders look washed out:

```tsx
gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
onCreated={({ gl }) => {
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.05;
  gl.outputColorSpace = THREE.SRGBColorSpace;
}}
```

### 5B · Two lighting rigs

Keep `StudioRig` for light chapters; lift the key and add a soft top strip.

Add **`GalleryRig`** for dark chapters (the BMW reference): near-black backdrop,
one hard key at ~35° elevation, a cool rim (`#9db9ec`) at ~145° behind the
subject, a warm low fill, tight dark `ContactShadows`, and a floor gradient built
with the existing `FloorGlow` canvas-texture technique.

**Do not add `@react-three/postprocessing`.** Achieve the look with lighting and
tone mapping. No new 3D dependencies.

### 5C · New: the Configurator — `/products`

The single highest-value new 3D feature, and it ships **zero new assets**.

Below the existing Showroom walk, add a non-pinned, full-bleed
`ProductConfigurator` on a `GalleryRig` stage:

- **Resin** — Natural (translucent) · White · Amber · Opaque White
- **Format** — the five bottles from `MODELS`, at true scale
- **Closure** — 38 mm CR · none (bottle only)
- Left: the lit model, drag-to-turn (reuse Showroom's pointer/yaw logic).
  Right: a BMW-style hairline-ruled spec table in tabular numerals, values read
  from `MODELS` (`heightMm`, `diameterMm`, `neck`, `material`).
- A "Request this configuration" button that deep-links to
  `/contact?config=pa04-natural-crc38`, and `Contact.tsx` renders the chosen
  configuration as a read-only summary line above the form.

Every switch is a material swap or a visibility toggle on models already loaded.
Changes must be instantaneous — no loading state between variants.

### 5D · Extend 3D past two pages

- **Technology** — a `ScrollScene` of the 38 mm closure assembling from its three
  parts, cross-cut with the existing `tech-moulding` / `tech-capfeed` /
  `tech-robot` loops on a `FootageWall`. `ExplodableClosure` already maps the
  seven GLB nodes into three travel groups, but `CLOSURE_PARTS` and the derived
  `parts` array are module-private and the component's only public surface is
  `{ url, explode, spread }`. Widen that API deliberately (e.g. an optional
  per-group offset ref) rather than reaching into its internals.
- **Quality** — a single bottle rotating slowly under a scanning light sweep,
  behind the inspection copy, with `quality-vision` / `quality-leaktest` footage.
  A quiet, contemplative stage, not another pinned journey.
- **About / Industries / Applications / Case Studies** — no new WebGL. These get
  the new type, chapter themes, `Reveal` and the ambient video treatment. **Do
  not put a canvas on every page**; scarcity is what makes the 3D land.

### 5E · Asset pipeline

1. Delete `public/models/pa19-bottle.glb` and `public/models/pacrc03-closure.glb`
   (zero references, 1.9 MB).
2. Compress the six live GLBs with
   `npx @gltf-transform/cli optimize <in> <out> --compress meshopt --texture-compress webp`.
   Targets: **≤ 600 KB** per bottle, **≤ 900 KB** for `pacrc03-38mm.glb`.
   Keep the originals in `assets-src/models/` and commit the compressed files.
   Wire the matching decoder into the existing `useGLTF` calls — check the
   installed `@react-three/drei@^10.7` and `three@^0.185` APIs before writing
   it; do not guess the import path. *If the CLI cannot be fetched, stop and
   report — do not hand-decimate.*
3. Re-encode `images/hero-bg.jpg` to 1600px WebP + AVIF, **≤ 120 KB**. Keep the
   `/images/hero-bg.jpg` path intact so `content.json` still resolves.
4. **Fix the preload fan-out.** `HomeJourneyScene.tsx` correctly preloads only
   `pa04` + `pacrc03`, and `Hero3D.tsx` only `pa04` — but `ShowroomScene.tsx:10`
   runs `ALL_KEYS.forEach((k) => useGLTF.preload(MODELS[k].url))`, pulling all
   six (17.8 MB today) the moment the chunk loads. Preload the first two
   products on the shelf; stream the rest as the walk approaches them.
5. `videos/facility.webm` is 7.8 MB for one About-page clip. Re-encode to the
   same budget as the seven loops, or lazy-attach it the way `AmbientVideo`
   already does.

---

## 6 · Page directives

**`/` Home.** Keep the four-chapter journey and its scroll choreography. Re-score
the hero per §4.1. Restage chapters 2–4 on `GalleryRig`. The stats band becomes
display-weight tabular numerals on `--surface-1` with hairline dividers — not a
navy stripe. The products section renders whatever `content.json` holds (4 items
today) as borderless surfaces on a generous grid — do not hardcode a count. The
certifications band is currently glass tiles (`bg-white/10 backdrop-blur border
border-white/20`) on `bg-primary`, which flattens the logos; move them to
`--surface-0` tiles with real padding. Client logos: greyscale at 55% opacity,
full colour on hover.

**`/products` Products.** Keep the Showroom walk. Add the Configurator (§5C).
Product detail rows lose their cards and become full-width editorial spreads:
media bleeding to one edge, a tight text column opposite, hairline-ruled specs.

**`/technology`** Closure-assembly ScrollScene (§5D) replacing the header band.
Process steps become a numbered editorial sequence on hairlines, not cards.

**`/quality`** Rotating bottle under an inspection sweep, behind the inspection
copy. Its certification tiles already sit on `bg-white` but are ringed with
`border-2 border-primary/10 rounded-2xl` — drop the double border for a hairline
and `--shadow-card`, and give the logo chips more room.

**`/about`** Keep `ImmersiveFilm` and its `floorClips`. Story and core-values
sections get the chapter rhythm instead of the `bg-white` / `bg-secondary` /
`bg-primary` stripe.

**Unsplash fallbacks** — `Home.tsx`, `Technology.tsx` and `Products.tsx` each
fall back to an `images.unsplash.com` URL in an `onError` handler. Replace all of
them with a neutral `--surface-2` placeholder block carrying the product code. A
stock photo of someone else's factory undercuts a cleanroom manufacturer's
credibility, and it is a third-party request on every failed image.

**`/contact`** Form fields get 48px targets, `--radius-md`, hairline borders, a
visible focus ring. Renders the Configurator summary when `?config=` is present.

**`/industries` `/applications` `/case-studies` `/downloads` `/faq`
`/management-team` `/career`** Tokens, type, chapter themes, `Reveal`. No new 3D.

**Navbar.** Transparent over the hero, `backdrop-blur-xl` + `--surface-0/80` +
hairline once `scrollY > 20`. Dropdowns get `--radius-lg`, `--shadow-lift`, no
border, 160ms fade+rise. Search collapses to an icon below `lg`.

**Footer.** Editorial four-column on `--ink-900`, hairline rules, link text at
`--brand-300` — currently below AA.

---

## 7 · Budgets (non-negotiable)

**Performance** — LCP ≤ 2.0s · CLS ≤ 0.02 · INP ≤ 200ms (mid-tier mobile, 4G).
Initial JS excluding three ≤ 180 KB gzipped; the lazy three chunk ≤ 320 KB
gzipped. 60fps sustained through every pinned stage on a mid-range laptop. Keep
`dpr={[1, 1.75]}` on journey canvases.

**Accessibility** — WCAG 2.1 AA. Body text ≥ 4.5:1, large text ≥ 3:1. Audit all
`text-white/50` (×9, 14 files), `/60` (×20) and `/65` (×12, +2 files); replace
every instance used for body copy with a token measured ≥ 4.5:1 against its
actual background, and **verify by computing the ratio, not by eye**. Visible
focus ring on every interactive element.
Preserve the existing `aria-hidden` canvases, `aria-live` spec panel, and the
`useScrollCaptions` keyboard-focus handling.

**Compatibility** — Full content and full usability with WebGL disabled, with
`prefers-reduced-motion: reduce`, and at 320px width.

---

## 8 · Phases — execute one, then stop

| Phase | Work | Done when |
|---|---|---|
| **0** | Recon. Record baseline: `pnpm build` output, typecheck error count, bundle sizes, screenshots of all 13 routes at 1440×900 and 390×844 into `docs/baseline/`. Write `docs/design-system.md` from §4. **No source changes.** | Baseline committed; design-system doc reviewed |
| **1** | Tokens + type + hex codemod in `index.css` and across all `.tsx`. Layout unchanged. | Hex count 197 → 7, every survivor a three.js colour argument; build passes; screenshots show the type and colour shift with *identical* structure |
| **2** | Primitives: `Reveal`, `RevealGroup`, `Surface`, `Eyebrow`, `SpecList`, `MediaFrame`, `Button`, `Chapter` (theme-switching section). | Storybook-free visual check page renders all variants in both themes |
| **3** | Chrome: Navbar, Footer, Breadcrumb, WhatsAppFloat. | Nav transparent→blurred verified in screenshots at scroll 0 and 400 |
| **4** | Home: chapter themes, re-scored hero, restaged journey chapters. | Journey scrubs at 60fps; hero legible at 320px and 1920px |
| **5** | 3D materials (§5A), `GalleryRig` (§5B), Configurator (§5C). | Screenshot of the same bottle before/after materials, side by side, in the PR body |
| **6** | Technology + Quality scroll scenes; Products editorial spreads. | Both new stages degrade cleanly with WebGL off |
| **7** | Remaining nine pages: About, Contact, Industries, Applications, Case Studies, Downloads, FAQ, Management Team, Career. | No page still uses `.section-pad` or the `bg-primary` header-band stripe |
| **8** | Asset pipeline (§5E), perf, a11y sweep. | Every §7 budget measured and recorded in `docs/budgets.md` |
| **9** | Full QA (§9). | All 13 routes × 3 viewports × 2 motion settings verified |

Commit at every phase boundary with a message naming the phase.

---

## 9 · Verification protocol — screenshots, not assertions

After **every** phase:

1. `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/productarmor-site build` — must pass.
2. Typecheck error count must not exceed the Phase 0 baseline.
3. Serve the build and capture headless Chromium screenshots of all 13 routes at
   **1440×900**, **768×1024** and **390×844**, into `docs/qa/phase-N/`.
4. **Look at them.** Compare against `docs/baseline/`. Any regression in
   legibility, overflow, overlap or contrast blocks the phase.
5. For pinned stages, capture at scroll progress 0, 0.25, 0.5, 0.75 and 1.0 —
   a pinned section that looks right at the top can break in the middle.
6. Re-run the whole set with `prefers-reduced-motion: reduce` forced.
7. Note: headless Chromium in most sandboxes lacks H.264, so video playback will
   not render. Verify the **poster and fallback path** instead, and say so
   explicitly rather than claiming playback works.

---

## 10 · Constraints

**Never change:** any user-facing copy, product name, spec value, certification,
statistic or claim; `artifacts/api-server/data/content.json`; the
`useGetSiteContent` data flow; `src/admin/**`; the wouter route table; the
`supportsImmersive()` fallback path.

**Never add:** GSAP · ScrollTrigger · Lenis · Locomotive · any smooth-scroll
library · `@react-three/postprocessing` · a CSS-in-JS runtime · a component
library · a second font service · Next.js · a state manager.

**May add** (only if a phase genuinely needs it): `@gltf-transform/cli` as a
devDependency for the asset step.

**Never:** put a `<canvas>` on every page · replace the ref-based scroll system
with React state · mutate a material reached through `useGLTF` · use
`font-weight` above 600 · write a hex literal inside a `className` · claim a
visual result you have not screenshotted.

**When this document and the code disagree, the code wins.** Every number here
was measured on the current tree; if a `grep` returns something else, say so in
your Phase 0 report rather than quietly working around it.

---

## 11 · How to judge your own work

Before declaring a phase done, ask:

- Could this page be any B2B manufacturer's, if you swapped the logo? If yes, it
  is not finished.
- Does colour carry meaning, or is it still separating sections?
- Is there one clear subject per screen, or several competing?
- Does the 3D tell a visitor something they could not learn from a photograph?
- Would a pharmaceutical procurement head trust this company more after
  scrolling than before?

**Start with Phase 0 now. Do not modify a source file until the baseline exists.**

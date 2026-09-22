# Phase 0 — baseline

Captured 2026-09-21. **No source file was modified.** Everything in this folder is a
measurement of the site as it stood before the redesign, plus the tools that took it
(`docs/qa/tools/`), so every later phase can be compared like-for-like.

## 0 · Read this first — two things blocked Phase 0 on 2026-09-21; both were resolved on 2026-09-22

### A. The tree the brief describes was not in git — resolved

When Phase 0 ran, `redesign/design-elevation` sat on commit `fb2cdc6`, the last commit
on `main`, which has **no 3D layer at all** — no `src/components/three/`, no
`src/components/video/`, no `three` / `@react-three/*` dependency, no models, no loops.
Everything the brief calls "the 3D layer that already exists" lived only as
**uncommitted changes in the main checkout's working tree**: 13 modified files,
44 new files, 1 deleted file, 42.7 MB (`data/source-manifest.txt` lists each with the
blob id `git add` would give it).

| | `fb2cdc6` | main working tree (what the brief measured) |
|---|---|---|
| `.tsx` files | 27 | 36 |
| `src/components/three/`, `video/` | missing | 10 + 3 files |
| hex literals (brief's grep) | 310 in 20 files | 345 in 28 files |
| `.reveal` uses | 38 | 42 |

**All numbers below were measured read-only against that working tree.**

**Resolved:** the feature is now commit `3df3cbe` on `main` ("Add scroll-driven 3D
stages and ambient video footage"), and this branch was rebased onto it. Every blob
the commit includes matches `data/source-manifest.txt` byte for byte (52 of 57,
checked with `git rev-parse 3df3cbe:<path>`), so the measurements describe this
branch's tree — with four deliberate exceptions that stayed uncommitted in the main
checkout because they are not part of the feature: the dev-only proxy in
`vite.config.ts`, the `allowBuilds: esbuild: set this to true or false` placeholder
in `pnpm-workspace.yaml`, the `_harness/` line in `.gitignore`, and the two
unreferenced GLBs (`pa19-bottle.glb`, `pacrc03-closure.glb`). That last one means
`public/models/` on this branch already holds only the six live models, and §5E.1 of
the brief is done by omission.

### B. `pnpm build`, the typecheck count and bundle sizes — resolved

1. **This machine has no Node.js** — no `node`, `npm`, `pnpm`, `corepack`, WSL or
   Docker. A checksum-verified portable Node 24.21.0 (`node-v24.21.0-win-x64.zip`
   from nodejs.org, SHA-256 `158f7685…9e541`) and pnpm 10.34.5 now live at
   `%LOCALAPPDATA%\Temp\pa\tool`, outside the repo.
2. **`pnpm-workspace.yaml` overrides every non-`linux-x64` native binary to `"-"`**
   ("replit uses linux-x64 only"), including `@esbuild/win32-x64`,
   `@rollup/rollup-win32-x64-msvc`, `lightningcss-win32-x64-msvc` and
   `@tailwindcss/oxide-win32-x64-msvc`, so the lockfile cannot build on Windows as
   committed. Builds therefore run from a **robocopy mirror** of the worktree at
   `%LOCALAPPDATA%\Temp\pa\repo` (a short path — `LongPathsEnabled` is off) with the
   five `win32-x64` override lines removed *in the copy only*. The mirror's
   `pnpm install` added exactly those native packages and nothing else; the repo's
   lockfile is untouched. Details in `docs/qa/tools/README.md`.
3. One trap for anyone building from Git Bash: MSYS rewrites `BASE_PATH=/` into
   `/Program Files/Git/`, and Vite silently builds with that base. Set
   `MSYS_NO_PATHCONV=1 MSYS2_ENV_CONV_EXCL='*'` (or build from PowerShell).

The three numbers are in §2, and the screenshots and audit in this folder were
**re-taken from the production build** once it existed (see "How the screenshots were
taken").

---

## 1 · What is here

```
docs/design-system.md              the §4 system, with measured contrast + decisions log
docs/baseline/
  README.md                        this report
  screenshots/{desktop,tablet,mobile}/   13 routes × 1440×900, 768×1024 and 390×844,
                                   from the production build of 3df3cbe
      <route>.fold.jpg             the first viewport, exactly W×H (mobile at 2×)
      <route>.full.jpg             the whole page at 1×
      pinned/<route>.pNNN.jpg      pinned stages at scroll progress 0 / .25 / .5 / .75 / 1
      capture-log.json             per page: height, overflow, canvases, WebGL renderer,
                                   videos, HTTP/console errors, heavy assets requested
  screenshots-reduced-motion/      Home + Products, three viewports, prefers-reduced-motion forced
  type-probe.jpg                   the brief's display-1 spec rendered with the real font
  data/
    build.log · typecheck.log · install.log · build-env.txt   the §2 evidence
    audit.json                     measured contrast + initial payload, all 13 routes (build)
    audit.harness.json             the same audit from the 2026-09-21 in-browser render
    recon-counts.txt               every grep behind the table in §3
    recon-scoped.txt               the same counts in three scopes (all / no admin / no admin+Career)
    recon-counts.committed-head.txt  the same script against commit fb2cdc6
    contrast-ramp.txt              WCAG ratios for the §4.2 ramp and today's colours
    source-manifest.txt            the once-uncommitted delta, file by file, with blob ids
docs/qa/tools/                     capture.ps1 · audit.ps1 · serve.ps1 · contrast.ps1 ·
                                   recon-*.sh · typeprobe.html   (see its README)
```

### How the screenshots were taken

The pages are the **production build** (`vite build` of `3df3cbe`, see §2), served
read-only by `docs/qa/tools/serve.ps1 -Dist`, which also stands in for the API's
public endpoints (`/api/content`, `/api/management-team`, `/api/uploads/*`) so every
route shows real data. `capture.ps1` drives the installed **Chrome 153 headless over
the DevTools protocol** from PowerShell — no Playwright, no dependency.

- The first pass on 2026-09-21, before a build existed, used the repo's no-Node
  preview shell (`_harness/index.html`: the real `src/` compiled in the browser by
  Babel, `index.css` through `@tailwindcss/browser@4`, packages from esm.sh). Its
  frames were visually identical to the build's; only `data/audit.harness.json` is
  kept from it.
- WebGL ran on the real GPU — `ANGLE (Intel Iris Xe, Direct3D11)` — not SwiftShader.
- Footage **did** decode (this is full Chrome, H.264 included): every `<video>`
  reached `readyState 4`. The brief's §9.7 caveat does not apply on this machine.
- Each page was scrolled once end-to-end before capture, so every `.reveal` /
  `.career-reveal` had fired (`revealPending: 0` on every load), and pinned stages
  were given 4 s to settle at each progress point.

---

## 2 · Build, typecheck, bundle

Measured on 2026-09-22 from the mirror of commit `3df3cbe` (Vite 7.3.6, Tailwind
4.3.3, three 0.185.1, Node 24.21.0, pnpm 10.34.5). Raw logs: `data/build.log`,
`data/typecheck.log`.

| Item | Baseline |
|---|---|
| `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/productarmor-site build` | **passes** — 2,367 modules, 8–19 s. One Rollup warning: the `Stage` chunk exceeds 500 kB minified. |
| `pnpm typecheck` | exit 2, **4 errors**, all `TS2322` in `src/admin/AdminDashboard.tsx` (lines 199, 227, 729 ×2). The libs build cleanly; the brief's "unbuilt api-client-react dist" explanation does not apply. **Later phases must not exceed 4.** |
| Entry JS `index-*.js` | 558.8 kB raw · **163.5 kB gz** (gzip -6; Vite reports 164.1) — §7 budget ≤ 180 kB ✓ |
| Lazy three chunk `Stage-*.js` (three + fiber + drei) | 1,033.9 kB raw · **284.0 kB gz** (Vite 285.7) — §7 budget ≤ 320 kB ✓ |
| CSS `index-*.css` | 91.5 kB raw · 15.4 kB gz |
| Scene chunks | `Html` 3.1 · `HomeJourneyScene` 2.7 · `ShowroomScene` 2.2 · `Hero3D` 1.6 kB gz |
| `index.html` | 3.5 kB |

The three scenes are already code-split (`lazy(() => import("./HomeJourneyScene"))`,
`ShowroomScene`, `Hero3D`); all 13 pages sit in the entry chunk; of ~60 declared
dependencies only `lucide-react`, `three`, `@react-three/fiber`, `@react-three/drei`,
`@radix-ui/react-toast` and `@radix-ui/react-tooltip` reach the public bundle.
Both JS budgets are met before the redesign starts — Phase 8's job is to keep them
met once `framer-motion` and the configurator arrive.

---

## 3 · The brief, checked against the code

"When this document and the code disagree, the code wins." ✓ = confirmed as written.

| Brief | Claim | Measured | |
|---|---|---|---|
| §1 | Vite ^7.3.2 · React 19.1.0 · TS 5.9 · Tailwind ^4.1.14 · wouter · three ^0.185 · fiber ^9.7 · drei ^10.7 | same (`three ^0.185.1`, `fiber ^9.7.0`, `drei ^10.7.8`, TS `~5.9.3`) | ✓ |
| §1 | `framer-motion ^12.23.24` installed, imported by zero files | 0 imports | ✓ |
| §1 | `ui/` holds card, toast, toaster, tooltip; **nothing imports `ui/card`** | `pages/not-found.tsx` imports it | ✗ minor |
| §1 | No `tailwind.config.js`; tokens are HSL triplets in `index.css` | confirmed | ✓ |
| §1 | `pnpm typecheck` has pre-existing failures "from the unbuilt `@workspace/api-client-react` dist" | 4 pre-existing errors, but all are `TS2322` inside `src/admin/AdminDashboard.tsx`; the libs build first and cleanly | ✗ cause |
| §1 | Build needs `PORT` and `BASE_PATH` or Vite throws | confirmed; passes with them (§2) | ✓ |
| §1 | 13 public routes + `/admin`, `/admin/dashboard` | confirmed in `App.tsx` | ✓ |
| §1 | 6 referenced GLBs = 17.8 MB; 2 orphans = 1.9 MB | 18,660,760 B (17.80 MiB); 1,858,188 B | ✓ |
| §1 | 7 loops × mp4+webm, 8 posters, `facility.webm` 7.8 MB | 14 files 15.3 MB; 8 posters; 8,168,791 B | ✓ |
| §1 | `hero-bg.jpg` 3.4 MB, referenced only via `content.json` | 3,582,306 B; only `hero.backgroundImage` | ✓ |
| §1 | 14 client logos, 5 certifications | 14, 5 | ✓ |
| §2.1 | All 11 inner pages open on `bg-primary section-pad` | 11 (+ Career, which opens on `bg-navy` and is never mentioned) | ✓ |
| §2.1 | CTA `bg-primary`: About, Management, Products, Quality · `bg-navy`: six others | confirmed | ✓ |
| §2.2 | Headline 158 chars / 19 words; first comma ends the first clause | 158 / 19; comma at index 80 | ✓ |
| §2.2 | "`font-extrabold` / `font-black` everywhere" | in `.tsx`: `font-black` ×7, `font-extrabold` ×0, `font-bold` ×20. The weight comes from 5 `.heading-*` classes + two `font-weight: 800` rules. Rendered: **8.7 % of all characters are above 600** (700 8.1 % · 800 0.4 % · 900 0.2 %) | ~ overstated |
| §2.3 | **197 hex literals across 24 files** | **345 in 28 files.** 197/24 is what is left after excluding `src/admin/**` (83) *and* `pages/Career.tsx` (65) | ✗ |
| §2.3 | 7 legitimate three.js colour args; 22 className literals inside `three/` | 7 and 22 (29 total) | ✓ |
| §2.3 | `#4164a8` ×90 · `#0f2a4e` ×53 · `#93b4e8` ×17 | true in the brief's scope; ×157 / ×64 / ×17 over all of `src` | ~ |
| §2.4 | `#32CD32`, `#25D366`, blue `--accent` vs orange `--accent-border`, orange dark `--accent` | confirmed; `#25D366` is ×6 in **3** files (float, Contact, Home); dark `--accent-border` and `--chart-2` are orange too | ✓ + |
| §2.5 | `.reveal` ×43 on 7 pages, Home 14 | **×42, Home 13** — the 14th hit is the `querySelectorAll(".reveal")` line itself | ✗ minor |
| §2.5 | seven `querySelectorAll(".reveal")` blocks | 7, spelled `querySelectorAll<HTMLElement>(".reveal")` | ✓ |
| §2.5 | Zero reveals on Career | zero `.reveal` — but Career runs its **own** `.career-reveal` system (20 uses, inline `<style>`, own observer) | ✗ |
| §2.6 | `toneMapping` / `outputColorSpace` / `onCreated` appear 0× | 0 | ✓ |
| §2.8 | `.card-standard` = `bg-card rounded-xl shadow-sm border border-card-border` | confirmed; 10 uses in 7 files | ✓ |
| §2.9 | `/50` ×9, `/60` ×20 in 14 files; `/65` ×12 → 16 files | brief's scope only. Non-admin: `/60` ×23, 15 → 17 files | ~ |
| §2.9 | "None of these clear WCAG AA" | **false on navy, true on `bg-primary`** — see §5 | ✗ |
| §2.10 | 3.4 MB hero image "downloaded to be shown at 6 %" | **only on the non-immersive path.** Never requested in the immersive journey (0 of 26 loads); requested on both reduced-motion Home loads | ~ |
| §4.4 | Curve hardcoded 4×; no `--ease-*` / `--dur-*` | lines 227, 240, 245, 274; none | ✓ |
| §4.3 | `--radius-sm/md/lg/xl` derived from `--radius: 0.5rem` | confirmed | ✓ |
| §5 | `dpr` [1,2] on Hero3D, [1,1.75] on both journeys; `frameloop` parked on all three | confirmed | ✓ |
| §5 | Canvases `aria-hidden`; Showroom spec panel `aria-live="polite"` | `Showroom.tsx:164` | ✓ |
| §5E.4 | `HomeJourneyScene` "correctly preloads only `pa04` + `pacrc03`" | the two `preload` calls, yes — but the scene **mounts** a `RealModel` for every line-up bottle under `visible={false}` (l. 297–306), so all six GLBs are fetched at first paint. **Home pulls 20.1 MB before any scroll** | ✗ |
| §5E.4 | `ShowroomScene.tsx:10` preloads all six | confirmed; `/products` pulls 18.0 MB before any scroll | ✓ |
| §6 | Unsplash fallbacks in Home, Technology, Products | 5 occurrences / 2 URLs / those 3 files | ✓ |
| §6 | Home cert band = glass tiles on `bg-primary`; Quality tiles `border-2 border-primary/10 rounded-2xl` | `Home.tsx:362`; `Quality.tsx:46, 72` | ✓ |
| §6 | `content.json` holds 4 products | 4 | ✓ |

---

## 4 · Findings the brief does not contain

1. **Career is a different design language** — 574 lines, 65 hex literals in a private
   14-colour palette including 14 ambers, 7 headings in **Georgia** (`font-serif`),
   its own tracking/leading literals, a `whitespace-nowrap text-[1.1rem]` `<h1>` on
   phones, an inline `<style>` block and a private reveal system. Every headline
   number in the brief silently excludes it.
2. **A second token leak the hex grep cannot see:** 97 Tailwind default-palette
   utilities in 16 non-admin files (`text-gray-500` ×42, `text-gray-600` ×20,
   `text-gray-400` ×14, `bg-gray-200` ×6 …). Two of them are top-five contrast
   failures.
3. **The Phase 1 gate is unreachable as written** — 345 → 7 needs edits inside
   `src/admin/**` (83 literals), which §10 forbids. Restated in
   `docs/design-system.md` §9 as 262 → 7 with `--exclude-dir=admin`.
4. **`About.tsx` still asks for `facility.mp4`, which does not exist** — a 404 on
   every visit. At `fb2cdc6` the path is a 3-line **Git LFS pointer** to a 126 MB
   file (`.gitattributes` routes it through LFS); the working tree deletes it and
   ships `facility.webm` instead. Chrome falls through to the WebM; a browser
   without VP9/WebM gets the poster only. Fix in §5E.5's pass (add an H.264 encode at
   loop budget, or drop the `<source>`), and retire the LFS rule with it.
5. **`"cv11"` and `"ss01"` do nothing on Google-hosted Inter** (`type-probe.jpg`);
   `tnum` works.
6. **`display-1` overflows at 320px** ("pharmaceutical" 288.6px in a 272px box) and
   runs to **7 lines / ≈ 640px** in the pinned hero's 46 % column — it does not fit a
   768px-tall viewport. Measured; details in `docs/design-system.md` §2.4.
7. **Two ramp roles fail the brief's own AA budget:** `--ink-400` "captions" is
   3.00:1 on white; `--eco-600` is 4.18:1 (large text only).
8. **`.dark` is dead code** — no provider, no `dark:` utility anywhere — so it is free
   to become the gallery-chapter scope.
9. `Breadcrumb.tsx:8` carries `#4164a8` in a comment, which the gate counts. Two hex
   values are SVG attributes, not classes (`Home.tsx:115` stroke, `:484` fill).
10. The workspace's uncommitted `pnpm-workspace.yaml` ends with a pnpm placeholder,
    `allowBuilds: esbuild: set this to true or false` — someone must answer it
    before the next install.

---

## 5 · Accessibility baseline (measured, not eyeballed)

`audit.ps1` walks every visible text node at 1440×900, composites its colour over
the real rendered background and computes the WCAG ratio. The figures below come
from the production build (`data/audit.json`, 2026-09-22); the in-browser render of
the day before (`data/audit.harness.json`) gives the identical 968 / 180 / 33 and the
identical weight histogram, node for node.

**180 of 968 text nodes (18.6 %) fail AA.** 33 more sit over footage, a gradient or
a canvas and are reported as *unresolved* rather than guessed. Rendered weight, by
character: 400 79.7 % · 500 2.2 % · 600 9.3 % · **700 8.1 % · 800 0.4 % · 900 0.2 %** —
the 8.7 % above 600 is the figure Phase 1 must take to zero.

| Route | Text nodes | Fail | Unresolved |
|---|---|---|---|
| `/` | 125 | 27 | 2 |
| `/products` | 97 | 10 | 28 |
| `/industries` | 60 | 13 | 0 |
| `/applications` | 70 | 14 | 0 |
| `/technology` | 91 | 16 | 0 |
| `/downloads` | 49 | 10 | 0 |
| `/case-studies` | 91 | 13 | 0 |
| `/career` | 97 | 17 | 1 |
| `/faq` | 53 | 9 | 0 |
| `/about` | 61 | 14 | 0 |
| `/management-team` | 50 | 10 | 0 |
| `/quality` | 72 | 11 | 2 |
| `/contact` | 52 | 16 | 0 |

The brief's diagnosis needs correcting. Translucent white **passes on navy**
(`/50` 4.66 · `/60` 6.10 · `/65` 6.86) and **fails on the mid-tone `bg-primary`
band**, where nothing under `white/82` reaches 4.5:1 — including the `/70` (×13) and
`/80` (×18) the brief never lists. The biggest single group is `text-white/40` in the
footer (3.53:1, 52 nodes, every route); the next is `text-gray-400` on white
(2.60:1). Full table in `docs/design-system.md` §3.5; raw data in `data/audit.json`.

No route overflows horizontally at 1440, 768 or 390px (`horizontalOverflowPx: 0` on
all 39 loads), every load booted, and the only HTTP or console error across the set
is the `facility.mp4` 404 on `/about` (§4.4).

---

## 6 · Payload baseline

Local media requested **before any scroll** (`audit.json → initialHeavyAssets`):

| Route | Before scroll | What |
|---|---|---|
| `/` | **20.1 MB** | all six GLBs (17.8 MiB) + `products-line.mp4` + posters/logos |
| `/products` | **18.0 MB** | all six GLBs |
| `/about` | 3.6 MB | three film clips (+ the `facility.mp4` 404) |
| `/quality` | 0.4 MB | posters and certification logos |
| others | < 0.3 MB | — |

With `prefers-reduced-motion` forced, Home requests 6.9 MB over a **whole-page**
scroll at every viewport (`screenshots-reduced-motion/capture-log.reduced-motion.json`):
`hero-bg.jpg` 3.4 MB — shown at 6 % opacity — plus `pa04-150cc.glb` 2.7 MB for
`Hero3D`, which is itself a WebGL canvas.

`public/` is 49.1 MB in 61 files (47.2 MB once the two orphan GLBs are left out, as
on this branch). JS and CSS weight is in §2.

---

## 7 · What the screenshots show (looked at, per §9.4)

- **Home, immersive** — the 158-character headline at weight 800 is a seven-line
  wall in blue with a neon-lime word; the bottle renders as flat matte white.
- **Home, reduced motion** — the same headline at `lg:text-6xl font-extrabold` runs
  to **eleven lines and pushes the sub-headline and both CTAs below a 1440×900
  fold.**
- **Home / Products at 390px** — the WhatsApp FAB sits on top of the "Request a
  Sample" CTA's arrow; in the Showroom the height label is clipped at the right edge
  ("94 mn").
- **Products Showroom, desktop, progress 0.25** — a resting state, not a settling
  artefact (identical after a 4 s settle): the incoming bottle and its ruler sit
  *behind the spec copy*, and the outgoing bottle overlaps the index rail. Between
  steps the models travel through the text column.
- **Eleven inner pages** are the same page: `bg-primary` band → white → grey → navy →
  CTA band. Career alone looks different (serif, amber, hairlines).
- **768px** — the desktop navbar is still in use one breakpoint too early: five
  links, the search field and the "Contact Us" button share 768px, and the button
  wraps onto two lines (every route, `screenshots/tablet/*.fold.jpg`). Phase 3
  (Navbar) must collapse search to an icon below `lg`, as the brief's §6 says.
- **About** — `ImmersiveFilm` plays; captions sit bottom-left over footage with the
  `.pa-on-footage` halo and stay legible.
- **Management Team** — seven profiles with photos render once the API shim is
  present; without it the page silently shows "Team profiles coming soon".

---

## 8 · Reproduce

```powershell
# 1. serve a tree (read-only). -Repo is the checkout that contains the work.
powershell -ExecutionPolicy Bypass -File docs\qa\tools\serve.ps1 -Repo <repo> -Harness <repo>\_harness -Port 4173
#    ...or a production build:  -Dist <repo>\artifacts\productarmor-site\dist\public

# 2. screenshots (add -Viewports desktop,tablet,mobile and -ReducedMotion for §9 of the brief)
powershell -ExecutionPolicy Bypass -File docs\qa\tools\capture.ps1 -OutDir docs\qa\phase-N -PublicDir <repo>\artifacts\productarmor-site\public

# 3. measured contrast + initial payload
powershell -ExecutionPolicy Bypass -File docs\qa\tools\audit.ps1 -OutFile docs\qa\phase-N\audit.json -PublicDir <repo>\artifacts\productarmor-site\public
```

```bash
# 4. the counts behind §3
bash docs/qa/tools/recon-counts.sh  <repo>/artifacts/productarmor-site
bash docs/qa/tools/recon-scoped.sh  <repo>
```

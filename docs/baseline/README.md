# Phase 0 — baseline

Captured 2026-09-21. **No source file was modified.** Everything in this folder is a
measurement of the site as it stood before the redesign, plus the tools that took it
(`docs/qa/tools/`), so every later phase can be compared like-for-like.

## 0 · Read this first — two things block a complete Phase 0

### A. The tree the brief describes is not in git, and not on this branch

`redesign/design-elevation` was cut from commit `fb2cdc6`, the last commit on `main`.
That commit has **no 3D layer at all** — no `src/components/three/`, no
`src/components/video/`, no `three` / `@react-three/*` dependency, no models, no loops.
Everything the brief calls "the 3D layer that already exists" lives only as
**uncommitted changes in the main checkout's working tree**: 13 modified files,
44 new files, 1 deleted file, 42.7 MB (`data/source-manifest.txt` lists each with the
blob id `git add` would give it).

| | committed `fb2cdc6` (this branch) | main working tree (what the brief measured) |
|---|---|---|
| `.tsx` files | 27 | 36 |
| `src/components/three/`, `video/` | missing | 10 + 3 files |
| hex literals (brief's grep) | 310 in 20 files | 345 in 28 files |
| `.reveal` uses | 38 | 42 |

**All numbers below were therefore measured read-only against the main checkout's
working tree, not against this branch.** Phase 1 cannot start until that work is on
this branch (commit it on `main` and rebase, or import it here as a first commit).

### B. `pnpm build`, the typecheck count and bundle sizes could not be recorded

1. **This machine has no Node.js** — no `node`, `npm`, `pnpm`, `corepack`, WSL or
   Docker (searched `PATH`, Program Files, the user profile, nvm/fnm/volta/scoop
   locations). Neither checkout has a `node_modules`.
2. **Installing Node would not be enough.** `pnpm-workspace.yaml` overrides every
   non-`linux-x64` native binary to `"-"` ("replit uses linux-x64 only") — including
   `@esbuild/win32-x64`, `@rollup/rollup-win32-x64-msvc`,
   `lightningcss-win32-x64-msvc` and `@tailwindcss/oxide-win32-x64-msvc`. Vite,
   Rollup, Lightning CSS and Tailwind's Oxide engine cannot start on Windows from
   this lockfile. The brief's build command only works on Linux (Replit) as written.

So three Phase 0 numbers are **not recorded**: build output, typecheck error count,
bundle sizes — and with them the §7 JS budgets (initial ≤ 180 KB gz, three chunk
≤ 320 KB gz). Ways to unblock, in order of fidelity: run the three commands on
Replit and paste the output here; or a portable Node + a *scratch copy* of the repo
with the Windows exclusions lifted (repo untouched); or WSL.

Everything else in Phase 0 is done.

---

## 1 · What is here

```
docs/design-system.md              the §4 system, with measured contrast + open questions
docs/baseline/
  README.md                        this report
  screenshots/{desktop,mobile}/    13 routes × 1440×900 and 390×844
      <route>.fold.jpg             the first viewport, exactly W×H (mobile at 2×)
      <route>.full.jpg             the whole page at 1×
      pinned/<route>.pNNN.jpg      pinned stages at scroll progress 0 / .25 / .5 / .75 / 1
      capture-log.json             per page: height, overflow, canvases, WebGL renderer,
                                   videos, HTTP/console errors, heavy assets requested
  screenshots-reduced-motion/      Home + Products with prefers-reduced-motion forced
  type-probe.jpg                   the brief's display-1 spec rendered with the real font
  data/
    recon-counts.txt               every grep behind the table in §3
    recon-scoped.txt               the same counts in three scopes (all / no admin / no admin+Career)
    recon-counts.committed-head.txt  the same script against commit fb2cdc6
    contrast-ramp.txt              WCAG ratios for the §4.2 ramp and today's colours
    audit.json                     measured contrast + initial payload, all 13 routes
    source-manifest.txt            the uncommitted delta, file by file
docs/qa/tools/                     capture.ps1 · audit.ps1 · serve.ps1 · contrast.ps1 ·
                                   recon-*.sh · typeprobe.html   (see its README)
```

### How the screenshots were taken — and their one caveat

There is no build, so the pages were rendered by the repo's own no-Node preview
shell (`_harness/index.html`, in the main checkout): the **real `src/`** compiled in
the browser by Babel, the real `index.css` through `@tailwindcss/browser@4`, packages
from esm.sh at the versions pinned in `package.json`. `docs/qa/tools/serve.ps1`
serves it read-only and stands in for the API's public endpoints (`/api/content`,
`/api/management-team`, `/api/uploads/*`) so every route shows real data.
`capture.ps1` drives the installed **Chrome 153 headless over the DevTools protocol**
from PowerShell — no Playwright, no dependency.

- It is **not the production bundle.** Layout, type, colour and 3D are the real
  code; load timing, chunking and font-loading behaviour are not. Re-take the
  baseline from `dist/` once a build exists, with the same tool
  (`serve.ps1 -Dist …`), before comparing anything timing-sensitive.
- WebGL ran on the real GPU — `ANGLE (Intel Iris Xe, Direct3D11)` — not SwiftShader.
- Footage **did** decode (this is full Chrome, H.264 included): every `<video>`
  reached `readyState 4`. The brief's §9.7 caveat does not apply on this machine.
- Each page was scrolled once end-to-end before capture, so every `.reveal` /
  `.career-reveal` had fired (`revealPending: 0` on all 26 loads).

---

## 2 · Build, typecheck, bundle

| Item | Baseline |
|---|---|
| `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/productarmor-site build` | **not run — blocked (§0.B)** |
| `pnpm typecheck` error count | **not recorded — blocked** |
| Initial JS / lazy three chunk (gz) | **not recorded — blocked** |

What can be said without a build: the three scenes are already code-split
(`lazy(() => import("./HomeJourneyScene"))`, `ShowroomScene`, `Hero3D`), all 13 pages
sit in the entry chunk, and of ~60 declared dependencies only `lucide-react`,
`three`, `@react-three/fiber`, `@react-three/drei`, `@radix-ui/react-toast` and
`@radix-ui/react-tooltip` are imported by the public site. `vite.config.ts` does
throw without `PORT` and `BASE_PATH` (confirmed by reading it).

---

## 3 · The brief, checked against the code

"When this document and the code disagree, the code wins." ✓ = confirmed as written.

| Brief | Claim | Measured | |
|---|---|---|---|
| §1 | Vite ^7.3.2 · React 19.1.0 · TS 5.9 · Tailwind ^4.1.14 · wouter · three ^0.185 · fiber ^9.7 · drei ^10.7 | same (`three ^0.185.1`, `fiber ^9.7.0`, `drei ^10.7.8`, TS `~5.9.3`) | ✓ |
| §1 | `framer-motion ^12.23.24` installed, imported by zero files | 0 imports | ✓ |
| §1 | `ui/` holds card, toast, toaster, tooltip; **nothing imports `ui/card`** | `pages/not-found.tsx` imports it | ✗ minor |
| §1 | No `tailwind.config.js`; tokens are HSL triplets in `index.css` | confirmed | ✓ |
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
the real rendered background and computes the WCAG ratio.

**180 of 968 text nodes (18.6 %) fail AA.** 33 more sit over footage, a gradient or
a canvas and are reported as *unresolved* rather than guessed.

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

No route overflows horizontally at 390px (`horizontalOverflowPx: 0` on all 13).

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
scroll (`screenshots-reduced-motion/capture-log.reduced-motion.json`): `hero-bg.jpg`
3.4 MB — shown at 6 % opacity — plus `pa04-150cc.glb` 2.7 MB for `Hero3D`, which is
itself a WebGL canvas.

`public/` is 49.1 MB in 61 files. JS/CSS weight is unknown until a build exists.

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

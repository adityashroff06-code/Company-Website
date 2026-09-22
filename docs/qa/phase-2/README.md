# Phase 2 — primitives

Verified 2026-09-22 against the production build of this commit, with the same tooling and
protocol as the baseline and Phase 1 (`docs/qa/tools/`). Brief §8, Phase 2: *"Primitives:
`Reveal`, `RevealGroup`, `Surface`, `Eyebrow`, `SpecList`, `MediaFrame`, `Button`, `Chapter`
(theme-switching section)."* Done when: *"Storybook-free visual check page renders all variants
in both themes."*

What was built and why is the decisions log in `docs/design-system.md` §11 (Phase 2 entry).

## 1 · Gates

| Gate | Phase 1 | Phase 2 | |
|---|---|---|---|
| `.reveal` class and `querySelectorAll(".reveal")` observers | 1 class, 7 observers | **0, 0** | ✓ |
| Career's private `.career-reveal` system (inline `<style>`, observer, usages) | 1, 1, 20 | **0, 0, 0** | ✓ |
| routes carrying a scroll reveal | 7 of 13 | **13 of 13** (`Reveal` on every page; header bands excluded until Phase 7) | ✓ |
| primitives with a `.pa-*` class or utility recipe | — | `Chapter`, `Container`, `Surface`, `Eyebrow`, `SpecList`, `MediaFrame`, `Button`, `Reveal`, `RevealGroup` | ✓ |
| check page renders every variant in both themes | — | `/dev/primitives`: light and gallery `Chapter`, 6 blocks each (`primitives/`) | ✓ |
| check page absent from the production bundle (`grep -l "dev/primitives\|PrimitivesCheck" dist/public/assets/*.js`) | — | **none** | ✓ |
| public route table | 13 + 2 admin | unchanged | ✓ |
| `pnpm typecheck` errors | 4 (all `src/admin/AdminDashboard.tsx`) | **4**, the same lines | ✓ |
| build | passes | passes, 9.3 s | ✓ |
| entry JS (gzip -6) | 163.2 KB | **177.5 KB** (framer-motion `m` + `LazyMotion`; features are a lazy chunk) | ✓ ≤ 180 |
| framer-motion animation features | not loaded | **14.0 KB gz, lazy chunk** `features-*.js` | ✓ |
| three chunk (gzip -6) | 284.0 KB | **284.0 KB** | ✓ ≤ 320 |
| CSS (gzip -6) | 15.7 KB | **16.6 KB** (+ the `.pa-*` classes and the gallery scope) | ✓ |
| hex literals in non-admin `.tsx` / inside a `className` | 7 / 0 | **7 / 0** | ✓ |
| `font-weight` above 600 in `.tsx` or CSS | 0 | **0** | ✓ |

Logs: `data/build-and-typecheck.log` (typecheck, the production build, the `--mode qa` build).
Audit: `data/audit.json` (compare with `docs/qa/phase-1/data/audit.json`).

**Entry-budget note.** With `domAnimation` bundled synchronously the entry measured
**189.4 KB gz**, over the budget; loading it through `LazyMotion`'s async form brings the entry
to 177.5 KB and ships the features as a 14.0 KB chunk fetched immediately after the entry. Only
2.5 KB of headroom remain for Phases 3–7; Phase 8's option is to lazy-load the two admin routes,
which are statically imported into the entry today.

## 2 · Accessibility — measured, not eyeballed

| | Phase 1 | Phase 2 |
|---|---|---|
| text nodes audited (13 routes, 1440×900) | 968 | **968** |
| failing AA | 141 of 968 (14.6 %) | **141 of 968 (14.6 %)** — the same count on every route |
| unresolved (over footage / gradient / canvas) | 33 | 33 |

Per route: `/` 18 · `/products` 10 · `/industries` 9 · `/applications` 9 · `/technology` 15 ·
`/downloads` 9 · `/case-studies` 9 · `/career` 14 · `/faq` 9 · `/about` 10 ·
`/management-team` 10 · `/quality` 10 · `/contact` 9 — Phase 1's numbers, unchanged.

The only colour that moved on the pages this phase is `--card` (white → `--surface-1`,
#FAFBFD); `--ink-500` body on it still measures 5.88:1. The 141 remaining pairs are the
ones Phase 1 listed by owner: the `bg-primary` header bands (Phase 7), the footer's
`text-white/40` and its "Admin" link and the WhatsApp pill (Phase 3), Home's glass
certification tiles (Phase 4), Technology's watermark numerals (Phase 6), Career's
openings meta (Phase 7).

The gallery scope's own pairs were computed rather than audited on a route, since none of
the 13 routes carries a gallery chapter yet: white on ink-900 18.19:1, the 72 % body mix
9.74:1, brand-300 links and eyebrows 10.26:1, ink-400 captions 6.06:1
(`docs/design-system.md` §3.2, §3.4).

## 3 · Screenshots — what to look at

`screenshots/{desktop,tablet,mobile}/` — 13 routes, fold + full page, pinned stages at
0 / .25 / .5 / .75 / 1; `screenshots-reduced-motion/` — the same 13 routes with
`prefers-reduced-motion` forced; `primitives/{desktop,tablet,mobile}/dev_primitives.*` and
`primitives-reduced-motion/desktop/` — the check page. Same file names as Phase 1, so any
pair diffs directly.

Looked at, page by page, against Phase 1:

- **Every route has the same sections in the same order, and every section is present in
  the full-page capture.** The capture scrolls each page once, so every `Reveal` has fired
  and nothing is left at opacity 0 — compared block by block on Home, Technology,
  Applications, Career (the page that had its own reveal system), Quality and About at
  1440, and on Home at 768 and 390.
- **The one visible change on the pages** is the `--card` re-pointing: the `.card-standard`
  cards (Technology's process and capability grids, Applications, Industries, Case Studies,
  Downloads, FAQ) and the Home product cards sit at `--surface-1` (#FAFBFD) instead of pure
  white — a 2 % tint that reads as depth against the white sections and does nothing on the
  grey ones. Their borders, radii and shadows are unchanged until Phases 4–7.
- **Reduced motion** — every route renders complete, with no inline style on any `Reveal`
  (the plain-element path); Home is the classic static layout, as before.
- **Check page, light chapter** (`primitives/desktop/dev_primitives.full.jpg`, top half):
  the seven steps of the type scale plus both eyebrow tones; five buttons (primary, outline,
  light on an ink-900 swatch, disabled, external); four surfaces (static, interactive with a
  button, media slot, `padding="lg"`); three media frames (16/10 with shadow, 1/1 `md`
  without, 4/3 `2xl` with a caption); the two spec lists; the six-card reveal grid and the
  lone reveal.
- **Check page, gallery chapter** (bottom half): the same blocks under the `.dark` scope —
  ink-900 page, ink-800 surfaces, white headings (`heading-card` flips through `--navy`),
  the 72 % white body mix, brand-300 eyebrows and primary fill with an ink-900 label, a
  white outline ring, white/10 rules on the spec lists, the light button plain white.
- **Check page at 768 and 390** — the grids collapse to two and one columns; no overflow at
  any width (`primitives/capture-log.json`).
- **The hidden → revealed states, measured** (`docs/qa/tools/reveal-probe.ps1`, headless
  Chrome at 1440×900, Reveal elements only — the pinned stages drive their own captions'
  opacity from scroll refs and are excluded):

  | Route | Reveals | hidden at load (2.5 s after boot) | visible above the fold | hidden after one scroll pass |
  |---|---|---|---|---|
  | `/` | 23 | 23 (all sit below the pinned journey) | 0 | **0** |
  | `/technology` | 22 | 18 | 4 | **0** |
  | `/career` | 18 | 16 | 2 | **0** |
  | `/about` | 8 | 6 | 2 | **0** |
  | `/products` | 6 | 6 | 0 | **0** |

  No element was caught mid-transition after the 1.5 s settle. The lazy features chunk had
  loaded on every route before the first count, so the below-the-fold reveals had already
  snapped hidden; the two Career and four Technology blocks that were on screen at boot
  were mounted static and never flashed. `/about` requested `facility.mp4` exactly once
  (one 404, as in Phase 1); an earlier design of `Reveal` that swapped a plain element for
  the motion element when the chunk arrived remounted the clip and requested it twice,
  which is why it was replaced.

## 4 · Not in this phase

Page-level adoption of `Chapter` / `Surface` / `Button` (the pages keep `.section-pad`,
`.container-width`, `.card-standard` and `.btn-*` until Phases 4–7 re-set them) · the Navbar,
Footer, Breadcrumb and WhatsApp float (Phase 3) · the hero re-score (Phase 4) · the
translucent-white audit and the global focus ring (Phase 8) · the `facility.mp4` 404 and the
asset pipeline (Phase 8) · anything under `src/admin/`.

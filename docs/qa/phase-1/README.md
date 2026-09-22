# Phase 1 — tokens, type scale, weight cap, hex codemod

Verified 2026-09-22 against the production build of this commit, with the same
tooling and protocol as the baseline (`docs/qa/tools/`). Brief §8, Phase 1: *"Tokens +
type + hex codemod in `index.css` and across all `.tsx`. Layout unchanged."* Done
when: *"hex count → 7, every survivor a three.js colour argument; build passes;
screenshots show the type and colour shift with identical structure."*

What was changed and why is the decisions log in `docs/design-system.md` §11.

## 1 · Gates

| Gate | Baseline | Phase 1 | |
|---|---|---|---|
| hex literals in non-admin `.tsx` (`grep -rhoiE '#[0-9a-f]{6}' src --include=*.tsx --exclude-dir=admin`) | 262 | **7** | ✓ |
| … of which inside a `className` | 255 | **0** | ✓ |
| survivors are three.js colour arguments | — | `Stage.tsx` 4 × `Lightformer`, `ContactShadows`, `FloorGlow` default; `ShowroomScene.tsx` `lineBasicMaterial` | ✓ |
| Tailwind default-palette utilities (`gray-*`, `red-*`, `green-*`, `blue-*`) | 97 | **0** | ✓ |
| `font-bold` / `font-black` / `font-extrabold` in `.tsx`; `font-weight` > 600 in CSS | 27; 2 | **0; 0** | ✓ |
| `font-serif` / `font-mono` (Georgia, Menlo) in `.tsx` | 9 | **0** | ✓ |
| **rendered** characters above weight 600 (`audit.json → fontWeights`, 13 routes) | **8.7 %** (700 8.1 · 800 0.4 · 900 0.2) | **0 %** (400 79.4 · 500 2.3 · 600 18.3) | ✓ |
| `pnpm typecheck` errors | 4 (all `src/admin/AdminDashboard.tsx`) | **4**, the same lines | ✓ |
| build | passes | passes, 9.6 s | ✓ |
| entry JS · three chunk · CSS (gzip -6) | 163.5 · 284.0 · 15.4 KB | **163.2 · 284.0 · 15.7 KB** | ✓ within §7 |
| text nodes per route (structure proxy) | 968 | **968**, identical on every route | ✓ |
| horizontal overflow at 1440 / 768 / 390 | 0 | **0** on all 39 loads | ✓ |
| HTTP / console errors | `facility.mp4` 404 on `/about` | the same, nothing new | ✓ |

Logs: `data/build-and-typecheck.log`. Audit: `data/audit.json` (compare with
`docs/baseline/data/audit.json`).

## 2 · Accessibility — measured, not eyeballed

| | Baseline | Phase 1 |
|---|---|---|
| text nodes failing AA | 180 of 968 (18.6 %) | **141 of 968 (14.6 %)** |
| unresolved (over footage / gradient / canvas) | 33 | 33 |

Per route: `/` 27→18 · `/products` 10→10 · `/industries` 13→9 · `/applications` 14→9 ·
`/technology` 16→15 · `/downloads` 10→9 · `/case-studies` 13→9 · `/career` 17→14 ·
`/faq` 9→9 · `/about` 14→10 · `/management-team` 10→10 · `/quality` 11→10 ·
`/contact` 16→9.

**Fixed by the token swap** (present in the baseline, gone now): `text-gray-400` on
white (2.60:1, 20 nodes), `text-gray-500` on the grey band (4.39:1, 15 nodes), the
`#32CD32` "sustainable" (2.12:1), Career's ambers on the primary band, and the
`text-white/50` / `/65` / `/80` variants that sat on the old `#4164a8`. Every body
colour on a light surface is now `--ink-500` (6.08:1 on white, 5.51:1 on `surface-2`).

**Still failing, by design of the phase split:**

| Pair | Ratio | Nodes | Owner |
|---|---|---|---|
| `text-white/40` on the navy footer | 3.44 | 52 | Phase 3 (Footer) / Phase 8 |
| `text-white/60`, `/65`, `/80` on the `bg-primary` header bands | 3.5–3.9 | 40 | Phase 7 removes the bands |
| `text-white/30` footer "Admin" link | 2.54 | 13 | Phase 3 |
| white on the WhatsApp `#25D366` pill | 1.98 | 13 | Phase 3 (neutral pill, green glyph) |
| `text-primary/15` step numerals on Technology | 1.24 | 6 | decorative watermark; Phase 6 editorial sequence |
| `text-accent` cert years on Home's glass tiles | 2.88 | 5 | Phase 4 moves them to `surface-0` |
| Career openings meta, `text-navy/70` eyebrow on `bg-accent` | 3.2–3.9 | 7 | Phase 7 |

One number moved the wrong way by a hair: `text-white/40` on the footer measures
3.44:1 against `--ink-700` where it measured 3.53:1 against the old `#0F2A4E` (the
new navy is fractionally lighter). It was failing before and is replaced in Phase 3.

## 3 · Screenshots — what to look at

`screenshots/{desktop,tablet,mobile}/` — 13 routes, fold + full page, pinned stages
at 0 / .25 / .5 / .75 / 1; `screenshots-reduced-motion/` — Home and Products with
`prefers-reduced-motion` forced. Same file names as `docs/baseline/screenshots/`, so
any pair diffs directly.

Looked at, page by page, against the baseline:

- **Every route has the same sections in the same order**; only type, weight and
  colour moved. The `bg-primary` header bands, the white/grey/navy stripes, the
  `.reveal` behaviour and the cards are deliberately still there (Phases 2, 4–7).
- **Home** — the hero headline is six lines at 600 instead of seven at 800; "sustainable"
  is `--eco-600`; stats use tabular figures. Reduced-motion Home
  (`screenshots-reduced-motion/desktop/home.fold.jpg`): the static headline is eight
  lines instead of eleven, and the sub-headline and both CTAs are now above the
  900px fold.
- **Career** — Inter throughout (was Georgia + Menlo); the `<h1>` wraps to two lines
  at 1440 instead of overflowing, which is why `whitespace-nowrap` had to go; the
  ambers are `accent` in the navy hero and `brand-100` inside the primary band.
- **Applications / Industries / Technology / Quality / Case Studies** — eyebrows are
  the 11px / 0.22em tag; card titles 19px / 600; step numerals tabular.
- **Products Showroom, Home journey, About film** — unchanged frames; the stage
  backdrops are the same gradient from ramp stops (`.pa-backdrop-*`) and the load bar
  uses `accent` / `primary`.
- **768px** — the nav's "Contact Us" still wraps (baseline defect, Phase 3).
- **390px** — no overflow; the hero is five lines.

## 4 · Not in this phase

`.reveal` and the seven observers (Phase 2, `Reveal` on framer-motion) ·
`.section-pad` / `.container-width` (Phase 2 `Chapter`) · card borders and radii
(Phase 2 `Surface`) · the hero re-score (Phase 4) · translucent-white audit (Phase 8) ·
the `facility.mp4` 404 and asset pipeline (Phase 8) · anything under `src/admin/`.

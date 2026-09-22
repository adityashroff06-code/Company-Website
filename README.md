# Product Armor Packaging — Website Monorepo

Marketing website and content platform for **Product Armor Packaging Pvt Ltd**
([productarmor.com](https://productarmor.com)) — a B2B manufacturer of pharmaceutical-grade
HDPE bottles and CR/CT closures. A React + Vite public site backed by an Express content API
with a JSON-file CMS and an `/admin` editor, organized as a pnpm workspace monorepo and
deployed on Replit autoscale.

**This `main` is the redesign line.** It carries the Replit-built site, the scroll-driven 3D /
video layer, and the "design elevation" programme described in
[`PRODUCT-ARMOR-REDESIGN-PROMPT.md`](PRODUCT-ARMOR-REDESIGN-PROMPT.md). The previous `main`
(a separate history) is preserved unchanged as the branch `main-before-redesign` and remains
a parent of this history.

---

## Status — 22 September 2026

| | |
|---|---|
| Latest commit content | Phase 1 of 9 complete; the site is fully functional at every step |
| Live preview of this state | `pnpm --filter @workspace/productarmor-site build` → serve `dist/public` (see *Running it*) |
| Working branch | `redesign/design-elevation` (identical to `main` after each phase) |
| Next up | **Phase 2 — primitives** (`Reveal` / `RevealGroup` on framer-motion, `Chapter`, `Surface`, `Eyebrow`, `SpecList`, `MediaFrame`, `Button`) |
| Task-level checklist | [`docs/PROGRESS.md`](docs/PROGRESS.md) — done / next / every remaining phase, housekeeping, how to resume |

### Progress by phase

| Phase | Scope (brief §8) | Status | Evidence |
|---|---|---|---|
| — | Scroll-driven 3D stages (Home journey, Products showroom), ambient footage, About film | ✅ committed `3df3cbe` | `artifacts/productarmor-site/src/components/{three,video}` |
| **0** | Recon, baseline screenshots, build / typecheck / bundle numbers, design-system doc | ✅ `a49cce4`, `3581b78` | [`docs/baseline/README.md`](docs/baseline/README.md) |
| **1** | Design tokens, type scale, weight cap ≤ 600, hex + default-palette codemod; layout unchanged | ✅ `740b432` | [`docs/qa/phase-1/README.md`](docs/qa/phase-1/README.md) |
| 2 | Primitives: `Reveal`, `RevealGroup`, `Surface`, `Eyebrow`, `SpecList`, `MediaFrame`, `Button`, `Chapter` | ⬜ | done when a visual check page renders all variants in both themes |
| 3 | Chrome: Navbar (transparent → blurred), Footer, Breadcrumb, WhatsApp float | ⬜ | nav verified at scroll 0 and 400 |
| 4 | Home: chapter themes, re-scored hero (`display-1` + `body-lg` split on the first comma), restaged journey | ⬜ | journey at 60 fps; hero legible at 320 and 1920 px |
| 5 | 3D materials (`paMaterials.ts`), `GalleryRig`, the Products configurator | ⬜ | before/after bottle screenshots side by side |
| 6 | Technology + Quality scroll scenes; Products editorial spreads | ⬜ | both stages degrade cleanly with WebGL off |
| 7 | Remaining nine pages: About, Contact, Industries, Applications, Case Studies, Downloads, FAQ, Management Team, Career | ⬜ | no page still uses `.section-pad` or the `bg-primary` header band |
| 8 | Asset pipeline (GLB compression, hero image, `facility` clip, preload fan-out), performance and accessibility sweep | ⬜ | every §7 budget measured in `docs/budgets.md` |
| 9 | Full QA: 13 routes × 3 viewports × 2 motion settings | ⬜ | all verified by screenshot |

### Measured state (production build, 2026-09-22)

| Metric | Baseline (Phase 0) | Now (Phase 1) | Budget / gate |
|---|---|---|---|
| Hex colour literals in non-admin `.tsx` | 262 | **7** (all three.js colour arguments) | 7 |
| Tailwind default-palette utilities | 97 | **0** | 0 |
| Rendered characters above font-weight 600 | 8.7 % | **0 %** | 0 |
| Text nodes failing WCAG AA (968 nodes, 13 routes) | 180 | **141** | 0 by Phase 8 |
| Entry JS, gzip | 163.5 KB | 163.2 KB | ≤ 180 KB |
| three.js chunk, gzip | 284.0 KB | 284.0 KB | ≤ 320 KB |
| `pnpm typecheck` errors | 4 (all `src/admin/AdminDashboard.tsx`) | 4 | must not rise |
| Horizontal overflow at 1440 / 768 / 390 px | 0 | 0 | 0 |

The design system itself — the colour ramp, type scale, spacing, elevation, motion tokens and
the log of every decision taken so far — is [`docs/design-system.md`](docs/design-system.md).

### Tasks still open

Carried from Phase 0 and Phase 1, in the phase that owns each:

- **Phase 3** — the navbar's "Contact Us" wraps onto two lines at 768 px (search must collapse
  to an icon below `lg`); footer text at `text-white/40` (3.4:1) and the "Admin" link (2.5:1);
  the WhatsApp pill (white on green, 2.0:1) becomes a neutral pill with a green glyph.
- **Phase 4** — the 158-character hero headline is still one block (six lines at 1440 px);
  split on the first comma into `display-1` + `body-lg`. `display-1` overflows a 320 px screen by
  17 px and needs `overflow-wrap` or a lower floor. The certification tiles on Home leave the
  glass-on-primary treatment.
- **Phase 7** — every inner page still opens on the `bg-primary` header band, which is where
  40 of the 141 remaining contrast failures live (translucent white on mid-blue). Career keeps a
  private `.career-reveal` system until then.
- **Phase 8** — `About.tsx` still requests `facility.mp4`, which no longer exists (404 on every
  visit; the WebM plays). `HomeJourneyScene` mounts all six GLBs under `visible={false}`, so Home
  pulls 20 MB before any scroll; `ShowroomScene` preloads all six too. `hero-bg.jpg` (3.4 MB) is
  fetched only on the reduced-motion path. The two unreferenced GLBs are already gone from this
  branch, so §5E.1 is done.
- **Housekeeping, not on the branch by design** — the dev-only proxy in `vite.config.ts`, the
  `allowBuilds: esbuild: set this to true or false` placeholder in `pnpm-workspace.yaml`, and the
  `_harness/` ignore line exist only in the local checkout; the Windows preview harness itself
  is not committed.
- **Product decisions taken by default, reversible in one place** (`docs/design-system.md` §11):
  captions on light use `--ink-500`; Career joins Inter and the brand ramp (its amber accent and
  Georgia headings were retired); `"cv11"`/`"ss01"` are declared although Google's Inter build
  ignores them (self-hosting `InterVariable` would enable them, ~345 KB).

---

## Monorepo layout

| Package | What it is |
|---|---|
| `artifacts/productarmor-site/` | **The public site.** React 19 + Vite 7 + Tailwind 4, wouter routing, TanStack Query; 13 public routes plus `/admin`. `src/components/three/` is the WebGL layer (three 0.185, @react-three/fiber 9, drei 10), `src/components/video/` the footage layer, `src/index.css` the token system. |
| `artifacts/api-server/` | **Express 5 content API.** Routes in `src/routes/` (`content`, `admin`, `management-team`, `health`). Serves editable content from `data/content.json` and `data/management-team.json`; photo uploads in `data/uploads/`. |
| `artifacts/mockup-sandbox/` | React + Vite design sandbox; auto-discovers components in `src/components/mockups`. |
| `lib/db` | Drizzle ORM + PostgreSQL schema. |
| `lib/api-zod`, `lib/api-client-react` | Zod schemas and react-query hooks, including committed generated code. |
| `lib/api-spec` | Orval OpenAPI codegen config. |
| `docs/` | `design-system.md` (the system and decisions log) · `baseline/` (Phase 0 evidence) · `qa/phase-N/` (per-phase screenshots and audits) · `qa/tools/` (the zero-dependency capture and audit tooling). |
| `attached_assets/` | Raw design sources — not consumed by any build. |

## Running it

Requires **Node.js 24** and **pnpm 10** (the `preinstall` hook rejects npm/yarn). Both
`PORT` and `BASE_PATH` are mandatory for the site's Vite config.

```bash
pnpm install
pnpm --filter @workspace/api-server run dev                          # content API, port 5000
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/productarmor-site dev
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/productarmor-site build
pnpm typecheck
```

**On Windows** the committed `pnpm-workspace.yaml` excludes every non-Linux native binary
(the project's home is Replit), so the lockfile does not build as-is. The procedure that works
— a mirror of the checkout with the five `win32-x64` override lines removed, plus the
`MSYS_NO_PATHCONV` trap in Git Bash — is in
[`docs/qa/tools/README.md`](docs/qa/tools/README.md), together with the screenshot and
accessibility tooling used to verify each phase.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Drizzle) |
| `PORT` | ✅ | api-server port; also required by the site's Vite config |
| `BASE_PATH` | ✅ (site) | Vite base path, `/` for a root deployment |
| `ADMIN_PASSWORD` | ⚠️ strongly recommended | Protects `/admin` and the content-write routes. A development fallback exists in code — always set this in any deployed environment. |
| `API_PORT`, `LOG_LEVEL` | optional | Local overrides |

## How the redesign is run

One phase per session, from `PRODUCT-ARMOR-REDESIGN-PROMPT.md`: read the brief and
`docs/design-system.md`, execute the phase, build, capture all 13 routes at 1440 × 900, 768 × 1024
and 390 × 844 (pinned stages at five scroll positions, plus a reduced-motion pass), run the
contrast and payload audit, compare with `docs/baseline/`, write `docs/qa/phase-N/README.md`,
commit with the phase in the message. Nothing is claimed that has not been screenshotted.

# Product Armor Packaging — Website Monorepo

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm&logoColor=white)

Marketing website and content platform for **Product Armor Packaging Pvt Ltd** ([productarmor.com](https://productarmor.com)) — a B2B manufacturer of pharmaceutical-grade HDPE bottles and CR/CT closures operating an ISO Class 8 cleanroom facility in Telangana, India.

A React + Vite public site backed by an Express content API with a JSON-file CMS and an `/admin` editor, organized as a pnpm workspace monorepo and deployed on Replit autoscale.

## Monorepo layout

| Package | What it is |
|---|---|
| `artifacts/productarmor-site/` | **The public site.** React 19 + Vite, served under base path `/site/`. 13 pages (Home, Products with search, Industries, Applications, Technology, Downloads, Case Studies, Careers, FAQ, About, Management Team, Quality, Contact), wouter routing, react-query, Tailwind v4 + Radix/shadcn, three.js hero imagery. SEO via `index.html` JSON-LD, `usePageMeta.ts`, `public/sitemap.xml`. |
| `artifacts/api-server/` | **Express 5 content API.** Routes in `src/routes/` (`content`, `admin`, `management-team`, `health`). Serves editable content from `data/content.json` and `data/management-team.json`; team photos/doc uploads live in `data/uploads/` and are served at `/api/uploads/*`. Bundled with esbuild (`build.mjs`). |
| `artifacts/audit-report/` | Standalone React + Vite single-page **website-audit scorecard** — an internal one-off deliverable, not wired to the API. |
| `artifacts/mockup-sandbox/` | React + Vite **design sandbox**; a custom Vite plugin auto-discovers components in `src/components/mockups`. |
| `lib/db` | Drizzle ORM + PostgreSQL schema (`push` / `push-force` scripts). |
| `lib/api-zod`, `lib/api-client-react` | Zod schemas and react-query hooks, **including committed generated code** — see the codegen warning below. |
| `lib/api-spec` | Orval OpenAPI codegen config (currently broken in this environment — do not run). |
| `scripts/` | Workspace utilities + Replit `post-merge.sh` hook. |
| `attached_assets/` | Raw design sources (images, video, PPTX) dumped from the design process — not consumed by any build. |

## Getting started

Requires **Node.js 24** and **pnpm** (the `preinstall` hook rejects npm/yarn; `start-site.cmd` bootstraps pnpm on Windows).

```bash
pnpm install

# content API (requires env, see below)
pnpm --filter @workspace/api-server run dev        # port 5000

# public site
pnpm --filter @workspace/productarmor-site run dev

# quality gates
pnpm run typecheck        # all packages
pnpm run build            # typecheck + build everything

# database schema (dev only)
pnpm --filter @workspace/db run push
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Drizzle) |
| `PORT` | ✅ (api-server) | API server port — startup fails fast if unset |
| `ADMIN_PASSWORD` | ⚠️ strongly recommended | Protects `/admin` and content-write routes. **A development fallback exists in code — always set this in any deployed environment.** |
| `API_PORT`, `BASE_PATH`, `LOG_LEVEL` | optional | Overrides for local setups |

## How content editing works

- Site copy, products, certifications, and testimonials live in `artifacts/api-server/data/content.json`, edited through the `/admin` UI (draft → save flow).
- The **Management Team** section has its own immediate-save CRUD (`/api/management-team`) with photo uploads persisted to `data/uploads/`.
- The frontend falls back to static defaults in `artifacts/productarmor-site/src/constants/site.ts` when an API value is missing — social/map links are deliberately static constants.

## ⚠️ Gotchas (read before changing code)

1. **Do NOT run the OpenAPI codegen** (`pnpm --filter @workspace/api-spec run codegen`). It fails in this environment and its clean step deletes the committed generated files under `lib/api-zod/src/generated` and `lib/api-client-react/src/generated`. Treat generated files as hand-maintained; recover with `git show HEAD:<path>`. To expose a new frontend value, add it to `src/constants/site.ts` instead. Details: `.agents/memory/orval-codegen-broken.md`.
2. **The site stays on React + Vite by explicit client requirement** — do not migrate to Next.js.
3. Verify site changes with `pnpm --filter @workspace/productarmor-site run typecheck`, not a root dev command.
4. `pnpm-workspace.yaml` enforces a **1-day `minimumReleaseAge`** on new dependency versions as a supply-chain guard — do not disable it.

## Deployment

Deployed on **Replit autoscale** (`.replit`): Node.js 24 module, `postMerge` runs `scripts/post-merge.sh` (`pnpm install --frozen-lockfile` + DB push), `postBuild` prunes the pnpm store. `replit.md` carries the agent-facing operating notes and mirrors this README.

## License

Private, proprietary codebase of Product Armor Packaging Pvt Ltd. All rights reserved.

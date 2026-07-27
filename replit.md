# Product Armor Packaging

Marketing website for Product Armor Packaging Pvt Ltd (productarmor.com) — a B2B manufacturer of pharmaceutical-grade HDPE bottles and CR/CT caps based in Telangana, India. React+Vite site backed by an Express content API.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/productarmor-site/` — React+Vite marketing site (served at `/site/`). Pages in `src/pages/`, shared UI in `src/components/`, static site constants (contact, social, nav) in `src/constants/site.ts`.
- `artifacts/api-server/` — Express content API. Editable site content (contact info, products, certs, testimonials) lives in `artifacts/api-server/data/content.json`.
- SEO: `artifacts/productarmor-site/index.html` (base meta + Organization JSON-LD), per-page meta via `src/hooks/usePageMeta.ts`, `public/sitemap.xml`, `public/robots.txt`.

## Architecture decisions

- Site stays on **React + Vite** by explicit client requirement — do NOT migrate to Next.js.
- Content is served from a JSON file via the API; the frontend falls back to `src/constants/site.ts` defaults when the API value is missing.
- LinkedIn / social / Google Map links are **static constants** (not content-API driven) because the OpenAPI codegen is broken in this env — see Gotchas.
- Client-side routing with wouter under base path `/site/`; product search is a `?q=` query param filtered in `Products.tsx`.

## Product

Public marketing site: Home, Products (with search), Industries, Applications, Technology, Downloads, Case Studies, Careers, FAQ, About, Management Team (cards + profile modal), Quality, Contact (Google Map + enquiry form). Mega-menu nav, breadcrumbs, WhatsApp float, and an `/admin` content editor (Management Team tab has its own immediate-save CRUD, separate from the content.json draft/save flow).

Management Team data lives in `artifacts/api-server/data/management-team.json` via dedicated REST routes (`/api/management-team`, photo uploads saved to `artifacts/api-server/data/uploads/` and served at `/api/uploads/*`). Frontend uses plain fetch + react-query in `src/lib/managementTeam.ts` (not generated hooks — codegen is broken, see Gotchas).

## User preferences

- Keep the site on React + Vite. Do not migrate to Next.js.

## Gotchas

- **Do NOT run the OpenAPI codegen** (`pnpm --filter @workspace/api-spec run codegen`). It fails in this env and deletes the committed generated files. To add a new frontend value, use `src/constants/site.ts` instead of adding an API field. See `.agents/memory/orval-codegen-broken.md`.
- Verify the site with `pnpm --filter @workspace/productarmor-site run typecheck` and `restart_workflow`, not root `pnpm dev`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

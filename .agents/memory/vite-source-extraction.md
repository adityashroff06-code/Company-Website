---
name: Vite dev-server source extraction
description: How this site was cloned from a live Vite dev URL, and gotchas to remember when comparing against the source.
---

The productarmor-site was cloned by extracting original source from the donor project's live Vite dev server (sourcemap `sourcesContent`, `?raw` for CSS, `/@fs/` for arbitrary workspace files) instead of visual recreation.

**Why:** A running Vite dev server exposes exact original TS/CSS source; copying it beats rebuilding from screenshots.

**How to apply / gotchas:**
- CSS fetched normally comes back as a dev-transformed JS module (`createHotContext`); use `?raw` and JSON-parse the `export default` string.
- Extracted files can carry a spurious 2-space indent from line 2 onward, and yaml came with literal `\$ref` — dedent/normalize before use.
- The donor site was served under base path `/site/`; content JSON stored asset URLs with that prefix, which had to be rewritten to `/` here.
- The donor's OpenAPI spec was stale vs its frontend (missing strengths, openings, downloads, cert logo, product sizes/imageFit) — our spec was extended; keep spec and content.json shape in sync.
- Admin auth: Bearer token = ADMIN_PASSWORD env (default productarmor2024); frontend wires it via setAuthTokenGetter in AdminDashboard.

---
name: Orval codegen broken in this environment
description: Why you must not run the OpenAPI codegen command and how to add API-driven fields safely
---

Running `pnpm --filter @workspace/api-spec run codegen` (orval) fails in this environment with "Failed to resolve input" on ANY input, even though dependencies are present. The codegen's clean step DELETES the already-generated files under `lib/api-client-react/src/generated` and `lib/api-zod/src/generated` before failing, leaving the repo broken.

**Why:** environment-specific orval/tooling breakage, not a spec problem. The generated files are committed and valid; regenerating them destroys them.

**How to apply:**
- Do NOT run the codegen command. Treat the committed generated API-client + zod files as the source of truth.
- If codegen was accidentally run and files were deleted, restore each with `git show HEAD:<path> > <path>` and recreate any removed `types/` dirs, then confirm with `pnpm run typecheck:libs`.
- To surface a new value in a frontend artifact, do NOT add a field to the OpenAPI spec (that would require codegen). Instead put it in a static TS constants file (e.g. `artifacts/productarmor-site/src/constants/site.ts`). This is how LinkedIn/social/map links are handled on the ProductArmor site.

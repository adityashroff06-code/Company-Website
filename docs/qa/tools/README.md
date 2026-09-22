# QA tools

Zero-dependency verification tooling for the redesign. Everything here runs on a
stock Windows 11 machine — **no Node, no Playwright** — by driving the installed
Chrome (or Edge) headlessly over the DevTools protocol from Windows PowerShell 5.1.
Nothing here is part of the site and nothing here writes to `src/`.

| Tool | What it does |
|---|---|
| `serve.ps1` | Read-only local server. Default mode serves the in-browser preview shell (`_harness/index.html`, which compiles the real `src/` with Babel); `-Dist <dir>` serves a production build with SPA fallback. In both modes it stands in for the API's public GET endpoints — `/api/content`, `/api/management-team`, `/api/uploads/*` — so every route renders with real data. |
| `capture.ps1` | Screenshots for the brief's §9 protocol: per route × viewport a `.fold.jpg` (exact viewport), a `.full.jpg` (whole page) and, for pinned stages, frames at scroll progress 0 / .25 / .5 / .75 / 1. Scrolls each page once first so reveals and lazy media have fired. Writes `capture-log.json`: page height, horizontal overflow (with offending elements), canvas count, WebGL renderer, video state, HTTP/console errors, heavy assets requested. Flags: `-Viewports desktop,tablet,mobile` · `-ReducedMotion` · `-NoWebGL` · `-Routes /,/products` · `-PinnedSettleMs 4000`. |
| `audit.ps1` | Measured accessibility + payload audit. Walks every visible text node, composites its colour over the real rendered background (any CSS colour format, including Tailwind v4's `oklab()`), and reports the WCAG ratio against 4.5:1 / 3:1. Text over footage, gradients or a canvas is counted as *unresolved*, never guessed. Also records media requested **before any scroll**, and the rendered font-weight distribution. |
| `contrast.ps1` | Pure maths: WCAG ratios for the design-system ramp and for today's colours. Extend it whenever a token or surface is added. |
| `recon-counts.sh`, `recon-scoped.sh` | The greps behind `docs/baseline/README.md` §3 — hex literals, `.reveal`, weights, stripe layout, contrast classes, three.js pipeline, assets. Git Bash. `recon-scoped.sh` reports each count in three scopes (all · no admin · no admin + Career), which is how the brief's 197 was reverse-engineered. |
| `typeprobe.html` | Renders the hero first clause at the exact `display-1` spec in the real content widths, with the real variable Inter, and reports wrap count, overflow and whether `cv11` / `ss01` / `tnum` take effect. Open it directly or capture it with `capture.ps1 -BaseUrl file:///…`. |

## Building on this machine

There is no system Node. A checksum-verified portable Node 24.21.0 and pnpm 10.34.5 live
at `%LOCALAPPDATA%\Temp\pa\tool` (outside the repo; delete the folder to remove them).
The repo's `pnpm-workspace.yaml` overrides every non-`linux-x64` native binary to
`"-"`, so the lockfile cannot build on Windows as committed. Builds therefore run from a
**mirror** of the worktree, never from the worktree itself:

```powershell
$PA = "$env:LOCALAPPDATA\Temp\pa"                       # short path: LongPathsEnabled is off
robocopy <worktree> "$PA\repo" /MIR /XD .git docs node_modules dist .claude /NFL /NDL /NJH /NP
# in the COPY only, drop the five Windows exclusions:
#   (esbuild|lightningcss|oxide|rollup).*win32-x64   lines of pnpm-workspace.yaml
```

```bash
export PATH="/c/Users/<you>/AppData/Local/Temp/pa/tool/node-v24.21.0-win-x64:/c/Users/<you>/AppData/Local/Temp/pa/tool/npm-global:$PATH"
export npm_config_store_dir="C:/Users/<you>/AppData/Local/Temp/pa/store"
cd /c/Users/<you>/AppData/Local/Temp/pa/repo
pnpm install --no-frozen-lockfile        # adds only the win32 native packages
pnpm typecheck                           # baseline: 4 errors, all in src/admin/AdminDashboard.tsx
MSYS_NO_PATHCONV=1 MSYS2_ENV_CONV_EXCL='*' PORT=5173 BASE_PATH=/ pnpm --filter @workspace/productarmor-site build
```

The `MSYS_*` variables matter: Git Bash otherwise rewrites `BASE_PATH=/` into
`/Program Files/Git/` and Vite builds with that base without complaint. Re-running
the `robocopy /MIR` after editing the worktree re-syncs the mirror while leaving its
`node_modules` and `dist` alone (`/XD` protects them on the destination too). To
compare two builds side by side, keep a second mirror (`$PA\repo1`); the pnpm store is
shared, so its install takes ~20 s.

## Per-phase routine (brief §9)

```powershell
$repo = "<checkout that holds the work>"
powershell -ExecutionPolicy Bypass -File docs\qa\tools\serve.ps1 -Repo $repo -Port 4173      # leave running

$out = "docs\qa\phase-N"
powershell -ExecutionPolicy Bypass -File docs\qa\tools\capture.ps1 -OutDir $out -Viewports desktop,tablet,mobile -PublicDir "$repo\artifacts\productarmor-site\public"
powershell -ExecutionPolicy Bypass -File docs\qa\tools\capture.ps1 -OutDir "$out\reduced-motion" -Viewports desktop,tablet,mobile -ReducedMotion -PublicDir "$repo\artifacts\productarmor-site\public"
powershell -ExecutionPolicy Bypass -File docs\qa\tools\audit.ps1   -OutFile "$out\audit.json" -PublicDir "$repo\artifacts\productarmor-site\public"
```

Then **look at the images** next to `docs/baseline/screenshots/`, and compare
`audit.json`'s failing count with the baseline's 180.

## Gotchas already hit

- **MAX_PATH.** Windows PowerShell's file APIs fail past 260 characters. Keep `-OutDir`
  short; `docs\qa\phase-N\desktop\pinned\management-team.p100.jpg` under a deep
  worktree path is close to the limit.
- **`powershell -File` flattens arrays.** `-Viewports desktop,mobile` arrives as one
  string; both tools split on commas, so either spelling works.
- **One Chrome at a time per profile.** Each tool reaps the Chrome children of its own
  `-ProfileDir` on exit; give concurrent runs different profile dirs and ports
  (`-DebugPort`).
- **The preview shell needs the network** (Babel, `@tailwindcss/browser`, esm.sh). A
  blip kills a boot; `capture.ps1` retries three times. A `-Dist` build has no such
  dependency.
- **404s under `/src/` and `/lib/`** are the preview shell probing file extensions.
  `capture.ps1` filters them out of the error log; a real build never emits them.
- The server is single-threaded on purpose (it is 120 lines). It is fine for one
  headless browser; do not point two captures at it at once and compare timings.

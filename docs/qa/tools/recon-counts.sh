#!/usr/bin/env bash
# Phase 0 recon — read-only measurements of a productarmor-site tree.
# usage: recon.sh <site-dir>
set -u
SITE="$1"
cd "$SITE" || { echo "cannot cd to $SITE"; exit 1; }

hr() { printf '\n==== %s ====\n' "$1"; }
occ() { # occ <regex> [extra grep args...] -> number of occurrences in src/**/*.tsx
  local re="$1"; shift
  grep -rhoE "$@" -- "$re" src --include='*.tsx' 2>/dev/null | wc -l | tr -d ' '
}
files() { # files <regex> -> number of tsx files containing it
  local re="$1"; shift
  grep -rlE "$@" -- "$re" src --include='*.tsx' 2>/dev/null | wc -l | tr -d ' '
}

hr "tree"
echo "tsx files: $(find src -name '*.tsx' | wc -l | tr -d ' ')   (non-admin: $(find src -name '*.tsx' -not -path 'src/admin/*' | wc -l | tr -d ' '))"
echo "three/ dir: $( [ -d src/components/three ] && ls src/components/three | tr '\n' ' ' || echo MISSING )"
echo "video/ dir: $( [ -d src/components/video ] && ls src/components/video | tr '\n' ' ' || echo MISSING )"
echo "ui/ dir:    $(ls src/components/ui | tr '\n' ' ')"
echo "tailwind.config.*: $(ls tailwind.config.* 2>/dev/null | tr '\n' ' ' || true)[none if blank]"

hr "§2.3 hex literals — acceptance command: grep -rhoiE '#[0-9a-f]{6}' src --include=*.tsx | wc -l"
echo "total occurrences: $(grep -rhoiE '#[0-9a-f]{6}' src --include='*.tsx' | wc -l | tr -d ' ')"
echo "files containing:  $(grep -rliE '#[0-9a-f]{6}' src --include='*.tsx' | wc -l | tr -d ' ')"
echo "-- per file --"
grep -rcoiE '#[0-9a-f]{6}' src --include='*.tsx' | grep -v ':0$' | while IFS= read -r line; do
  f="${line%:*}"; n=$(grep -oiE '#[0-9a-f]{6}' "$f" | wc -l | tr -d ' '); printf '%4s  %s\n' "$n" "$f"; done | sort -k2
echo "-- by value (case-folded) --"
grep -rhoiE '#[0-9a-f]{6}' src --include='*.tsx' | tr 'A-F' 'a-f' | sort | uniq -c | sort -rn
echo "-- inside src/components/three --"
echo "three/ total: $(grep -rhoiE '#[0-9a-f]{6}' src/components/three --include='*.tsx' 2>/dev/null | wc -l | tr -d ' ')"
echo "-- inside src/admin (out of scope per brief) --"
echo "admin total: $(grep -rhoiE '#[0-9a-f]{6}' src/admin --include='*.tsx' 2>/dev/null | wc -l | tr -d ' ')"
echo "-- hex literals in .ts files (not covered by acceptance grep) --"
grep -rcoiE '#[0-9a-f]{6}' src --include='*.ts' | grep -v ':0$' || echo "(none)"
echo "-- 3-digit hex in tsx (not matched by the 6-digit regex) --"
grep -rnoiE '#[0-9a-f]{3}\b' src --include='*.tsx' | grep -viE '#[0-9a-f]{6}' | head -20 || true
echo "-- lines with non-className hex in three/ (candidate legit three.js colour args) --"
grep -rniE '#[0-9a-f]{6}' src/components/three --include='*.tsx' 2>/dev/null | grep -vE 'className|\[#' || true

hr "§2.4 palette collisions"
for v in '#32CD32' '#25D366'; do
  echo "$v: $(grep -rhoi -- "$v" src | wc -l | tr -d ' ') occurrence(s) in: $(grep -rli -- "$v" src | tr '\n' ' ')"; done
echo "-- --accent / --accent-border in index.css --"
grep -nE '^\s*--accent(-border|-foreground)?:' src/index.css

hr "§2.5 .reveal"
echo "-- className uses of the 'reveal' class per file (token-exact) --"
tot=0
for f in $(grep -rlE '(^|[" `{ ])reveal([" `} ]|$)' src --include='*.tsx' | sort); do
  n=$(grep -oE '(["`{ ])reveal(["`} ])' "$f" | wc -l | tr -d ' '); tot=$((tot+n)); printf '%4s  %s\n' "$n" "$f"; done
echo "total className uses: $tot"
echo "-- querySelectorAll('.reveal') blocks --"
grep -rnE "querySelectorAll\(['\"]\.reveal" src --include='*.tsx' | sed 's/^/  /'
echo "count: $(grep -rhoE "querySelectorAll\(['\"]\.reveal" src --include='*.tsx' | wc -l | tr -d ' ')"
echo "-- .reveal CSS --"
grep -nE '\.reveal' src/index.css
echo "-- framer-motion imports --"
echo "count: $(grep -rlE "from ['\"]framer-motion['\"]|from ['\"]motion" src | wc -l | tr -d ' ')"

hr "§2.2 font weight"
for c in font-black font-extrabold font-bold font-semibold font-medium; do
  printf '%-16s %5s occurrences in %3s tsx files\n' "$c" "$(occ "\\b$c\\b")" "$(files "\\b$c\\b")"; done
echo "-- font-weight declarations in index.css --"
grep -noE 'font-weight:\s*[0-9]+|@apply[^;]*font-(black|extrabold|bold|semibold)' src/index.css | sort | uniq -c | sort -rn | head -40
echo "-- heading-hero / pa-stage-hero-title definitions --"
grep -nE 'heading-hero|pa-stage-hero-title' src/index.css | head
echo "-- Google Fonts link --"
grep -n 'fonts.googleapis.com/css2' index.html

hr "§2.1 stripe layout"
echo "-- page header band: bg-primary section-pad (first <section>) --"
grep -rnE 'className="bg-primary section-pad' src/pages --include='*.tsx' | sed 's/^/  /'
echo "pages with it: $(grep -rlE 'className="bg-primary section-pad' src/pages --include='*.tsx' | wc -l | tr -d ' ')"
echo "-- section-pad uses --"
echo "total: $(occ 'section-pad')  in $(files 'section-pad') files"
echo "-- <section> background classes per page --"
for f in src/pages/*.tsx; do
  printf '%-32s ' "$(basename "$f")"
  grep -oE '<section[^>]*className="[^"]*' "$f" | grep -oE '\bbg-(primary|navy|white|secondary|background|card|muted|\[[^]]+\])[^ "]*' | tr '\n' ' '
  echo
done

hr "§2.8 cards"
echo "card-standard uses: $(occ 'card-standard') in $(files 'card-standard') files"
echo "imports of ui/card: $(grep -rlE "components/ui/card|/ui/card['\"]" src | wc -l | tr -d ' ')"
grep -nE '\.card-standard' -A4 src/index.css | head -12

hr "§2.9 contrast classes"
for c in 'text-white/40' 'text-white/50' 'text-white/60' 'text-white/65' 'text-white/70' 'text-white/75' 'text-white/80'; do
  printf '%-16s %4s occurrences in %3s files\n' "$c" "$(grep -rhoE --include='*.tsx' -e "$c\\b" src | wc -l | tr -d ' ')" "$(grep -rlE --include='*.tsx' -e "$c\\b" src | wc -l | tr -d ' ')"; done
echo "files with /50 or /60:        $(grep -rlE 'text-white/(50|60)\b' src --include='*.tsx' | wc -l | tr -d ' ')"
echo "files with /50, /60 or /65:   $(grep -rlE 'text-white/(50|60|65)\b' src --include='*.tsx' | wc -l | tr -d ' ')"

hr "§2.6 / §5 three.js pipeline"
echo "toneMapping|outputColorSpace|onCreated occurrences: $(grep -rhoE 'toneMapping|outputColorSpace|onCreated' src | wc -l | tr -d ' ')"
echo "-- <Canvas> sites --";            grep -rnE '<Canvas' src | sed 's/^/  /'
echo "-- dpr --";                       grep -rnE 'dpr=' src | sed 's/^/  /'
echo "-- frameloop --";                 grep -rnE 'frameloop=' src | sed 's/^/  /'
echo "-- useGLTF.preload --";           grep -rnE 'useGLTF\.preload' src | sed 's/^/  /'
echo "-- aria-live --";                 grep -rnE 'aria-live' src --include='*.tsx' | grep -v 'src/components/ui/' | sed 's/^/  /'
echo "-- supportsImmersive call sites --"; grep -rnE 'supportsImmersive' src | sed 's/^/  /'
echo "-- tuneMaterials --";             grep -rnE 'tuneMaterials' src | sed 's/^/  /'
echo "-- postprocessing / gsap / lenis / locomotive --"
grep -rniE 'postprocessing|gsap|lenis|locomotive|ScrollTrigger' src package.json | sed 's/^/  /' || true
echo "(blank above = none)"

hr "§4.4 motion tokens"
echo "cubic-bezier(0.22, 1, 0.36, 1) occurrences in index.css: $(grep -oE 'cubic-bezier\(0\.22, ?1, ?0\.36, ?1\)' src/index.css | wc -l | tr -d ' ')"
grep -nE 'cubic-bezier\(0\.22, ?1, ?0\.36, ?1\)' src/index.css | sed 's/^/  /'
echo "same curve in tsx: $(grep -rhoE 'cubic-bezier\(0\.22, ?1, ?0\.36, ?1\)' src --include='*.tsx' | wc -l | tr -d ' ')"
echo "--ease-* / --dur-* custom properties: $(grep -cE '^\s*--(ease|dur)-' src/index.css)"
echo "-- all distinct cubic-bezier curves in index.css --"
grep -oE 'cubic-bezier\([^)]*\)' src/index.css | sort | uniq -c | sort -rn

hr "§4.3 radius"
grep -nE '^\s*--radius' src/index.css | sed 's/^/  /'

hr "§6 unsplash fallbacks"
grep -rnoE 'images\.unsplash\.com[^"'"'"'` ]*' src | sed 's/^/  /'
echo "files: $(grep -rlE 'images\.unsplash\.com' src | tr '\n' ' ')"

hr "line counts"
wc -l src/index.css src/App.tsx src/pages/*.tsx src/components/*.tsx src/components/three/* src/components/video/* 2>/dev/null

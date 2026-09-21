#!/usr/bin/env bash
# Phase 0 recon, part 2 — scoped counts (all / no-admin / no-admin-no-Career), assets, content facts.
# usage: recon2.sh <repo-root>
set -u
ROOT="$1"
SITE="$ROOT/artifacts/productarmor-site"
cd "$SITE" || exit 1
hr() { printf '\n==== %s ====\n' "$1"; }

# file lists for the three scopes
ALL=$(find src -name '*.tsx' | sort)
NOADMIN=$(find src -name '*.tsx' -not -path 'src/admin/*' | sort)
BRIEF=$(find src -name '*.tsx' -not -path 'src/admin/*' -not -name 'Career.tsx' | sort)

cnt()  { local re="$1"; shift; grep -hoiE -- "$re" "$@" 2>/dev/null | wc -l | tr -d ' '; }
fcnt() { local re="$1"; shift; grep -liE  -- "$re" "$@" 2>/dev/null | wc -l | tr -d ' '; }
row()  { # row <label> <regex>
  printf '%-34s all=%4s/%2sf   no-admin=%4s/%2sf   no-admin-no-Career=%4s/%2sf\n' "$1" \
    "$(cnt "$2" $ALL)" "$(fcnt "$2" $ALL)" "$(cnt "$2" $NOADMIN)" "$(fcnt "$2" $NOADMIN)" "$(cnt "$2" $BRIEF)" "$(fcnt "$2" $BRIEF)"; }

hr "scoped counts  (occurrences / files)"
row "hex #rrggbb"            '#[0-9a-f]{6}'
row "#4164a8"                '#4164a8'
row "#0f2a4e"                '#0f2a4e'
row "#93b4e8"                '#93b4e8'
row "#32cd32"                '#32cd32'
row "#25d366"                '#25d366'
row "text-white/50"          'text-white/50\b'
row "text-white/60"          'text-white/60\b'
row "text-white/65"          'text-white/65\b'
row "text-white/(50|60)"     'text-white/(50|60)\b'
row "text-white/(50|60|65)"  'text-white/(50|60|65)\b'
row "font-black"             '\bfont-black\b'
row "font-extrabold"         '\bfont-extrabold\b'
row "font-bold"              '\bfont-bold\b'
row "font-semibold"          '\bfont-semibold\b'
row "section-pad"            '\bsection-pad\b'
row "card-standard"          '\bcard-standard\b'
row "heading-(hero|page|section|card)" '\bheading-(hero|page|section|section-light|card)\b'
row "text-body(-sm)? class"  '[" ]text-body(-sm)?[" ]'
row "container-width"        '\bcontainer-width\b'
row "section-tag(-light)?"   '\bsection-tag(-light)?\b'
row "btn-(primary|outline|light)" '\bbtn-(primary|outline|light)\b'
row "ease-out utility"       '[" ]ease-out[" ]'
row "rounded-* utilities"    '\brounded(-[a-z0-9]+)*\b'
row "shadow-* utilities"     '\bshadow(-[a-z0-9]+)+\b'
row "border-2"               '\bborder-2\b'
row "backdrop-blur"          '\bbackdrop-blur'
row "hsl(var(--"             'hsl\(var\(--'
row "style={{ (inline styles)" 'style=\{\{'
row "rgba?( literals"        'rgba?\('
row "career-reveal"          'career-reveal'

hr "hex inside three/ — split className vs three.js args"
T=$(find src/components/three -name '*.tsx' | sort)
echo "three/ total:                 $(cnt '#[0-9a-f]{6}' $T)"
echo "three/ on lines w/ className or [#: $(grep -hiE '#[0-9a-f]{6}' $T | grep -E 'className|\[#|from-\[|to-\[|via-\[' | grep -oiE '#[0-9a-f]{6}' | wc -l | tr -d ' ')"
echo "-- every hex line in three/ --"
grep -niE '#[0-9a-f]{6}' $T | sed -E 's/^(.{0,230}).*/\1/'

hr "hex in video/"
grep -niE '#[0-9a-f]{6}' src/components/video/*.tsx | sed -E 's/^(.{0,230}).*/\1/'

hr "hsl(var( / inline colour usage outside @theme"
grep -rnE 'hsl\(var\(--' src --include='*.tsx' --include='*.ts' | sed -E 's/^(.{0,200}).*/\1/' | head -30
echo "-- in index.css outside @theme --"
grep -nE 'hsl\(var\(--' src/index.css | grep -v -- '--color-' | head

hr "ui/card importers"
grep -rnE "ui/card" src | sed 's/^/  /'

hr "Career.tsx bespoke system"
grep -nE 'career-reveal|IntersectionObserver|@keyframes|<style' src/pages/Career.tsx | head -20
echo "-- Career hex by value --"
grep -oiE '#[0-9a-f]{6}' src/pages/Career.tsx | tr 'A-F' 'a-f' | sort | uniq -c | sort -rn

hr "admin hex by value (out of scope)"
grep -rhoiE '#[0-9a-f]{6}' src/admin | tr 'A-F' 'a-f' | sort | uniq -c | sort -rn

hr "routes (src/App.tsx)"
grep -nE '<Route|path=' src/App.tsx | sed 's/^/  /'

hr "package.json — 3D / motion deps"
grep -nE '"(three|@react-three/[a-z]+|framer-motion|@types/three|wouter|vite|react|react-dom|tailwindcss|typescript|@tanstack/react-query)"' package.json | sed 's/^/  /'
echo "-- catalog entries (pnpm-workspace.yaml) --"
grep -nE '^\s+("?)(vite|react|react-dom|tailwindcss|@tailwindcss/vite|framer-motion|typescript|@tanstack/react-query|@vitejs/plugin-react|lucide-react)("?):' "$ROOT/pnpm-workspace.yaml" | sed 's/^/  /'

hr "assets — public/models"
ls -l public/models 2>/dev/null | awk 'NR>1 {printf "  %10d  %s\n", $5, $9}'
echo "-- references per model file in src --"
for f in public/models/*.glb; do b=$(basename "$f"); printf '  %-28s refs=%s\n' "$b" "$(grep -rl -- "$b" src | wc -l | tr -d ' ')"; done
echo "-- totals --"
ref=0; orph=0
for f in public/models/*.glb; do b=$(basename "$f"); s=$(stat -c %s "$f"); if grep -rq -- "$b" src; then ref=$((ref+s)); else orph=$((orph+s)); fi; done
echo "  referenced: $ref bytes ($(awk "BEGIN{printf \"%.2f\", $ref/1000000}") MB, $(awk "BEGIN{printf \"%.2f\", $ref/1048576}") MiB)"
echo "  orphaned:   $orph bytes ($(awk "BEGIN{printf \"%.2f\", $orph/1000000}") MB, $(awk "BEGIN{printf \"%.2f\", $orph/1048576}") MiB)"

hr "assets — public/videos"
find public/videos -type f -printf '%10s  %p\n' | sort -k2
echo "-- totals --"
echo "  loops:   $(find public/videos/loops -type f -printf '%s\n' 2>/dev/null | awk '{s+=$1} END{printf "%d bytes (%.2f MB) in %d files", s, s/1000000, NR}')"
echo "  posters: $(find public/videos/posters -type f -printf '%s\n' 2>/dev/null | awk '{s+=$1} END{printf "%d bytes (%.2f MB) in %d files", s, s/1000000, NR}')"

hr "assets — public/images"
find public/images -maxdepth 1 -type f -printf '%10s  %p\n' | sort -k2
echo "clients:        $(find public/images/clients -type f | wc -l | tr -d ' ') files"
echo "certifications: $(find public/images/certifications -type f | wc -l | tr -d ' ') files"
echo "-- hero-bg references --"
grep -rn 'hero-bg' src "$ROOT/artifacts/api-server/data/content.json" | sed -E 's/^(.{0,200}).*/\1/'
grep -rnE 'opacity-\[0\.06\]' src | sed -E 's/^(.{0,200}).*/\1/'
echo "-- public/ total --"
find public -type f -printf '%s\n' | awk '{s+=$1} END{printf "  %d bytes (%.2f MB) in %d files\n", s, s/1000000, NR}'

hr "video wiring"
grep -rnE 'facility\.(webm|mp4|jpg)|floorClips|ImmersiveFilm|AmbientVideo' src --include='*.tsx' --include='*.ts' | grep -v '^src/components/video/' | sed -E 's/^(.{0,200}).*/\1/'
echo "-- videos.ts keys --"
grep -nE '^\s+"?[a-z-]+"?:\s*\{|key:|src:|poster:' src/components/video/videos.ts | head -30

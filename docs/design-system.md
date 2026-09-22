# Product Armor — Design System

> **Status:** Phase 1 implemented (2026-09-22) — tokens, type scale, weight cap and the
> hex / default-palette codemod are in `src/index.css`, `index.html` and every non-admin
> `.tsx`. The open questions in §10 were resolved with the recommended answers; §11 is
> the decisions log. Primitives (`Reveal`, `Chapter`, `Surface` …) are Phase 2.
> **Source of truth:** §4 of `PRODUCT-ARMOR-REDESIGN-PROMPT.md`. Every value in a
> "Normative" block is copied from the brief verbatim and must be written exactly.
> **Implementation notes** are derived from Phase 0 recon of the real
> `src/index.css` and explain *how* each value lands in this Tailwind v4 (CSS-first)
> codebase. Anything marked **⚠** is a conflict or a gap that needs a decision —
> they are collected in [§10 Open questions](#10--open-questions-for-review).
> Contrast figures were computed (WCAG 2.1 relative luminance), not eyeballed;
> the script is `docs/qa/tools/contrast.ps1`.

Every later phase reads from this file. If the code and this document disagree,
fix the document in the same commit.

---

## 1 · Operating principles

1. **One idea per screen.** Scroll behaves like a camera. Copy is caption to the
   object, never competition for it. At most two type sizes visible at once.
2. **Chapters, not stripes.** Colour marks a narrative beat, not a section break.
   A page gets **at most three theme flips**. White *specification* chapters show
   the object as a diagram; near-black *gallery* chapters show it as a lit object.
   No mid-tone bands (`bg-primary` header bands and CTAs go away).
3. **Light type, tight tracking, generous space.** Maximum font weight is **600**.
4. **Depth from one soft shadow, not a border.** Hairlines instead of boxes.
5. **Motion is confident and fast** (160–320 ms, 560 ms for reveals), never bouncy,
   never scroll-hijacked.
6. **Scarcity makes the 3D land.** Canvases on Home, Products, Technology and
   Quality only.

---

## 2 · Typography

### 2.1 Font loading — normative

Replace the static-weight link in `index.html`
(`family=Inter:wght@400;500;600;700;800`) with the variable axes:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap" rel="stylesheet">
```

On `body`:

```css
font-optical-sizing: auto;
font-feature-settings: "cv11" 1, "ss01" 1;
```

`font-variant-numeric: tabular-nums` on **every** spec value, stat and counter.

**⚠ Measured in Phase 0 (`docs/baseline/type-probe.jpg`): `"cv11"` and `"ss01"` are
no-ops on the Google-hosted Inter.** With the exact link above loaded, "a 0469"
renders glyph-for-glyph identically with the features on and off (same
double-storey *a*, same closed *4/6/9*, identical advance widths) — Google's build
does not ship those character variants. `tnum` **does** work ("1111" measures
304.3px proportional vs 515.6px tabular at 200px). Writing the declaration is
harmless, but it changes nothing unless Inter is self-hosted from the upstream
release (`InterVariable.woff2`, ≈ 345 KB — not a "second font service", but it
would replace the Google link, and it costs weight). See §10.

### 2.2 Scale — normative

| Token | Size (fluid) | Line | Tracking | Weight |
|---|---|---|---|---|
| `--text-display-1` | `clamp(2.75rem, 1.5rem + 4.4vw, 5.25rem)` | 0.96 | −0.035em | 600 |
| `--text-display-2` | `clamp(2.25rem, 1.4rem + 3vw, 3.75rem)` | 1.02 | −0.030em | 600 |
| `--text-title-1` | `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)` | 1.10 | −0.022em | 600 |
| `--text-title-2` | `1.5rem` | 1.20 | −0.018em | 600 |
| `--text-body-lg` | `1.1875rem` | 1.60 | −0.006em | 400 |
| `--text-body` | `1.0625rem` | 1.65 | −0.004em | 400 |
| `--text-caption` | `0.8125rem` | 1.50 | 0 | 500 |
| `--text-eyebrow` | `0.6875rem` | 1 | **0.22em** | 600, uppercase |

Resolved sizes (px, 16px root) — where each clamp actually bites:

| Token | 320 | 390 | 768 | 1024 | 1440 | 1920 | floor until | ceiling from |
|---|---|---|---|---|---|---|---|---|
| display-1 | 44 | 44 | 57.8 | 69.1 | 84 | 84 | 455px | 1364px |
| display-2 | 36 | 36 | 45.4 | 53.1 | 60 | 60 | 453px | 1253px |
| title-1 | 28 | 28 | 33 | 37.6 | 40 | 40 | 489px | 1156px |

### 2.3 Hard rules — normative

- Maximum font weight on the site is **600**. Delete every `font-extrabold`,
  `font-black` and `font-bold` on headings. `font-semibold` stays for UI labels.
- Body measure capped at **62ch**; display measure at **18ch**.
- **The hero headline is 158 characters / 19 words and must not be edited.**
  Re-score it: the first clause — everything up to the first comma,
  *"Delivering sustainable pharmaceutical Bottles and Closures for global
  healthcare"* — at `display-1`; the remainder at `body-lg` in `--ink-500` directly
  beneath, inside one `<h1>` with a nested `<span>`. Every word verbatim, in order.
  Split on the first `,` **at runtime** so a CMS edit still renders correctly.
  *(Verified in Phase 0: `content.json → hero.headline` is 158 chars / 19 words; the
  first comma is at index 80.)* The word "sustainable" keeps its highlight, in
  `--eco-600` (§3).

### 2.4 Implementation notes

**Register the scale in `@theme`** so Tailwind v4 generates real utilities. v4
reads companion keys, so one class sets size, leading, tracking and weight:

```css
@theme {
  --text-display-1: clamp(2.75rem, 1.5rem + 4.4vw, 5.25rem);
  --text-display-1--line-height: 0.96;
  --text-display-1--letter-spacing: -0.035em;
  --text-display-1--font-weight: 600;
  /* …same four keys for display-2, title-1, title-2, body-lg, body, caption, eyebrow */
}
```

→ `text-display-1`, `text-title-2`, `text-eyebrow` … (`eyebrow` still needs
`uppercase`; bundle it in the `Eyebrow` primitive in Phase 2.)

**⚠ Name collision — `text-body`.** `index.css` already defines component classes
`.text-body` and `.text-body-sm` (`@apply text-muted-foreground text-base
leading-relaxed`). A `--text-body` theme key generates a *utility* with the same
class name; both would apply, the utility winning on `font-size` while the old
colour and leading leak through. They are used only 6× in 2 files. Phase 1 deletes
both component classes and rewrites the usages as `text-body text-muted-foreground`.
`.text-body-sm` (14px) has no equivalent in the 8-step scale — use `text-body`
inside cards, `text-caption` only where space is genuinely constrained.

**Legacy heading classes → tokens** (62 uses across 12 files; defined in
`@layer components`, so Phase 1 can re-point the definitions without touching JSX):

| Legacy class | Today | Becomes |
|---|---|---|
| `.heading-hero` | `text-4xl sm:text-5xl lg:text-6xl font-extrabold` | `display-1` |
| `.heading-page` | `text-4xl sm:text-5xl font-bold` | `display-2` |
| `.heading-section`, `.heading-section-light` | `text-3xl sm:text-4xl font-bold` | `title-1` |
| `.heading-card` | `text-lg font-bold` | `body-lg` size at weight 600 (proposal — the scale has no 18–19px heading step) |
| `.pa-stage-title`, `.pa-stage-hero-title` | `font-weight: 800`, −0.02em | weight 600, −0.03em; **keep the two-axis `min(vw, vh)` clamp** |

The next two items were **measured** in headless Chrome with the real variable
Inter at the real spec (`docs/baseline/type-probe.jpg`, source in
`docs/qa/tools/typeprobe.html`):

| Context | Content width | `display-1` | First clause wraps to | `<h1>` total | Widest word |
|---|---|---|---|---|---|
| 320 viewport | 272px | 44px | 7 lines / 296px | 399px | "pharmaceutical" 288.6px — **overflows by 16.6px** |
| 390 viewport | 342px | 44px | 6 lines / 253px | 326px | fits |
| 768 viewport | 707px | 57.8px | 4 lines / 222px | 264px | fits |
| 1366, half-width hero column (600px) | 600px | 84px | **7 lines / 564px** | 637px | fits |
| 1440, half-width hero column (640px) | 640px | 84px | 6 lines / 484px | 557px | fits |

**⚠ `display-1` at 320px overflows.** "pharmaceutical" is 288.6px wide at the 44px
floor; the content box is 272px (320 − 2 × the 24px `--gutter` floor). Fix in
Phase 1/4 with `overflow-wrap: anywhere` + `hyphens: auto` on the hero `<h1>`, or a
lower floor below 360px (≤ 41px makes it fit). The brief's Phase 4 gate is "hero
legible at 320px".

**⚠ `display-1` inside the pinned hero.** `.pa-stage-hero-title` exists so the whole
hero block always fits one pinned viewport — its size is
`clamp(1.3rem, min(3vw, 4.6vh), 3rem)`, i.e. height-aware; `display-1` is
width-only. The real hero copy block is `max-w-xl lg:max-w-[46%]`
(`HomeJourney.tsx:79`) — **559px** at both 1366 and 1440, narrower than the two
columns probed above — so the 80-character clause runs to 7 lines at 84px
("pharmaceutical", 550.9px, clears the column by 8px). The `<h1>` alone is
≈ 640px tall, before the chip, sub-headline and CTAs (≈ 180px more), against 704px
of stage under the navbar at 1366×768 and 836px at 1440×900. It does **not** fit —
and a seven-line headline is still a wall, only a lighter one. The 18ch display
measure (≈ 940px at 84px) is unreachable in a 46 % column. Phase 4 must either give
the headline the full content width and let `useStageBands` seat the bottle in
what is left, or make the size height-aware, e.g.
`clamp(2.75rem, min(1.5rem + 4.4vw, 9.5vh), 5.25rem)`. Verify by screenshot at
1366×768 and 1440×900.

**Weight today** (non-admin `.tsx`): `font-black` ×7, `font-extrabold` ×0,
`font-bold` ×20, `font-semibold` ×111. Most heading weight comes from the five
`.heading-*` classes and two `font-weight: 800` rules in `index.css`, so re-pointing
those classes does most of the work. As rendered across all 13 routes, **8.7 % of
characters sit above 600** (700: 8.1 % · 800: 0.4 % · 900: 0.2 %) — that figure must
read 0 after Phase 1 (`audit.json → fontWeights`).

---

## 3 · Colour

### 3.1 Ramp — normative

```
--ink-900   #071628   page black, gallery chapters
--ink-800   #0D2038
--ink-700   #12304F   headings on light
--ink-600   #1B4374
--ink-500   #55637A   body on light
--ink-400   #8996A8   captions

--brand-700 #2E4E88
--brand-600 #3A5D9F   primary action
--brand-500 #4A72B8
--brand-400 #7B9BD6
--brand-300 #A9C4F0   accents on dark
--brand-100 #E4ECF9
--brand-50  #F3F7FD

--surface-0 #FFFFFF
--surface-1 #FAFBFD
--surface-2 #F1F4F8
--hairline  rgba(11,31,59,0.08)

--eco-600   #2E8B6B   replaces the neon lime on "sustainable"
```

Rules from the brief:

- Delete `#32CD32`. The word "sustainable" stays; it renders in `--eco-600`.
- `--accent` and `--accent-border` both come from the brand ramp. Remove the orange
  `hsl(24 90% 45%)`.
- Dark mode's `--accent: 24 90% 55%` (orange) contradicts light mode. Unify on
  `--brand-300`.
- The WhatsApp float keeps `#25D366` **inside its icon only**; the pill itself is
  `--surface-0` with `--hairline` and `--ink-700` text.
- No hex literal inside a `className`, ever.

### 3.2 Measured contrast — what each token may be used for

Ratios are foreground on background. AA body text needs **4.5:1**; large text
(≥ 24px, or ≥ 18.66px at weight ≥ 700) and UI graphics need **3:1**.

**On light surfaces**

| Foreground | `surface-0` | `surface-1` | `surface-2` | Verdict |
|---|---|---|---|---|
| `ink-900` | 18.19 | 17.57 | 16.49 | any text |
| `ink-800` | 16.40 | 15.84 | 14.86 | any text |
| `ink-700` | 13.45 | 12.99 | 12.19 | any text — headings |
| `ink-600` | 9.99 | 9.65 | 9.06 | any text |
| `ink-500` | 6.08 | 5.88 | 5.51 | any text — body |
| `ink-400` | **3.00** | **2.90** | **2.72** | **⚠ fails AA as text; fails even large text on `surface-1/2`** |
| `brand-700` | 8.20 | 7.92 | 7.43 | any text |
| `brand-600` | 6.47 | 6.25 | 5.86 | any text — links, primary action |
| `brand-500` | 4.78 | 4.62 | **4.34** | text on `surface-0/1` only |
| `brand-400` | 2.80 | 2.70 | 2.54 | decoration only |
| `eco-600` | **4.18** | **4.04** | **3.79** | **large text only** |

**On dark (gallery) chapters**

| Foreground | `ink-900` | `ink-800` | `ink-700` | Verdict |
|---|---|---|---|---|
| `surface-0` (white) | 18.19 | 16.40 | 13.45 | headings |
| `brand-100` | 15.30 | 13.79 | 11.31 | any text |
| `brand-300` | 10.26 | 9.25 | 7.58 | any text — links, eyebrows, accents |
| `brand-400` | 6.50 | 5.86 | 4.80 | any text |
| `ink-400` | 6.06 | 5.46 | **4.48** | captions on `ink-900/800` only |
| `brand-500` | 3.80 | 3.43 | 2.81 | large text / UI graphics on `ink-900/800` |
| `eco-600` | 4.35 | 3.92 | 3.22 | large text only |
| `ink-500` | 2.99 | 2.70 | 2.21 | **never on dark** |

**Action fills:** white label on `brand-700` 8.20 · `brand-600` 6.47 ·
`brand-500` 4.78 · `eco-600` **4.18 (fails — never a button fill with small white text)**.

**⚠ Two ramp roles fail the brief's own §7 budget:**

1. **`--ink-400` is labelled "captions" but is 3.00:1 on white.** `--text-caption`
   is 13px/500 — body-size text needing 4.5:1. *Proposal:* captions on light use
   `--ink-500` (6.08:1); `--ink-400` is reserved for captions **on dark**
   (6.06:1 on `ink-900`), placeholders, disabled states and non-text marks.
2. **`--eco-600` is 4.18:1 on white.** Fine for "sustainable" inside the `display-1`
   headline (large text, 3:1), but it may never colour body-size text or sit under
   small white text.

### 3.3 Semantic layer — implementation note

"Replace the current `:root` block" cannot mean *delete the shadcn semantic
tokens*: `bg-primary`, `text-navy`, `border-border`, `text-muted-foreground`… are
used throughout the pages, by `components/ui/{card,toast,toaster,tooltip}` and by
`src/admin/**` (which we may not touch). The ramp becomes the **primitive** layer
and the existing semantic names are **re-pointed** at it.

Today `@theme inline` wraps HSL triplets: `--color-primary: hsl(var(--primary))`.
`--hairline` is `rgba()` and the ramp is hex, so switch to full-colour values:
`--color-primary: var(--primary)` with `--primary: var(--brand-600)`. This is safe —
recon found **zero** `hsl(var(--…))` consumers in any `.ts`/`.tsx` (admin included);
the only two are in `index.css`'s own `body` rule. Tailwind v4 opacity modifiers
(`bg-primary/10`) compile to `color-mix()` and work with any colour format.

| Semantic token | Today | Re-pointed to |
|---|---|---|
| `--background` | `#FFFFFF` | `--surface-0` |
| `--foreground` | `#0F2A4E` | `--ink-700` |
| `--card`, `--popover` | `#FFFFFF` | `--surface-0` |
| `--card-foreground`, `--popover-foreground` | `#0F2A4E` | `--ink-700` |
| `--border`, `--input`, `--card-border`, `--popover-border` | `hsl(220 13% 91%)` | `--hairline` |
| `--primary`, `--ring` | `#4164A8` | `--brand-600` (ring: `--brand-500`, see §7) |
| `--primary-foreground` | `#FFFFFF` | `--surface-0` |
| `--primary-border` | `hsl(218 64% 25%)` | `--brand-700` |
| `--navy` | `#0F2A4E` | `--ink-700` **⚠ dual role, see below** |
| `--secondary`, `--muted` | `hsl(220 14% 96%)` ≈ `#F3F4F6` | `--surface-2` |
| `--secondary-foreground` | navy | `--ink-700` |
| `--muted-foreground` | `hsl(205 15% 45%)` = `#627684` | `--ink-500` |
| `--accent` | `hsl(217 65% 74%)` = `#93B4E8` | `--brand-300` |
| `--accent-foreground` | navy | `--ink-700` |
| `--accent-border` | **orange** `hsl(24 90% 45%)` | `--brand-400` |
| `--destructive*`, `--chart-*`, `--sidebar-*` | — | unchanged (not in the brief; `--chart-2` is orange but no chart is rendered on the public site) |

Re-pointing `--muted-foreground` also fixes a failure the brief does not list:
today's `.text-body` colour on `bg-secondary` sections is **4.33:1** (fails AA);
`--ink-500` on `--surface-2` is 5.51:1.

**⚠ `--navy` does two jobs.** `text-navy` is "headings on light" (→ `--ink-700`) and
`bg-navy` is "dark section" (→ `--ink-900` in the chapter model). One variable
cannot be both. *Proposal:* Phase 1 points `--navy` at `--ink-700` for both roles
(`#12304F` is within a few RGB steps of today's `#0F2A4E`, so structure and tone are
preserved as Phase 1 requires); the `Chapter` primitive introduces `--ink-900`
gallery chapters in Phase 2+, and `bg-navy` is retired page by page through Phase 7.

**⚠ Admin will drift.** `src/admin/**` mixes token classes with 83 hex literals
(`#4164a8` ×67). When `--primary` moves from `#4164A8` to `#3A5D9F`, admin screens
will show two slightly different blues side by side. See §10.

### 3.4 Chapter themes — implementation note (Phase 2)

The `.dark` block in `index.css` is **dead code today**: no `ThemeProvider`, nothing
ever adds the `.dark` class, and there are zero `dark:` utilities in the codebase.
That makes it free to repurpose: a gallery chapter is simply a subtree carrying
`.dark`, so every semantic class inside it flips without per-component overrides.

```css
.dark {                                  /* = <Chapter theme="gallery"> */
  --background: var(--ink-900);
  --foreground: var(--surface-0);        /* 18.19:1 */
  --muted-foreground: color-mix(in srgb, var(--surface-0) 72%, var(--ink-900)); /* #BABEC3, 9.74:1 */
  --border: rgba(255,255,255,0.10);
  --card: var(--ink-800);
  --primary: var(--brand-300);           /* links/accents on dark, 10.26:1 */
  --primary-foreground: var(--ink-900);
  --accent: var(--brand-300);  --accent-border: var(--brand-400);
  --ring: var(--brand-300);
}
```

On-dark text rules (all measured): headings `--surface-0`; body the 72 % mix above
(a solid colour derived from two ramp tokens — no new hex, no alpha stacking);
captions `--ink-400` on `ink-900/800` only; links and eyebrows `--brand-300`.

### 3.5 Translucent white text — what is actually broken

The brief (§2.9) says `text-white/50`, `/60` and `/65` never clear AA. Measured
against the backgrounds they really sit on, that is **true on `bg-primary`, false on
navy**:

| Class | on `bg-navy` `#0F2A4E` | on stage `#07172E` | on `bg-primary` `#4164A8` |
|---|---|---|---|
| `text-white/40` | 3.52 | 3.79 | **2.26** |
| `text-white/50` | 4.66 ✓ | 5.21 ✓ | **2.72** |
| `text-white/60` | 6.10 ✓ | 6.98 ✓ | **3.20** |
| `text-white/65` | 6.86 ✓ | 8.02 ✓ | **3.48** |
| `text-white/70` | 7.74 ✓ | 9.11 ✓ | **3.75** |
| `text-white/80` | 9.65 ✓ | 11.68 ✓ | **4.39** |
| `text-white/90` | 11.90 ✓ | 14.60 ✓ | 5.08 ✓ |

The real defect is the **mid-tone `bg-primary` band**: nothing under `white/82`
passes on it, including the `/70` (×13) and `/80` (×18) the brief does not mention.
Every page-header subtitle is affected. Removing the `bg-primary` bands (principle 2)
fixes the cause; the token swap fixes the symptom. Occurrence counts, non-admin
`.tsx`: `/40` ×4 · `/50` ×9 · `/60` ×23 · `/65` ×12 · `/70` ×13 · `/75` ×1 · `/80` ×18.
Phase 8 must check each against its actual background — see the automated audit in
`docs/baseline/`.

Also failing today: `#32CD32` on white **2.12:1** (fails even large text);
white label on the WhatsApp `#25D366` pill **1.98:1**; `#93B4E8` on `bg-primary` 2.75:1.

**Measured baseline (`docs/baseline/audit.json`, 1440×900, all 13 routes):
180 of 968 visible text nodes — 18.6 % — fail AA** against their real rendered
background; 33 more sit over footage, gradients or a canvas and cannot be resolved
from CSS. The largest groups, none of which the brief's `/50 · /60 · /65` list
would have caught on its own:

| Rendered pair | Ratio | Nodes | Routes | Source |
|---|---|---|---|---|
| `#6F7F94` on navy | 3.53 | 52 | 13 | `text-white/40` — footer column heads, tagline, copyright |
| `#99A1AF` on white | 2.60 | 20 | 5 | **`text-gray-400`** — Tailwind default palette |
| `#B3C1DD` on primary | 3.20 | 17 | 13 | `text-white/60` on the `bg-primary` header band |
| `#6A7282` on `#F3F4F6` | 4.39 | 15 | 8 | **`text-gray-500`** on `bg-secondary` |
| white on `#25D366` | 1.98 | 13 | 13 | WhatsApp float label |
| `#576982` on navy | 2.58 | 13 | 13 | `text-white/30` — footer "Admin" link |
| `#DDE3F0` on `#5574B2` | 3.61 | 12 | 12 | the 12px page-header eyebrow tag — `text-white/80` on `bg-white/10` over `bg-primary` |
| `#BDC9E1` on primary | 3.47 | 11 | 11 | `text-white/65` — every page-header subtitle |

Re-run `docs/qa/tools/audit.ps1` after each phase; the failing count is the a11y
regression gate.

### 3.6 Hex codemod map (Phase 1)

| Literal | × | Where | Becomes |
|---|---|---|---|
| `#4164a8`, `#4364a7` | 90 + 1 | 18 files | `primary` — it *is* today's `--primary` (`text-[#4164a8]/70` → `text-primary/70`) |
| `#0f2a4e` | 53 | 12 pages | `navy` — it is today's `--navy` |
| `#93b4e8` | 17 | 6 files | `accent` — it is today's `--accent` |
| `#07172e` | 7 | `three/`, `video/` | `ink-900` |
| `#0f2a4d` | 4 (+1 three.js) | stage gradients, Products | `ink-700` |
| `#1d4478` | 2 | stage gradients | `ink-600` |
| `#a9c4f0` | 2 | `three/` | `brand-300` (exact) |
| `#c7d8f5` | 1 (+1 three.js) | ShowroomScene label | `brand-100` |
| `#eaf1fc`, `#ffffff` | 1 + 1 (+2 three.js) | HomeJourney light backdrop | `brand-100`, `surface-0` |
| `#32cd32` | 1 | Home | `eco-600` |
| `#25d366` | 6 | WhatsAppFloat, Contact, Home | **⚠** `whatsapp` token defined once in CSS, icon only |
| `#1ebe57` | 1 | WhatsAppFloat hover | dropped with the neutral pill |
| `#0a66c2`, `#084d92` | 1 + 1 | ManagementTeam (LinkedIn) | **⚠** neutral (`ink-700` → `brand-600` on hover), or a `linkedin` CSS token |
| `#9ca3af` | 1 | Home — SVG `stroke=` attribute | `stroke="currentColor"` + `text-ink-400` |
| Career palette | 65 | `Career.tsx` only | see below |

The two stage backdrops are arbitrary-value radial gradients with three literals
each; move them to named classes in `index.css`
(`radial-gradient(… var(--ink-600) 0%, var(--ink-700) 48%, var(--ink-900) 100%)`)
rather than threading `var()` through a 120-character class string.

`Breadcrumb.tsx:8` mentions `#4164a8` in a **comment** — the acceptance grep counts
it, so reword the comment.

**⚠ A second leak the hex grep cannot see: Tailwind's default palette.** 97
utilities in 16 non-admin files bypass the tokens without containing a `#` —
`text-gray-500` ×42, `text-gray-600` ×20, `text-gray-400` ×14, `bg-gray-200` ×6,
plus a few `gray-700/800/900`, `border-gray-300/400`, six `red-*` (form errors) and
two `green-*` (form success); `index.css` has one (`hover:bg-blue-50` in
`.btn-light`). Two of them are top-five contrast failures (§3.5). Fold them into
the Phase 1 codemod: `text-gray-500/600/700` → `text-muted-foreground`
(`--ink-500`), `text-gray-400` → `--ink-500` for text / `--ink-400` for marks,
`text-gray-800/900` → `text-foreground`, `bg-gray-200` → `bg-muted`,
`border-gray-*` → `border-border`, `hover:bg-blue-50` → `hover:bg-brand-50`. Error
and success colours need tokens of their own (`--destructive` exists; success can
reuse `--eco-600` for large text or icons only). Suggested extra gate:

```bash
grep -rhoE '\b(text|bg|border|ring|from|to|via|divide|fill|stroke)-(gray|slate|zinc|neutral|stone|blue|green|red)-[0-9]{2,3}\b' \
  src --include=*.tsx --exclude-dir=admin | wc -l     # 97 → 0
```

**⚠ `Career.tsx` has its own 14-colour palette** the brief never measured:
`#1e5da6` ×13 → `brand-600` · `#627684` ×12 → `ink-500` · `#173454` ×10 → `ink-700` ·
`#0b2444` ×7 → `ink-800` · `#9aaab1` ×4, `#71828a`, `#597080` → `ink-400`/`ink-500` ·
`#74a9e8` → `brand-400` · `#d5dede`, `#f8f7f1` → `surface-2`/`surface-1` — and **14
warm ambers** (`#f0b36d` ×6, `#f4c17f` ×5, `#e09b55` ×2, `#e6a35c`) with no home in a
ramp that deliberately removes orange. See §10.

**The 7 legitimate survivors** (three.js colour arguments, confirmed by grep):
`Stage.tsx` — 4 × `Lightformer` (`#ffffff`, `#dbe7fb`, `#ffffff`, `#e8f0fd`),
1 × `ContactShadows` (`#0f2a4d`), 1 × `FloorGlow` default (`#9db9ec`);
`ShowroomScene.tsx` — 1 × `lineBasicMaterial` (`#c7d8f5`).

**⚠ Acceptance criterion needs restating** — see §9.

---

## 4 · Space, surfaces, elevation

### 4.1 Tokens — normative

```
--space-chapter: clamp(6rem, 10vw, 11rem)   /* replaces .section-pad */
--space-block:   clamp(3rem, 5vw, 5rem)
--gutter:        clamp(1.5rem, 4vw, 2.5rem)
--measure-content: 1240px
--measure-media:   1440px

--pa-radius-sm: 6px   --pa-radius-md: 12px   --pa-radius-lg: 18px
--pa-radius-xl: 24px  --pa-radius-2xl: 32px

--shadow-card:  0 1px 2px rgba(11,31,59,.04), 0 8px 24px -12px rgba(11,31,59,.14)
--shadow-lift:  0 2px 4px rgba(11,31,59,.05), 0 20px 40px -16px rgba(11,31,59,.20)
--shadow-media: 0 32px 64px -32px rgba(7,22,40,.45)
```

**Name the radius tokens `--pa-radius-*`.** `@theme inline` already derives
`--radius-sm/md/lg/xl` from `--radius: 0.5rem` (4 / 6 / 8 / 12px) and the Radix
components depend on them. Use the `--pa-` prefix **or** raise `--radius` and let
the `calc()` chain follow — never define both. This document chooses the prefix.

**Cards lose their borders.** Depth comes from `--surface-1` against `--surface-0`
plus `--shadow-card`. Hover: `translateY(-2px)` + `--shadow-lift` over 240ms, and
`scale(1.02)` on **contained media only**.

### 4.2 Implementation notes

- `.section-pad` is `py-16 sm:py-20 lg:py-24` (64 / 80 / 96px) and is used **60×
  in 14 files**. `--space-chapter` resolves to 96px below 960px, 144px at 1440,
  176px from 1760px — mobile sections get 50 % taller. Phase 1 must leave layout
  unchanged, so `.section-pad` keeps its value until the `Chapter` primitive
  replaces it (Phases 4–7).
- `.container-width` is `max-w-7xl` (1280px) + `px-4 sm:px-6 lg:px-8`, used 50× in
  18 files → `max-width: var(--measure-content)` (1240px) with
  `padding-inline: var(--gutter)`. The 40px narrowing is a layout change: Phase 2+,
  not Phase 1.
- Register the three shadows in `@theme` → `shadow-card`, `shadow-lift`,
  `shadow-media`. The existing `:root` overrides of `--shadow-2xs … --shadow-2xl`
  (blue-tinted `rgba(30,75,138,…)`) stay until the 42 legacy `shadow-*` usages are
  migrated.
- Register radii as `--radius-pa-sm …` only if utilities are wanted
  (`rounded-pa-lg`); otherwise consume `var(--pa-radius-lg)` from primitives.
  155 `rounded-*` utilities exist today (non-admin) — they are replaced primitive by
  primitive, not by codemod.
- **⚠ The brief's §6 names `--radius-md` (Contact fields) and `--radius-lg`
  (Navbar dropdowns).** Read these as `--pa-radius-md` (12px) and `--pa-radius-lg`
  (18px); the un-prefixed names are the Radix chain (6px / 8px).
- `.card-standard` is used 10× in 7 files; `components/ui/card.tsx` is imported by
  exactly one file, `pages/not-found.tsx` (the brief says zero).

---

## 5 · Motion

### 5.1 Tokens — normative

```
--ease-out:      cubic-bezier(0.22, 1, 0.36, 1)    /* the existing curve */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)
--dur-fast: 160ms  --dur-base: 240ms  --dur-slow: 320ms  --dur-reveal: 560ms
```

`cubic-bezier(0.22, 1, 0.36, 1)` is hardcoded **4×** in `index.css` — lines 227
(`.pa-hero-reveal`), 240 (`.pa-chip-float`), 245 (`.pa-chip-float-delay`) and 274
(`.pa-spec-swap`) — and nowhere in `.tsx`. Point all four at `var(--ease-out)`.
No `--ease-*` / `--dur-*` property exists in `index.css` today (confirmed).

### 5.2 `Reveal` — normative

Delete the `.reveal` class and the seven
`document.querySelectorAll<HTMLElement>(".reveal")` IntersectionObserver blocks
(Applications, CaseStudies, Downloads, FAQ, Home, Industries, Technology). Build
`src/components/motion/Reveal.tsx` on **framer-motion** (installed at `^12.23.24`,
imported by zero files):

- `opacity 0→1`, `y 16→0`, `scale 0.985→1`, `--dur-reveal`, `--ease-out`
- `viewport={{ once: true, amount: 0.25 }}`
- sibling stagger **60ms** via a `<RevealGroup>` parent
- returns children **unanimated** when `prefers-reduced-motion: reduce`

Apply it to **all 13 routes**. Today `.reveal` is on 42 elements across 7 pages —
Home 13, Technology 9, Applications 6, Industries 5, Downloads 4, FAQ 3,
Case Studies 2 — and on none of the other six.

**Never** add smooth-scroll hijacking, Lenis, Locomotive, GSAP or ScrollTrigger.
The native-scroll + rAF + ref pattern in `three/scroll.ts` is why the pinned stages
are smooth; `Reveal` must not touch it.

### 5.3 Implementation notes

- **⚠ `--ease-out` shadows a Tailwind built-in.** Tailwind v4's default theme
  already ships `--ease-out: cubic-bezier(0, 0, 0.2, 1)` behind the `ease-out`
  utility. Declaring the brief's value in `@theme` deliberately re-defines that
  utility site-wide. It is safe here — `ease-out` is used **0×** in `.tsx` — but
  check `tw-animate-css` does not read `--ease-out` once `node_modules` exists.
  `--ease-standard` is byte-identical to Tailwind's built-in `--ease-in-out`.
- `--dur-*` is not a Tailwind namespace. Consume as `duration-(--dur-base)`
  (v4 variable shorthand) or from CSS.
- **⚠ `Career.tsx` runs an eighth, private reveal system** — an inline `<style>`
  block defining `.career-reveal` / `.career-revealed`, its own
  IntersectionObserver, 20 usages. The brief counts Career as "zero reveals". It
  must migrate to `Reveal` in Phase 7 or the site keeps two systems.
- **Bundle budget.** `motion` components pull most of framer-motion into the
  initial chunk. Prefer `LazyMotion` + `m.*` with `domAnimation` (strict mode).
  The ≤ 180 KB gz initial-JS budget cannot be checked until a build exists (§ Phase 0
  blockers in `docs/baseline/README.md`).
- The existing reduced-motion block in `index.css` (hero reveal, chips, marquee,
  scroll cue, spec swap) stays; `html { scroll-behavior: smooth }` already drops to
  `auto` under reduced motion.

---

## 6 · 3D colour (for reference — full spec is brief §5)

Hex literals that are **three.js arguments** are exempt from the no-hex rule and
live in `.ts`/`.tsx` under `three/`. New ones arriving in Phase 5:
`sheenColor #dfe8f5`, opaque-white resin `#F2F4F6`, `GalleryRig` cool rim `#9db9ec`.
They raise the hex count above 7 by design; the "7" gate applies to Phase 1 only.
Canvas pipeline to add on all three canvases: `ACESFilmicToneMapping`, exposure
1.05, `SRGBColorSpace` (none of `toneMapping`, `outputColorSpace`, `onCreated`
appear anywhere today — confirmed).

---

## 7 · Accessibility tokens

- **Focus ring:** 2px solid `--ring` + 2px offset on every interactive element.
  `--ring` = `--brand-500` on light (4.78:1 against `surface-0`) and `--brand-300`
  on dark (10.26:1 against `ink-900`); both clear the 3:1 non-text requirement.
- **Targets:** 48px minimum on form controls (Contact, Career); 44px elsewhere.
- **Text:** body ≥ 4.5:1, large ≥ 3:1, verified by computing against the real
  background. Use §3.2 as the lookup table; extend `contrast.ps1` when a token or
  surface is added.
- Preserve: `aria-hidden` canvases, the `aria-live="polite"` Showroom spec panel
  (`Showroom.tsx:164`), and `useScrollCaptions`' keyboard-focus handling.

---

## 8 · Never

Hex literal in a `className` · `font-weight` above 600 · a `<canvas>` on every page ·
React state for scroll progress · mutating a material reached through `useGLTF` ·
GSAP / ScrollTrigger / Lenis / Locomotive / any smooth-scroll library ·
`@react-three/postprocessing` · a CSS-in-JS runtime · a component library ·
a second font service · claiming a visual result that has not been screenshotted.

---

## 9 · Phase 1 acceptance, restated against the real tree

The brief's gate is
`grep -rhoiE '#[0-9a-f]{6}' src --include=*.tsx | wc -l` → **197 → 7**.
On the current tree that command returns **345**, in 28 files:

| Scope | Occurrences | Files |
|---|---|---|
| all of `src` | **345** | 28 |
| minus `src/admin/**` (83, never-touch) | **262** | 25 |
| minus `pages/Career.tsx` as well (65) | **197** | 24 |

So "197" silently excluded both admin and Career. `7` is unreachable with the
command as written unless admin is edited. Proposed gate:

```bash
grep -rhoiE '#[0-9a-f]{6}' src --include=*.tsx --exclude-dir=admin | wc -l   # 262 → 7
```

…with every survivor a three.js colour argument and none inside a `className`.

**Measured after the Phase 1 codemod (2026-09-22):**

| Gate | Before | After |
|---|---|---|
| hex literals, non-admin `.tsx` | 262 | **7** — `Stage.tsx` 4 × `Lightformer`, 1 × `ContactShadows`, 1 × `FloorGlow` default; `ShowroomScene.tsx` 1 × `lineBasicMaterial` |
| hex inside a `className` | 255 | **0** |
| Tailwind default-palette utilities | 97 | **0** |
| `font-bold` / `font-black` / `font-extrabold` in `.tsx` | 27 | **0** |
| `font-serif` / `font-mono` in `.tsx` | 9 | **0** |
| `hsl(var(--…))` wrappers in `index.css` | 42 | **0** |
| `pnpm typecheck` errors | 4 (admin) | **4** (the same lines) |
| build | passes | passes — entry 163.2 KB gz, three chunk 284.0 KB gz, CSS 15.7 KB gz |

Rendered-weight and contrast results are in `docs/qa/phase-1/README.md`.

---

## 10 · Open questions for review

*Resolved in Phase 1 with the recommended answer in each case; see §11 for what was
actually done. Any of them can be reversed in one place.*

1. **Captions.** Accept `--ink-500` for captions on light (`--ink-400` is 3.00:1)?
2. **Admin drift.** `src/admin/**` holds 83 hex literals and consumes `--primary`.
   (a) accept two slightly different blues in admin *(recommended — internal UI)*,
   (b) allow a token-only codemod inside admin, or (c) pin admin to the legacy values.
3. **Phase 1 gate.** Adopt `--exclude-dir=admin` → 262 → 7 (§9)?
4. **Career is a different design language, not just a different palette.** It is
   the largest page (574 lines) and the brief never measured it: 7 headings in
   `font-serif` (**Georgia**), its own tracking/leading literals
   (`tracking-[-0.045em]`, `leading-[0.98]`), a `whitespace-nowrap text-[1.1rem]`
   `<h1>` on phones, a sticky sub-nav, 14 amber accents, an inline `<style>` block
   and a private reveal system. Ironically its hairline-ruled editorial layout is
   the closest thing on the site to the target. Bring it fully onto the system —
   Inter `display-*`, ambers → `brand-300` on dark / `brand-600` on light
   *(recommended; the brief lists Career under "tokens, type, chapter themes,
   Reveal")* — or keep the serif/amber voice as a deliberate, documented exception?
5. **`--navy` dual role.** Point it at `--ink-700` in Phase 1 and retire `bg-navy`
   through the `Chapter` primitive (§3.3)?
6. **Third-party brand colours.** WhatsApp green as a CSS token used on the icon
   only (also in the Contact and Home WhatsApp buttons, which the brief does not
   mention), and LinkedIn blue neutralised — or tokenised?
7. **Gallery chapters as `.dark` scope** (§3.4) — approve the mechanism?
8. **`display-1` in the pinned hero** — 7 lines / ≈ 640px in today's 46 % column
   (§2.4, measured). Full-width headline with the bottle seated by `useStageBands`,
   or a height-aware clamp?
9. **`cv11` / `ss01`.** Measured no-ops on Google-hosted Inter (§2.1). Accept Inter's
   default *a* and digits *(recommended — zero cost)*, or self-host
   `InterVariable.woff2` (≈ 345 KB) to get the single-storey *a* and open digits?
10. **Default-palette leak.** Add the `gray-*` gate (97 → 0) to Phase 1 (§3.6)?

---

## 11 · Decisions log

### Phase 1 — 2026-09-22

**Where things live.** `@theme` holds the type scale (each step with its
`--line-height` / `--letter-spacing` / `--font-weight` companions, so `text-display-2`
sets all four), the three shadows, `--ease-out` / `--ease-standard` and
`--color-whatsapp`. `@theme inline` maps the ramp to utilities (`text-ink-500`,
`bg-surface-1`, `border-hairline`, `text-eco-600` …) and keeps every shadcn semantic
name. `:root` holds the ramp itself under the brief's names (`--ink-900` …), the
space / measure / `--pa-radius-*` / `--dur-*` tokens, and the semantic re-pointing of
§3.3 — full-colour values now, so every `hsl(var(--x))` wrapper is gone.

**Answers taken (§10).** 1 captions on light use `--ink-500`; `--ink-400` is for marks
and for captions on dark only. 2 admin is left alone and will show two blues.
3 the Phase 1 gate excludes `src/admin/**`. 4 Career is brought onto the system
(below). 5 `--navy` → `--ink-700` for both roles; `bg-navy` retires through `Chapter`.
6 WhatsApp green is the token `--color-whatsapp`, used only on the glyph and — until
Phase 3 restyles the float — on the pill it already had; LinkedIn is neutralised to
`bg-navy hover:bg-primary`. 7 and 8 are Phase 2 / Phase 4 items. 9 `"cv11", "ss01"`
are declared as specified although they are no-ops on Google's build. 10 the gray
gate was added and is at 0.

**Type.** `.heading-hero` maps to `display-2` (36–60px), not `display-1`, until Phase 4
splits the 158-character headline; at `display-1` the unsplit sentence would run to
ten lines. `.heading-page` → `display-2`, `.heading-section(-light)` → `title-1`,
`.heading-card` → 19px / 600 / 1.3 (explicit CSS, since `@apply text-body-lg
font-semibold` would leave the companion weight ambiguous). `.section-tag(-light)` →
`text-eyebrow uppercase` (11px, 0.22em) and the eleven inline copies of that class
string were collapsed to `section-tag`. `.pa-stage-title` / `.pa-stage-hero-title`
keep their two-axis clamps at weight 600 / −0.03em. `font-bold` / `font-black` → `font-semibold`
(27 occurrences), `strong, b { font-weight: 600 }` in the base layer, and every stat,
counter and spec value carries `tabular-nums`. The `.text-body` / `.text-body-sm`
component classes were deleted: the `--text-body` token now owns `text-body` (Career's
four usages keep their explicit colour, so they render correctly as the utility) and
Home's one `text-body-sm` became `text-sm leading-relaxed`.

**Colour codemod.** 255 literals in 24 non-admin files → tokens, exactly per §3.6;
the 7 three.js colour arguments remain. The two stage backdrops became
`.pa-backdrop-light` / `.pa-backdrop-dark` in `index.css` (ramp stops; the Showroom
moves the hotspot with `[--pa-backdrop-at:38%_46%]`). SVG attributes use
`currentColor` with a token class on the element. Tailwind's default palette
(97 utilities) → `text-muted-foreground` (gray 400–600), `text-foreground`
(gray 700–900), `bg-muted`, `border-border`, `text-destructive`, `text-eco-600` /
`bg-eco-600/10` (form success), and the toast close button's reds → white alphas +
`ring-destructive`.

**Career.** Georgia and Menlo are gone: the four `h2`s → `text-display-2`, the `h3` →
`text-title-1`, the mono counters → `text-caption tabular-nums`; the `h1` keeps its
responsive sizes at weight 600 / −0.035em but loses `whitespace-nowrap`, which was
tuned to Georgia's narrow lowercase — in Inter the sentence measures ≈1340px at 76px
against a 1216px container and must be allowed to wrap. Palette: `#173454` → `navy`,
`#0b2444` → `ink-800`, `#1e5da6` → `primary`, greys → `muted-foreground` /
`ink-400`, `#74a9e8` → `brand-300`, `#d5dede` → `border`; the ambers → `accent`
(brand-300) in the navy hero and the `bg-accent` closing section, `primary` as icon
colour on light, and `brand-100` inside the `bg-primary` openings section, where
brand-300 would sit at 2.2:1 (brand-100 measures 5.5:1 there). Its private
`.career-reveal` system stays until Phase 7.

**Also.** `index.html` loads the variable axis (`opsz,wght@14..32,300..700`) and its
`theme-color` follows `--brand-600`. `.btn-light`'s `hover:bg-blue-50` →
`hover:bg-brand-50`. `--ease-out` in `@theme` replaces Tailwind's default curve
site-wide — checked: `tw-animate-css` uses the `ease-out` keyword, never
`var(--ease-out)`, and no `.tsx` uses the utility. `.reveal`, `.section-pad`,
`.card-standard` and the `bg-primary` header bands are untouched by design; they are
Phases 2, 4–7.

/**
 * /dev/primitives — the Storybook-free visual check for the Phase 2 primitives (brief §8:
 * "renders all variants in both themes"). Every primitive and every variant is rendered twice,
 * inside a light Chapter and inside a gallery Chapter, so one page proves the `.dark` scope.
 *
 * App.tsx registers this route only when import.meta.env.MODE !== "production"; a production
 * build carries neither the route nor this chunk. `vite build --mode qa` keeps it for the
 * screenshot run (docs/qa/phase-2).
 */
import type { ReactNode } from "react";
import { ArrowRight, Download, Send } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { MODELS } from "@/components/three/pa-models";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { Button, Chapter, Eyebrow, MediaFrame, SpecList, Surface, type ChapterTheme } from "@/components/primitives";

const THEMES: ChapterTheme[] = ["light", "gallery"];
const IMAGES = ["/images/bottles-containers.jpg", "/images/cr-caps.jpg", "/images/ct-caps.jpg"];

const SCALE: Array<{ cls: string; token: string; sample: string }> = [
  { cls: "text-display-1", token: "display-1 · 44–84px · 0.96 · −0.035em · 600", sample: "Delivering sustainable" },
  { cls: "text-display-2", token: "display-2 · 36–60px · 1.02 · −0.03em · 600", sample: "Bottles and Closures" },
  { cls: "text-title-1", token: "title-1 · 28–40px · 1.10 · −0.022em · 600", sample: "Engineered for regulated markets" },
  { cls: "text-title-2", token: "title-2 · 24px · 1.20 · −0.018em · 600", sample: "ISO Class 8 cleanroom moulding" },
  {
    cls: "text-body-lg",
    token: "body-lg · 19px · 1.60 · −0.006em · 400",
    sample: "Every batch follows the same six-stage process, so quality is engineered rather than inspected afterwards.",
  },
  {
    cls: "text-body",
    token: "body · 17px · 1.65 · −0.004em · 400",
    sample: "Every batch follows the same six-stage process, so quality is engineered rather than inspected afterwards.",
  },
  { cls: "text-caption", token: "caption · 13px · 1.50 · 500", sample: "Measured from the CAD source, in millimetres." },
];

function Block({ index, title, note, children }: { index: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mt-20 first:mt-0">
      <Eyebrow className="mb-3">
        {index} · {title}
      </Eyebrow>
      {note && <p className="mb-8 max-w-[62ch] text-body text-muted-foreground">{note}</p>}
      {children}
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span className="mb-2 block text-caption tabular-nums text-muted-foreground">{children}</span>;
}

function Sampler({ theme }: { theme: ChapterTheme }) {
  const bottle = MODELS.pa04;
  const closure = MODELS.pacrc03;
  const bottleSpecs = [
    { label: "Code", value: bottle.code },
    { label: "Height", value: bottle.heightMm, unit: "mm" },
    { label: "Diameter", value: bottle.diameterMm, unit: "mm" },
    { label: "Neck", value: bottle.neck },
    { label: "Material", value: bottle.material },
  ];
  const closureSpecs = [
    { label: "Code", value: closure.code },
    { label: "Height", value: closure.heightMm, unit: "mm" },
    { label: "Diameter", value: closure.diameterMm, unit: "mm" },
    { label: "Fits neck", value: closure.neck },
    { label: "Material", value: closure.material },
    { label: "Kind", value: closure.kind },
  ];

  return (
    <>
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <Eyebrow tone="muted" className="mb-3">
            Chapter · {theme}
          </Eyebrow>
          <h2 className="text-title-1 text-foreground">
            {theme === "light" ? "Specification chapter" : "Gallery chapter"}
          </h2>
        </div>
        <p className="max-w-[48ch] text-body text-muted-foreground">
          {theme === "light"
            ? "--surface-0 page, --ink-700 headings, --ink-500 body, brand-600 actions."
            : "--ink-900 page under the .dark scope: white headings, a 72 % white mix for body, brand-300 for links and eyebrows."}
        </p>
      </div>

      <Block index="01" title="Type scale" note="One class per step sets size, leading, tracking and weight. Maximum weight on the site is 600.">
        <div className="space-y-8">
          {SCALE.map((step) => (
            <div key={step.cls}>
              <Label>{step.token}</Label>
              <p className={`${step.cls} max-w-[18ch] text-foreground ${step.cls.includes("body") || step.cls.includes("caption") ? "!max-w-[62ch]" : ""}`}>
                {step.sample}
              </p>
            </div>
          ))}
          <div>
            <Label>eyebrow · 11px · 0.22em · 600 · uppercase</Label>
            <div className="flex flex-wrap gap-8">
              <Eyebrow>Primary tone</Eyebrow>
              <Eyebrow tone="muted">Muted tone</Eyebrow>
            </div>
          </div>
        </div>
      </Block>

      <Block index="02" title="Button" note="48px targets, --pa-radius-md, --dur-fast transitions, a 2px --ring focus ring with 2px offset. Tab through them.">
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/contact">
            Request a sample <ArrowRight size={16} />
          </Button>
          <Button variant="outline" href="/products">
            View products
          </Button>
          {theme === "light" ? (
            <span className="inline-flex rounded-[var(--pa-radius-lg)] bg-ink-900 p-3">
              <Button variant="light" href="/quality">
                Our quality standards
              </Button>
            </span>
          ) : (
            <Button variant="light" href="/quality">
              Our quality standards
            </Button>
          )}
          <Button type="submit" disabled>
            <Send size={16} /> Sending
          </Button>
          <Button variant="outline" href="https://productarmor.com">
            <Download size={16} /> External link
          </Button>
        </div>
      </Block>

      <Block index="03" title="Surface" note="Borderless: --card on the chapter background, --shadow-card for depth. Interactive surfaces lift 2px on hover and scale contained media by 1.02.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Surface>
            <Label>static · padding md</Label>
            <h3 className="heading-card">Raw material testing</h3>
            <p className="mt-2 text-body text-muted-foreground">Every incoming resin batch is tested for melt flow index and density before use.</p>
          </Surface>
          <Surface interactive as="article">
            <Label>interactive</Label>
            <h3 className="heading-card">In-process control</h3>
            <p className="mt-2 flex-1 text-body text-muted-foreground">Dimensional checks, torque testing and visual inspection at defined intervals.</p>
            <Button variant="outline" href="/quality" className="mt-6 self-start">
              Read more
            </Button>
          </Surface>
          <Surface interactive media={<img src={IMAGES[0]} alt="" loading="lazy" className="h-44 w-full" />}>
            <Label>interactive · media slot</Label>
            <h3 className="heading-card">Bottles and containers</h3>
            <p className="mt-2 text-body text-muted-foreground">Media sits flush and scales on hover; the body keeps its padding.</p>
          </Surface>
          <Surface padding="lg">
            <Label>padding lg</Label>
            <h3 className="heading-card">Certificate of analysis</h3>
            <p className="mt-2 text-body text-muted-foreground">Issued with every shipment, traceable to batch records.</p>
          </Surface>
        </div>
      </Block>

      <Block index="04" title="MediaFrame" note="--pa-radius-xl and --shadow-media by default; media fills the frame with object-fit: cover over a --muted placeholder.">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Label>ratio 16 / 10 · radius xl · shadow</Label>
            <MediaFrame ratio="16 / 10">
              <img src={IMAGES[1]} alt="" loading="lazy" />
            </MediaFrame>
          </div>
          <div>
            <Label>ratio 1 / 1 · radius md · no shadow</Label>
            <MediaFrame ratio="1 / 1" radius="md" shadow={false}>
              <img src={IMAGES[2]} alt="" loading="lazy" />
            </MediaFrame>
          </div>
          <div>
            <Label>ratio 4 / 3 · radius 2xl · caption</Label>
            <MediaFrame ratio="4 / 3" radius="2xl" caption="Child-resistant closures, 38 mm, moulded in-house.">
              <img src={IMAGES[1]} alt="" loading="lazy" />
            </MediaFrame>
          </div>
        </div>
      </Block>

      <Block index="05" title="SpecList" note="Hairline-ruled rows, caption labels, body values in tabular numerals. Values here are read from the MODELS registry.">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Label>one column · size md</Label>
            <SpecList items={bottleSpecs} />
          </div>
          <div>
            <Label>two columns · size sm</Label>
            <SpecList items={closureSpecs} columns={2} size="sm" />
          </div>
        </div>
      </Block>

      <Block index="06" title="Reveal and RevealGroup" note="Each card reveals when a quarter of it is on screen: opacity 0→1, y 16→0, scale 0.985→1 over --dur-reveal on --ease-out, siblings 60 ms apart. Under prefers-reduced-motion: reduce they render as plain elements with no inline style.">
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Reveal key={i}>
              <Surface interactive className="h-full">
                <Label>reveal · sibling {i + 1}</Label>
                <h3 className="heading-card">Staggered surface</h3>
                <p className="mt-2 text-body text-muted-foreground">Entered together, so this one starts {i * 60} ms after the first.</p>
              </Surface>
            </Reveal>
          ))}
        </RevealGroup>
        <Reveal as="p" className="mt-10 max-w-[62ch] text-body text-muted-foreground">
          A lone Reveal outside any group starts as soon as it enters, with no delay.
        </Reveal>
      </Block>
    </>
  );
}

export default function PrimitivesCheck() {
  usePageMeta({
    title: "Primitives check",
    description: "Development-only visual check of the design-system primitives in both chapter themes.",
    path: "/dev/primitives",
  });

  return (
    <div className="pt-16">
      <Chapter theme="light" className="border-b border-border">
        <Eyebrow tone="muted" className="mb-4">
          Phase 2 · primitives check
        </Eyebrow>
        <h1 className="max-w-[18ch] text-display-2 text-foreground">Every primitive, in both chapter themes.</h1>
        <p className="mt-6 max-w-[62ch] text-body-lg text-muted-foreground">
          Chapter, Surface, Eyebrow, SpecList, MediaFrame, Button, Reveal and RevealGroup, rendered once inside a light
          chapter and once inside a gallery chapter. This route exists only outside production builds.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="outline" href="#light">
            Light chapter
          </Button>
          <Button variant="outline" href="#gallery">
            Gallery chapter
          </Button>
        </div>
      </Chapter>
      {THEMES.map((theme) => (
        <Chapter key={theme} id={theme} theme={theme}>
          <Sampler theme={theme} />
        </Chapter>
      ))}
    </div>
  );
}

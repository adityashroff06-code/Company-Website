import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { CheckCircle, ChevronRight, Star, ArrowRight, ArrowUpRight, Phone, Mail, Play } from "lucide-react";
import { CONTACT, SITE } from "@/constants/site";
import { TiltFrame, ImageReveal } from "@/components/Lux3D";
import ProductViewer3D, { type ProductModel } from "@/components/ProductViewer3D";

/* Which engineering model belongs beside a given product heading. */
function modelFor(name: string, category: string): ProductModel | null {
  const t = `${name} ${category}`;
  if (/child|crc|\bcr\b/i.test(t)) return "crCap";
  if (/bottle|container/i.test(t)) return "bottle";
  return null;
}

const CORPORATE_VIDEO_ID = "mHR9lM7LZGw";
const BASE = import.meta.env.BASE_URL;

/* Observes every reveal variant; elements animate once when scrolled into view. */
function useReveal(ready?: boolean) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ready]);
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`} />;
}

/* Counts a stat like "100+" / "1B+" / "100%" up from zero on first view. */
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const m = value.match(/^(\d+)(.*)$/);
    const el = ref.current;
    if (!m || !el) return;
    const target = Number(m[1]);
    const suffix = m[2] ?? "";
    const obs = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        obs.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(`${Math.round(target * eased)}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center sm:text-left">
      <div className="font-display text-4xl sm:text-5xl font-light text-white tabular-nums">{display}</div>
      <div className="lux-kicker text-white/40 mt-2">{label}</div>
    </div>
  );
}

/* Click-to-play facade: only the thumbnail ships with the page. */
function FilmPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative reveal" style={{ transitionDelay: "160ms" }}>
      <div className="absolute -inset-8 sm:-inset-12 bg-[#4164a8]/20 blur-3xl rounded-full pointer-events-none" />
      <div className="relative aspect-video rounded-lg overflow-hidden ring-1 ring-white/15 shadow-2xl shadow-black/60 bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${CORPORATE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
            title="Product Armor Corporate Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full cursor-pointer"
            aria-label="Play the Product Armor corporate film"
          >
            <img
              src={`https://i.ytimg.com/vi/${CORPORATE_VIDEO_ID}/maxresdefault.jpg`}
              alt="Product Armor corporate film preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              onError={e => { (e.target as HTMLImageElement).src = `${BASE}images/hero-poster.jpg`; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1626]/85 via-[#0a1626]/20 to-transparent" />
            <span className="play-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
              <Play size={32} className="text-[#0a1626] fill-[#0a1626] translate-x-0.5" />
            </span>
            <span className="lux-kicker absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 whitespace-nowrap">
              Watch the corporate film
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/* Kinetic headline: leading words rise in, the closing word rolls forever. */
function KineticHeadline() {
  const lead = ["Engineered", "for"];
  const cycle = ["Precision.", "Protection.", "Performance."];

  return (
    <h2 aria-label="Engineered for Precision, Protection, Performance" className="font-display text-4xl sm:text-6xl font-light text-white leading-[1.08] tracking-tight">
      {lead.map((w, i) => (
        <span key={w} className="kinetic-word mr-[0.28em]">
          <span style={{ "--kinetic-delay": `${i * 0.14}s` } as React.CSSProperties}>{w}</span>
        </span>
      ))}
      <span className="kinetic-cycle italic text-[#c2a15f]">
        {cycle.map((w, i) => (
          <span key={w} style={{ "--cycle-delay": `${i * 2.8}s` } as React.CSSProperties}>{w}</span>
        ))}
        <span aria-hidden="true" className="kinetic-sizer">Performance.</span>
      </span>
    </h2>
  );
}

/* Real local assets as fallbacks so the site stays premium even without the content API. */
const FALLBACK_STATS = [
  { value: "100+", label: "Products Portfolio" },
  { value: "1B+", label: "Units Annual Capacity" },
  { value: "20+", label: "Advanced Machines" },
  { value: "100%", label: "Automated Inspection" },
];

const FALLBACK_PRODUCTS = [
  {
    id: "bottles",
    category: "Bottles & Containers",
    name: "Pharmaceutical HDPE Bottles",
    description:
      "High-quality pharmaceutical bottles and containers manufactured in an ISO Class 8 cleanroom, engineered for product protection and regulatory compliance.",
    image: `${BASE}images/hdpe-bottles-real.png`,
    features: ["ISO Class 8 cleanroom production", "100% automated camera inspection", "Low-carbon manufacturing"],
  },
  {
    id: "cr-caps",
    category: "Caps & Closures",
    name: "Child-Resistant Closures (CRC)",
    description:
      "Patented technology delivering one of the lowest carbon footprints in CRC manufacturing, compliant with U.S. PPPA 16 CFR 1700.20.",
    image: `${BASE}images/cr-caps-real.png`,
    features: ["Patented CRC process", "U.S. PPPA compliant", "Trusted by global pharma brands"],
  },
  {
    id: "ct-caps",
    category: "Caps & Closures",
    name: "Continuous Thread (CT) Caps",
    description:
      "Precision-moulded CT caps with consistent torque performance, produced under continuous automated quality monitoring.",
    image: `${BASE}images/ct-caps-real.png`,
    features: ["Consistent torque performance", "Automated quality monitoring", "Global regulatory support"],
  },
];

const FALLBACK_CLIENT_LOGOS = [
  "granules", "hetero", "annora", "msn", "vkt-pharma", "remedica", "strides",
  "chemo", "lupin", "marksans", "graviti", "kusum", "aizant", "orbion",
].map(n => ({ id: n, name: n, logo: `${BASE}images/clients/${n}.png` }));

export default function Home() {
  const { data: content, isLoading } = useGetSiteContent({
    query: { queryKey: getGetSiteContentQueryKey() }
  });
  useReveal(!isLoading);

  const hero = content?.hero;
  const stats = (content?.stats?.length ? content.stats : FALLBACK_STATS);
  const about = content?.about;
  const products = (content?.products?.length ? content.products : FALLBACK_PRODUCTS);
  const certifications = content?.certifications ?? [];
  const clients = (content?.clients?.length ? content.clients : FALLBACK_CLIENT_LOGOS);
  const testimonials = content?.testimonials ?? [];
  const contactData = content?.contact;

  const headline = hero?.headline ?? "Delivering sustainable pharmaceutical bottles and closures for global healthcare";
  const headlineWords = headline.split(/\s+/);

  const scrollToFilm = () => document.getElementById("corporate-film")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="overflow-x-hidden bg-white">

      {/* ── CINEMATIC VIDEO HERO ── */}
      <section className="grain relative min-h-screen flex flex-col justify-end bg-[#0a1626] overflow-hidden">
        {/* Real facility footage, muted loop */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-[0.42]"
          src={`${BASE}videos/hero-loop.mp4`}
          poster={`${BASE}images/hero-poster.jpg`}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1626]/70 via-[#0a1626]/30 to-[#0a1626]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-36 pb-14">
          <div className="max-w-4xl">
            <p className="lux-kicker text-[#c2a15f] mb-7 reveal kinetic-live">
              ISO Class 8 Cleanroom&ensp;·&ensp;Gummadidala, Telangana&ensp;·&ensp;Est. {SITE.founded}
            </p>

            {isLoading ? (
              <>
                <Skeleton className="h-16 w-4/5 mb-4 bg-white/10" />
                <Skeleton className="h-8 w-3/5 mb-8 bg-white/10" />
              </>
            ) : (
              <>
                <h1 aria-label={headline} className="kinetic-live font-display text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-[4.4rem] font-light text-white tracking-tight mb-8">
                  {headlineWords.map((w, i) => (
                    <span key={`${w}-${i}`} className="kinetic-word mr-[0.24em]">
                      <span
                        className={/sustainable/i.test(w) ? "italic text-[#c2a15f]" : undefined}
                        style={{ "--kinetic-delay": `${0.15 + i * 0.055}s` } as React.CSSProperties}
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </h1>
                <p className="text-base sm:text-lg text-white/60 max-w-xl leading-relaxed mb-10 reveal">
                  {hero?.subheadline ?? "Uncompromised integrity, engineered under controlled conditions and trusted by regulated markets worldwide."}
                </p>
              </>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16 reveal">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-white text-[#0a1626] hover:bg-[#e9edf4] px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-300 rounded-sm"
              >
                Explore Products
                <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                onClick={scrollToFilm}
                className="inline-flex items-center gap-3 text-white/80 hover:text-white border border-white/25 hover:border-white/60 px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300 rounded-sm cursor-pointer"
              >
                <Play size={14} className="fill-current" />
                Watch the Film
              </button>
            </div>
          </div>

          {/* Stats strip with live counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t hairline">
            {stats.map(s => (
              <StatCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-3" aria-hidden="true">
          <span className="lux-kicker text-white/30 [writing-mode:vertical-rl]">Scroll</span>
          <div className="w-px h-14 bg-white/10 overflow-hidden">
            <div className="scroll-cue w-px h-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* ── CLIENT MARQUEE ── */}
      {clients.length > 0 && (
        <section className="py-14 bg-[#f6f7f9] border-b hairline-d border-b-[1px]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <p className="lux-kicker text-gray-400 text-center mb-10 reveal">
              Trusted by the world's leading pharmaceutical companies
            </p>
            <div className="logo-marquee relative overflow-hidden">
              <div className="logo-marquee-track flex items-center gap-16 w-max">
                {[...clients, ...clients].map((c, i) => (
                  <div key={`${c.id}-${i}`} className="shrink-0 flex items-center justify-center" title={c.name}>
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} className="marquee-logo h-11 md:h-12 w-auto object-contain" loading="lazy" />
                    ) : (
                      <span className="text-gray-400 font-medium text-sm">{c.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── MANIFESTO ── */}
      <section className="py-28 sm:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
            <div className="lg:col-span-7 reveal-left">
              <p className="lux-kicker text-[#b08d3e] mb-7">The Product Armor Standard</p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-light text-[#0a1626] leading-[1.12] tracking-tight mb-8">
                {(() => {
                  const words = (about?.title ?? "Where formulation meets perfect packaging").trim().replace(/\.$/, "").split(/\s+/);
                  const lead = words.slice(0, -2).join(" ");
                  const em = words.slice(-2).join(" ");
                  return (<>{lead}<br /><em className="text-[#4164a8]">{em}.</em></>);
                })()}
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-10">
                {about?.description ??
                  "Operating within an ISO Class 8 cleanroom environment, we manufacture high-quality containers and closures that meet the rigorous demands of the pharmaceutical industry — advancing toward next-generation packaging technologies and drug-delivery devices for global markets."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-12 max-w-xl">
                {(about?.strengths ?? ["Sustainable Practices", "End-to-End Automation", "Quality Approach", "Economies of Scale"]).slice(0, 6).map(f => (
                  <div key={f} className="flex items-center gap-3 py-3 border-b hairline-d border-b-[1px]">
                    <span className="w-1 h-1 rounded-full bg-[#c2a15f] shrink-0" />
                    <span className="text-[#0a1626] text-sm font-medium tracking-wide">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-[#0a1626] font-semibold text-sm tracking-wide"
              >
                <span className="border-b border-[#c2a15f] pb-1">The company in depth</span>
                <ArrowUpRight size={16} className="text-[#c2a15f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="lg:col-span-5">
              <ImageReveal from="right">
                <TiltFrame className="rounded-lg" max={6}>
                  <img
                    src={about?.image ?? `${BASE}images/cleanroom-corridor.jpg`}
                    alt="Product Armor cleanroom corridor"
                    className="w-full h-[520px] object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = `${BASE}images/about-home.jpg`; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1626]/60 to-transparent" />
                  <div className="lux3d-float absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <div className="lux-kicker text-white/60 mb-1">Facility</div>
                      <div className="text-white font-display text-xl font-light">ISO Class 8 Cleanroom</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-4xl font-light text-white">{SITE.founded}</div>
                      <div className="lux-kicker text-white/50">Est.</div>
                    </div>
                  </div>
                </TiltFrame>
              </ImageReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORPORATE FILM ── */}
      <section id="corporate-film" className="grain relative bg-[#0a1626] py-28 sm:py-32 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14 reveal">
            <p className="lux-kicker text-[#c2a15f] mb-6">Inside Product Armor</p>
            <KineticHeadline />
            <p className="text-white/50 max-w-2xl mx-auto mt-7 leading-relaxed">
              Step inside the cleanroom — where a billion units a year are moulded,
              inspected and armored, virtually untouched by human hands.
            </p>
          </div>
          <FilmPlayer />
        </div>
      </section>

      {/* ── CAPABILITIES — editorial product rows ── */}
      <section className="py-28 sm:py-36 bg-[#f6f7f9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-20 reveal">
            <p className="lux-kicker text-[#b08d3e] mb-6">Capabilities</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#0a1626] leading-tight tracking-tight">
              Engineered for protection.<br />Designed for performance.
            </h2>
          </div>

          <div className="space-y-24">
            {isLoading
              ? Array(3).fill(0).map((_, i) => (
                  <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Skeleton className="h-96 w-full rounded-lg" />
                    <div className="space-y-3 py-8">
                      <Skeleton className="h-8 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                ))
              : products.slice(0, 3).map((p, i) => (
                  <div
                    key={p.id}
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "" : ""}`}
                  >
                    <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                      <ImageReveal from={i % 2 === 1 ? "right" : "left"}>
                        <TiltFrame className="rounded-lg bg-white">
                          <div className="relative h-[380px] sm:h-[440px] overflow-hidden lux3d-media">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = `${BASE}images/bottles-containers.jpg`; }}
                            />
                          </div>
                          <div className="lux3d-float absolute top-5 left-5">
                            <span className="lux-kicker bg-[#0a1626]/80 backdrop-blur text-white/90 px-3.5 py-2 rounded-sm inline-block">
                              {p.category}
                            </span>
                          </div>
                        </TiltFrame>
                      </ImageReveal>
                    </div>
                    <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-1 reveal-left" : "reveal-right"}`}>
                      <div className="font-display text-[#c2a15f] text-xl mb-4">{String(i + 1).padStart(2, "0")}</div>
                      <h3 className="font-display text-3xl sm:text-4xl font-light text-[#0a1626] tracking-tight mb-5">{p.name}</h3>
                      <p className="text-gray-500 leading-relaxed mb-8 max-w-lg">{p.description}</p>
                      <ul className="space-y-3 mb-9 max-w-lg">
                        {p.features.slice(0, 3).map(f => (
                          <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle size={15} className="text-[#4164a8] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      {modelFor(p.name, p.category) && (
                        <div className="mb-9 max-w-lg">
                          <ProductViewer3D model={modelFor(p.name, p.category)!} className="h-[250px]" />
                          <p className="lux-kicker text-gray-400 mt-3">
                            Interactive 3-D · built from our engineering drawings
                          </p>
                        </div>
                      )}
                      <Link
                        href="/products"
                        className="group inline-flex items-center gap-2 text-[#0a1626] font-semibold text-sm tracking-wide"
                      >
                        <span className="border-b border-[#c2a15f] pb-1">View specifications</span>
                        <ChevronRight size={15} className="text-[#c2a15f] group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── CLEANROOM IMMERSIVE BAND ── */}
      <section className="relative py-40 sm:py-52 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${BASE}images/hero-bg.jpg)` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#0a1626]/78" />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center reveal">
          <p className="lux-kicker text-[#c2a15f] mb-7">Technology</p>
          <blockquote className="font-display text-3xl sm:text-5xl font-light text-white leading-[1.2] tracking-tight mb-9">
            "Controlled variables,<br /><em className="text-[#93b4e8]">specified outcomes.</em>"
          </blockquote>
          <p className="text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            Fully automated moulding, 100% camera inspection and end-to-end traceability —
            the discipline of pharmaceutical science, applied to packaging.
          </p>
          <Link
            href="/technology"
            className="inline-flex items-center gap-3 border border-white/25 hover:border-white/70 text-white px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300 rounded-sm"
          >
            Explore the Technology
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      {certifications.length > 0 && (
        <section className="grain relative bg-[#0a1626] py-24 sm:py-28">
          <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 reveal">
              <div>
                <p className="lux-kicker text-[#c2a15f] mb-5">Compliance</p>
                <h2 className="font-display text-3xl sm:text-4xl font-light text-white tracking-tight">
                  Certified to global standards.
                </h2>
              </div>
              <Link
                href="/quality"
                className="group inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors"
              >
                Quality standards
                <ArrowUpRight size={15} className="text-[#c2a15f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {certifications.map((c, i) => (
                <div
                  key={c.id}
                  className="reveal bg-white/[0.04] border hairline border-[1px] rounded-lg p-6 text-center hover:bg-white/[0.08] transition-colors duration-300"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {c.logo ? (
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-md p-2 flex items-center justify-center">
                      <img src={c.logo} alt={`${c.name} logo`} className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-4 rounded-md border hairline border-[1px] flex items-center justify-center">
                      <span className="font-display text-[#c2a15f] text-lg">{c.name.slice(0, 3)}</span>
                    </div>
                  )}
                  <div className="text-white font-semibold text-sm mb-1">{c.name}</div>
                  <div className="text-white/40 text-xs">{c.issuer}</div>
                  <div className="lux-kicker text-[#c2a15f] mt-3">{c.year}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="py-28 sm:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-16 reveal">
              <p className="lux-kicker text-[#b08d3e] mb-6">Testimonials</p>
              <h2 className="font-display text-4xl sm:text-5xl font-light text-[#0a1626] tracking-tight">
                In their words.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className="reveal bg-white p-9 flex flex-col"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div className="flex gap-1 mb-6">
                    {Array(5).fill(0).map((_, j) => (
                      <Star key={j} size={12} className="fill-[#c2a15f] text-[#c2a15f]" />
                    ))}
                  </div>
                  <p className="font-display text-lg font-light text-[#0a1626] leading-relaxed mb-8 flex-1">
                    "{t.quote}"
                  </p>
                  <div className="pt-5 border-t hairline-d border-t-[1px]">
                    <div className="font-semibold text-[#0a1626] text-sm">{t.author}</div>
                    <div className="lux-kicker text-gray-400 mt-1.5">{t.role} · {t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="grain relative bg-[#0a1626] py-28 sm:py-36 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c2a15f]/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 reveal">
              <p className="lux-kicker text-[#c2a15f] mb-7">Begin the Conversation</p>
              <h2 className="font-display text-4xl sm:text-6xl font-light text-white leading-[1.1] tracking-tight mb-8">
                Let's armor your<br /><em className="text-[#93b4e8]">next launch.</em>
              </h2>
              <p className="text-white/50 max-w-lg leading-relaxed">
                Request a sample kit or a technical consultation with our packaging specialists —
                from feasibility to filed DMF.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-5 reveal" style={{ transitionDelay: "120ms" }}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 bg-white text-[#0a1626] hover:bg-[#e9edf4] px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-300 rounded-sm"
              >
                Get in Touch
                <ArrowRight size={16} />
              </Link>
              <div className="space-y-3 pt-3">
                <a href={`tel:${(contactData?.phone ?? CONTACT.phone).replace(/[^+0-9]/g, "")}`} className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors font-mono">
                  <Phone size={13} className="text-[#c2a15f]" />
                  {contactData?.phone ?? CONTACT.phone}
                </a>
                <a href={`mailto:${contactData?.email ?? CONTACT.email}`} className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors font-mono">
                  <Mail size={13} className="text-[#c2a15f]" />
                  {contactData?.email ?? CONTACT.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

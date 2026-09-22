import { lazy, Suspense, useEffect, useState } from "react";
  import { Link } from "wouter";
  import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { CheckCircle, Award, Users, Package, ChevronRight, Star, ArrowRight, Phone, Mail } from "lucide-react";
  import AmbientVideo from "@/components/video/AmbientVideo";
  import { videoSrc, videoWebm, posterSrc } from "@/components/video/videos";
  import { supportsImmersive } from "@/components/three/scroll";
  import HomeJourney from "@/components/three/HomeJourney";

  const Hero3D = lazy(() => import("@/components/three/Hero3D"));

  function useReveal(ready?: boolean) {
    useEffect(() => {
      const els = document.querySelectorAll<HTMLElement>(".reveal");
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
        { threshold: 0.12 }
      );
      els.forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, [ready]);
  }

  function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-muted rounded ${className ?? ""}`} />;
  }

  export default function Home() {
    const { data: content, isLoading } = useGetSiteContent({
      query: { queryKey: getGetSiteContentQueryKey() }
    });
    useReveal(!isLoading);

    const hero = content?.hero;
    const stats = content?.stats ?? [];
    const about = content?.about;
    const products = content?.products ?? [];
    const certifications = content?.certifications ?? [];
    const clients = content?.clients ?? [];
    const testimonials = content?.testimonials ?? [];
    const contactData = content?.contact;
    const company = content?.company;
    // Scroll-driven 3D journey where the device can run it; the classic static hero otherwise.
    const [immersive] = useState(supportsImmersive);

    // Shared by both hero layouts. Inside the pinned journey the headline uses a
    // viewport-fitted size so the whole block always fits one screen.
    const heroCopy = (
      <>
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-4/5 mx-auto lg:mx-0 mb-4" />
            <Skeleton className="h-8 w-3/5 mx-auto lg:mx-0 mb-8" />
          </>
        ) : (
          <>
            <div className="pa-hero-reveal inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4 sm:mb-6 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-widest whitespace-nowrap text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Pharmaceutical Packaging · Only Pharma
            </div>
            <h1 className={`pa-hero-reveal pa-hero-reveal-1 mb-4 sm:mb-6 text-primary ${immersive ? "pa-stage-hero-title" : "heading-hero"}`}>
              {(hero?.headline ?? "Pharmaceutical-Grade Packaging")
                .split(/(sustainable|Delivering pharmaceutical packaging)/i)
                .map((part, idx) =>
                  /^sustainable$/i.test(part) ? (
                    <span key={idx} className="text-eco-600">{part}</span>
                  ) : /^Delivering pharmaceutical packaging$/i.test(part) ? (
                    <span key={idx} className="whitespace-nowrap">{part}</span>
                  ) : (
                    part
                  )
                )}
            </h1>
            <p className={`pa-hero-reveal pa-hero-reveal-2 text-body sm:text-lg max-w-2xl mx-auto lg:mx-0 text-muted-foreground ${immersive ? "max-sm:text-sm mb-5 sm:mb-8" : "mb-10"}`}>
              {hero?.subheadline ?? "ISO-certified bottles, child-resistant closures and CT caps — manufactured under controlled conditions, delivered on time."}
            </p>
          </>
        )}

        {/* In the pinned journey the two CTAs share a row on phones, leaving the bottle its space */}
        <div
          className={`pa-hero-reveal pa-hero-reveal-3 flex items-center lg:items-start justify-center lg:justify-start ${
            immersive ? "flex-row flex-wrap gap-3 sm:gap-4 max-sm:[&>a]:px-4 max-sm:[&>a]:py-3" : "flex-col sm:flex-row gap-4"
          }`}
        >
          <Link href="/products" className="btn-outline text-foreground">
            View Products
            <ChevronRight size={18} />
          </Link>
          <Link href="/contact" className="btn-primary text-white">
            Request a Sample
            <ArrowRight size={16} />
          </Link>
        </div>
      </>
    );

    return (
      <div className={immersive ? "overflow-x-clip" : "overflow-x-hidden"}>

        {/* ── HERO → CAPPING → RANGE → LINE FOOTAGE: one scroll-driven 3D journey ── */}
        {immersive && <HomeJourney hero={heroCopy} />}

        {/* ── HERO (classic) ── */}
        {!immersive && (
        <section className="relative bg-white overflow-hidden pt-16">
          {/* Geometric background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 border border-border rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 border border-border rounded-full -translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 border border-border rounded-full" />
            <svg className="absolute inset-0 w-full h-full text-ink-400" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Hero background image — kept very subtle so the 3D model reads as the focal point */}
          {hero?.backgroundImage && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
                style={{ backgroundImage: `url(${hero.backgroundImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            </>
          )}
          {/* Soft brand glow behind the model */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[520px] h-[520px] rounded-full bg-primary/5 blur-3xl hidden lg:block" />

          <div className="relative z-10 container-width pt-8 sm:pt-10 lg:pt-6 pb-16 sm:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center">
              {/* Copy */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                {heroCopy}
              </div>

              {/* 3D bottle */}
              <div className="order-1 lg:order-2">
                <Suspense fallback={<div className="h-[340px] sm:h-[420px] lg:h-[540px] w-full" />}>
                  <Hero3D />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ── STATS BAR ── */}
        <section className="bg-navy py-8">
          <div className="container-width">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {isLoading
                ? Array(4).fill(0).map((_, i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-10 w-24 mx-auto mb-2" />
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </div>
                  ))
                : stats.map((s, i) => (
                    <div key={i} className="text-center reveal">
 <div className="text-3xl sm:text-4xl font-semibold tabular-nums text-accent">{s.value}</div>
                      <div className="text-white/60 text-sm mt-1 font-medium">{s.label}</div>
                    </div>
                  ))
              }
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="section-pad bg-white">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="reveal">
 <div className="section-tag">
                  About Us
                </div>
 <h2 className="heading-section text-navy">
                  {about?.title ?? "Precision Packaging Built for Pharma"}
                </h2>
 <p className="leading-relaxed mb-8 text-muted-foreground">
                  {about?.description ?? "Product Armor Packaging Pvt Ltd is a dedicated manufacturer of pharmaceutical bottles, CR and CT caps, delivering world-class packaging at unparalleled value."}
                </p>
 <h3 className="heading-card mb-4 text-navy">
                  Every solution we deliver is supported by the core strengths that define who we are and how we serve.
                </h3>
                <div className="space-y-3 mb-8">
                  {(about?.strengths ?? ["Sustainability Practices","End-to-End Automation","Quality Approach","Economies of Scale","Culture"]).map((f: string) => (
                    <div key={f} className="flex items-center gap-3">
 <CheckCircle size={18} className="shrink-0 text-primary" />
 <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/about"
 className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary transition-colors group"
                >
                  Learn more about us
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="reveal">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/5 rounded-2xl" />
                  <img
                    src={about?.image ?? "https://images.unsplash.com/photo-1581093804475-577d72e13da5?w=800&q=80"}
                    alt="Manufacturing facility"
                    className="relative rounded-xl shadow-xl object-cover w-full h-80"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581093804475-577d72e13da5?w=800&q=80"; }}
                  />
                  {company && (
                    <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-xl p-5 shadow-xl">
                      <div className="text-3xl font-semibold tabular-nums">{company.founded}</div>
                      <div className="text-white/70 text-xs mt-0.5">Est.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSIDE OUR FACILITY (classic layout only — the journey above ends inside the line footage) ── */}
        {!immersive && (
        <section className="section-pad bg-navy overflow-hidden">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="reveal">
                <div className="section-tag-light">Inside Our Facility</div>
 <h2 className="heading-section-light text-white">Precision, In Motion.</h2>
                <p className="text-white/60 leading-relaxed mb-8 max-w-lg">
                  Step inside our ISO Class 8 cleanroom — where bottles and closures are moulded, conveyed,
                  inspected and packed by an automated line that never lets quality slip.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href="/technology"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-200"
                  >
                    Explore Technology
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="reveal">
                <AmbientVideo
                  src={videoSrc("loops/home-bottle.mp4")}
                  webmSrc={videoWebm("loops/home-bottle.mp4")}
                  poster={posterSrc("home-bottle")}
                  ariaLabel="A bottle passing through inline inspection on the production line"
                  label="Inline inspection — live line footage"
                  className="aspect-video rounded-2xl ring-1 ring-white/10 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ── PRODUCTS ── */}
        <section className="section-pad bg-secondary">
          <div className="container-width">
            <div className="text-center mb-14 reveal">
 <div className="section-tag">
                Our Products
              </div>
 <h2 className="heading-section text-navy">
                Engineered for Protection. Designed for Performance.
              </h2>
 <p className="max-w-xl mx-auto text-muted-foreground">
                Explore our portfolio of pharmaceutical packaging solutions, including containers &amp; bottles, CT (Continuous Thread) and CRC (Child-Resistant Closures) caps &amp; closures powered by patented technology and recognized globally.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading
                ? Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                      <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))
                : products.map((p, i) => (
                    <div
                      key={p.id}
                      className="reveal card-standard p-0 sm:p-0 overflow-hidden group"
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      <div className="px-6 pt-5 pb-3">
                        <span className="inline-block bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          {p.category}
                        </span>
                      </div>
                      <div className="relative overflow-hidden h-52 bg-secondary">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80"; }}
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
 <h3 className="heading-card mb-2 text-navy">{p.name}</h3>
 <p className="text-sm leading-relaxed mb-4 line-clamp-2 text-muted-foreground">{p.description}</p>
                        <ul className="space-y-1.5 mb-5 flex-1">
                          {p.features.slice(0, 3).map(f => (
 <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
 <CheckCircle size={13} className="shrink-0 mt-0.5 text-primary" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/products"
 className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-primary transition-colors group/link mt-auto"
                        >
                          View details
                          <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))
              }
            </div>
            <div className="text-center mt-10">
              <Link
                href="/products"
 className="btn-primary"
              >
                View All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section className="section-pad bg-primary">
          <div className="container-width">
            <div className="text-center mb-14 reveal">
 <div className="section-tag-light text-white/80">
                Quality Assurance
              </div>
 <h2 className="heading-section-light text-white">
                Committed to Quality. Trusted Worldwide.
              </h2>
              <p className="text-white/60 max-w-xl mx-auto text-base leading-relaxed">
                Powered by advanced technology, rigorous quality controls, and end-to-end traceability to deliver reliable pharmaceutical packaging solutions.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {certifications.map((c, i) => (
                <div
                  key={c.id}
                  className="reveal bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {c.logo ? (
                    <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-xl p-2 flex items-center justify-center">
                      <img src={c.logo} alt={`${c.name} logo`} className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
 <Award size={32} className="mx-auto mb-4 text-accent" />
                  )}
                  <div className="text-white font-semibold text-sm mb-1">{c.name}</div>
                  <div className="text-white/50 text-xs">{c.issuer}</div>
 <div className="text-xs font-semibold mt-2 text-accent">{c.year}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/quality"
 className="btn-light text-primary"
              >
                Our Quality Standards
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CLIENTS ── */}
        {clients.length > 0 && (
          <section className="section-pad bg-white border-b border-border">
            <div className="container-width">
              <div className="text-center mb-10 reveal">
 <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  Trusted by Global'S Leading Pharmaceutical Companies
                </p>
              </div>
              <div className="logo-marquee relative overflow-hidden">
                <div className="logo-marquee-track flex items-center gap-14 w-max">
                  {[...clients, ...clients].map((c, i) => (
                    <div key={`${c.id}-${i}`} className="shrink-0 flex items-center justify-center" title={c.name}>
                      {c.logo ? (
                        <img src={c.logo} alt={c.name} className="h-12 md:h-14 w-auto object-contain" loading="lazy" />
                      ) : (
                        <div className="px-6 py-3 border border-border rounded-lg bg-secondary">
 <span className="font-semibold text-sm text-muted-foreground">{c.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ── */}
        {testimonials.length > 0 && (
          <section className="section-pad bg-secondary">
            <div className="container-width">
              <div className="text-center mb-14 reveal">
 <div className="section-tag">
                  Testimonials
                </div>
 <h2 className="heading-section text-navy">
                  What Our Clients Say
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                  <div
                    key={t.id}
                    className="reveal bg-white rounded-xl p-7 shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="flex gap-1 mb-4">
                      {Array(5).fill(0).map((_, i) => (
 <Star key={i} size={14} className="fill-primary text-primary" />
                      ))}
                    </div>
 <p className="leading-relaxed text-sm mb-5 italic text-muted-foreground">"{t.quote}"</p>
                    <div className="border-t border-border pt-4">
 <div className="font-semibold text-sm text-navy">{t.author}</div>
 <div className="text-xs mt-0.5 text-muted-foreground">{t.role}, {t.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT CTA ── */}
        <section className="section-pad bg-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
 <h2 className="heading-section-light text-white">
              Ready to Upgrade Your Packaging?
            </h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Request a free sample kit or schedule a technical consultation with our packaging specialists.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/contact"
 className="btn-light hover:scale-105 text-primary"
              >
                Get in Touch
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/50 text-sm">
              <div className="flex items-center gap-2">
 <Phone size={14} className="text-accent" />
                <span>{contactData?.phone ?? "+91-7416207700"}</span>
              </div>
              <a
                href={`https://wa.me/${(contactData?.whatsapp ?? "+917416207700").replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
                aria-label="Chat with us on WhatsApp"
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" className="text-whatsapp" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp Us</span>
              </a>
              <div className="flex items-center gap-2">
 <Mail size={14} className="text-accent" />
                <span>{contactData?.email ?? "info@productarmor.com"}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
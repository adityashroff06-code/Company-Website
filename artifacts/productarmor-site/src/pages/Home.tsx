import { useEffect } from "react";
  import { Link } from "wouter";
  import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { CheckCircle, Award, Users, Package, ChevronRight, Star, ArrowRight, Phone, Mail } from "lucide-react";

  function useReveal() {
    useEffect(() => {
      const els = document.querySelectorAll<HTMLElement>(".reveal");
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
        { threshold: 0.12 }
      );
      els.forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, []);
  }

  function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`} />;
  }

  export default function Home() {
    useReveal();
    const { data: content, isLoading } = useGetSiteContent({
      query: { queryKey: getGetSiteContentQueryKey() }
    });

    const hero = content?.hero;
    const stats = content?.stats ?? [];
    const about = content?.about;
    const products = content?.products ?? [];
    const certifications = content?.certifications ?? [];
    const clients = content?.clients ?? [];
    const testimonials = content?.testimonials ?? [];
    const contactData = content?.contact;
    const company = content?.company;

    return (
      <div className="overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center justify-center bg-[#1e4b8a] overflow-hidden pt-16">
          {/* Geometric background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 border border-white rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 border border-white rounded-full -translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 border border-white/60 rounded-full" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Hero background image */}
          {hero?.backgroundImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${hero.backgroundImage})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e4b8a]/60 via-transparent to-[#0f2a4e]/80" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">ISO 9001:2015 &amp; WHO-GMP Certified Manufacturer</span>
            </div>

            {isLoading ? (
              <>
                <Skeleton className="h-16 w-4/5 mx-auto mb-4" />
                <Skeleton className="h-8 w-3/5 mx-auto mb-8" />
              </>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                  {hero?.headline ?? "Pharmaceutical-Grade HDPE Packaging"}
                </h1>
                <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
                  {hero?.subheadline ?? "ISO-certified HDPE bottles, child-resistant closures and CT caps — manufactured under controlled conditions, delivered on time."}
                </p>
              </>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-xl hover:scale-105 text-base"
              >
                {hero?.ctaText ?? "Request a Sample Kit"}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-200 text-base"
              >
                View Products
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 flex justify-center">
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="bg-[#0f2a4e] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      <div className="text-3xl sm:text-4xl font-black text-[#f97316]">{s.value}</div>
                      <div className="text-white/60 text-sm mt-1 font-medium">{s.label}</div>
                    </div>
                  ))
              }
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="reveal">
                <div className="inline-block px-3 py-1 bg-[#1e4b8a]/10 text-[#1e4b8a] text-xs font-semibold uppercase tracking-widest rounded mb-4">
                  About Us
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a4e] leading-tight mb-6">
                  {about?.title ?? "Precision Packaging Built for Pharma"}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {about?.description ?? "Product Armor Packaging Pvt Ltd is a dedicated manufacturer of HDPE pharmaceutical bottles, CR and CT caps, delivering world-class packaging at unparalleled value."}
                </p>
                <div className="space-y-3 mb-8">
                  {["Controlled manufacturing environment","Zero-rejection quality inspection","Sustainable production processes","On-time delivery guarantee"].map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-[#f97316] shrink-0" />
                      <span className="text-gray-700 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-[#1e4b8a] font-semibold hover:text-[#f97316] transition-colors group"
                >
                  Learn more about us
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="reveal">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#1e4b8a]/5 rounded-2xl" />
                  <img
                    src={about?.image ?? "https://images.unsplash.com/photo-1581093804475-577d72e13da5?w=800&q=80"}
                    alt="Manufacturing facility"
                    className="relative rounded-xl shadow-xl object-cover w-full h-80"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581093804475-577d72e13da5?w=800&q=80"; }}
                  />
                  {company && (
                    <div className="absolute -bottom-6 -right-6 bg-[#1e4b8a] text-white rounded-xl p-5 shadow-xl">
                      <div className="text-3xl font-black">{company.founded}</div>
                      <div className="text-white/70 text-xs mt-0.5">Est.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 reveal">
              <div className="inline-block px-3 py-1 bg-[#1e4b8a]/10 text-[#1e4b8a] text-xs font-semibold uppercase tracking-widest rounded mb-4">
                Our Products
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a4e] mb-4">
                End-to-End Packaging Solutions
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Every product is manufactured to meet international regulatory requirements for pharmaceutical packaging.
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
                      className="reveal bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-[#1e4b8a]/20"
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      <div className="relative overflow-hidden h-52 bg-gray-100">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80"; }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#1e4b8a] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                            {p.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-[#0f2a4e] text-lg mb-2">{p.name}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                        <ul className="space-y-1.5 mb-5">
                          {p.features.slice(0, 3).map(f => (
                            <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                              <CheckCircle size={13} className="text-[#f97316] shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-1.5 text-[#1e4b8a] font-semibold text-sm hover:text-[#f97316] transition-colors group/link"
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
                className="inline-flex items-center gap-2 border-2 border-[#1e4b8a] text-[#1e4b8a] hover:bg-[#1e4b8a] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
              >
                View All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section className="py-20 bg-[#1e4b8a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 reveal">
              <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
                Quality Assurance
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Certified to International Standards
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                Our certifications are not just badges — they represent the rigor embedded in every production run.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {certifications.map((c, i) => (
                <div
                  key={c.id}
                  className="reveal bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <Award size={32} className="text-[#f97316] mx-auto mb-4" />
                  <div className="text-white font-bold text-sm mb-1">{c.name}</div>
                  <div className="text-white/50 text-xs">{c.issuer}</div>
                  <div className="text-[#f97316] text-xs font-semibold mt-2">{c.year}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/quality"
                className="inline-flex items-center gap-2 bg-white text-[#1e4b8a] hover:bg-gray-50 font-semibold px-8 py-3 rounded-lg transition-all duration-200"
              >
                Our Quality Standards
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CLIENTS ── */}
        {clients.length > 0 && (
          <section className="py-16 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 reveal">
                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
                  Trusted by India's Leading Pharmaceutical Companies
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {clients.map((c, i) => (
                  <div key={c.id} className="reveal text-center" style={{ transitionDelay: `${i * 60}ms` }}>
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100" />
                    ) : (
                      <div className="px-6 py-3 border border-gray-200 rounded-lg bg-gray-50 hover:border-[#1e4b8a]/30 hover:bg-[#1e4b8a]/5 transition-all duration-300">
                        <span className="text-gray-500 font-semibold text-sm">{c.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ── */}
        {testimonials.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14 reveal">
                <div className="inline-block px-3 py-1 bg-[#1e4b8a]/10 text-[#1e4b8a] text-xs font-semibold uppercase tracking-widest rounded mb-4">
                  Testimonials
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a4e] mb-4">
                  What Our Clients Say
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                  <div
                    key={t.id}
                    className="reveal bg-white rounded-xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-[#1e4b8a]/20"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="flex gap-1 mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={14} className="fill-[#f97316] text-[#f97316]" />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm mb-5 italic">"{t.quote}"</p>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="font-semibold text-[#0f2a4e] text-sm">{t.author}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{t.role}, {t.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT CTA ── */}
        <section className="py-20 bg-[#0f2a4e]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Upgrade Your Packaging?
            </h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Request a free sample kit or schedule a technical consultation with our packaging specialists.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                Request Sample Kit
                <ArrowRight size={16} />
              </Link>
              <a
                href={`tel:${contactData?.phone ?? "+919876543210"}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-200"
              >
                <Phone size={16} />
                Call Us Now
              </a>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#f97316]" />
                <span>{contactData?.phone ?? "+91 98765 43210"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#f97316]" />
                <span>{contactData?.email ?? "info@productarmor.com"}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
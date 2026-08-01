import { useEffect } from "react";
  import { Link } from "wouter";
  import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { CheckCircle, Award, Users, Package, ChevronRight, Star, ArrowRight, Phone, Mail } from "lucide-react";

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
    return <div className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`} />;
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

    return (
      <div className="overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="relative flex items-center justify-center bg-white overflow-hidden pt-16">
          {/* Geometric background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 border border-gray-400 rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 border border-gray-400 rounded-full -translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 border border-gray-300 rounded-full" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9ca3af" strokeWidth="0.5"/>
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

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 sm:pt-12 pb-16 sm:pb-20">
            {isLoading ? (
              <>
                <Skeleton className="h-16 w-4/5 mx-auto mb-4" />
                <Skeleton className="h-8 w-3/5 mx-auto mb-8" />
              </>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#4364a7] leading-[1.1] tracking-tight mb-6">
                  {(hero?.headline ?? "Pharmaceutical-Grade Packaging")
                    .split(/(sustainability|Delivering pharmaceutical packaging)/i)
                    .map((part, idx) =>
                      /^sustainability$/i.test(part) ? (
                        <span key={idx} className="text-[#32CD32]">{part}</span>
                      ) : /^Delivering pharmaceutical packaging$/i.test(part) ? (
                        <span key={idx} className="whitespace-nowrap">{part}</span>
                      ) : (
                        part
                      )
                    )}
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                  {hero?.subheadline ?? "ISO-certified bottles, child-resistant closures and CT caps — manufactured under controlled conditions, delivered on time."}
                </p>
              </>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-800 font-medium px-8 py-3.5 rounded-lg transition-all duration-200 text-base"
              >
                View Products
                <ChevronRight size={18} />
              </Link>
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
                      <div className="text-3xl sm:text-4xl font-black text-[#93b4e8]">{s.value}</div>
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
                <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
                  About Us
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a4e] leading-tight mb-6">
                  {about?.title ?? "Precision Packaging Built for Pharma"}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {about?.description ?? "Product Armor Packaging Pvt Ltd is a dedicated manufacturer of pharmaceutical bottles, CR and CT caps, delivering world-class packaging at unparalleled value."}
                </p>
                <h3 className="text-lg font-semibold text-[#0f2a4e] mb-4">
                  Every solution we deliver is supported by the core strengths that define who we are and how we serve.
                </h3>
                <div className="space-y-3 mb-8">
                  {(about?.strengths ?? ["Sustainability Practices","End-to-End Automation","Quality Approach","Economies of Scale","Culture"]).map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-[#4164a8] shrink-0" />
                      <span className="text-gray-700 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-[#4164a8] font-semibold hover:text-[#4164a8] transition-colors group"
                >
                  Learn more about us
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="reveal">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#4164a8]/5 rounded-2xl" />
                  <img
                    src={about?.image ?? "https://images.unsplash.com/photo-1581093804475-577d72e13da5?w=800&q=80"}
                    alt="Manufacturing facility"
                    className="relative rounded-xl shadow-xl object-cover w-full h-80"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581093804475-577d72e13da5?w=800&q=80"; }}
                  />
                  {company && (
                    <div className="absolute -bottom-6 -right-6 bg-[#4164a8] text-white rounded-xl p-5 shadow-xl">
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
              <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
                Our Products
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a4e] mb-4">
                Engineered for Protection. Designed for Performance.
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
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
                      className="reveal bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-[#4164a8]/20"
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      <div className="px-6 pt-5 pb-3">
                        <span className="inline-block bg-[#4164a8] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          {p.category}
                        </span>
                      </div>
                      <div className="relative overflow-hidden h-52 bg-gray-100">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80"; }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-[#0f2a4e] text-lg mb-2">{p.name}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                        <ul className="space-y-1.5 mb-5">
                          {p.features.slice(0, 3).map(f => (
                            <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                              <CheckCircle size={13} className="text-[#4164a8] shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-1.5 text-[#4164a8] font-semibold text-sm hover:text-[#4164a8] transition-colors group/link"
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
                className="inline-flex items-center gap-2 border-2 border-[#4164a8] text-[#4164a8] hover:bg-[#4164a8] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
              >
                View All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section className="py-20 bg-[#4164a8]">
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
                  <Award size={32} className="text-[#93b4e8] mx-auto mb-4" />
                  <div className="text-white font-bold text-sm mb-1">{c.name}</div>
                  <div className="text-white/50 text-xs">{c.issuer}</div>
                  <div className="text-[#93b4e8] text-xs font-semibold mt-2">{c.year}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/quality"
                className="inline-flex items-center gap-2 bg-white text-[#4164a8] hover:bg-gray-50 font-semibold px-8 py-3 rounded-lg transition-all duration-200"
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
                        <div className="px-6 py-3 border border-gray-200 rounded-lg bg-gray-50">
                          <span className="text-gray-500 font-semibold text-sm">{c.name}</span>
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
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14 reveal">
                <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
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
                    className="reveal bg-white rounded-xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-[#4164a8]/20"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="flex gap-1 mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={14} className="fill-[#4164a8] text-[#4164a8]" />
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
                className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#4164a8] font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                Get in Touch
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#93b4e8]" />
                <span>{contactData?.phone ?? "+91-9154992473"}</span>
              </div>
              <a
                href={`https://wa.me/${(contactData?.whatsapp ?? "+919154992473").replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
                aria-label="Chat with us on WhatsApp"
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="#25D366" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp Us</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#93b4e8]" />
                <span>{contactData?.email ?? "info@productarmor.com"}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
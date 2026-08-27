import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { Award, CheckCircle, ClipboardCheck, FlaskConical, ArrowRight } from "lucide-react";
  import { Link } from "wouter";

  const qcSteps = [
    { icon: FlaskConical, title: "Raw Material Testing", desc: "Every incoming resin batch is tested for melt flow index, density, and compliance with USP Class VI requirements before use." },
    { icon: ClipboardCheck, title: "In-Process Quality Control", desc: "Dimensional checks, torque testing, and visual inspection at defined intervals throughout the production run." },
    { icon: Award, title: "Finished Goods Testing", desc: "Drop test, leak test, child resistance and adult use testing on each batch. All results documented and retained for 5 years." },
    { icon: CheckCircle, title: "Certificate of Analysis", desc: "Full CoA issued with every shipment, traceable to batch records and third-party lab results on request." },
  ];

  export default function Quality() {
    const { data: content } = useGetSiteContent({ query: { queryKey: getGetSiteContentQueryKey() } });
    const certifications = content?.certifications ?? [];

    return (
      <div className="pt-16">
        {/* Header */}
        <section className="grain relative overflow-hidden bg-[#0a1626] pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lux-kicker text-[#c2a15f] mb-5 block">
              Quality & Compliance
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-light text-white tracking-tight mb-4">Our Quality Framework</h1>
            <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
              Quality is not a department — it is embedded in every step of our manufacturing process.
            </p>
          </div>
        </section>

        {/* Certifications grid */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl font-light text-[#0a1626] tracking-tight mb-4">Our Certifications</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Each certification represents a commitment to a specific international quality or compliance standard.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map(c => (
                <div key={c.id} className="border-2 border-[#4164a8]/10 hover:border-[#4164a8]/30 rounded-lg p-8 text-center transition-all duration-300 hover:shadow-md group">
                  {c.logo ? (
                    <div className="w-20 h-20 mx-auto mb-5 bg-[#f6f7f9] rounded-lg p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img src={c.logo} alt={`${c.name} logo`} className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-[#4164a8] rounded-lg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                      <Award size={30} className="text-white" />
                    </div>
                  )}
                  <div className="font-semibold text-[#0a1626] text-lg mb-1">{c.name}</div>
                  <div className="text-gray-500 text-sm mb-2">{c.issuer}</div>
                  <div className="inline-block bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold px-3 py-1 rounded-full">
                    {c.year}
                  </div>
                </div>
              ))}
              {certifications.length === 0 && (
                <>
                  {[
                    { name: "ISO 9001:2018", issuer: "Quality Management Systems", year: "IN25/00000630" },
                    { name: "ISO 15378:2017", issuer: "Primary Packaging for Pharmaceuticals", year: "IN22/00000330" },
                    { name: "USDMF Listed", issuer: "US Drug Master File", year: "DMF 036675 / 037264" },
                    { name: "Canadian DMF", issuer: "Health Canada", year: "MF2022-108" },
                    { name: "China DMF", issuer: "NMPA China", year: "B20220000820" },
                  ].map(c => (
                    <div key={c.name} className="border-2 border-[#4164a8]/10 hover:border-[#4164a8]/30 rounded-lg p-8 text-center transition-all duration-300 hover:shadow-md group">
                      <div className="w-16 h-16 bg-[#4164a8] rounded-lg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                        <Award size={30} className="text-white" />
                      </div>
                      <div className="font-semibold text-[#0a1626] text-lg mb-1">{c.name}</div>
                      <div className="text-gray-500 text-sm mb-2">{c.issuer}</div>
                      <div className="inline-block bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold px-3 py-1 rounded-full">
                        {c.year}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* QC Process */}
        <section className="py-24 bg-[#f6f7f9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl font-light text-[#0a1626] tracking-tight mb-4">Our Quality Control Process</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                A multi-stage inspection and testing protocol ensures every batch meets specification before dispatch.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {qcSteps.map((s, i) => (
                <div key={s.title} className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#4164a8] rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-lg">
                      {i + 1}
                    </div>
                    {i < qcSteps.length - 1 && <div className="w-0.5 flex-1 bg-[#4164a8]/10 mt-3" />}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon size={16} className="text-[#4164a8]" />
                      <h3 className="font-semibold text-[#0a1626]">{s.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="grain relative overflow-hidden bg-[#0a1626] py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-light text-white tracking-tight mb-3">Need Compliance Documentation?</h2>
            <p className="text-white/60 mb-6 text-sm">
              We can provide CoA, GMP certificates, MSDS and regulatory dossiers on request.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#e9edf4] text-[#0a1626] font-semibold px-7 py-3 rounded-sm tracking-wide transition-all duration-200"
            >
              Request Documents <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    );
  }
  
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { Award, CheckCircle, ClipboardCheck, FlaskConical, ArrowRight } from "lucide-react";
  import { Link } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";

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
        <section className="bg-primary section-pad">
          <div className="container-width">
            <Breadcrumb items={[{ label: "Quality" }]} />
            <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Quality & Compliance
            </div>
            <h1 className="heading-page">Our Quality Framework</h1>
            <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
              Quality is not a department — it is embedded in every step of our manufacturing process.
            </p>
          </div>
        </section>

        {/* Certifications grid */}
        <section className="section-pad bg-white">
          <div className="container-width">
            <div className="text-center mb-14">
              <h2 className="heading-section">Our Certifications</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Each certification represents a commitment to a specific international quality or compliance standard.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map(c => (
                <div key={c.id} className="border-2 border-primary/10 hover:border-primary/30 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg group">
                  {c.logo ? (
                    <div className="w-20 h-20 mx-auto mb-5 bg-secondary rounded-xl p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img src={c.logo} alt={`${c.name} logo`} className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                      <Award size={30} className="text-white" />
                    </div>
                  )}
                  <div className="heading-card mb-1">{c.name}</div>
                  <div className="text-muted-foreground text-sm mb-2">{c.issuer}</div>
                  <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
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
                    <div key={c.name} className="border-2 border-primary/10 hover:border-primary/30 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg group">
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                        <Award size={30} className="text-white" />
                      </div>
                      <div className="heading-card mb-1">{c.name}</div>
                      <div className="text-muted-foreground text-sm mb-2">{c.issuer}</div>
                      <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
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
        <section className="section-pad bg-secondary">
          <div className="container-width">
            <div className="text-center mb-14">
              <h2 className="heading-section">Our Quality Control Process</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A multi-stage inspection and testing protocol ensures every batch meets specification before dispatch.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {qcSteps.map((s, i) => (
                <div key={s.title} className="bg-white rounded-xl p-8 shadow-sm border border-border flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-lg">
                      {i + 1}
                    </div>
                    {i < qcSteps.length - 1 && <div className="w-0.5 flex-1 bg-primary/10 mt-3" />}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon size={16} className="text-primary" />
                      <h3 className="font-bold text-navy">{s.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad bg-primary">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="heading-section-light">Need Compliance Documentation?</h2>
            <p className="text-white/60 mb-6 text-sm">
              We can provide CoA, GMP certificates, MSDS and regulatory dossiers on request.
            </p>
            <Link
              href="/contact"
              className="btn-light"
            >
              Request Documents <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    );
  }
  
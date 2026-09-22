import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { Award, CheckCircle, ClipboardCheck, FlaskConical, ArrowRight } from "lucide-react";
  import { Link } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
  import AmbientVideo from "@/components/video/AmbientVideo";
  import { videoSrc, videoWebm, posterSrc } from "@/components/video/videos";
  import { Reveal, RevealGroup } from "@/components/motion/Reveal";

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
 <h1 className="heading-page text-white">Our Quality Framework</h1>
            <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
              Quality is not a department — it is embedded in every step of our manufacturing process.
            </p>
          </div>
        </section>

        {/* Certifications grid */}
        <section className="section-pad bg-white">
          <div className="container-width">
            <Reveal className="text-center mb-14">
 <h2 className="heading-section text-navy">Our Certifications</h2>
 <p className="max-w-xl mx-auto text-muted-foreground">
                Each certification represents a commitment to a specific international quality or compliance standard.
              </p>
            </Reveal>
            <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map(c => (
                <Reveal key={c.id} className="border-2 border-primary/10 hover:border-primary/30 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg group">
                  {c.logo ? (
                    <div className="w-20 h-20 mx-auto mb-5 bg-secondary rounded-xl p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img src={c.logo} alt={`${c.name} logo`} className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                      <Award size={30} className="text-white" />
                    </div>
                  )}
 <div className="heading-card mb-1 text-navy">{c.name}</div>
 <div className="text-sm mb-2 text-muted-foreground">{c.issuer}</div>
 <div className="inline-block bg-primary/10 text-xs font-semibold px-3 py-1 rounded-full text-primary">
                    {c.year}
                  </div>
                </Reveal>
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
                    <Reveal key={c.name} className="border-2 border-primary/10 hover:border-primary/30 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg group">
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                        <Award size={30} className="text-white" />
                      </div>
 <div className="heading-card mb-1 text-navy">{c.name}</div>
 <div className="text-sm mb-2 text-muted-foreground">{c.issuer}</div>
 <div className="inline-block bg-primary/10 text-xs font-semibold px-3 py-1 rounded-full text-primary">
                        {c.year}
                      </div>
                    </Reveal>
                  ))}
                </>
              )}
            </RevealGroup>
          </div>
        </section>

        {/* Inspection, live */}
        <section className="section-pad bg-navy">
          <div className="container-width">
            <Reveal className="text-center mb-14">
              <div className="section-tag-light">Inspection, Live</div>
 <h2 className="heading-section-light text-white">Watch 100% Inspection Happen</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Every unit passes automated vision and physical checks before it ships — the footage below
                is straight from our inspection stations.
              </p>
            </Reveal>
            <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Reveal>
                <AmbientVideo
                  src={videoSrc("loops/quality-vision.mp4")}
                  webmSrc={videoWebm("loops/quality-vision.mp4")}
                  poster={posterSrc("quality-vision")}
                  ariaLabel="Vision system inspecting closures on screen"
                  label="Vision station — live"
                  className="aspect-video rounded-xl ring-1 ring-white/10 shadow-lg mb-4"
                />
                <h3 className="text-white font-semibold mb-1">360° Vision Inspection</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Camera systems examine every unit's surfaces, with automatic rejection of any deviation —
                  100% inspection, zero human bias.
                </p>
              </Reveal>
              <Reveal>
                <AmbientVideo
                  src={videoSrc("loops/quality-leaktest.mp4")}
                  webmSrc={videoWebm("loops/quality-leaktest.mp4")}
                  poster={posterSrc("quality-leaktest")}
                  ariaLabel="Automated in-line testing heads working over the production line"
                  label="In-line testing"
                  className="aspect-video rounded-xl ring-1 ring-white/10 shadow-lg mb-4"
                />
                <h3 className="text-white font-semibold mb-1">Automated In-Line Testing</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Dimensional and physical checks run continuously during production — deviations are caught
                  in real time, not after the batch.
                </p>
              </Reveal>
            </RevealGroup>
          </div>
        </section>

        {/* QC Process */}
        <section className="section-pad bg-secondary">
          <div className="container-width">
            <Reveal className="text-center mb-14">
 <h2 className="heading-section text-navy">Our Quality Control Process</h2>
 <p className="max-w-xl mx-auto text-muted-foreground">
                A multi-stage inspection and testing protocol ensures every batch meets specification before dispatch.
              </p>
            </Reveal>
            <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {qcSteps.map((s, i) => (
                <Reveal key={s.title} className="bg-white rounded-xl p-8 shadow-sm border border-border flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0 text-white font-semibold text-lg">
                      {i + 1}
                    </div>
                    {i < qcSteps.length - 1 && <div className="w-0.5 flex-1 bg-primary/10 mt-3" />}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-2">
 <s.icon size={16} className="text-primary" />
 <h3 className="font-semibold text-navy">{s.title}</h3>
                    </div>
 <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad bg-primary">
          <Reveal className="max-w-3xl mx-auto px-4 text-center">
 <h2 className="heading-section-light text-white">Need Compliance Documentation?</h2>
            <p className="text-white/60 mb-6 text-sm">
              We can provide CoA, GMP certificates, MSDS and regulatory dossiers on request.
            </p>
            <Link
              href="/contact"
 className="btn-light text-primary"
            >
              Request Documents <ArrowRight size={15} />
            </Link>
          </Reveal>
        </section>
      </div>
    );
  }
  
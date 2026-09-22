import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Target, Lightbulb, TrendingUp, ShieldCheck, Clock, PiggyBank, PackageCheck, Globe2 } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import Breadcrumb from "@/components/Breadcrumb";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const caseStudies = [
  {
    icon: Globe2,
    tag: "Export Compliance",
    title: "Meeting US CR-Cap Certification for a Nutraceutical Exporter",
    challenge:
      "A supplement manufacturer expanding into the United States needed child-resistant closures that passed 16 CFR §1700.20 / ISO 8317 protocol testing, but their existing supplier could not provide documented certification or consistent torque performance.",
    solution:
      "We supplied CR caps moulded from USP Class VI pharmaceutical-grade material with a validated push-and-turn mechanism, matched liner systems for the target bottle necks, and provided full protocol test reports plus lot-level certificates of analysis for every consignment.",
    result:
      "The client cleared US import documentation on the first submission and standardised all export SKUs on our closures.",
    metrics: [
      { icon: ShieldCheck, value: "100%", label: "CR protocol pass rate" },
      { icon: Clock, value: "3 wks", label: "To first certified shipment" },
    ],
  },
  {
    icon: PiggyBank,
    tag: "Cost Optimisation",
    title: "Reducing Packaging Cost by 18% Without Compromising Quality",
    challenge:
      "A mid-size generics company was over-specifying wall thickness and using an inefficient bottle-and-cap combination, driving up per-unit packaging cost and freight weight across its solid-oral range.",
    solution:
      "Our engineering team ran a light-weighting study, re-designed the bottle geometry for even wall distribution, and standardised the neck finish so a single CT cap served multiple SKUs — cutting tooling and inventory complexity.",
    result:
      "Material usage dropped while drop-test and top-load performance stayed within specification, delivering measurable savings on every batch.",
    metrics: [
      { icon: PiggyBank, value: "18%", label: "Packaging cost reduction" },
      { icon: PackageCheck, value: "4→1", label: "Cap SKUs consolidated" },
    ],
  },
  {
    icon: ShieldCheck,
    tag: "Quality Assurance",
    title: "Achieving Zero-Rejection QC for a Contract Manufacturer",
    challenge:
      "A CDMO packaging multiple client brands faced recurring line rejections from dimensional drift and occasional short-fill caps, causing costly line stoppages and audit observations.",
    solution:
      "We introduced in-line vision inspection, tightened statistical process control on critical-to-quality dimensions, and shared real-time capability data through incoming-inspection reports aligned to their AQL plan.",
    result:
      "Incoming rejections fell to negligible levels and the client cleared its subsequent customer GMP audit with no packaging-related observations.",
    metrics: [
      { icon: ShieldCheck, value: "<0.1%", label: "Incoming rejection rate" },
      { icon: TrendingUp, value: "0", label: "Audit observations" },
    ],
  },
  {
    icon: Clock,
    tag: "Supply Reliability",
    title: "Cutting Lead Times for a Fast-Scaling Ayurvedic Brand",
    challenge:
      "A direct-to-consumer herbal brand was scaling quickly but its packaging lead times of six-plus weeks caused frequent stock-outs during demand spikes and promotional launches.",
    solution:
      "We set up a rolling forecast and safety-stock programme for their core bottle and CT cap sizes, reserved mould capacity, and moved to scheduled dispatches synchronised with their filling calendar.",
    result:
      "Reliable replenishment eliminated stock-outs and allowed the brand to launch new SKUs on schedule.",
    metrics: [
      { icon: Clock, value: "40%", label: "Shorter lead time" },
      { icon: PackageCheck, value: "99%", label: "On-time delivery" },
    ],
  },
];

export default function CaseStudies() {
  usePageMeta({
    title: "Case Studies",
    description:
      "Real ProductArmor pharma packaging case studies — export CR-cap certification, 18% cost reduction, zero-rejection QC and faster lead times for bottles and caps.",
    path: "/case-studies",
  });
  useReveal();

  return (
    <div className="pt-16">
      <section className="bg-primary section-pad">
        <div className="container-width">
          <Breadcrumb items={[{ label: "Case Studies" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Proven Results
          </div>
 <h1 className="heading-page text-white">Case Studies</h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            How pharmaceutical, nutraceutical and healthcare brands solved packaging challenges with our
            Bottles, CR caps and CT caps — from export compliance to cost, quality and lead-time gains.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-width">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "18%", label: "Average cost reduction" },
              { value: "<0.1%", label: "Incoming rejection rate" },
              { value: "40%", label: "Faster lead times" },
              { value: "100%", label: "CR certification pass" },
            ].map((s) => (
              <div key={s.label} className="reveal text-center bg-secondary rounded-xl p-6 border border-border">
 <div className="text-3xl font-semibold tabular-nums text-primary">{s.value}</div>
 <div className="text-xs mt-2 leading-relaxed text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-width">
          <div className="space-y-8">
            {caseStudies.map((cs) => (
              <div
                key={cs.title}
                className="reveal card-standard p-6 sm:p-8"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-2/3">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
 <cs.icon size={22} className="text-primary" />
                      </div>
                      <div>
 <div className="text-xs font-semibold uppercase tracking-widest text-primary">{cs.tag}</div>
 <h2 className="text-xl font-semibold mt-0.5 text-navy">{cs.title}</h2>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
 <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-navy">
 <Target size={15} className="text-primary" /> Challenge
                        </div>
 <p className="text-sm leading-relaxed text-muted-foreground">{cs.challenge}</p>
                      </div>
                      <div>
 <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-navy">
 <Lightbulb size={15} className="text-primary" /> Solution
                        </div>
 <p className="text-sm leading-relaxed text-muted-foreground">{cs.solution}</p>
                      </div>
                      <div>
 <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-navy">
 <TrendingUp size={15} className="text-primary" /> Result
                        </div>
 <p className="text-sm leading-relaxed text-muted-foreground">{cs.result}</p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/3 flex flex-col gap-4 justify-center">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className="bg-primary/5 rounded-xl p-5 border border-primary/10 flex items-center gap-4">
                        <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
 <m.icon size={20} className="text-primary" />
                        </div>
                        <div>
 <div className="text-2xl font-semibold tabular-nums text-navy">{m.value}</div>
 <div className="text-xs text-muted-foreground">{m.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy">
        <div className="max-w-3xl mx-auto px-4 text-center">
 <h2 className="heading-section-light text-white">Have a Packaging Challenge to Solve?</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Tell us about your product, volumes and compliance targets — our technical team will propose a
            bottle-and-closure solution tailored to your requirements.
          </p>
          <Link
            href="/contact"
 className="btn-light text-primary"
          >
            Talk to Our Team <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Link } from "wouter";
import {
  Pill,
  Leaf,
  Sprout,
  ShieldCheck,
  FileCheck,
  Globe,
  ArrowRight,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import Breadcrumb from "@/components/Breadcrumb";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

const industries = [
  {
    icon: Pill,
    name: "Pharmaceuticals",
    desc: "Primary packaging for prescription and OTC medicines — tablets, capsules and liquid orals — with tamper-evidence feature through induction sealing.",
    packaging: "Bottles · CR / CT caps with customer-specific liners",
  },
  {
    icon: Leaf,
    name: "Nutraceuticals, Healthcare & Supplements",
    desc: "Wide-mouth bottles and secure closures for vitamins, minerals and softgel supplements that demand better barrier performance.",
    packaging: "Wide-mouth bottles · CT / CR caps with customer-specific liners",
  },
  {
    icon: Sprout,
    name: "Ayurvedic & Herbal",
    desc: "Inert, food-grade containers that preserve the potency of herbal powder, tablets and syrups while meeting AYUSH and export labelling needs.",
    packaging: "Bottles - Wadded CT Caps",
  },
];

const regulatory = [
  {
    icon: ShieldCheck,
    title: "Pharmaceuticals",
    desc: "Regulatory bodies approved food-grade resin, GMP manufacturing, and CR caps designed to meet stringent child-resistance standards.",
  },
  {
    icon: FileCheck,
    title: "Healthcare & Nutraceuticals & Ayurvedic",
    desc: "Reliable packaging solutions that maintain formulation stability, and product quality.",
  },
  {
    icon: Globe,
    title: "Export Markets",
    desc: "Availability of all relevant regulatory certification / declaration (Including DMF Certification) for regulated markets across the North America, Europe, Middle East and Africa, Asia.",
  },
];

export default function Industries() {
  usePageMeta({
    title: "Industries We Serve",
    description:
      "ProductArmor supplies bottles, CR caps and CT caps to pharmaceuticals, nutraceuticals, ayurvedic, diagnostics and personal-care industries across the globe.",
    path: "/industries",
  });

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-primary section-pad">
        <div className="container-width">
          <Breadcrumb items={[{ label: "Industries" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Industries
          </div>
 <h1 className="heading-page text-white">
            Industries We Serve
          </h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            Supporting pharmaceutical, nutraceutical, and healthcare brands with
            packaging solutions designed for product safety, reliability, and
            compliance.
          </p>
        </div>
      </section>

      {/* Industry cards */}
      <section className="section-pad bg-white">
        <div className="container-width">
          <Reveal className="text-center mb-14">
 <div className="section-tag">
              Sectors
            </div>
 <h2 className="heading-section text-navy">
              Packaging Built Around Your Product
            </h2>
 <p className="max-w-2xl mx-auto text-muted-foreground">
              Each sector carries distinct compliance, barrier and handling
              requirements. We tailor material, closure and liner choices to
              match.
            </p>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind) => (
              <Reveal
                key={ind.name}
                className="card-standard p-6"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
 <ind.icon size={22} className="text-primary" />
                </div>
 <h3 className="heading-card mb-2 text-navy">
                  {ind.name}
                </h3>
 <p className="text-sm leading-relaxed mb-4 text-muted-foreground">
                  {ind.desc}
                </p>
                <div className="border-t border-border pt-3">
 <div className="text-xs font-semibold uppercase tracking-widest mb-1 text-muted-foreground">
                    Relevant packaging
                  </div>
 <div className="text-sm font-medium text-primary">
                    {ind.packaging}
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Regulatory fit */}
      <section className="section-pad bg-secondary">
        <div className="container-width">
          <Reveal className="text-center mb-14">
 <div className="section-tag">
              Compliance
            </div>
 <h2 className="heading-section text-navy">
              Regulatory Fit by Industry
            </h2>
 <p className="max-w-2xl mx-auto text-muted-foreground">
              ISO 9001:2018 certified manufacturing means the right
              documentation and material assurance for every market you sell
              into.
            </p>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regulatory.map((r) => (
              <Reveal
                key={r.title}
                className="card-standard p-6"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
 <r.icon size={22} className="text-primary" />
                </div>
 <h3 className="heading-card mb-2 text-navy">
                  {r.title}
                </h3>
 <p className="text-sm leading-relaxed text-muted-foreground">
                  {r.desc}
                </p>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-navy">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <h2 className="heading-section-light text-white">
            Don't See Your Industry?
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Talk to our technical team about custom packaging engineered to your
            product's specific barrier, closure and compliance requirements.
          </p>
          <Link
            href="/contact"
 className="btn-light hover:scale-105 text-primary"
          >
            Discuss Your Requirements
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}

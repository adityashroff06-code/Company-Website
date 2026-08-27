import { useEffect } from "react";
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

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

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
  useReveal();

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
          <div className="text-center mb-14 reveal">
 <div className="inline-block px-3 py-1 bg-primary/10 text-xs font-semibold uppercase tracking-widest rounded mb-4 text-[#4164a8]">
              Sectors
            </div>
 <h2 className="heading-section text-[#0f2a4e]">
              Packaging Built Around Your Product
            </h2>
 <p className="max-w-2xl mx-auto text-gray-500">
              Each sector carries distinct compliance, barrier and handling
              requirements. We tailor material, closure and liner choices to
              match.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <div
                key={ind.name}
                className="reveal card-standard p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
 <ind.icon size={22} className="text-[#4164a8]" />
                </div>
 <h3 className="heading-card mb-2 text-[#0f2a4e]">
                  {ind.name}
                </h3>
 <p className="text-sm leading-relaxed mb-4 text-gray-500">
                  {ind.desc}
                </p>
                <div className="border-t border-border pt-3">
 <div className="text-xs font-semibold uppercase tracking-widest mb-1 text-gray-400">
                    Relevant packaging
                  </div>
 <div className="text-sm font-medium text-[#4164a8]">
                    {ind.packaging}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory fit */}
      <section className="section-pad bg-secondary">
        <div className="container-width">
          <div className="text-center mb-14 reveal">
 <div className="inline-block px-3 py-1 bg-primary/10 text-xs font-semibold uppercase tracking-widest rounded mb-4 text-[#4164a8]">
              Compliance
            </div>
 <h2 className="heading-section text-[#0f2a4e]">
              Regulatory Fit by Industry
            </h2>
 <p className="max-w-2xl mx-auto text-gray-500">
              ISO 9001:2018 certified manufacturing means the right
              documentation and material assurance for every market you sell
              into.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regulatory.map((r, i) => (
              <div
                key={r.title}
                className="reveal card-standard p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
 <r.icon size={22} className="text-[#4164a8]" />
                </div>
 <h3 className="heading-card mb-2 text-[#0f2a4e]">
                  {r.title}
                </h3>
 <p className="text-sm leading-relaxed text-gray-500">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
 <h2 className="heading-section-light text-white">
            Don't See Your Industry?
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Talk to our technical team about custom packaging engineered to your
            product's specific barrier, closure and compliance requirements.
          </p>
          <Link
            href="/contact"
 className="btn-light hover:scale-105 text-[#4164a8]"
          >
            Discuss Your Requirements
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

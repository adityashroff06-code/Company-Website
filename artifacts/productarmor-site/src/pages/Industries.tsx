import { useEffect } from "react";
import { Link } from "wouter";
import {
  Pill,
  Leaf,
  Sprout,
  Stethoscope,
  Sparkles,
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
    desc: "Primary packaging for prescription and OTC medicines — tablets, capsules and liquid orals — with tamper-evidence and moisture protection built in.",
    packaging: "bottles · CR caps · CT caps with induction liners",
  },
  {
    icon: Leaf,
    name: "Nutraceuticals & Supplements",
    desc: "Wide-mouth bottles and secure closures for vitamins, minerals, protein powders and softgel supplements that demand shelf appeal and barrier performance.",
    packaging: "Wide-mouth bottles · CT caps · seals",
  },
  {
    icon: Sprout,
    name: "Ayurvedic & Herbal",
    desc: "Inert, food-grade containers that preserve the potency of herbal churnas, tablets and syrups while meeting AYUSH and export labelling needs.",
    packaging: "bottles · wadded CT caps",
  },
  {
    icon: Stethoscope,
    name: "Diagnostics & Healthcare",
    desc: "Clean, contamination-resistant containers for reagents, test kits and clinical consumables produced under controlled conditions.",
    packaging: "bottles · precision closures · liners",
  },
  {
    icon: Sparkles,
    name: "Personal Care & Cosmetics",
    desc: "Aesthetic yet functional bottles and caps for lotions, oils and cosmetic serums where finish, colour matching and leak-proofing matter.",
    packaging: "Custom-colour bottles · CT caps",
  },
];

const regulatory = [
  {
    icon: ShieldCheck,
    title: "Pharmaceuticals",
    desc: "USP Class VI food-grade resin, GMP manufacturing and CR caps certified to ISO 8317 / US 16 CFR 1700.20 child-resistance standards.",
  },
  {
    icon: FileCheck,
    title: "Nutraceuticals & Ayurvedic",
    desc: "Reliable packaging solutions that maintain ingredient safety, formulation stability, and product quality.",
  },
  {
    icon: Globe,
    title: "Export Markets",
    desc: "DMF-ready material declarations and drug master file support for regulated markets across the USA, Europe, the Middle East and Asia.",
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
      <section className="bg-[#4164a8] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Industries" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Industries
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Sectors
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">
              Packaging Built Around Your Product
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Each sector carries distinct compliance, barrier and handling
              requirements. We tailor material, closure and liner choices to
              match.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <div
                key={ind.name}
                className="reveal bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#4164a8]/20 transition-all duration-300 p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center mb-5">
                  <ind.icon size={22} className="text-[#4164a8]" />
                </div>
                <h3 className="font-bold text-[#0f2a4e] text-lg mb-2">
                  {ind.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {ind.desc}
                </p>
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    Relevant packaging
                  </div>
                  <div className="text-[#4164a8] text-sm font-medium">
                    {ind.packaging}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory fit */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Compliance
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">
              Regulatory Fit by Industry
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              ISO 9001:2015 certified manufacturing means the right
              documentation and material assurance for every market you sell
              into.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regulatory.map((r, i) => (
              <div
                key={r.title}
                className="reveal bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#4164a8]/20 transition-all duration-300 p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center mb-5">
                  <r.icon size={22} className="text-[#4164a8]" />
                </div>
                <h3 className="font-bold text-[#0f2a4e] text-lg mb-2">
                  {r.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f2a4e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Don't See Your Industry?
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Talk to our technical team about custom packaging engineered to your
            product's specific barrier, closure and compliance requirements.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#4164a8] font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            Discuss Your Requirements
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

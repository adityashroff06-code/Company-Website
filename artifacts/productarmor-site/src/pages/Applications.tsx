import { useEffect } from "react";
import { Link } from "wouter";
import {
  Pill,
  Droplet,
  Wind,
  Sparkles,
  Candy,
  Hand,
  FlaskConical,
  Layers,
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

const applications = [
  {
    icon: Pill,
    name: "Solid Oral Dosage",
    desc: "Tablets and capsules that need dependable moisture and light protection over long shelf lives, with tamper-evidence for retail.",
    fit: "HDPE bottle + CR cap + induction liner",
  },
  {
    icon: Droplet,
    name: "Liquid Orals & Syrups",
    desc: "Cough syrups, suspensions and tonics requiring leak-proof, low-extractable containers that survive transport and dosing.",
    fit: "HDPE bottle + CT cap + wad seal",
  },
  {
    icon: Wind,
    name: "Dry Powders & Granules",
    desc: "Reconstitutable powders and granular formulations that demand a strong moisture barrier and a wide neck for easy filling.",
    fit: "Wide-mouth HDPE bottle + CT cap",
  },
  {
    icon: Sparkles,
    name: "Effervescent Products",
    desc: "Effervescent tablets that react with moisture, needing tight-sealing closures and desiccant-compatible packaging.",
    fit: "HDPE bottle + CR/CT cap + desiccant liner",
  },
  {
    icon: Candy,
    name: "Nutraceutical Gummies",
    desc: "Sticky, temperature-sensitive gummies and chewables that require a wide mouth, secure closure and good barrier performance.",
    fit: "Wide-mouth HDPE bottle + CT cap + seal",
  },
  {
    icon: Hand,
    name: "Topical & Personal Care",
    desc: "Creams, oils and lotions where finish, chemical resistance and reliable dispensing closures are essential.",
    fit: "HDPE bottle + CT cap (dispensing options)",
  },
];

const productFit = [
  {
    icon: FlaskConical,
    title: "HDPE Bottles",
    desc: "USP Class VI food-grade high-density polyethylene bottles in round, oval and wide-mouth profiles from 30 ml to 1000 ml — the primary container for tablets, powders and liquids.",
  },
  {
    icon: Pill,
    title: "CR (Child-Resistant) Caps",
    desc: "Push-and-turn closures certified to ISO 8317 and US 16 CFR 1700.20, protecting children while remaining accessible for adults — ideal for potent Rx and OTC products.",
  },
  {
    icon: Layers,
    title: "CT (Continuous Thread) Caps",
    desc: "Reliable everyday closures with wadded or induction-sealable liners for nutraceuticals, syrups, cosmetics and general packaging where child resistance is not required.",
  },
];

export default function Applications() {
  usePageMeta({
    title: "Packaging Applications",
    description:
      "See how ProductArmor HDPE bottles, CR caps and CT caps fit real applications — solid orals, syrups, powders, effervescents, gummies and topicals — plus closure and liner selection.",
    path: "/applications",
  });
  useReveal();

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-[#4164a8] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Applications" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Applications
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Real-World Packaging Applications
          </h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            Every dosage form has its own packaging demands. Explore how our
            bottles, caps and liners are matched to the products they protect.
          </p>
        </div>
      </section>

      {/* Applications grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Use Cases
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">
              Matched to Your Dosage Form
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              The right container and closure combination keeps your product
              stable, compliant and easy to use from fill line to end user.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app, i) => (
              <div
                key={app.name}
                className="reveal bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#4164a8]/20 transition-all duration-300 p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center mb-5">
                  <app.icon size={22} className="text-[#4164a8]" />
                </div>
                <h3 className="font-bold text-[#0f2a4e] text-lg mb-2">
                  {app.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {app.desc}
                </p>
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    Recommended fit
                  </div>
                  <div className="text-[#4164a8] text-sm font-medium">
                    {app.fit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Which product fits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Product Range
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">
              Which Product Fits Each Application
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our three core product families cover the full spectrum of
              pharmaceutical and nutraceutical packaging needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productFit.map((p, i) => (
              <div
                key={p.title}
                className="reveal bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#4164a8]/20 transition-all duration-300 p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center mb-5">
                  <p.icon size={22} className="text-[#4164a8]" />
                </div>
                <h3 className="font-bold text-[#0f2a4e] text-lg mb-2">
                  {p.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closure & liner selection */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal bg-gray-50 rounded-2xl border border-gray-100 p-8 sm:p-12">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center shrink-0">
                <Layers size={22} className="text-[#4164a8]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0f2a4e] mb-2">
                  Closure &amp; Liner Selection
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                  The closure and liner do the real work of protecting your
                  product. Here is how we help you choose the right combination.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  t: "Induction (heat) seal liners",
                  d: "Create a hermetic, tamper-evident seal ideal for moisture-sensitive tablets, effervescents and export shipments.",
                },
                {
                  t: "Wadded / pressure-sensitive liners",
                  d: "Cost-effective sealing for syrups, nutraceuticals and personal-care products where induction sealing is not required.",
                },
                {
                  t: "Child-resistant vs. continuous thread",
                  d: "CR closures for potent or regulated products; CT closures for everyday packaging — both available across our neck sizes.",
                },
                {
                  t: "Desiccant compatibility",
                  d: "Wide-neck bottles and compatible liners support desiccant canisters or sachets for highly hygroscopic formulations.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="bg-white rounded-xl border border-gray-100 p-6"
                >
                  <h3 className="font-bold text-[#0f2a4e] text-sm mb-2">
                    {item.t}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f2a4e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Not Sure Which Combination You Need?
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Send us your product details and our packaging specialists will
            recommend the ideal bottle, closure and liner — and ship you samples
            to validate.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#4164a8] font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            Get a Recommendation
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

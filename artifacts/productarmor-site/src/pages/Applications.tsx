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
    desc: "Tablets and capsules that need moisture and light protection over long shelf lives, with tamper-evidence feature.",
    fit: "Bottle + CT/CR Cap + Induction Liner",
  },
  {
    icon: Droplet,
    name: "Liquid Orals & Syrups",
    desc: "Cough syrups, suspensions and tonics requiring leak-proof, low-extractable containers that survive transport and dosing.",
    fit: "bottle + CT cap + wad seal",
  },
  {
    icon: Wind,
    name: "Dry Powders & Granules",
    desc: "Reconstitutable powders and granular formulations that demand a strong moisture barrier and a wide neck for easy filling.",
    fit: "Wide-mouth bottle + CT cap",
  },
  {
    icon: Sparkles,
    name: "Effervescent Products",
    desc: "Effervescent tablets that react with moisture, needing tight-sealing closures and desiccant-compatible packaging.",
    fit: "bottle + CR/CT cap + desiccant liner",
  },
  {
    icon: Candy,
    name: "Nutraceutical Gummies",
    desc: "Sticky, temperature-sensitive gummies and chewables that require a wide mouth, secure closure and good barrier performance.",
    fit: "Wide-mouth bottle + CT cap + seal",
  },
  {
    icon: Hand,
    name: "Topical & Personal Care",
    desc: "Creams, oils and lotions where finish, chemical resistance and reliable dispensing closures are essential.",
    fit: "bottle + CT cap (dispensing options)",
  },
];

const productFit = [
  {
    icon: FlaskConical,
    title: "Bottles",
    desc: "Manufactured using food-grade resins, we supply pharmaceutical bottles in round, oval and wide-mouth profiles from 30 ml to 1000 ml — the primary container for tablets/capsule.",
  },
  {
    icon: Pill,
    title: "CR (Child-Resistant) Caps",
    desc: "Push-and-turn closures certified to ISO 8317 and US 16 CFR 1700.20, protecting children while remaining accessible for adults.",
  },
  {
    icon: Layers,
    title: "CT (Continuous Thread) Caps",
    desc: "Reliable everyday closures with wadded or induction-sealable liners for pharmaceuticals, healthcare, nutraceuticals, and general packaging where child resistance features in cap is not required.",
  },
];

export default function Applications() {
  usePageMeta({
    title: "Packaging Applications",
    description:
      "See how ProductArmor bottles, CR caps and CT caps fit real applications — solid orals, syrups, powders, effervescents, gummies and topicals — plus closure and liner selection.",
    path: "/applications",
  });
  useReveal();

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-primary section-pad">
        <div className="container-width">
          <Breadcrumb items={[{ label: "Applications" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Applications
          </div>
 <h1 className="heading-page text-white">
            Real-World Packaging Applications
          </h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            Every product has its own packaging demands. Explore how our
            bottles, caps and liners are matched to the products they protect.
          </p>
        </div>
      </section>

      {/* Applications grid */}
      <section className="section-pad bg-white">
        <div className="container-width">
          <div className="text-center mb-14 reveal">
 <div className="inline-block px-3 py-1 bg-primary/10 text-xs font-semibold uppercase tracking-widest rounded mb-4 text-[#4164a8]">
              Use Cases
            </div>
 <h2 className="heading-section text-[#0f2a4e]">
              Matched to Your Dosage Form
            </h2>
 <p className="max-w-2xl mx-auto text-gray-500">
              The right container and closure combination keeps your product
              stable, compliant and easy to use from filling line to end user.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app, i) => (
              <div
                key={app.name}
                className="reveal card-standard p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
 <app.icon size={22} className="text-[#4164a8]" />
                </div>
 <h3 className="heading-card mb-2 text-[#0f2a4e]">
                  {app.name}
                </h3>
 <p className="text-sm leading-relaxed mb-4 text-gray-500">
                  {app.desc}
                </p>
                <div className="border-t border-border pt-3">
 <div className="text-xs font-semibold uppercase tracking-widest mb-1 text-gray-400">
                    Recommended fit
                  </div>
 <div className="text-sm font-medium text-[#4164a8]">
                    {app.fit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Which product fits */}
      <section className="section-pad bg-secondary">
        <div className="container-width">
          <div className="text-center mb-14 reveal">
 <div className="inline-block px-3 py-1 bg-primary/10 text-xs font-semibold uppercase tracking-widest rounded mb-4 text-[#4164a8]">
              Product Range
            </div>
 <h2 className="heading-section text-[#0f2a4e]">
              Our Product Fits Each Application
            </h2>
 <p className="max-w-2xl mx-auto text-gray-500">
              Our three core product families cover the full spectrum of
              pharmaceutical and nutraceutical packaging needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productFit.map((p, i) => (
              <div
                key={p.title}
                className="reveal card-standard p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
 <p.icon size={22} className="text-[#4164a8]" />
                </div>
 <h3 className="heading-card mb-2 text-[#0f2a4e]">
                  {p.title}
                </h3>
 <p className="text-sm leading-relaxed text-gray-500">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closure & liner selection */}
      <section className="section-pad bg-white">
        <div className="container-width">
          <div className="reveal bg-secondary rounded-2xl border border-border p-8 sm:p-12">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
 <Layers size={22} className="text-[#4164a8]" />
              </div>
              <div>
 <h2 className="text-2xl heading-card mb-2 text-[#0f2a4e]">
                  Closure &amp; Liner Selection
                </h2>
 <p className="text-sm leading-relaxed max-w-2xl text-gray-500">
                  The closure and liner also play key role in protecting your
                  product. Here is how we help you choose the right combination.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  t: "Induction (heat) seal liners",
                  d: "Create a hermetic, tamper-evident seal ideal for moisture-sensitive tablets, and export shipments.",
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
                  d: "Our wide-neck bottles and induction liners are compatible with desiccant canisters or sachets, required for highly hygroscopic formulations.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="bg-white rounded-xl border border-border p-6"
                >
 <h3 className="font-bold text-sm mb-2 text-[#0f2a4e]">
                    {item.t}
                  </h3>
 <p className="text-sm leading-relaxed text-gray-500">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
 <h2 className="heading-section-light text-white">
            Not Sure Which Combination You Need?
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Send us your product details and our packaging specialists will
            recommend the ideal bottle, closure and liner — and ship you samples
            to validate.
          </p>
          <Link
            href="/contact"
 className="btn-light hover:scale-105 text-[#4164a8]"
          >
            Get a Recommendation
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

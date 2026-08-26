import { useEffect } from "react";
import { Link } from "wouter";
import {
  Cpu,
  Factory,
  ShieldCheck,
  Recycle,
  FlaskConical,
  Gauge,
  Wrench,
  PenTool,
  ScanLine,
  PackageCheck,
  Truck,
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

const processSteps = [
  {
    icon: PenTool,
    title: "Design & Development",
    desc: "Where Engineering Becomes Performance - We translate your specifications into precision packaging solutions—validated upfront to deliver quality, compatibility, and performance from the very first tool.",
  },
  {
    icon: Wrench,
    title: "Tooling & Mould Making",
    desc: "Our precision multi-cavity molds are engineered and hardened for exceptional durability and dimensional control—delivering consistent, repeatable bottles and closures across millions of production cycles.",
  },
  {
    icon: Factory,
    title: "Moulding",
    desc: "Engineered for Purity; Built for Precision - Advanced injection & blow moulding technology, pharmaceutical-grade resin materials, and controlled cleanroom environment to minimize air particulate contamination and deliver packaging engineered for consistent performance and quality.",
  },
  {
    icon: ScanLine,
    title: "In-Line Inspection",
    desc: "Inspecting in Real Time; Protecting Quality at Every Step - Advanced vision systems and automated torque, leak, and drop testing continuously monitor production—detecting deviations in real time and preventing defects from moving to the next stage.",
  },
  {
    icon: PackageCheck,
    title: "Packaging",
    desc: "Packed with Precision; Traceable by Design - Approved products are counted, securely poly-bagged, and cartoned in controlled packing areas, with every carton fully labeled for end-to-end batch traceability, rapid identification, and recall readiness.",
  },
  {
    icon: Truck,
    title: "Dispatch",
    desc: "Finished goods ship with a Certificate of Analysis and compliance documentation, coordinated for on-time delivery to domestic and export markets.",
  },
];

const capabilities = [
  {
    icon: Factory,
    title: "CBF, IBM & EBM Bottle Technologies",
    desc: "Compression Blow Forming (SACMI, Italy), Injection Blow Moulding and Extrusion Blow Moulding lines cover bottles from 30cc to 2400cc — with CBF cutting carbon emissions by up to 40% versus conventional blow moulding.",
  },
  {
    icon: Wrench,
    title: "Patented CRC Closure Moulding",
    desc: "India's only patented Continuous Compression Moulding technology for CRC caps (Patent No. 568961) delivers 600M+ CRC and 1B+ CT caps annually with up to 30% lower energy consumption.",
  },
  {
    icon: ShieldCheck,
    title: "ISO Class 8 Cleanroom Environment",
    desc: "Moulding and packing take place inside a 1,820 sq.m ISO Class 8 cleanroom with HEPA filtration and strict particulate control, ensuring contamination-free primary pharmaceutical packaging.",
  },
  {
    icon: Gauge,
    title: "11-Camera Vision Inspection",
    desc: "An 11-camera vision system performs 360° inspection of every bottle, with automated rejection of defective units — 100% inspection with zero human bias, backed by documented records.",
  },
  {
    icon: Cpu,
    title: "Automation & Traceability",
    desc: "Automated handling reduces human contact while batch-level traceability links every unit back to its resin lot, machine and inspection data.",
  },
  {
    icon: FlaskConical,
    title: "Material Science",
    desc: "We work exclusively with USP Class VI, food- and pharma-grade resins, validated for melt flow index, density and chemical compatibility with your formulation.",
  },
  {
    icon: Recycle,
    title: "Sustainability",
    desc: "Light-weighting, in-house regrind of production scrap and energy-efficient machinery reduce waste and carbon footprint without compromising barrier performance.",
  },
];

export default function Technology() {
  usePageMeta({
    title: "Manufacturing Technology",
    description:
      "Explore ProductArmor's pharmaceutical packaging technology — injection & blow moulding, clean-room production, in-line inspection, USP Class VI pharmaceutical-grade material and sustainable processes.",
    path: "/technology",
  });
  useReveal();

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-primary section-pad">
        <div className="container-width">
          <Breadcrumb items={[{ label: "Technology" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Manufacturing Technology
          </div>
 <h1 className="heading-page text-white">
            Engineered for Precision. Built for Performance.
          </h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            From advanced resin processing to intelligent automation and 100% quality inspection, our cleanroom
            manufacturing platform is engineered to deliver pharmaceutical packaging with exceptional precision,
            consistency, and reliability.
          </p>
        </div>
      </section>

      {/* Process timeline */}
      <section className="section-pad bg-white">
        <div className="container-width">
          <div className="text-center mb-14 reveal">
 <div className="inline-block px-3 py-1 bg-primary/10 text-xs font-semibold uppercase tracking-widest rounded mb-4 text-[#4164a8]">
              Our Process
            </div>
 <h2 className="heading-section text-[#0f2a4e]">
              Design to Dispatch — A Controlled Workflow
            </h2>
 <p className="max-w-2xl mx-auto text-gray-500">
              Every batch follows the same six-stage process, so quality is engineered rather than inspected
              afterwards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, i) => (
              <div
                key={step.title}
                className="reveal relative card-standard p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
 <step.icon size={22} className="text-[#4164a8]" />
                  </div>
 <span className="text-4xl font-black leading-none text-[#4164a8]/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
 <h3 className="heading-card mb-2 text-[#0f2a4e]">{step.title}</h3>
 <p className="text-sm leading-relaxed text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section-pad bg-secondary">
        <div className="container-width">
          <div className="text-center mb-14 reveal">
 <div className="inline-block px-3 py-1 bg-primary/10 text-xs font-semibold uppercase tracking-widest rounded mb-4 text-[#4164a8]">
              Capabilities
            </div>
 <h2 className="heading-section text-[#0f2a4e]">Technology That Sets Us Apart</h2>
 <p className="max-w-2xl mx-auto text-gray-500">
              A tightly integrated manufacturing platform that combines material science, automation and
              sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => (
              <div
                key={cap.title}
                className="reveal card-standard p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
 <cap.icon size={22} className="text-[#4164a8]" />
                </div>
 <h3 className="heading-card mb-2 text-[#0f2a4e]">{cap.title}</h3>
 <p className="text-sm leading-relaxed text-gray-500">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Material science highlight */}
      <section className="section-pad bg-white">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
 <div className="inline-block px-3 py-1 bg-primary/10 text-xs font-semibold uppercase tracking-widest rounded mb-4 text-[#4164a8]">
                Material Excellence & Full Traceability
              </div>
 <h2 className="text-3xl font-bold mb-6 text-[#0f2a4e]">
                Pharmaceutical-Grade Materials. Built on Quality and Traceability.
              </h2>
 <p className="leading-relaxed mb-6 text-gray-600">
                The foundation of every pharmaceutical packaging solution begins with carefully selected raw
                materials sourced from qualified suppliers. Our material qualification process is designed to
                support product safety, regulatory compliance, and consistent performance across every batch,
                ensuring confidence throughout the product lifecycle.
              </p>
              <ul className="space-y-3">
                {[
                  "USP Class VI compliant pharmaceutical-grade materials",
                  "End-to-end batch traceability to finished goods",
                  "Approved supplier qualification and control program",
                  "Material compatibility assessment for pharmaceutical applications",
                  "SKU-specific quality and performance validation",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
 <ShieldCheck size={18} className="shrink-0 mt-0.5 text-[#4164a8]" />
 <span className="text-sm text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal relative">
              <img
                src="/images/cleanroom-corridor.jpg"
                alt="Cleanroom manufacturing corridor at ProductArmor"
                className="rounded-2xl shadow-xl w-full object-cover h-96"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1581093804475-577d72e13da5?w=800&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-navy">
        <div className="max-w-3xl mx-auto px-4 text-center reveal">
 <h2 className="heading-section-light text-white">Talk to Our Technical Team</h2>
          <p className="text-white/60 mb-8">
            Have a challenging packaging specification? Our engineers can review your requirement and recommend the
            right material, mould and closure system.
          </p>
          <Link
            href="/contact"
 className="btn-light hover:scale-105 text-[#4164a8]"
          >
            Discuss Your Project <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

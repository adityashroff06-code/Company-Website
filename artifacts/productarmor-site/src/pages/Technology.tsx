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
    desc: "Our engineers translate your fill volume, closure system and regulatory needs into 3D CAD models, then validate wall thickness, neck finish and CR/CT compatibility before a single tool is cut.",
  },
  {
    icon: Wrench,
    title: "Tooling & Mould Making",
    desc: "Precision multi-cavity moulds are machined and hardened to hold tight dimensional tolerances across millions of cycles, ensuring every bottle and cap is identical batch after batch.",
  },
  {
    icon: Factory,
    title: "Moulding",
    desc: "USP Class VI HDPE resin is processed on automated injection and blow-moulding machines inside a controlled clean-room environment to minimise particulate contamination.",
  },
  {
    icon: ScanLine,
    title: "In-Line Inspection",
    desc: "Automated vision systems and torque, leak and drop checks run continuously through the line, flagging any deviation in real time so defects never reach the next stage.",
  },
  {
    icon: PackageCheck,
    title: "Packing",
    desc: "Approved product is counted, poly-bagged and cartoned in a dust-controlled packing area, each carton labelled with batch traceability for full recall readiness.",
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
    desc: "We work exclusively with USP Class VI, food- and pharma-grade HDPE resins, validated for melt flow index, density and chemical compatibility with your formulation.",
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
      "Explore ProductArmor's pharmaceutical packaging technology — injection & blow moulding, clean-room production, in-line inspection, USP Class VI HDPE and sustainable processes.",
    path: "/technology",
  });
  useReveal();

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-[#4164a8] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Technology" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Manufacturing Technology
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Precision Engineered, Consistently Delivered
          </h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            From resin science to automated inspection, our clean-room manufacturing platform is built to produce
            pharmaceutical packaging with repeatable, specified outcomes.
          </p>
        </div>
      </section>

      {/* Process timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Our Process
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">
              Design to Dispatch — A Controlled Workflow
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Every batch follows the same six-stage process, so quality is engineered in rather than inspected in
              afterwards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, i) => (
              <div
                key={step.title}
                className="reveal relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#4164a8]/20 transition-all duration-300 p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center shrink-0">
                    <step.icon size={22} className="text-[#4164a8]" />
                  </div>
                  <span className="text-4xl font-black text-[#4164a8]/15 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-bold text-[#0f2a4e] mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Capabilities
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">Technology That Sets Us Apart</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A tightly integrated manufacturing platform that combines material science, automation and
              sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => (
              <div
                key={cap.title}
                className="reveal bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#4164a8]/20 transition-all duration-300 p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center mb-4">
                  <cap.icon size={22} className="text-[#4164a8]" />
                </div>
                <h3 className="font-bold text-[#0f2a4e] mb-2">{cap.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Material science highlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
                Material Science
              </div>
              <h2 className="text-3xl font-bold text-[#0f2a4e] mb-6">
                USP Class VI HDPE, Validated for Pharma
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                The performance of primary packaging starts with the polymer. We source only pharma-grade,
                USP Class VI high-density polyethylene, verified for melt flow index, density and extractables so
                your product stays stable throughout its shelf life.
              </p>
              <ul className="space-y-3">
                {[
                  "USP Class VI & food-grade resin certification",
                  "Batch-level resin traceability to finished goods",
                  "Chemical compatibility review for your formulation",
                  "Moisture-barrier performance validated per SKU",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <ShieldCheck size={18} className="text-[#4164a8] shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal relative">
              <img
                src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80"
                alt="Automated pharmaceutical packaging manufacturing line"
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
      <section className="py-20 bg-[#0f2a4e]">
        <div className="max-w-3xl mx-auto px-4 text-center reveal">
          <h2 className="text-3xl font-bold text-white mb-4">Talk to Our Technical Team</h2>
          <p className="text-white/60 mb-8">
            Have a challenging packaging specification? Our engineers can review your requirement and recommend the
            right material, mould and closure system.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#4164a8] font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            Discuss Your Project <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import Breadcrumb from "@/components/Breadcrumb";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const faqs = [
  {
    q: "What is your minimum order quantity (MOQ)?",
    a: "For standard bottles, CR caps and CT caps our typical MOQ starts at 10,000 units per SKU, though this varies with neck size, bottle volume and colour. For custom moulds or specialised colours, higher volumes may apply to keep unit costs competitive. Share your annual requirement and we will recommend the most economical batch structure.",
  },
  {
    q: "What are your standard lead times?",
    a: "Stocked and standard specifications are usually dispatched within 7-10 working days of a confirmed purchase order. Custom colours, printed or decorated components, and new mould tooling extend lead times to 3-5 weeks. We provide a firm dispatch schedule at order confirmation and share production updates through your account manager.",
  },
  {
    q: "Can I customise bottle sizes, neck finishes and colours?",
    a: "Yes. We manufacture bottles across a wide range of volumes (typically 30 ml to 1000 ml) with common pharma neck finishes, and closures in CR and CT formats. Colours are matched to Pantone references, and we support masterbatch matching for brand consistency. Custom geometries are achievable through dedicated tooling.",
  },
  {
    q: "Which certifications and quality standards do you hold?",
    a: "Our facility is ISO 9001:2015 certified and operates under GMP guidelines. Production runs under controlled clean conditions with documented in-process and final inspection. Certificate copies and quality documentation can be provided to support your regulatory filings and vendor qualification.",
  },
  {
    q: "Do you provide free samples before I place an order?",
    a: "We provide product samples so your team can validate fit, compatibility and line performance before committing to volume. Sample kits typically include representative bottles and closures for your specified neck size. Contact our team with your target specification and application and we will arrange a sample dispatch.",
  },
  {
    q: "Are your child-resistant (CR) caps compliant with regulatory standards?",
    a: "Our CR closures are designed to align with recognised child-resistant performance requirements, including principles set out in US 16 CFR 1700.20 and ISO 8317. The correct CR performance depends on the complete bottle-and-closure system, so we recommend validating the assembled pack for your specific product and market.",
  },
  {
    q: "What liner and wadding options do you offer?",
    a: "We supply closures with a range of liner and sealing options, including induction heat seal (IHS) wads, EPE (foam) liners, pressure-sensitive liners and plain/unlined variants. Liner selection depends on your product's moisture sensitivity, tamper-evidence needs and filling process — our technical team helps you specify the right combination.",
  },
  {
    q: "Which export markets do you supply?",
    a: "We export pharmaceutical packaging to the USA, Europe, the Middle East and across Asia, in addition to serving clients throughout India. Our documentation, quality systems and packaging standards are structured to support the requirements of regulated export markets.",
  },
  {
    q: "How do you ensure consistent quality across production runs?",
    a: "Every run follows controlled process parameters with in-line inspection and defined acceptance criteria. We monitor critical dimensions, weight, torque performance and visual quality, and maintain batch traceability. This 'controlled variables, specified outcomes' approach delivers predictable, repeatable quality batch after batch.",
  },
  {
    q: "What materials are used in your bottles and caps?",
    a: "Our bottles and closures are manufactured primarily from pharmaceutical-grade materials selected for chemical resistance, mechanical strength and compatibility with oral solid and liquid dosage forms. Material compliance documentation can be provided to support your product's stability and regulatory requirements.",
  },
  {
    q: "What are your payment and logistics terms?",
    a: "Payment terms are agreed at the account level based on order volume and relationship, with standard options for domestic and export shipments. We coordinate packing, palletisation and freight documentation for both domestic dispatch and export consignments. Your account manager will confirm Incoterms and logistics arrangements for each order.",
  },
  {
    q: "Can you support new product development and regulatory documentation?",
    a: "Yes. Our technical team assists with component selection, closure and liner recommendations, and pack compatibility guidance during your development phase. We also provide the quality and material documentation you need for vendor qualification, regulatory filings and audits.",
  },
];

export default function FAQ() {
  usePageMeta({
    title: "FAQ",
    description: "Answers to common questions about ProductArmor pharmaceutical packaging — MOQ, lead times, customization, certifications, CR cap compliance, liners, samples and export markets.",
    path: "/faq",
  });
  useReveal();

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="grain relative overflow-hidden bg-[#0a1626] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "FAQ" }]} />
          <div className="lux-kicker text-[#c2a15f] mb-5 block">
            Support
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-white tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            Everything you need to know about our bottles, CR &amp; CT caps, ordering process, certifications and export capabilities.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((f, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={f.q}
                  className="reveal bg-white rounded-lg border border-gray-100 shadow-sm hover:border-[#4164a8]/20 transition-all duration-300 overflow-hidden"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4164a8]/40"
                    >
                      <span className="font-semibold text-[#0a1626] text-base">{f.q}</span>
                      <ChevronDown
                        size={20}
                        className={`text-[#4164a8] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    hidden={!isOpen}
                    className="px-6 pb-5 -mt-1"
                  >
                    <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-24 bg-[#f6f7f9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center shrink-0">
              <HelpCircle size={22} className="text-[#4164a8]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#0a1626] mb-2">Still have questions?</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Can't find the answer you're looking for? Our technical and sales teams are happy to help with
                specifications, samples, pricing and regulatory documentation.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#0a1626] hover:bg-[#1a2f52] text-white font-semibold px-6 py-3 rounded-sm tracking-wide transition-all duration-200 hover:shadow-lg"
              >
                <MessageSquare size={16} />
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="grain relative overflow-hidden bg-[#0a1626] py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <h2 className="font-display text-4xl sm:text-5xl font-light text-white tracking-tight mb-4">
            Ready to Discuss Your Packaging Needs?
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Request a sample kit, get a quote, or speak with our specialists about custom bottles and closures.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#e9edf4] text-[#0a1626] font-semibold px-8 py-3.5 rounded-sm tracking-wide transition-all duration-200 hover:shadow-xl"
            >
              Get in Touch
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-3.5 rounded-sm transition-all duration-200"
            >
              View Products
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

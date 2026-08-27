import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
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

const faqs = [
  {
    q: "What is your Minimum Order Quantity (MOQ)?",
    a: "For bottles, containers, and CR & CT closures, our standard MOQ starts at 5,000 units per SKU. MOQ requirements may vary depending on factors such as neck size, bottle volume or weight, colour, and other product specifications. For customised moulds or specialised products, higher order volumes may apply to ensure efficient production and competitive unit pricing. Please share your annual requirement, and our team will recommend the most economical batch size and order structure for your needs.",
  },
  {
    q: "What are your standard lead times?",
    a: "Stocked products and standard products are typically dispatched within 7–10 working days of receiving a confirmed purchase order. For customised products and new mould tooling, lead times are generally 12–15 weeks, depending on the specific requirements. We provide a firm dispatch schedule at order confirmation and keep you informed of production updates through our dedicated account manager.",
  },
  {
    q: "Can I customize bottle sizes, closure sizes, neck finishes, liners, and colors?",
    a: "Yes. We manufacture bottles in a wide range of volumes, typically from 30 cc to 2400 cc, with SP 400 threading profiles. We also offer closures in CR and CT formats across 28 mm, 33 mm, 38 mm, 45 mm, and 53 mm sizes. Colors can be matched to Pantone references, and we support masterbatch color matching to ensure consistent brand identity across products.",
  },
  {
    q: "Which certifications and quality standards do you hold?",
    a: "Our facility is certified to ISO 9001:2015 and ISO 15378:2017 standards and operates in accordance with GMP guidelines. We maintain US, Canada, and China DMFs to support regulatory and customer requirements. Production is carried out under Class 8 controlled cleanroom conditions, with documented in-process quality checks and final ERP-based inspection to ensure consistent product quality and traceability. Certificate copies and quality documents are available to support regulatory filings and vendor qualification.",
  },
  {
    q: "Do you provide free samples before I place an order?",
    a: "Yes, we provide product samples so your team can evaluate fit, compatibility, and line performance before placing a bulk order. Sample kits typically include representative bottles and closures based on your specified sizes. Share your product specifications and application with our team, and we will arrange the sample dispatch.",
  },
  {
    q: "Are your child-resistant closures compliant with regulatory standards?",
    a: "Our CR closures are designed to meet recognised child-resistant requirements, including US 16 CFR 1700.20. Final performance depends on the complete bottle and closure system, so we recommend testing the assembled pack for your specific product and market.",
  },
  {
    q: "What liner and wadding options do you offer?",
    a: "We offer a range of liner and sealing options to suit different packaging requirements, including induction heat seal (IHS) wads, EPE (foam) liners, PET liners, and plain or printed variants. The right liner depends on factors such as product compatibility, moisture sensitivity, tamper-evidence requirements, and filling process. Our technical team can help you select the most suitable liner and sealing solution for your application.",
  },
  {
    q: "Which export markets do you serve?",
    a: "We export pharmaceutical packaging solutions to the USA, Europe, the Middle East, and markets across Asia, while also serving customers throughout India. Our documentation, quality management systems, and packaging standards are designed to meet the requirements of regulated international markets, supporting reliable and compliant supply to customers worldwide.",
  },
  {
    q: "How do you ensure consistent quality across production runs?",
    a: "Every production run follows controlled process parameters, supported by in-line inspection, documented Batch Manufacturing Records (BMRs), and clearly defined acceptance criteria. We monitor critical dimensions, weight, torque performance, and visual quality at each relevant stage. Complete batch traceability is maintained through BMR documentation, ensuring that process parameters, inspections, and results are recorded and verified. This controlled variables, specified outcomes approach ensures predictable, repeatable quality and full traceability from batch to batch.",
  },
  {
    q: "What materials are used in your bottles and closures?",
    a: "Our bottles and closures are manufactured primarily from pharmaceutical-grade materials, carefully selected for their chemical resistance, mechanical strength, and compatibility with oral solid dosage forms. We ensure that our packaging materials meet applicable quality and safety requirements. Material compliance and technical documentation can be provided to support product stability, quality assurance, and regulatory requirements.",
  },
  {
    q: "What are your payment and logistics terms?",
    a: "Payment terms are agreed at the account level based on order volume and relationship, with standard options for domestic and export shipments. We coordinate packing, palletisation and freight documentation for both domestic dispatch and export consignments. Your account manager will confirm Incoterms and logistics arrangements for each order.",
  },
  {
    q: "Can you support new product development and regulatory documentation?",
    a: "Yes, our technical team supports you throughout the new product development process from component selection and bottle, closure, and liner recommendations to packaging compatibility guidance. We also provide the quality, material, and compliance documentation required for vendor qualification, regulatory submissions, customer approvals, and audits. This comprehensive support helps you move seamlessly from product development to commercialization with confidence.",
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
      <section className="bg-primary section-pad">
        <div className="container-width">
          <Breadcrumb items={[{ label: "FAQ" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Support
          </div>
 <h1 className="heading-page text-white">Frequently Asked Questions</h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            Everything you need to know about our bottles, CR &amp; CT caps, ordering process, certifications and export capabilities.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-pad bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((f, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={f.q}
                  className="reveal bg-white rounded-xl border border-border shadow-sm hover:border-primary/20 transition-all duration-300 overflow-hidden"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
 <span className="font-semibold text-base text-[#0f2a4e]">{f.q}</span>
                      <ChevronDown
                        size={20}
 className={` shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
 <p className="text-sm leading-relaxed border-t border-border pt-4 text-gray-600">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="section-pad bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal card-standard p-8 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
 <HelpCircle size={22} className="text-[#4164a8]" />
            </div>
            <div className="flex-1">
 <h2 className="text-xl heading-card mb-2 text-[#0f2a4e]">Still have questions?</h2>
 <p className="text-sm leading-relaxed mb-5 text-gray-500">
                Can't find the answer you're looking for? Our technical and sales teams are happy to help with
                specifications, samples, pricing and regulatory documentation.
              </p>
              <Link
                href="/contact"
 className="btn-primary text-white"
              >
                <MessageSquare size={16} />
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
 <h2 className="heading-section-light text-white">
            Ready to Discuss Your Packaging Needs?
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Request a sample kit, get a quote, or speak with our specialists about custom bottles and closures.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
 className="btn-light hover:scale-105 text-[#4164a8]"
            >
              Get in Touch
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-200"
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

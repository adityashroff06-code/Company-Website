import { useEffect } from "react";
import { Link } from "wouter";
import {
  FileText,
  FileSpreadsheet,
  FileBadge,
  FileCheck2,
  BookOpen,
  ShieldCheck,
  Download,
  ArrowRight,
  Mail,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import Breadcrumb from "@/components/Breadcrumb";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";

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

function pickIcon(title: string): typeof FileText {
  const t = title.toLowerCase();
  if (t.includes("brochure")) return BookOpen;
  if (t.includes("catalogue") || t.includes("catalog")) return FileSpreadsheet;
  if (t.includes("certificate") || t.includes("iso")) return FileBadge;
  if (t.includes("child") || t.includes("resistance")) return ShieldCheck;
  if (t.includes("compliance")) return FileCheck2;
  return FileText;
}

export default function Downloads() {
  usePageMeta({
    title: "Downloads & Resources",
    description:
      "Download ProductArmor brochures, technical data sheets, ISO 9001 and ISO 15378 certificates, and material compliance documents for pharmaceutical HDPE packaging.",
    path: "/downloads",
  });
  useReveal();

  const { data: content } = useGetSiteContent({
    query: { queryKey: getGetSiteContentQueryKey() },
  });
  const resources = content?.downloads ?? [];
  const hasPlaceholders = resources.some(r => !r.url);

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-[#4164a8] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Downloads" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Resource Centre
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Downloads &amp; Documentation</h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            Access brochures, technical data sheets, certificates and compliance documents — everything your
            procurement and regulatory teams need in one place.
          </p>
        </div>
      </section>

      {/* Downloads grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Available Documents
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">Browse Our Resources</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Select a document below to download. Need something specific? Our team can share tailored
              documentation on request.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((r, i) => {
              const Icon = pickIcon(r.title);
              return (
                <div
                  key={r.id}
                  className="reveal flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#4164a8]/20 transition-all duration-300 p-6"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center">
                      <Icon size={22} className="text-[#4164a8]" />
                    </div>
                  </div>
                  <h3 className="font-bold text-[#0f2a4e] mb-2">{r.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{r.description}</p>
                  <a
                    href={r.url || "#"}
                    {...(r.url ? { target: "_blank", rel: "noopener noreferrer" } : { title: "Placeholder file — to be replaced with the actual document" })}
                    className="inline-flex items-center justify-center gap-2 bg-[#4164a8] hover:bg-[#345099] text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md text-sm"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              );
            })}
          </div>

          {hasPlaceholders && (
            <p className="text-center text-gray-400 text-xs mt-8 max-w-xl mx-auto">
              Note: Some download links are placeholders to be replaced with the final documents. Contact us if you
              need a file before it is published here.
            </p>
          )}
        </div>
      </section>

      {/* Request a document */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
            <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center mx-auto mb-5">
              <Mail size={22} className="text-[#4164a8]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f2a4e] mb-3">Request a Document</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto mb-6">
              Looking for a specific data sheet, a Certificate of Analysis, a Drug Master File reference or custom
              regulatory documentation? Let us know and our team will send it across.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-[#4164a8] text-[#4164a8] hover:bg-[#4164a8] hover:text-white font-semibold px-7 py-3 rounded-lg transition-all duration-200"
            >
              Request Documentation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f2a4e]">
        <div className="max-w-3xl mx-auto px-4 text-center reveal">
          <h2 className="text-3xl font-bold text-white mb-4">Need More Information?</h2>
          <p className="text-white/60 mb-8">
            Speak with our team for samples, pricing and complete regulatory documentation for your packaging
            requirement.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#4164a8] font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            Get in Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, HeartHandshake, GraduationCap, TrendingUp, ShieldCheck, Users, Factory, MapPin, CheckCircle, Send, Paperclip } from "lucide-react";
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

const benefits = [
  { icon: GraduationCap, title: "Learning & Growth", desc: "Structured on-the-job training in injection/blow moulding, GMP practices and quality systems, plus support for relevant certifications." },
  { icon: TrendingUp, title: "Clear Career Paths", desc: "Defined progression from operator to supervisor and engineer roles, with internal promotion prioritised across production and QA." },
  { icon: ShieldCheck, title: "Safe, Clean Workplace", desc: "A controlled, well-maintained manufacturing environment built around workplace safety, hygiene and GMP discipline." },
  { icon: HeartHandshake, title: "People-First Culture", desc: "Collaborative teams, transparent communication and recognition for those who take ownership of quality outcomes." },
];

const openRoles = [
  {
    icon: Factory,
    title: "Production Engineer",
    type: "Full-time",
    location: "Hyderabad, Telangana",
    summary:
      "Own moulding line performance for HDPE bottles and caps — set up tooling, optimise cycle times, drive OEE and troubleshoot process deviations while maintaining GMP compliance.",
    requirements: ["B.E./Diploma in Mechanical/Polymer/Plastics", "2–5 yrs injection/blow moulding experience", "Working knowledge of SPC and preventive maintenance"],
  },
  {
    icon: ShieldCheck,
    title: "QA Executive",
    type: "Full-time",
    location: "Hyderabad, Telangana",
    summary:
      "Execute in-line and incoming quality checks, maintain batch records and CoAs, support ISO 9001:2015 and WHO-GMP audits, and drive corrective/preventive actions.",
    requirements: ["B.Sc./B.Pharm/M.Sc.", "1–4 yrs QA/QC in pharma or packaging", "Familiarity with AQL sampling, GDP and documentation"],
  },
  {
    icon: Users,
    title: "Sales Manager",
    type: "Full-time",
    location: "Hyderabad / Field",
    summary:
      "Grow B2B relationships with pharmaceutical, nutraceutical and healthcare manufacturers — manage the enquiry-to-order cycle, coordinate samples and support export accounts.",
    requirements: ["Graduate; MBA (Marketing) preferred", "3–6 yrs B2B sales, packaging/pharma advantage", "Strong client relationship and negotiation skills"],
  },
];

export default function Career() {
  usePageMeta({
    title: "Careers",
    description:
      "Build your career at ProductArmor — a WHO-GMP & ISO 9001:2015 certified HDPE pharma packaging manufacturer in Hyderabad. Explore open roles and apply online.",
    path: "/career",
  });
  useReveal();

  const [openRole, setOpenRole] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="pt-16">
      <section className="bg-[#4164a8] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Careers" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Join Our Team
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Build Your Career With Us</h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            Help shape the future of pharmaceutical packaging. We're a WHO-GMP and ISO 9001:2015 certified
            HDPE bottle and closure manufacturer in Hyderabad, growing across India and export markets.
          </p>
        </div>
      </section>

      {/* Why work with us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Why ProductArmor
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">A Place to Grow &amp; Do Meaningful Work</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We package the products that protect patient health — and we invest in the people who make that
              possible every day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="reveal bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#4164a8]/20 transition-all duration-300 p-6 flex gap-5"
              >
                <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center shrink-0">
                  <b.icon size={22} className="text-[#4164a8]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f2a4e] mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Open Positions
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">Current Openings</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Explore roles across production, quality and sales. Select a position in the form below to apply.
            </p>
          </div>
          <div className="space-y-4">
            {openRoles.map((r) => {
              const isOpen = openRole === r.title;
              return (
                <div
                  key={r.title}
                  className="reveal bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#4164a8]/20 transition-all duration-300 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenRole(isOpen ? null : r.title)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-5 p-6 text-left"
                  >
                    <div className="w-12 h-12 bg-[#4164a8]/10 rounded-lg flex items-center justify-center shrink-0">
                      <r.icon size={22} className="text-[#4164a8]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#0f2a4e]">{r.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <TrendingUp size={12} className="text-[#4164a8]" /> {r.type}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} className="text-[#4164a8]" /> {r.location}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className={`text-[#4164a8] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                      <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-4">{r.summary}</p>
                      <div className="text-xs font-semibold text-[#0f2a4e] uppercase tracking-wider mb-2">What we look for</div>
                      <ul className="space-y-2 mb-5">
                        {r.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle size={14} className="text-[#4164a8] shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, position: r.title }));
                          document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-2 text-[#4164a8] font-semibold text-sm hover:underline"
                      >
                        Apply for this role <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 reveal">
            <div className="inline-block px-3 py-1 bg-[#4164a8]/10 text-[#4164a8] text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Apply Now
            </div>
            <h2 className="text-3xl font-bold text-[#0f2a4e] mb-4">Submit Your Application</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Fill in your details and tell us why you'd be a great fit. We review every application and respond
              to shortlisted candidates.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-[#0f2a4e] mb-2">Application Received!</h3>
                <p className="text-gray-500 text-sm">
                  Thank you for your interest in joining ProductArmor. Our HR team will review your application
                  and reach out if there's a fit.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", phone: "", position: "", message: "" });
                  }}
                  className="mt-6 text-[#4164a8] font-semibold text-sm hover:underline"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      type="text" required value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none focus:ring-2 focus:ring-[#4164a8]/20 text-sm transition-all"
                      placeholder="Raj Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                    <input
                      type="email" required value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none focus:ring-2 focus:ring-[#4164a8]/20 text-sm transition-all"
                      placeholder="raj@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone *</label>
                    <input
                      type="tel" required value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none focus:ring-2 focus:ring-[#4164a8]/20 text-sm transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Position *</label>
                    <select
                      required value={form.position}
                      onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none focus:ring-2 focus:ring-[#4164a8]/20 text-sm transition-all bg-white"
                    >
                      <option value="" disabled>Select a role</option>
                      {openRoles.map((r) => (
                        <option key={r.title} value={r.title}>{r.title}</option>
                      ))}
                      <option value="Other / General Application">Other / General Application</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message / Cover Note *</label>
                  <textarea
                    required value={form.message} rows={5}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none focus:ring-2 focus:ring-[#4164a8]/20 text-sm transition-all resize-none"
                    placeholder="Tell us about your experience, notice period and why you'd like to join our team..."
                  />
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <Paperclip size={14} className="shrink-0 mt-0.5 text-[#4164a8]" />
                  <span>
                    Please email your resume/CV to our careers inbox after submitting this form — attach it in
                    reply to the confirmation, or send it directly to our HR team via the contact page.
                  </span>
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#4164a8] hover:bg-[#345099] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f2a4e]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Didn't Find the Right Role?</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            We're always keen to meet talented people in manufacturing, quality and sales. Reach out and
            introduce yourself — we'll keep your details on file for future openings.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#4164a8] font-semibold px-7 py-3 rounded-lg transition-all duration-200"
          >
            Contact Our HR Team <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}

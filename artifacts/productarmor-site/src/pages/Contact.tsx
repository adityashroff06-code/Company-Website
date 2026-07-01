import { useState } from "react";
  import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { Phone, Mail, MapPin, Send, CheckCircle, MessageSquare } from "lucide-react";

  export default function Contact() {
    const { data: content } = useGetSiteContent({ query: { queryKey: getGetSiteContentQueryKey() } });
    const contact = content?.contact;
    const company = content?.company;

    const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setSent(true);
      setLoading(false);
    };

    const phone = contact?.phone ?? "+91 98765 43210";
    const email = contact?.email ?? "info@productarmor.com";
    const address = contact?.address ?? "Industrial Area, Phase II, India";
    const whatsapp = contact?.whatsapp ?? "+919876543210";

    return (
      <div className="pt-16">
        {/* Header */}
        <section className="bg-[#1e4b8a] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Contact
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
              Request a sample kit, get a quote, or speak with our technical team.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f2a4e] mb-2">
                    {company?.name ?? "Product Armor Packaging Pvt Ltd"}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Reach out to us for samples, technical queries, pricing or regulatory documentation.
                  </p>
                </div>

                <div className="space-y-4">
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1e4b8a]/30 hover:shadow-sm transition-all duration-200 group">
                    <div className="w-10 h-10 bg-[#1e4b8a]/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#1e4b8a] transition-colors">
                      <Phone size={18} className="text-[#1e4b8a] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Phone</div>
                      <div className="text-[#0f2a4e] font-semibold text-sm">{phone}</div>
                    </div>
                  </a>

                  <a href={`mailto:${email}`} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1e4b8a]/30 hover:shadow-sm transition-all duration-200 group">
                    <div className="w-10 h-10 bg-[#1e4b8a]/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#1e4b8a] transition-colors">
                      <Mail size={18} className="text-[#1e4b8a] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Email</div>
                      <div className="text-[#0f2a4e] font-semibold text-sm">{email}</div>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=Hello, I'm interested in your pharmaceutical packaging products.`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#25d366]/40 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-[#25d366]/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#25d366] transition-colors">
                      <MessageSquare size={18} className="text-[#25d366] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">WhatsApp</div>
                      <div className="text-[#0f2a4e] font-semibold text-sm">{whatsapp}</div>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-[#1e4b8a]/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-[#1e4b8a]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Address</div>
                      <div className="text-[#0f2a4e] font-medium text-sm leading-relaxed">{address}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  {sent ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0f2a4e] mb-2">Message Sent!</h3>
                      <p className="text-gray-500 text-sm">
                        Thank you for reaching out. Our team will respond within 1 business day.
                      </p>
                      <button
                        onClick={() => { setSent(false); setForm({ name: "", company: "", email: "", message: "" }); }}
                        className="mt-6 text-[#1e4b8a] font-semibold text-sm hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <h2 className="text-xl font-bold text-[#0f2a4e] mb-1">Send us a Message</h2>
                        <p className="text-gray-400 text-sm">We typically respond within 24 hours on business days.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Your Name *</label>
                          <input
                            type="text" required value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#1e4b8a] focus:outline-none focus:ring-2 focus:ring-[#1e4b8a]/20 text-sm transition-all"
                            placeholder="Raj Sharma"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Company *</label>
                          <input
                            type="text" required value={form.company}
                            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#1e4b8a] focus:outline-none focus:ring-2 focus:ring-[#1e4b8a]/20 text-sm transition-all"
                            placeholder="Pharma Co. Ltd"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                        <input
                          type="email" required value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#1e4b8a] focus:outline-none focus:ring-2 focus:ring-[#1e4b8a]/20 text-sm transition-all"
                          placeholder="raj@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message *</label>
                        <textarea
                          required value={form.message} rows={5}
                          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#1e4b8a] focus:outline-none focus:ring-2 focus:ring-[#1e4b8a]/20 text-sm transition-all resize-none"
                          placeholder="Tell us about your packaging requirements — product type, volumes, specifications needed..."
                        />
                      </div>
                      <button
                        type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg"
                      >
                        {loading ? (
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <>
                            <Send size={16} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
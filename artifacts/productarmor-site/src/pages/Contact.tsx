import { useState } from "react";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { Phone, Mail, MapPin, Send, CheckCircle, MessageSquare, Linkedin } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { usePageMeta } from "@/hooks/usePageMeta";
import { CONTACT, SOCIAL } from "@/constants/site";

export default function Contact() {
  usePageMeta({
    title: "Contact Us",
    description:
      "Contact Product Armor Packaging Pvt Ltd for pharmaceutical bottles, CR & CT caps. Request a sample kit, get a quote or speak with our technical team in Telangana, India.",
    path: "/contact",
  });

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

  const phone = contact?.phone ?? CONTACT.phone;
  const email = contact?.email ?? CONTACT.email;
  const address = contact?.address ?? CONTACT.address;
  const whatsapp = contact?.whatsapp ?? CONTACT.whatsapp;
  const mapEmbed = contact?.mapEmbed || SOCIAL.mapEmbed;

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-primary section-pad">
        <div className="container-width">
          <Breadcrumb items={[{ label: "Contact" }]} />
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Contact
          </div>
 <h1 className="heading-page text-white">Get in Touch</h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            Request a sample kit, get a quote, or speak with our technical team.
          </p>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
 <h2 className="text-2xl heading-card mb-2 text-[#0f2a4e]">
                  {company?.name ?? "Product Armor Packaging Pvt Ltd"}
                </h2>
 <p className="text-sm leading-relaxed text-gray-500">
                  Reach out to us for samples, technical queries, pricing or regulatory documentation.
                </p>
              </div>

              <div className="space-y-4">
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
 <Phone size={18} className="group-hover: transition-colors text-[#4164a8] text-white" />
                  </div>
                  <div>
 <div className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-gray-400">Phone</div>
 <div className="font-semibold text-sm text-[#0f2a4e]">{phone}</div>
                  </div>
                </a>

                <a href={`mailto:${email}`} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
 <Mail size={18} className="group-hover: transition-colors text-[#4164a8] text-white" />
                  </div>
                  <div>
 <div className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-gray-400">Email</div>
 <div className="font-semibold text-sm text-[#0f2a4e]">{email}</div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=Hello, I'm interested in your pharmaceutical packaging products.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:border-[#25d366]/40 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-[#25d366]/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#25d366] transition-colors">
                    <MessageSquare size={18} className="text-[#25d366] group-hover:text-white transition-colors" />
                  </div>
                  <div>
 <div className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-gray-400">WhatsApp</div>
 <div className="font-semibold text-sm text-[#0f2a4e]">{whatsapp}</div>
                  </div>
                </a>

                <a
                  href={SOCIAL.linkedin}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
 <Linkedin size={18} className="group-hover: transition-colors text-[#4164a8] text-white" />
                  </div>
                  <div>
 <div className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-gray-400">LinkedIn</div>
 <div className="font-semibold text-sm text-[#0f2a4e]">Product Armor Packaging</div>
                  </div>
                </a>

                <a
                  href={SOCIAL.mapLink}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
 <MapPin size={18} className="group-hover: transition-colors text-[#4164a8] text-white" />
                  </div>
                  <div>
 <div className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-gray-400">Address</div>
 <div className="font-medium text-sm leading-relaxed text-[#0f2a4e]">{address}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
 <h3 className="text-xl heading-card mb-2 text-[#0f2a4e]">Message Sent!</h3>
 <p className="text-sm text-gray-500">
                      Thank you for reaching out. Our team will respond within 1 business day.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", company: "", email: "", message: "" }); }}
 className="mt-6 font-semibold text-sm hover:underline text-[#4164a8]"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
 <h2 className="heading-card mb-1 text-[#0f2a4e]">Send us a Message</h2>
 <p className="text-sm text-gray-400">We typically respond within 24 hours on business days.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500">Your Name *</label>
                        <input
                          type="text" required value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                          placeholder="Raj Sharma"
                        />
                      </div>
                      <div>
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500">Company *</label>
                        <input
                          type="text" required value={form.company}
                          onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                          placeholder="Pharma Co. Ltd"
                        />
                      </div>
                    </div>
                    <div>
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500">Email Address *</label>
                      <input
                        type="email" required value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                        placeholder="raj@company.com"
                      />
                    </div>
                    <div>
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500">Message *</label>
                      <textarea
                        required value={form.message} rows={5}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                        placeholder="Tell us about your packaging requirements — product type, volumes, specifications needed..."
                      />
                    </div>
                    <button
                      type="submit" disabled={loading}
 className="btn-primary w-full text-white"
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

      {/* Google Map */}
      <section className="pb-20 bg-secondary">
        <div className="container-width">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-border">
            <iframe
              title="Product Armor Packaging location"
              src={mapEmbed}
              className="w-full h-80 md:h-96"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}

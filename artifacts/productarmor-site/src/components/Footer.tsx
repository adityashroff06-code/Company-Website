import { Link } from "wouter";
    import { Phone, Mail, MapPin } from "lucide-react";
      import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";

    export default function Footer() {
      const { data: content } = useGetSiteContent({ query: { queryKey: getGetSiteContentQueryKey() } });
      const contact = content?.contact;
      const company = content?.company;

      const phone = contact?.phone ?? "+91 98765 43210";
      const email = contact?.email ?? "info@productarmor.com";
      const address = contact?.address ?? "Industrial Area, Phase II, India";
      const companyName = company?.name ?? "Product Armor Packaging Pvt Ltd";

      return (
        <footer className="bg-[#0f2a4e] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand */}
              <div className="lg:col-span-1">
                <div className="mb-4">
                  <img
                    src={import.meta.env.BASE_URL + "logo.png"}
                    alt="ProductArmor"
                    className="h-9 w-auto object-contain"
                  />
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Pharmaceutical-grade HDPE packaging manufactured with precision, certified to global standards.
                </p>
                <p className="mt-3 text-white/40 text-xs italic">
                  {company?.tagline ?? "Controlled Variables, Specified Outcomes"}
                </p>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Products</h3>
                <ul className="space-y-2.5">
                  {["HDPE Pharmaceutical Bottles","Child Resistant Caps","Continuous Thread Caps"].map(p => (
                    <li key={p}>
                      <Link href="/products" className="text-white/70 hover:text-[#f97316] text-sm transition-colors">{p}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Company</h3>
                <ul className="space-y-2.5">
                  {[
                    { href: "/about", label: "About Us" },
                    { href: "/quality", label: "Quality & Certifications" },
                    { href: "/contact", label: "Contact" },
                  ].map(l => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-white/70 hover:text-[#f97316] text-sm transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Get in Touch</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-white/70 text-sm">
                    <Phone size={14} className="mt-0.5 shrink-0 text-[#f97316]" />
                    <span>{phone}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white/70 text-sm">
                    <Mail size={14} className="mt-0.5 shrink-0 text-[#f97316]" />
                    <span>{email}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white/70 text-sm">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-[#f97316]" />
                    <span>{address}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-white/40 text-xs">
                &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-white/30 hover:text-white/50 text-xs transition-colors">Admin</Link>
              </div>
            </div>
          </div>
        </footer>
      );
    }
  
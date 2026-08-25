import { Link } from "wouter";
import { Phone, Mail, MapPin, Linkedin } from "lucide-react";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { CONTACT, SOCIAL, SITE } from "@/constants/site";

export default function Footer() {
  const { data: content } = useGetSiteContent({ query: { queryKey: getGetSiteContentQueryKey() } });
  const contact = content?.contact;
  const company = content?.company;

  const phone = contact?.phone ?? CONTACT.phone;
  const email = contact?.email ?? CONTACT.email;
  const address = contact?.address ?? CONTACT.address;
  const companyName = company?.name ?? SITE.name;

  return (
    <footer className="bg-navy text-white">
      <div className="container-width py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img
                src={import.meta.env.BASE_URL + "logo-transparent.png"}
                alt="Product Armor Packaging"
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Pharmaceutical-grade packaging manufactured with precision, certified to global standards and delivered to regulated markets worldwide.
            </p>
            <p className="mt-3 text-white/40 text-xs italic">
              {company?.tagline ?? SITE.tagline}
            </p>
            <a
              href={SOCIAL.linkedin}
              target="_blank" rel="noopener noreferrer"
              aria-label="Product Armor Packaging on LinkedIn"
              className="mt-5 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-primary transition-colors"
            >
              <Linkedin size={16} className="text-white" />
            </a>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Solutions</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/products", label: "Products" },
                { href: "/industries", label: "Industries" },
                { href: "/applications", label: "Applications" },
                { href: "/technology", label: "Technology" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-accent text-sm transition-colors">{l.label}</Link>
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
                { href: "/case-studies", label: "Case Studies" },
                { href: "/career", label: "Careers" },
                { href: "/downloads", label: "Downloads" },
                { href: "/faq", label: "FAQ" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-accent text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-white/70 text-sm">
                <Phone size={14} className="mt-0.5 shrink-0 text-accent" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-accent transition-colors">{phone}</a>
              </li>
              <li className="flex items-start gap-2.5 text-white/70 text-sm">
                <Mail size={14} className="mt-0.5 shrink-0 text-accent" />
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors break-all">{email}</a>
              </li>
              <li className="flex items-start gap-2.5 text-white/70 text-sm">
                <MapPin size={14} className="mt-0.5 shrink-0 text-accent" />
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

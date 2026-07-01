import { useState, useEffect } from "react";
    import { Link, useLocation } from "wouter";
    import { Menu, X } from "lucide-react";

    const links = [
      { href: "/", label: "Home" },
      { href: "/products", label: "Products" },
      { href: "/about", label: "About" },
      { href: "/quality", label: "Quality" },
      { href: "/contact", label: "Contact" },
    ];

    export default function Navbar() {
      const [open, setOpen] = useState(false);
      const [scrolled, setScrolled] = useState(false);
      const [location] = useLocation();

      useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
      }, []);

      useEffect(() => { setOpen(false); }, [location]);

      const logoUrl = import.meta.env.BASE_URL + "logo.png";

      return (
        <header
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
            scrolled ? "bg-[#1e4b8a] shadow-lg" : "bg-[#1e4b8a]/95 backdrop-blur-sm"
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center group">
                <img
                  src={logoUrl}
                  alt="ProductArmor"
                  className="h-9 w-auto object-contain"
                />
              </Link>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-1">
                {links.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                      location === l.href
                        ? "text-[#f97316]"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="ml-4 px-4 py-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold rounded transition-colors"
                >
                  Request Sample
                </Link>
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden text-white p-2 rounded hover:bg-white/10 transition-colors"
                onClick={() => setOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Mobile menu */}
            {open && (
              <div className="md:hidden border-t border-white/20 py-3 pb-4 space-y-1">
                {links.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`block px-4 py-2.5 text-sm font-medium rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors ${
                      location === l.href ? "text-[#f97316]" : ""
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="px-4 pt-2">
                  <Link
                    href="/contact"
                    className="block text-center px-4 py-2.5 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold rounded transition-colors"
                  >
                    Request Sample
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </header>
      );
    }

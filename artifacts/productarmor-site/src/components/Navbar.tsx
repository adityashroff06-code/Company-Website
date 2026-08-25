import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { MEGA_NAV } from "@/constants/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [location, navigate] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setExpanded(null); }, [location]);

  const logoUrl = import.meta.env.BASE_URL + "logo-transparent.png";

  const isActive = (href: string) => location === href;
  const groupActive = (items: { href: string }[]) => items.some(i => location === i.href);

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/products?q=${encodeURIComponent(q)}`);
    setQuery("");
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white border-b border-border ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <nav className="container-width">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img src={logoUrl} alt="Product Armor Packaging" className="h-11 w-auto object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                isActive("/") ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-secondary"
              }`}
            >
              Home
            </Link>

            {MEGA_NAV.map(group => (
              <div key={group.label} className="relative group">
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    groupActive(group.items) ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-secondary"
                  }`}
                >
                  {group.label}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>
                {/* Dropdown */}
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="w-56 bg-white rounded-xl shadow-lg border border-border p-2">
                    {group.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-secondary hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Search */}
            <form onSubmit={runSearch} className="relative ml-2">
              <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-40 lg:w-44 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </form>

            <Link
              href="/contact"
              className="ml-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-sm font-semibold rounded transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-primary p-2 rounded hover:bg-secondary transition-colors"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border py-3 pb-4 space-y-1">
            <form onSubmit={runSearch} className="relative px-1 mb-2">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border focus:border-primary focus:outline-none"
              />
            </form>

            <Link
              href="/"
              className={`block px-4 py-2.5 text-sm font-medium rounded transition-colors ${
                isActive("/") ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-secondary"
              }`}
            >
              Home
            </Link>

            {MEGA_NAV.map(group => (
              <div key={group.label}>
                <button
                  onClick={() => setExpanded(e => (e === group.label ? null : group.label))}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                >
                  {group.label}
                  <ChevronDown size={15} className={`transition-transform ${expanded === group.label ? "rotate-180" : ""}`} />
                </button>
                {expanded === group.label && (
                  <div className="pl-3 space-y-0.5">
                    {group.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm rounded transition-colors ${
                          isActive(item.href) ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-secondary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="px-4 pt-2">
              <Link
                href="/contact"
                className="block text-center px-4 py-2.5 bg-primary text-white hover:bg-primary/90 text-sm font-semibold rounded transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

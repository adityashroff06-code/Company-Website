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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-[#0a1626]/92 backdrop-blur-xl border-white/10 shadow-lg shadow-black/20"
          : "bg-[#0a1626]/55 backdrop-blur-md border-white/[0.06]"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src={logoUrl}
              alt="Product Armor Packaging"
              className="h-10 w-auto object-contain brightness-0 invert transition-opacity group-hover:opacity-80"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            <Link
              href="/"
              className={`px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                isActive("/") ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Home
            </Link>

            {MEGA_NAV.map(group => (
              <div key={group.label} className="relative group">
                <button
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                    groupActive(group.items) ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {group.label}
                  <ChevronDown size={13} className="transition-transform group-hover:rotate-180 text-[#c2a15f]" />
                </button>
                {/* Dropdown */}
                <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="w-60 bg-[#0d1c33]/97 backdrop-blur-xl rounded-md shadow-2xl shadow-black/40 border border-white/10 p-2">
                    {group.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-3.5 py-2.5 text-[13px] rounded-sm transition-colors ${
                          isActive(item.href)
                            ? "bg-white/10 text-white font-medium"
                            : "text-white/60 hover:bg-white/[0.06] hover:text-white"
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
            <form onSubmit={runSearch} className="relative ml-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-36 lg:w-44 pl-8.5 pr-3 py-2 text-[13px] rounded-sm bg-white/[0.07] border border-white/10 text-white placeholder:text-white/35 focus:border-[#c2a15f]/60 focus:bg-white/10 focus:outline-none transition-all"
              />
            </form>

            <Link
              href="/contact"
              className="ml-3 px-6 py-2.5 bg-white text-[#0a1626] hover:bg-[#e9edf4] text-[13px] font-semibold tracking-wide rounded-sm transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-sm hover:bg-white/10 transition-colors"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/10 py-3 pb-5 space-y-1 bg-[#0a1626]">
            <form onSubmit={runSearch} className="relative px-1 mb-2">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-sm bg-white/[0.07] border border-white/10 text-white placeholder:text-white/35 focus:border-[#c2a15f]/60 focus:outline-none"
              />
            </form>

            <Link
              href="/"
              className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive("/") ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Home
            </Link>

            {MEGA_NAV.map(group => (
              <div key={group.label}>
                <button
                  onClick={() => setExpanded(e => (e === group.label ? null : group.label))}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  {group.label}
                  <ChevronDown size={15} className={`text-[#c2a15f] transition-transform ${expanded === group.label ? "rotate-180" : ""}`} />
                </button>
                {expanded === group.label && (
                  <div className="pl-3 space-y-0.5">
                    {group.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive(item.href) ? "text-white font-medium" : "text-white/50 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="px-4 pt-3">
              <Link
                href="/contact"
                className="block text-center px-4 py-3 bg-white text-[#0a1626] text-sm font-semibold tracking-wide rounded-sm transition-colors"
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

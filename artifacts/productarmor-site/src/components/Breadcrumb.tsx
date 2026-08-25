import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Accessible breadcrumb trail rendered on inner pages, styled for dark hero
 * sections (white/translucent text on the #4164a8 hero background).
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
        </li>
        {items.map((c) => (
          <li key={c.label} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-white/40" />
            {c.href ? (
              <Link href={c.href} className="text-white/60 hover:text-white transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className="text-white font-medium" aria-current="page">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

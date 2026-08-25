import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { CheckCircle, Package, ArrowRight, SearchX } from "lucide-react";
  import { Link, useSearch } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
  import { usePageMeta } from "@/hooks/usePageMeta";

  export default function Products() {
    usePageMeta({
      title: "Products",
      description:
        "Explore Product Armor's pharmaceutical packaging range — bottles, child-resistant (CR) caps and continuous thread (CT) caps, engineered for global regulated markets.",
      path: "/products",
    });

    const { data: content, isLoading } = useGetSiteContent({
      query: { queryKey: getGetSiteContentQueryKey() }
    });
    const allProducts = content?.products ?? [];

    const searchString = useSearch();
    const query = (new URLSearchParams(searchString).get("q") ?? "").trim();
    const q = query.toLowerCase();

    const products = q
      ? allProducts.filter(p =>
          [p.name, p.category, p.description, ...(p.features ?? [])]
            .filter(Boolean)
            .some(v => String(v).toLowerCase().includes(q))
        )
      : allProducts;

    return (
      <div className="pt-16">
        {/* Header */}
        <section className="bg-primary section-pad">
          <div className="container-width">
            <Breadcrumb items={[{ label: "Products" }]} />
            <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Product Range
            </div>
 <h1 className="heading-page text-white">
              Pharmaceutical Packaging Solutions
            </h1>
            <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
              Every product is engineered to meet the stringent requirements of global regulated pharmaceutical markets, supported by ISO Class 8 cleanroom production, 100% automated visual inspection, and advanced quality assurance systems to ensure pharmaceutical-grade quality, consistency, and product integrity.
            </p>
            {query && (
              <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-sm">
                <span>Showing results for “{query}”</span>
 <Link href="/products" className="hover: font-semibold text-[#93b4e8] text-white">Clear</Link>
              </div>
            )}
          </div>
        </section>

        {/* Products */}
        <section className="section-pad bg-secondary">
          <div className="container-width">
            {isLoading ? (
              <div className="space-y-12">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-8 shadow-sm animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="h-72 bg-gray-200 rounded-xl" />
                      <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center section-pad">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
 <SearchX size={28} className="text-gray-400" />
                </div>
 <h2 className="text-xl heading-card mb-2 text-[#0f2a4e]">No products matched “{query}”</h2>
 <p className="text-sm mb-6 text-gray-500">Try a different term, or browse our full product range.</p>
                <Link
                  href="/products"
 className="btn-primary text-white"
                >
                  View all products
                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="space-y-12">
                {products.map((p, i) => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 ${i % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                      <div className={`relative h-72 lg:h-auto min-h-64 bg-secondary ${i % 2 === 1 ? "lg:col-start-2" : ""}`}>
                        <img
                          src={p.image}
                          alt={p.name}
                          className={`w-full h-full ${p.imageFit === "contain" ? "object-contain bg-white" : "object-cover"}`}
                          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80"; }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">{p.category}</span>
                        </div>
                      </div>
                      <div className={`p-10 flex flex-col justify-center ${i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
 <h2 className="text-2xl heading-card mb-3 text-[#0f2a4e]">{p.name}</h2>
 <p className="leading-relaxed mb-6 text-gray-500">{p.description}</p>
                        {p.sizes && (
                          <p className="mb-6 text-sm">
 <span className="font-bold uppercase tracking-widest text-xs text-[#4164a8]">Available Sizes: </span>
 <span className="text-gray-600">{p.sizes}</span>
                          </p>
                        )}
                        <div>
 <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-[#4164a8]">Key Features</h3>
                          <ul className="space-y-2">
                            {p.features.map(f => (
 <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
 <CheckCircle size={15} className="shrink-0 mt-0.5 text-[#4164a8]" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad bg-primary">
          <div className="max-w-3xl mx-auto px-4 text-center">
 <Package size={40} className="mx-auto mb-4 text-[#93b4e8]" />
 <h2 className="heading-section-light text-white"> Need Customize Specification </h2>
            <p className="text-white/60 mb-6 text-sm">
              We offer custom sizing, color options, and tailored packaging solutions. Talk to our team to develop a solution that meets your specific requirements.
            </p>
            <Link
              href="/contact"
 className="btn-light text-[#4164a8]"
            >
              Get in Touch
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    );
  }
  
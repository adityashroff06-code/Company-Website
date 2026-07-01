import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { CheckCircle, Package, ArrowRight } from "lucide-react";
  import { Link } from "wouter";

  export default function Products() {
    const { data: content, isLoading } = useGetSiteContent({
      query: { queryKey: getGetSiteContentQueryKey() }
    });
    const products = content?.products ?? [];

    return (
      <div className="pt-16">
        {/* Header */}
        <section className="bg-[#1e4b8a] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
              Product Range
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Pharmaceutical Packaging Solutions
            </h1>
            <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
              Every product is engineered to meet the stringent requirements of global regulated pharmaceutical markets.
            </p>
          </div>
        </section>

        {/* Products */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            ) : (
              <div className="space-y-12">
                {products.map((p, i) => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 ${i % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                      <div className={`relative h-72 lg:h-auto min-h-64 bg-gray-100 ${i % 2 === 1 ? "lg:col-start-2" : ""}`}>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80"; }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#1e4b8a] text-white text-xs font-bold px-3 py-1.5 rounded-full">{p.category}</span>
                        </div>
                      </div>
                      <div className={`p-10 flex flex-col justify-center ${i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                        <h2 className="text-2xl font-bold text-[#0f2a4e] mb-3">{p.name}</h2>
                        <p className="text-gray-500 leading-relaxed mb-6">{p.description}</p>
                        <div>
                          <h3 className="text-xs font-bold text-[#1e4b8a] uppercase tracking-widest mb-3">Key Features</h3>
                          <ul className="space-y-2">
                            {p.features.map(f => (
                              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <CheckCircle size={15} className="text-[#4060b0] shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-8">
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-[#4060b0] hover:bg-[#345099] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg text-sm"
                          >
                            Request Sample
                            <ArrowRight size={15} />
                          </Link>
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
        <section className="py-16 bg-[#1e4b8a]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Package size={40} className="text-[#93b4e8] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Need Custom Specifications?</h2>
            <p className="text-white/60 mb-6 text-sm">
              We offer custom sizing, color options, and labelling. Talk to our team for bespoke solutions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#1e4b8a] font-semibold px-7 py-3 rounded-lg transition-all duration-200"
            >
              Get in Touch
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    );
  }
  
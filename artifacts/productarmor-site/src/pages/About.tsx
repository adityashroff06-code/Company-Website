import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { CheckCircle, Users, Leaf, Shield, ArrowRight } from "lucide-react";
  import { Link } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";

  const values = [
    { icon: Shield, title: "Quality First", desc: "Every batch meets or exceeds international pharmacopoeia requirements before it leaves our facility." },
    { icon: Users, title: "Client Partnership", desc: "We work as an extension of your supply chain, adapting to your timelines and compliance requirements." },
    { icon: Leaf, title: "Sustainable Manufacturing", desc: "Responsible material sourcing, waste reduction, and a carbon-neutral-by-2026 commitment." },
    { icon: CheckCircle, title: "Controlled Outcomes", desc: "Controlled variables in every production run mean predictable, repeatable quality — every time." },
  ];

  export default function About() {
    const { data: content } = useGetSiteContent({ query: { queryKey: getGetSiteContentQueryKey() } });
    const about = content?.about;
    const company = content?.company;

    return (
      <div className="pt-16">
        {/* Header */}
        <section className="bg-primary section-pad">
          <div className="container-width">
            <Breadcrumb items={[{ label: "About Us" }]} />
            <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
              About Us
            </div>
            <h1 className="heading-page">
              Who We Are
            </h1>
            <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
              {company?.tagline ?? "Controlled Variables, Specified Outcomes"}
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="section-pad bg-white">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-navy mb-6">
                  {about?.title ?? "Precision Packaging Built for Pharma"}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {about?.description ?? "Product Armor Packaging Pvt Ltd is a dedicated manufacturer of pharmaceutical bottles, Child Resistant (CR) caps and Continuous Thread (CT) caps."}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Founded in {company?.founded ?? "2020"}, we have grown to serve {company?.totalClients ?? "50+"} pharmaceutical clients across India and export markets. Our {company?.employees ?? "50+"} person team brings decades of combined experience in pharmaceutical packaging manufacturing.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { v: company?.founded ?? "2020", l: "Founded" },
                    { v: company?.employees ?? "50+", l: "Team members" },
                    { v: company?.totalClients ?? "50+", l: "Clients served" },
                  ].map(s => (
                    <div key={s.l} className="text-center bg-secondary rounded-xl p-4 border border-border">
                      <div className="text-2xl font-black text-primary">{s.v}</div>
                      <div className="text-muted-foreground text-xs mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <video
                  src={`${import.meta.env.BASE_URL}videos/facility.mp4`}
                  className="rounded-2xl shadow-xl w-full object-cover h-96 bg-secondary"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-pad bg-secondary">
          <div className="container-width">
            <div className="text-center mb-14">
              <h2 className="heading-section">Our Core Values</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                The principles that guide every decision we make, from raw material selection to final delivery.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map(v => (
                <div key={v.title} className="bg-white rounded-xl p-8 shadow-sm border border-border flex gap-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <v.icon size={22} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="heading-card mb-2">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad bg-primary">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="heading-section-light">Partner With Us</h2>
            <p className="text-white/60 mb-6 text-sm">
              We are always open to new client partnerships and technical collaborations.
            </p>
            <Link
              href="/contact"
              className="btn-light"
            >
              Get in Touch <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    );
  }
  
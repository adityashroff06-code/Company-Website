import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
  import { CheckCircle, Users, Leaf, Shield, ArrowRight } from "lucide-react";
  import { Link } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
import AmbientVideo from "@/components/video/AmbientVideo";
import ImmersiveFilm, { type FilmClip } from "@/components/video/ImmersiveFilm";
import { videoSrc, videoWebm, posterSrc } from "@/components/video/videos";

  const floorClips: FilmClip[] = [
    {
      file: "loops/tech-moulding.mp4",
      poster: "tech-moulding",
      tag: "Moulding",
      title: "Continuous Compression Moulding",
      text: "Patented CRC closure moulding running at production speed.",
    },
    {
      file: "loops/tech-robot.mp4",
      poster: "tech-robot",
      tag: "Handling",
      title: "Robotic Handling",
      text: "Automated transfer keeps human contact off the product.",
    },
    {
      file: "loops/quality-vision.mp4",
      poster: "quality-vision",
      tag: "Inspection",
      title: "Inspecting in Real Time",
      text: "Advanced vision systems monitor production continuously — detecting deviations in real time and preventing defects from moving to the next stage.",
    },
  ];

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
 <h1 className="heading-page text-white">
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
 <h2 className="text-3xl font-bold mb-6 text-[#0f2a4e]">
                  {about?.title ?? "Precision Packaging Built for Pharma"}
                </h2>
 <p className="leading-relaxed mb-6 text-gray-600">
                  {about?.description ?? "Product Armor Packaging Pvt Ltd is a dedicated manufacturer of pharmaceutical bottles, Child Resistant (CR) caps and Continuous Thread (CT) caps."}
                </p>
 <p className="leading-relaxed mb-8 text-gray-600">
                  Founded in {company?.founded ?? "2020"}, we have grown to serve {company?.totalClients ?? "50+"} pharmaceutical clients across India and export markets. Our {company?.employees ?? "50+"} person team brings decades of combined experience in pharmaceutical packaging manufacturing.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { v: company?.founded ?? "2020", l: "Founded" },
                    { v: company?.employees ?? "50+", l: "Team members" },
                    { v: company?.totalClients ?? "50+", l: "Clients served" },
                  ].map(s => (
                    <div key={s.l} className="text-center bg-secondary rounded-xl p-4 border border-border">
 <div className="text-2xl font-black text-[#4164a8]">{s.v}</div>
 <div className="text-xs mt-1 text-gray-500">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <AmbientVideo
                  src={videoSrc("facility.mp4")}
                  webmSrc={videoWebm("facility.mp4")}
                  poster={posterSrc("facility")}
                  ariaLabel="A walk through the Product Armor manufacturing facility"
                  className="h-96 rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* On the floor — footage you scroll into, cut to the process it shows */}
        <ImmersiveFilm clips={floorClips} ariaLabel="Footage from the Product Armor production floor">
          <Link
            href="/technology"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur text-white font-medium px-7 py-3 rounded-lg transition-all duration-200"
          >
            Explore Technology <ArrowRight size={16} />
          </Link>
        </ImmersiveFilm>

        {/* Values */}
        <section className="section-pad bg-secondary">
          <div className="container-width">
            <div className="text-center mb-14">
 <h2 className="heading-section text-[#0f2a4e]">Our Core Values</h2>
 <p className="max-w-xl mx-auto text-gray-500">
                The principles that guide every decision we make, from raw material selection to final delivery.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map(v => (
                <div key={v.title} className="bg-white rounded-xl p-8 shadow-sm border border-border flex gap-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
 <v.icon size={22} className="text-[#4164a8]" />
                  </div>
                  <div>
 <h3 className="heading-card mb-2 text-[#0f2a4e]">{v.title}</h3>
 <p className="text-sm leading-relaxed text-gray-500">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad bg-primary">
          <div className="max-w-3xl mx-auto px-4 text-center">
 <h2 className="heading-section-light text-white">Partner With Us</h2>
            <p className="text-white/60 mb-6 text-sm">
              We are always open to new client partnerships and technical collaborations.
            </p>
            <Link
              href="/contact"
 className="btn-light text-[#4164a8]"
            >
              Get in Touch <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    );
  }
  
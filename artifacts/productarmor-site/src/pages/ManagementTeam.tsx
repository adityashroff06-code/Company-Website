import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { X, Linkedin, Mail, GraduationCap, Briefcase, Target, Quote, Users, ArrowRight, Star } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { fetchPublicTeam, type TeamMember } from "@/lib/managementTeam";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Photo({ member, className, sizes }: { member: TeamMember; className: string; sizes?: string }) {
  if (member.profilePhoto) {
    return (
      <img
        src={member.profilePhoto}
        alt={member.fullName}
        loading="lazy"
        sizes={sizes}
        className={`${className} object-cover object-top`}
      />
    );
  }
  return (
    <div className={`${className} bg-[#4164a8]/10 flex items-center justify-center`}>
      <span className="text-[#4164a8] font-black text-3xl">{initials(member.fullName)}</span>
    </div>
  );
}

function DetailBlock({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  if (!text.trim()) return null;
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-[#4164a8]/10 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#4164a8]" />
      </div>
      <div>
        <h4 className="font-bold text-[#0f2a4e] text-sm mb-1">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{text}</p>
      </div>
    </div>
  );
}

function MemberModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.fullName} profile`}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <div className="bg-[#4164a8] h-28 rounded-t-2xl" />
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="absolute top-4 right-4 bg-white/15 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="px-6 sm:px-10 -mt-14 flex flex-col sm:flex-row sm:items-end gap-4">
            <Photo member={member} className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg shrink-0" />
            <div className="pb-1">
              <h3 className="text-2xl font-bold text-[#0f2a4e]">{member.fullName}</h3>
              <p className="text-[#4164a8] font-semibold text-sm">{member.designation}</p>
              {member.department && <p className="text-gray-400 text-xs mt-0.5">{member.department}</p>}
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-10 py-8 space-y-6">
          {member.biography.trim() && (
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{member.biography}</p>
          )}
          <DetailBlock icon={GraduationCap} title="Qualifications" text={member.qualifications} />
          <DetailBlock icon={Briefcase} title="Experience" text={member.experience} />
          <DetailBlock icon={Target} title="Key Responsibilities" text={member.shortDescription} />

          {(member.linkedinUrl || member.email) && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#4164a8] hover:bg-[#345099] text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Linkedin size={15} /> LinkedIn Profile
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#0f2a4e] text-sm font-semibold rounded-lg transition-colors"
                >
                  <Mail size={15} /> {member.email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ManagementTeam() {
  usePageMeta({
    title: "Management Team",
    description:
      "Meet the directors and senior leadership of Product Armor Packaging Pvt Ltd — the team behind our pharmaceutical-grade packaging manufacturing.",
    path: "/management-team",
  });

  const [selected, setSelected] = useState<TeamMember | null>(null);
  const { data: members, isLoading } = useQuery({
    queryKey: ["management-team", "public"],
    queryFn: fetchPublicTeam,
  });

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-[#4164a8] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest rounded mb-4">
            Management Team
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Leadership</h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            The directors and senior management guiding Product Armor's commitment to
            pharmaceutical packaging excellence.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : !members || members.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#4164a8]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Users size={28} className="text-[#4164a8]" />
              </div>
              <h2 className="text-xl font-bold text-[#0f2a4e] mb-2">Team profiles coming soon</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                We are preparing detailed profiles of our directors and senior management team.
                Please check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map(member => (
                <button
                  key={member.id}
                  onClick={() => setSelected(member)}
                  className="group text-left bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4164a8]/40"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Photo
                      member={member}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {member.featured && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#4164a8] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        <Star size={11} /> Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-[#0f2a4e] text-lg group-hover:text-[#4164a8] transition-colors">
                      {member.fullName}
                    </h3>
                    <p className="text-[#4164a8] text-sm font-semibold mb-3">{member.designation}</p>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
                      {member.shortDescription}
                    </p>
                    <span className="inline-flex items-center gap-1.5 mt-4 text-[#4164a8] text-sm font-semibold">
                      View Profile
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4164a8]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Quote size={26} className="text-white/40 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Leadership You Can Rely On</h2>
          <p className="text-white/60 mb-6 text-sm">
            Our management team brings decades of combined pharmaceutical packaging experience to every partnership.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#4164a8] font-semibold px-7 py-3 rounded-lg transition-all duration-200"
          >
            Get in Touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

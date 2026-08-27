import { useState } from "react";
import { Link } from "wouter";
import { X, Linkedin, Quote, Users, ArrowRight, Star } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { fetchPublicTeam, type TeamMember } from "@/lib/managementTeam";
import { useQuery } from "@tanstack/react-query";

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

/** Renders **bold** markers and blank-line paragraph breaks. */
function boldParts(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-[#0a1626]">{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );
}

function FormattedDescription({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-gray-600 text-sm leading-relaxed whitespace-pre-line text-justify">
          {boldParts(p)}
        </p>
      ))}
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
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative px-6 sm:px-10 pt-10 pb-8 text-center">
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-2 transition-colors"
          >
            <X size={18} />
          </button>

          <Photo
            member={member}
            className="w-32 h-32 rounded-full border-4 border-[#4164a8]/10 shadow-md mx-auto mb-5"
            sizes="128px"
          />
          <h3 className="text-2xl font-semibold text-[#0a1626]">{member.fullName}</h3>
          <p className="text-[#4164a8] font-semibold text-sm mb-6">{member.designation}</p>

          {member.shortDescription.trim() && (
            <div className="text-left">
              <FormattedDescription text={member.shortDescription} />
            </div>
          )}

          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.fullName} on LinkedIn`}
              className="inline-flex items-center justify-center w-11 h-11 mt-6 rounded-full bg-[#0a66c2] hover:bg-[#084d92] text-white transition-colors"
            >
              <Linkedin size={19} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberCard({ member, onSelect }: { member: TeamMember; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full bg-white rounded-lg border border-gray-100 shadow-sm p-8 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4164a8]/40"
    >
      <div className="relative w-36 h-36 mx-auto mb-6">
        <Photo
          member={member}
          className="w-36 h-36 rounded-full border-4 border-[#4164a8]/10 shadow-md group-hover:scale-105 transition-transform duration-300"
          sizes="144px"
        />
        {member.featured && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-[#4164a8] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            <Star size={11} /> Featured
          </span>
        )}
      </div>
      <h3 className="font-semibold text-[#0a1626] text-lg group-hover:text-[#4164a8] transition-colors">
        {member.fullName}
      </h3>
      <p className="text-[#4164a8] text-sm font-semibold">{member.designation}</p>
    </button>
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
  const isDirector = (member: TeamMember) => /\bdirector\b/i.test(member.designation);
  const isChiefExecutiveOfficer = (member: TeamMember) =>
    /\bchief executive officer\b/i.test(member.designation) || /\bceo\b/i.test(member.designation);
  const leadershipMembers = [...(members ?? [])]
    .filter(member => isDirector(member) || isChiefExecutiveOfficer(member))
    .sort((a, b) => Number(!isDirector(a)) - Number(!isDirector(b)));
  const leadershipIds = new Set(leadershipMembers.map(member => member.id));
  const otherMembers = (members ?? []).filter(member => !leadershipIds.has(member.id));

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="grain relative bg-[#0a1626] overflow-hidden pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lux-kicker text-[#c2a15f] mb-5 block">
            Management Team
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-white tracking-tight mb-4">Our Leadership</h1>
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            The directors and senior management guiding Product Armor's commitment to
            pharmaceutical packaging excellence.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 bg-[#f6f7f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 animate-pulse">
                  <div className="w-36 h-36 bg-gray-100 rounded-full mx-auto mb-6" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : !members || members.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#4164a8]/10 rounded-lg flex items-center justify-center mx-auto mb-5">
                <Users size={28} className="text-[#4164a8]" />
              </div>
              <h2 className="text-xl font-semibold text-[#0a1626] mb-2">Team profiles coming soon</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                We are preparing detailed profiles of our directors and senior management team.
                Please check back shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {leadershipMembers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {leadershipMembers.map(member => (
                    <MemberCard key={member.id} member={member} onSelect={() => setSelected(member)} />
                  ))}
                </div>
              )}
              {otherMembers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {otherMembers.map(member => (
                    <MemberCard key={member.id} member={member} onSelect={() => setSelected(member)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="grain relative bg-[#0a1626] overflow-hidden py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Quote size={26} className="text-[#c2a15f] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-light text-white tracking-tight mb-3">Leadership You Can Rely On</h2>
          <p className="text-white/60 mb-6 text-sm">
            Our management team brings decades of combined pharmaceutical packaging experience to every partnership.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0a1626] hover:bg-[#e9edf4] font-semibold px-7 py-3 rounded-sm tracking-wide transition-all duration-200"
          >
            Get in Touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

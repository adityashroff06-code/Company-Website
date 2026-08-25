import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "wouter";
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  Factory,
  HeartHandshake,
  MapPin,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import Breadcrumb from "@/components/Breadcrumb";
import { getGetSiteContentQueryKey, useGetSiteContent } from "@workspace/api-client-react";

const roleIcons = {
  factory: Factory,
  quality: ShieldCheck,
  people: Users,
} as const;

const values = [
  {
    number: "01",
    icon: HeartHandshake,
    title: "Collaboration & Teamwork",
    description:
      "Great outcomes are never achieved in isolation. We work across functions, share knowledge freely and support one another to solve problems and achieve common goals. We believe success belongs to the team, not the individual.",
  },
  {
    number: "02",
    icon: CheckCircle2,
    title: "Accountability & Close-Looping",
    description:
      "Ownership goes beyond completing a task. It means seeing it through to completion. We take responsibility for our commitments, communicate proactively and ensure that every action reaches a clear conclusion. We don't leave loose ends.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Transparency",
    description:
      "Trust is built through openness. We communicate honestly, provide constructive feedback, share information responsibly and make decisions with integrity. We believe transparency strengthens relationships; with our colleagues, customers and partners alike.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Efficiency",
    description:
      "We constantly look for better, smarter and simpler ways to work. By eliminating waste, improving processes and focusing on what truly matters, we create value for our customers while enabling our teams to perform at their best.",
  },
  {
    number: "05",
    icon: Sparkles,
    title: "Adaptability",
    description:
      "Growth demands agility. As our business evolves, we embrace change with a positive mindset, learn continuously and respond quickly to new opportunities and challenges. Flexibility and resilience are part of who we are.",
  },
];

const joiningReasons = [
  "Work on meaningful challenges in a fast-growing manufacturing organization.",
  "Learn from experienced professionals while taking on real responsibility from day one.",
  "Build systems, improve processes and leave a lasting impact.",
  "Collaborate with passionate teams that value ideas over hierarchy.",
  "Grow your career in an environment that rewards initiative, ownership and continuous learning.",
];

const initialForm = { name: "", email: "", phone: "", position: "", message: "" };

function useReveal(dependency: number) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".career-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("career-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [dependency]);
}

export default function Career() {
  usePageMeta({
    title: "Careers at Product Armor",
    description:
      "Build your career at Product Armor, a young and ambitious pharmaceutical packaging manufacturer in Telangana. Explore open roles and make work that protects what matters.",
    path: "/career",
  });

  const [openRole, setOpenRole] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: content, isLoading: openingsLoading, isError: openingsError, refetch } = useGetSiteContent({
    query: { queryKey: getGetSiteContentQueryKey() },
  });
  const openRoles = (content?.openings ?? []).filter((opening) => opening.active !== false);

  useReveal(openRoles.length);

  const selectRole = (title: string, id: string) => {
    setForm((current) => ({ ...current, position: title }));
    setOpenRole(id);
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="career-page overflow-hidden bg-background pt-16 text-navy">
      <style>{`
        .career-reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 650ms ease, transform 650ms ease;
        }
        .career-reveal.career-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .career-reveal,
          .career-reveal.career-revealed {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute -right-24 top-14 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 top-28 h-64 w-64 rounded-full border border-[#e6a35c]/30" />
        <div className="pointer-events-none absolute bottom-0 left-[52%] h-px w-[42%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24 lg:px-12">
          <Breadcrumb items={[{ label: "Careers" }]} />
          <div>
            <div className="career-reveal">
              <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
                <span className="h-px w-8 bg-accent/80" />
                Careers at Product Armor
              </p>
              <h1 className="whitespace-nowrap  text-[1.1rem] leading-none tracking-tight text-white sm:text-3xl md:text-5xl lg:text-[4.75rem]">
                Build the Future. <span className="text-accent">Protect What Matters.</span>
              </h1>
              <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.72fr)] lg:items-center lg:gap-16">
                <div>
                  <div className="grid gap-5 border-l border-white/25 pl-5 text-base leading-7 text-white/70 sm:grid-cols-2 sm:gap-8 sm:pl-7">
                    <p>
                      At Product Armor, we don't just manufacture pharmaceutical packaging; we help safeguard products that improve lives. Every bottle, every closure, every process and every decision contributes to the quality and reliability our customers depend on.
                    </p>
                    <p>
                      We're building an organization where talented people can do meaningful work, take ownership, challenge convention and grow alongside the business. As a young and ambitious company, we believe the best ideas come from people who are willing to roll up their sleeves, collaborate across teams and continuously improve the way things are done.
                    </p>
                  </div>
                  <p className="mt-8 max-w-xl text-lg leading-7 text-white">
                    If you're looking for a workplace where your contribution is visible, your voice is heard and your work has a real impact, we'd love to meet you.
                  </p>
                  <a
                    href="#openings"
                    data-testid="link-explore-openings"
                    className="mt-9 inline-flex items-center gap-3 border-b border-accent/80 pb-2 text-sm font-semibold text-accent transition-transform duration-300 hover:translate-x-1"
                  >
                    Explore current openings <ArrowDownRight size={17} />
                  </a>
                </div>
                <figure className="career-reveal relative mx-auto w-full max-w-[430px] overflow-hidden border border-white/20 bg-white/10 lg:justify-self-center" style={{ transitionDelay: "120ms" }}>
                  <img
                    src="/site/images/productarmor-careers-team.jpg"
                    alt="ProductArmor manufacturing team collaborating in a cleanroom"
                    data-testid="img-careers-team"
                    className="aspect-[4/3] w-full object-cover opacity-90"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b2444]/90 to-transparent px-5 pb-4 pt-12 text-xs uppercase tracking-[0.18em] text-white/75">
                    People who protect what matters
                  </figcaption>
                </figure>
              </div>
            </div>

          </div>
        </div>
      </section>

      <nav aria-label="Career page sections" className="border-b border-border bg-background">
        <div className="container-width flex items-center justify-between gap-5 overflow-x-auto py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span className="hidden whitespace-nowrap text-navy sm:inline">Join the build</span>
          <div className="flex min-w-max items-center gap-6 sm:gap-9">
            <a href="#values" data-testid="link-career-values" className="transition-colors hover:text-primary">What defines us</a>
            <a href="#why-join" data-testid="link-career-why-join" className="transition-colors hover:text-primary">Why join</a>
            <a href="#openings" data-testid="link-career-openings" className="transition-colors hover:text-primary">Openings</a>
            <a href="#apply" data-testid="link-career-apply" className="transition-colors hover:text-primary">Apply</a>
          </div>
        </div>
      </nav>

      <section id="values" className="bg-background section-pad sm:py-28">
        <div className="container-width">
          <div className="grid gap-12 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
            <div className="career-reveal lg:sticky lg:top-28 lg:self-start">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">01 / How we work</p>
              <h2 className="max-w-md  text-5xl leading-[0.98] tracking-tight text-navy sm:text-6xl">
                What Defines Us
              </h2>
              <p className="mt-7 max-w-sm text-body">
                The standards we hold ourselves to are the same standards we bring to every product we make.
              </p>
              <div className="mt-12 hidden h-28 w-px bg-accent/50 lg:block" />
            </div>
            <div className="divide-y divide-[#d5dede] border-t border-navy/20">
              {values.map((value, index) => {
                const ValueIcon = value.icon;
                return (
                  <article
                    key={value.title}
                    data-testid={`value-${index + 1}-${value.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}
                    className="career-reveal grid gap-5 py-8 sm:grid-cols-[58px_235px_1fr] sm:gap-7"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start justify-between sm:block">
                      <span className="font-mono text-xs text-primary">{value.number}</span>
                      <ValueIcon size={21} strokeWidth={1.5} className="text-accent sm:mt-7" />
                    </div>
                    <h3 className="max-w-[220px] text-xl font-semibold leading-tight tracking-[-0.02em] text-navy">{value.title}</h3>
                    <p className="max-w-xl text-body">{value.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="why-join" className="relative overflow-hidden bg-secondary section-pad sm:py-28">
        <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full border border-primary/10" />
        <div className="pointer-events-none absolute -left-20 top-28 h-48 w-48 rounded-full border border-accent/20" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-28 lg:px-12">
          <div className="career-reveal">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">02 / Make your mark</p>
            <h2 className="max-w-md  text-5xl leading-[0.98] tracking-tight text-navy sm:text-6xl">
              Why Join Product Armor?
            </h2>
            <div className="mt-8 flex items-start gap-3 text-muted-foreground">
              <ArrowRight size={18} className="mt-1 shrink-0 text-accent" />
              <p className="max-w-xs leading-7">At Product Armor, you'll have the opportunity to:</p>
            </div>
          </div>
          <div className="career-reveal border-t border-navy/20" style={{ transitionDelay: "100ms" }}>
            {joiningReasons.map((reason, index) => (
              <div
                key={reason}
                data-testid={`why-join-item-${index + 1}`}
                className="flex gap-5 border-b border-navy/15 py-6 text-body text-navy text-lg sm:gap-8 sm:py-7 sm:text-xl"
              >
                <span className="font-mono text-xs text-primary">0{index + 1}</span>
                <p>{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="openings" className="bg-primary section-pad text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="career-reveal mb-12 flex flex-col justify-between gap-7 border-b border-white/20 pb-10 sm:flex-row sm:items-end">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent/80">03 / The next move</p>
              <h2 className=" text-5xl leading-[0.98] tracking-tight sm:text-6xl">Current Openings</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/60">
              Explore roles across production, quality and sales. Select a position in the form below to apply.
            </p>
          </div>

          {openingsLoading ? (
            <div data-testid="loading-current-openings" className="space-y-3" aria-label="Loading current openings">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-[92px] animate-pulse border border-white/10 bg-white/[0.06]" />
              ))}
            </div>
          ) : openingsError ? (
            <div data-testid="error-current-openings" className="border border-accent/40 bg-accent/10 p-7">
              <p className="font-semibold text-white">Openings are taking a moment to load.</p>
              <p className="mt-2 text-sm text-white/60">Please try again, or send us a general application below.</p>
              <button
                type="button"
                data-testid="button-retry-openings"
                onClick={() => void refetch()}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-transform hover:translate-x-1"
              >
                Try again <ArrowRight size={15} />
              </button>
            </div>
          ) : openRoles.length === 0 ? (
            <div data-testid="empty-current-openings" className="border border-white/15 bg-white/[0.05] p-8 sm:p-10">
              <BriefcaseBusiness size={24} strokeWidth={1.4} className="text-accent/80" />
              <p className="mt-5 text-xl font-semibold">There are no open positions at the moment.</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/60">Please check back soon, or submit a general application so we can keep your details on file.</p>
            </div>
          ) : (
            <div className="border-t border-white/20">
              {openRoles.map((role, index) => {
                const isOpen = openRole === role.id;
                const RoleIcon = roleIcons[role.icon as keyof typeof roleIcons] ?? BriefcaseBusiness;
                return (
                  <article
                    key={role.id}
                    data-testid={`opening-${role.id}`}
                    className="career-reveal border-b border-white/20"
                    style={{ transitionDelay: `${index * 70}ms` }}
                  >
                    <button
                      type="button"
                      data-testid={`button-toggle-opening-${role.id}`}
                      onClick={() => setOpenRole(isOpen ? null : role.id)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center gap-4 py-6 text-left transition-colors hover:text-accent sm:gap-7 sm:py-7"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 text-accent/80 transition-colors group-hover:border-accent/80">
                        <RoleIcon size={20} strokeWidth={1.4} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-semibold tracking-[-0.01em] sm:text-xl">{role.title}</span>
                        <span className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/55">
                          <span className="inline-flex items-center gap-1.5"><TrendingUp size={13} /> {role.type}</span>
                          <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {role.location}</span>
                        </span>
                      </span>
                      <ChevronDown size={20} className={`shrink-0 text-accent/80 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div data-testid={`opening-details-${role.id}`} className="grid gap-8 border-t border-white/15 pb-8 pt-7 sm:grid-cols-[1fr_1fr] sm:pl-[70px]">
                        <p className="max-w-xl text-sm leading-7 text-white/70">{role.summary}</p>
                        <div>
                          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/80">What we look for</p>
                          <ul className="space-y-3">
                            {role.requirements.map((requirement) => (
                              <li key={requirement} className="flex gap-3 text-sm leading-6 text-white/70">
                                <Check size={15} className="mt-1 shrink-0 text-accent/80" />
                                <span>{requirement}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            data-testid={`button-apply-opening-${role.id}`}
                            onClick={() => selectRole(role.title, role.id)}
                            className="mt-7 inline-flex items-center gap-2 border-b border-accent/80 pb-1 text-sm font-semibold text-accent transition-transform hover:translate-x-1"
                          >
                            Apply for this role <ArrowRight size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="apply" className="bg-background section-pad sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
            <div className="career-reveal">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">04 / Start a conversation</p>
              <h2 className=" text-5xl leading-[0.98] tracking-tight text-navy sm:text-6xl">Submit Your Application</h2>
              <p className="mt-7 max-w-sm text-body">
                Tell us where your experience could make a difference. We review every application and respond to shortlisted candidates.
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <span className="h-px w-8 bg-accent" /> Product Armor / People
              </div>
            </div>

            <div data-testid="application-form-panel" className="career-reveal border-t border-navy/20 pt-7" style={{ transitionDelay: "100ms" }}>
              {sent ? (
                <div data-testid="status-application-received" className="border border-primary/20 bg-white p-8 sm:p-12">
                  <CheckCircle2 size={34} strokeWidth={1.4} className="text-primary" />
                  <h3 className="mt-7  text-4xl tracking-tight text-navy">Application Received!</h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                    Thank you for your interest in joining ProductArmor. Our HR team will review your application and reach out if there's a fit.
                  </p>
                  <button
                    type="button"
                    data-testid="button-submit-another-application"
                    onClick={() => {
                      setSent(false);
                      setForm(initialForm);
                    }}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-transform hover:translate-x-1"
                  >
                    Submit another application <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-application">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Full Name *</span>
                      <input
                        type="text"
                        required
                        value={form.name}
                        data-testid="input-application-name"
                        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                        className="w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                        placeholder="Your full name"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email Address *</span>
                      <input
                        type="email"
                        required
                        value={form.email}
                        data-testid="input-application-email"
                        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                        className="w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                        placeholder="you@company.com"
                      />
                    </label>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Phone *</span>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        data-testid="input-application-phone"
                        onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                        className="w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                        placeholder="+91 98765 43210"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Position *</span>
                      <select
                        required
                        value={form.position}
                        data-testid="select-application-position"
                        onChange={(event) => setForm((current) => ({ ...current, position: event.target.value }))}
                        className="w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-navy outline-none transition-colors focus:border-primary focus:ring-0"
                      >
                        <option value="" disabled>Select a role</option>
                        {openRoles.map((role) => <option key={role.id} value={role.title}>{role.title}</option>)}
                        <option value="Other / General Application">Other / General Application</option>
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Message / Cover Note *</span>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      data-testid="textarea-application-message"
                      onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                      className="w-full resize-none border border-border bg-white px-4 py-3 text-sm leading-6 text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                      placeholder="Tell us about your experience, notice period and why you'd like to join our team..."
                    />
                  </label>
                  <div className="flex items-start gap-3 border border-border bg-secondary p-4 text-xs leading-5 text-muted-foreground">
                    <Paperclip size={15} className="mt-0.5 shrink-0 text-primary" />
                    <span>Please email your resume/CV to our careers inbox after submitting this form — attach it in reply to the confirmation, or send it directly to our HR team via the contact page.</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="button-submit-application"
                    className="inline-flex w-full items-center justify-center gap-3 bg-primary px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg disabled:cursor-wait disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <span className="flex gap-1" aria-hidden="true"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white [animation-delay:150ms]" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white [animation-delay:300ms]" /></span>
                        Sending application
                      </>
                    ) : (
                      <>Submit Application <Send size={16} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent section-pad text-navy sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12">
          <div className="career-reveal">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-navy/70">The next chapter</p>
            <h2 className=" text-5xl leading-[0.98] tracking-tight sm:text-7xl">Grow With Us</h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-navy/80">
              We're always looking for people who are curious, driven and committed to making a difference. Whether you're an experienced professional or just beginning your career, if our values resonate with you, there's a place for you at Product Armor.
            </p>
            <p className="mt-4 text-lg font-semibold">Come build something meaningful with us.</p>
          </div>
          <Link
            href="/contact"
            data-testid="link-contact-hr-team"
            className="career-reveal inline-flex items-center justify-center gap-3 border border-navy/35 px-6 py-4 text-sm font-semibold transition-colors hover:bg-navy hover:text-accent"
            style={{ transitionDelay: "120ms" }}
          >
            Contact our HR team <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
import { useState, useEffect } from "react";
  import { useLocation } from "wouter";
  import {
    useGetSiteContent,
    useUpdateSiteContent,
    useAdminLogin,
    getGetSiteContentQueryKey,
  } from "@workspace/api-client-react";
  import type { SiteContent } from "@workspace/api-client-react";
  import { useQueryClient } from "@tanstack/react-query";
  import {
    Shield, LogOut, Save, Plus, Trash2, ChevronDown,
    Image, Video, FileText, Package, Award, Users, Star, Phone, Building2, LayoutDashboard, UserRound
  } from "lucide-react";
  import TeamManager from "./TeamManager";

  type Tab = "hero" | "about" | "team" | "products" | "certifications" | "clients" | "testimonials" | "contact" | "company";

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "hero", label: "Hero", icon: Image },
    { id: "about", label: "About", icon: FileText },
    { id: "team", label: "Management Team", icon: UserRound },
    { id: "products", label: "Products", icon: Package },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "clients", label: "Clients", icon: Users },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "company", label: "Company", icon: Building2 },
  ];

  function Field({ label, value, onChange, type = "text", rows = 3 }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number;
  }) {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
        {type === "textarea" ? (
          <textarea
            value={value} onChange={e => onChange(e.target.value)} rows={rows}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none focus:ring-2 focus:ring-[#4164a8]/15 text-sm transition-all resize-none"
          />
        ) : (
          <input
            type={type} value={value} onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none focus:ring-2 focus:ring-[#4164a8]/15 text-sm transition-all"
          />
        )}
      </div>
    );
  }

  function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-[#4164a8]" : "bg-gray-300"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
    );
  }

  export default function AdminDashboard() {
    const [, navigate] = useLocation();
    const qc = useQueryClient();
    const [activeTab, setActiveTab] = useState<Tab>("hero");
    const [savedMsg, setSavedMsg] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") ?? "" : "";

    useEffect(() => {
      if (!token) navigate("/admin");
    }, [token, navigate]);

    const { data: content, isLoading } = useGetSiteContent({
      query: { queryKey: getGetSiteContentQueryKey() }
    });

    const [draft, setDraft] = useState<SiteContent | null>(null);
    useEffect(() => { if (content && !draft) setDraft(JSON.parse(JSON.stringify(content))); }, [content]);

    const updateMutation = useUpdateSiteContent({
      mutation: {
        onSuccess: (data) => {
          qc.setQueryData(getGetSiteContentQueryKey(), data);
          setSavedMsg("Saved successfully!");
          setTimeout(() => setSavedMsg(""), 3000);
        },
        onError: () => setSavedMsg("Error saving. Check your connection."),
      },
    });

    const handleSave = () => {
      if (!draft) return;
      updateMutation.mutate({ data: draft, token });
    };

    const logout = () => {
      localStorage.removeItem("admin_token");
      navigate("/admin");
    };

    if (isLoading || !draft) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#4164a8] border-t-transparent mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading content...</p>
          </div>
        </div>
      );
    }

    const set = (path: string[], value: unknown) => {
      setDraft(prev => {
        if (!prev) return prev;
        const next = JSON.parse(JSON.stringify(prev)) as SiteContent;
        let obj: Record<string, unknown> = next as unknown as Record<string, unknown>;
        for (let i = 0; i < path.length - 1; i++) {
          obj = obj[path[i]] as Record<string, unknown>;
        }
        obj[path[path.length - 1]] = value;
        return next;
      });
    };

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top bar */}
        <header className="bg-[#4164a8] text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4164a8] rounded-lg flex items-center justify-center">
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-sm">ProductArmor</span>
              <span className="ml-1 text-white/60 text-xs hidden sm:inline">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {savedMsg && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                savedMsg.includes("Error") ? "bg-red-500/20 text-red-200" : "bg-green-500/20 text-green-200"
              }`}>
                {savedMsg}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex items-center gap-1.5 bg-[#4164a8] hover:bg-[#345099] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {updateMutation.isPending ? (
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
              ) : (
                <Save size={14} />
              )}
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </button>
            <button onClick={logout} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <nav className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 shrink-0">
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Content Sections</p>
              <ul className="space-y-1">
                {tabs.map(t => (
                  <li key={t.id}>
                    <button
                      onClick={() => setActiveTab(t.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                        activeTab === t.id
                          ? "bg-[#4164a8] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <t.icon size={15} />
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Mobile tab selector */}
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2">
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="flex items-center gap-2 text-[#4164a8] font-semibold text-sm"
            >
              {tabs.find(t => t.id === activeTab)?.label ?? "Select section"}
              <ChevronDown size={16} className={`transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileMenuOpen && (
              <div className="mt-2 pb-2 grid grid-cols-4 gap-1">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id); setMobileMenuOpen(false); }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === t.id ? "bg-[#4164a8] text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <t.icon size={14} />
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-6">

              {/* ── HERO ── */}
              {activeTab === "hero" && (
                <Section title="Hero Section" icon={Image}>
                  <Field label="Headline" value={draft.hero.headline} onChange={v => set(["hero","headline"], v)} type="textarea" rows={2} />
                  <Field label="Subheadline" value={draft.hero.subheadline} onChange={v => set(["hero","subheadline"], v)} type="textarea" rows={3} />
                  <Field label="CTA Button Text" value={draft.hero.ctaText} onChange={v => set(["hero","ctaText"], v)} />
                  <Field label="CTA Link (e.g. /contact)" value={draft.hero.ctaLink} onChange={v => set(["hero","ctaLink"], v)} />
                  <Field label="Background Image URL" value={draft.hero.backgroundImage} onChange={v => set(["hero","backgroundImage"], v)} />
                  {draft.hero.backgroundImage && (
                    <img src={draft.hero.backgroundImage} alt="Hero preview" className="w-full h-40 object-cover rounded-lg border border-gray-200" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  )}
                  <Field label="Video URL (YouTube embed, e.g. https://www.youtube.com/embed/...)" value={draft.hero.videoUrl} onChange={v => set(["hero","videoUrl"], v)} />
                  <Toggle label="Show Video instead of image" checked={draft.hero.showVideo} onChange={v => set(["hero","showVideo"], v)} />
                  {draft.hero.showVideo && draft.hero.videoUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200 aspect-video">
                      <iframe src={draft.hero.videoUrl} className="w-full h-full" allowFullScreen title="Hero video" />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Stats Bar</label>
                    <div className="space-y-2">
                      {draft.stats.map((s, i) => (
                        <div key={i} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                          <input
                            type="text" value={s.value} placeholder="Value"
                            onChange={e => {
                              const next = [...draft.stats];
                              next[i] = { ...next[i], value: e.target.value };
                              set(["stats"], next);
                            }}
                            className="w-24 px-2 py-1.5 rounded border border-gray-200 focus:border-[#4164a8] focus:outline-none text-sm font-bold"
                          />
                          <input
                            type="text" value={s.label} placeholder="Label"
                            onChange={e => {
                              const next = [...draft.stats];
                              next[i] = { ...next[i], label: e.target.value };
                              set(["stats"], next);
                            }}
                            className="flex-1 px-2 py-1.5 rounded border border-gray-200 focus:border-[#4164a8] focus:outline-none text-sm"
                          />
                          <button onClick={() => set(["stats"], draft.stats.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => set(["stats"], [...draft.stats, { value: "", label: "" }])}
                        className="flex items-center gap-1.5 text-[#4164a8] text-sm font-medium hover:underline"
                      >
                        <Plus size={14} /> Add Stat
                      </button>
                    </div>
                  </div>
                </Section>
              )}

              {/* ── ABOUT ── */}
              {activeTab === "about" && (
                <Section title="About Section" icon={FileText}>
                  <Field label="Title" value={draft.about.title} onChange={v => set(["about","title"], v)} />
                  <Field label="Description" value={draft.about.description} onChange={v => set(["about","description"], v)} type="textarea" rows={5} />
                  <Field label="Image URL" value={draft.about.image} onChange={v => set(["about","image"], v)} />
                  {draft.about.image && (
                    <img src={draft.about.image} alt="About" className="w-full h-48 object-cover rounded-lg border border-gray-200" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  )}
                </Section>
              )}

              {/* ── MANAGEMENT TEAM ── */}
              {activeTab === "team" && (
                <Section title="Management Team" icon={UserRound}>
                  <p className="text-xs text-gray-400 -mt-1">
                    Changes here are saved immediately — no need to click "Save Changes". Only active members appear on the public website.
                  </p>
                  <TeamManager token={token} />
                </Section>
              )}

              {/* ── PRODUCTS ── */}
              {activeTab === "products" && (
                <Section title="Products" icon={Package}>
                  {draft.products.map((p, i) => (
                    <div key={p.id} className="border border-gray-200 rounded-xl p-5 space-y-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#0f2a4e] text-sm">{p.name || `Product ${i + 1}`}</span>
                        <button onClick={() => set(["products"], draft.products.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <Field label="Name" value={p.name} onChange={v => { const next = [...draft.products]; next[i] = { ...next[i], name: v }; set(["products"], next); }} />
                      <Field label="Category" value={p.category} onChange={v => { const next = [...draft.products]; next[i] = { ...next[i], category: v }; set(["products"], next); }} />
                      <Field label="Description" value={p.description} onChange={v => { const next = [...draft.products]; next[i] = { ...next[i], description: v }; set(["products"], next); }} type="textarea" rows={3} />
                      <Field label="Image URL" value={p.image} onChange={v => { const next = [...draft.products]; next[i] = { ...next[i], image: v }; set(["products"], next); }} />
                      {p.image && <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-lg border border-gray-200" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Features</label>
                        <div className="space-y-1.5">
                          {p.features.map((f, fi) => (
                            <div key={fi} className="flex gap-2">
                              <input
                                type="text" value={f}
                                onChange={e => {
                                  const next = [...draft.products];
                                  const feats = [...next[i].features];
                                  feats[fi] = e.target.value;
                                  next[i] = { ...next[i], features: feats };
                                  set(["products"], next);
                                }}
                                className="flex-1 px-2 py-1.5 rounded border border-gray-200 focus:border-[#4164a8] focus:outline-none text-sm"
                              />
                              <button onClick={() => {
                                const next = [...draft.products];
                                next[i] = { ...next[i], features: next[i].features.filter((_, j) => j !== fi) };
                                set(["products"], next);
                              }} className="text-red-400 hover:text-red-600 p-1">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const next = [...draft.products];
                              next[i] = { ...next[i], features: [...next[i].features, ""] };
                              set(["products"], next);
                            }}
                            className="text-[#4164a8] text-xs font-medium hover:underline flex items-center gap-1"
                          >
                            <Plus size={12} /> Add feature
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => set(["products"], [...draft.products, { id: Date.now().toString(), name: "", category: "", description: "", features: [], image: "" }])}
                    className="flex items-center gap-2 border-2 border-dashed border-[#4164a8]/30 hover:border-[#4164a8]/60 text-[#4164a8] font-medium px-4 py-3 rounded-xl w-full justify-center transition-colors text-sm"
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </Section>
              )}

              {/* ── CERTIFICATIONS ── */}
              {activeTab === "certifications" && (
                <Section title="Certifications" icon={Award}>
                  {draft.certifications.map((c, i) => (
                    <div key={c.id} className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-[#0f2a4e]">{c.name || `Cert ${i + 1}`}</span>
                        <button onClick={() => set(["certifications"], draft.certifications.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                      <Field label="Name" value={c.name} onChange={v => { const next = [...draft.certifications]; next[i] = { ...next[i], name: v }; set(["certifications"], next); }} />
                      <Field label="Issuer" value={c.issuer} onChange={v => { const next = [...draft.certifications]; next[i] = { ...next[i], issuer: v }; set(["certifications"], next); }} />
                      <Field label="Year" value={c.year} onChange={v => { const next = [...draft.certifications]; next[i] = { ...next[i], year: v }; set(["certifications"], next); }} />
                    </div>
                  ))}
                  <button
                    onClick={() => set(["certifications"], [...draft.certifications, { id: Date.now().toString(), name: "", issuer: "", year: new Date().getFullYear().toString() }])}
                    className="flex items-center gap-2 border-2 border-dashed border-[#4164a8]/30 hover:border-[#4164a8]/60 text-[#4164a8] font-medium px-4 py-3 rounded-xl w-full justify-center transition-colors text-sm"
                  >
                    <Plus size={16} /> Add Certification
                  </button>
                </Section>
              )}

              {/* ── CLIENTS ── */}
              {activeTab === "clients" && (
                <Section title="Clients" icon={Users}>
                  {draft.clients.map((c, i) => (
                    <div key={c.id} className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50 flex gap-3">
                      <div className="flex-1 space-y-2">
                        <Field label="Company Name" value={c.name} onChange={v => { const next = [...draft.clients]; next[i] = { ...next[i], name: v }; set(["clients"], next); }} />
                        <Field label="Logo URL (optional)" value={c.logo} onChange={v => { const next = [...draft.clients]; next[i] = { ...next[i], logo: v }; set(["clients"], next); }} />
                      </div>
                      <button onClick={() => set(["clients"], draft.clients.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 self-start mt-5"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button
                    onClick={() => set(["clients"], [...draft.clients, { id: Date.now().toString(), name: "", logo: "" }])}
                    className="flex items-center gap-2 border-2 border-dashed border-[#4164a8]/30 hover:border-[#4164a8]/60 text-[#4164a8] font-medium px-4 py-3 rounded-xl w-full justify-center transition-colors text-sm"
                  >
                    <Plus size={16} /> Add Client
                  </button>
                </Section>
              )}

              {/* ── TESTIMONIALS ── */}
              {activeTab === "testimonials" && (
                <Section title="Testimonials" icon={Star}>
                  {draft.testimonials.map((t, i) => (
                    <div key={t.id} className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50">
                      <div className="flex justify-between">
                        <span className="font-semibold text-sm text-[#0f2a4e]">{t.author || `Testimonial ${i + 1}`}</span>
                        <button onClick={() => set(["testimonials"], draft.testimonials.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                      <Field label="Quote" value={t.quote} onChange={v => { const next = [...draft.testimonials]; next[i] = { ...next[i], quote: v }; set(["testimonials"], next); }} type="textarea" rows={3} />
                      <Field label="Author Name" value={t.author} onChange={v => { const next = [...draft.testimonials]; next[i] = { ...next[i], author: v }; set(["testimonials"], next); }} />
                      <Field label="Role / Title" value={t.role} onChange={v => { const next = [...draft.testimonials]; next[i] = { ...next[i], role: v }; set(["testimonials"], next); }} />
                      <Field label="Company" value={t.company} onChange={v => { const next = [...draft.testimonials]; next[i] = { ...next[i], company: v }; set(["testimonials"], next); }} />
                    </div>
                  ))}
                  <button
                    onClick={() => set(["testimonials"], [...draft.testimonials, { id: Date.now().toString(), quote: "", author: "", role: "", company: "" }])}
                    className="flex items-center gap-2 border-2 border-dashed border-[#4164a8]/30 hover:border-[#4164a8]/60 text-[#4164a8] font-medium px-4 py-3 rounded-xl w-full justify-center transition-colors text-sm"
                  >
                    <Plus size={16} /> Add Testimonial
                  </button>
                </Section>
              )}

              {/* ── CONTACT ── */}
              {activeTab === "contact" && (
                <Section title="Contact Information" icon={Phone}>
                  <Field label="Phone" value={draft.contact.phone} onChange={v => set(["contact","phone"], v)} />
                  <Field label="Email" value={draft.contact.email} onChange={v => set(["contact","email"], v)} type="email" />
                  <Field label="WhatsApp Number (with country code, digits only)" value={draft.contact.whatsapp} onChange={v => set(["contact","whatsapp"], v)} />
                  <Field label="Address" value={draft.contact.address} onChange={v => set(["contact","address"], v)} type="textarea" rows={2} />
                  <Field label="Google Maps Embed URL (optional)" value={draft.contact.mapEmbed} onChange={v => set(["contact","mapEmbed"], v)} />
                  {draft.contact.mapEmbed && (
                    <div className="rounded-lg overflow-hidden border border-gray-200 h-48">
                      <iframe src={draft.contact.mapEmbed} className="w-full h-full" allowFullScreen title="Map" />
                    </div>
                  )}
                </Section>
              )}

              {/* ── COMPANY ── */}
              {activeTab === "company" && (
                <Section title="Company Info" icon={Building2}>
                  <Field label="Company Name" value={draft.company.name} onChange={v => set(["company","name"], v)} />
                  <Field label="Tagline" value={draft.company.tagline} onChange={v => set(["company","tagline"], v)} />
                  <Field label="Founded Year" value={draft.company.founded} onChange={v => set(["company","founded"], v)} />
                  <Field label="Employees" value={draft.company.employees} onChange={v => set(["company","employees"], v)} />
                  <Field label="Total Clients Served" value={draft.company.totalClients} onChange={v => set(["company","totalClients"], v)} />
                </Section>
              )}

              {/* Save button at bottom */}
              <div className="flex items-center justify-between pt-4 pb-8">
                <p className="text-xs text-gray-400">Changes are not saved until you click Save Changes.</p>
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-2 bg-[#4164a8] hover:bg-[#345099] disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                  {updateMutation.isPending ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Save size={15} />}
                  Save Changes
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50">
          <Icon size={16} className="text-[#4164a8]" />
          <h2 className="font-bold text-[#0f2a4e] text-sm">{title}</h2>
        </div>
        <div className="p-6 space-y-4">{children}</div>
      </div>
    );
  }
  
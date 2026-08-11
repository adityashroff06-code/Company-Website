import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Trash2, Pencil, Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown,
  Star, Upload, X, UserRound,
} from "lucide-react";
import {
  fetchAllTeam, createTeamMember, updateTeamMember, deleteTeamMember,
  reorderTeam, uploadTeamPhoto, type TeamMember, type TeamMemberInput,
} from "@/lib/managementTeam";

const PAGE_SIZE = 6;

const emptyForm: Partial<TeamMemberInput> = {
  fullName: "",
  designation: "",
  department: "",
  shortDescription: "",
  biography: "",
  qualifications: "",
  experience: "",
  linkedinUrl: "",
  email: "",
  phone: "",
  profilePhoto: "",
  featured: false,
  status: "active",
};

function Input({ label, value, onChange, type = "text", rows = 3, hint }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {hint && <span className="normal-case font-normal text-gray-400">— {hint}</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value} onChange={e => onChange(e.target.value)} rows={rows}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none focus:ring-2 focus:ring-[#4164a8]/15 text-sm transition-all"
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

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
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

export default function TeamManager({ token }: { token: string }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<TeamMember | "new" | null>(null);
  const [form, setForm] = useState<Partial<TeamMemberInput>>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<TeamMember | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const queryKey = ["management-team", "admin"];
  const { data: members = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchAllTeam(token),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["management-team"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.fullName?.trim() || !form.designation?.trim()) {
        throw new Error("Full name and designation are required.");
      }
      if (editing && editing !== "new") {
        return updateTeamMember(token, editing.id, form);
      }
      return createTeamMember(token, form);
    },
    onSuccess: () => {
      invalidate();
      setEditing(null);
      setForm(emptyForm);
      setError("");
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeamMember(token, id),
    onSuccess: () => {
      invalidate();
      setConfirmDelete(null);
    },
    onError: (e: Error) => setError(e.message),
  });

  const toggleStatus = useMutation({
    mutationFn: (m: TeamMember) =>
      updateTeamMember(token, m.id, { status: m.status === "active" ? "inactive" : "active" }),
    onSuccess: invalidate,
  });

  const moveMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: -1 | 1 }) => {
      const sorted = [...members].sort((a, b) => a.displayOrder - b.displayOrder);
      const index = sorted.findIndex(m => m.id === id);
      const swapWith = index + direction;
      if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return;
      const orders = sorted.map((m, i) => {
        let pos = i;
        if (i === index) pos = swapWith;
        else if (i === swapWith) pos = index;
        return { id: m.id, displayOrder: pos + 1 };
      });
      await reorderTeam(token, orders);
    },
    onSuccess: invalidate,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...members].sort((a, b) => a.displayOrder - b.displayOrder);
    if (!q) return sorted;
    return sorted.filter(
      m => m.fullName.toLowerCase().includes(q) || m.designation.toLowerCase().includes(q),
    );
  }, [members, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({ ...m });
    setError("");
  };

  const openNew = () => {
    setEditing("new");
    setForm(emptyForm);
    setError("");
  };

  const setField = (key: keyof TeamMemberInput, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handlePhotoFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const url = await uploadTeamPhoto(token, file);
      setField("profilePhoto", url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Edit / create form ──
  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#0f2a4e]">{editing === "new" ? "Add Team Member" : `Edit: ${editing.fullName}`}</h3>
          <button onClick={() => { setEditing(null); setError(""); }} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">{error}</div>}

        {/* Photo */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Profile Photo</label>
          <div className="flex items-center gap-4">
            {form.profilePhoto ? (
              <img src={form.profilePhoto} alt="Preview" className="w-20 h-20 rounded-xl object-cover object-top border border-gray-200" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                <UserRound size={26} className="text-gray-300" />
              </div>
            )}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 text-sm font-medium text-[#4164a8] border border-[#4164a8]/30 hover:border-[#4164a8]/70 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {uploading ? <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-[#4164a8] border-t-transparent" /> : <Upload size={14} />}
                {uploading ? "Uploading…" : "Upload Photo"}
              </button>
              {form.profilePhoto && (
                <button type="button" onClick={() => setField("profilePhoto", "")} className="block text-xs text-red-400 hover:text-red-600">
                  Remove photo
                </button>
              )}
            </div>
            <input
              ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); e.target.value = ""; }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name *" value={form.fullName ?? ""} onChange={v => setField("fullName", v)} />
          <Input label="Designation *" value={form.designation ?? ""} onChange={v => setField("designation", v)} />
          <Input label="Department" value={form.department ?? ""} onChange={v => setField("department", v)} />
          <Input label="LinkedIn URL" value={form.linkedinUrl ?? ""} onChange={v => setField("linkedinUrl", v)} />
          <Input label="Email" type="email" value={form.email ?? ""} onChange={v => setField("email", v)} />
          <Input label="Phone" value={form.phone ?? ""} onChange={v => setField("phone", v)} />
        </div>

        <Input label="Description" hint="Shown on the card. Use **text** for bold, and leave a blank line between paragraphs." type="textarea" rows={6}
          value={form.shortDescription ?? ""} onChange={v => setField("shortDescription", v)} />
        <Input label="Detailed Biography" type="textarea" rows={6}
          value={form.biography ?? ""} onChange={v => setField("biography", v)} />
        <Input label="Qualifications" type="textarea" rows={3}
          value={form.qualifications ?? ""} onChange={v => setField("qualifications", v)} />
        <Input label="Experience" type="textarea" rows={3}
          value={form.experience ?? ""} onChange={v => setField("experience", v)} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Switch label="Active on website" checked={form.status !== "inactive"}
            onChange={v => setField("status", v ? "active" : "inactive")} />
          <Switch label="Featured member" checked={!!form.featured} onChange={v => setField("featured", v)} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || uploading}
            className="flex items-center gap-2 bg-[#4164a8] hover:bg-[#345099] disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            {saveMutation.isPending && <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
            {editing === "new" ? "Add Member" : "Save Member"}
          </button>
          <button onClick={() => { setEditing(null); setError(""); }} className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── List ──
  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or designation…"
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:border-[#4164a8] focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 bg-[#4164a8] hover:bg-[#345099] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors self-start"
        >
          <Plus size={15} /> Add Member
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading team members…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
          <UserRound size={26} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            {search ? "No members match your search." : "No team members yet. Click \"Add Member\" to create the first profile."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {pageItems.map(m => {
            const sorted = [...members].sort((a, b) => a.displayOrder - b.displayOrder);
            const idx = sorted.findIndex(s => s.id === m.id);
            return (
              <div key={m.id} className={`flex items-center gap-3 border rounded-xl p-3 ${m.status === "active" ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200 opacity-70"}`}>
                {/* Order controls */}
                <div className="flex flex-col">
                  <button
                    onClick={() => moveMutation.mutate({ id: m.id, direction: -1 })}
                    disabled={idx === 0 || moveMutation.isPending || !!search}
                    title={search ? "Clear search to reorder" : "Move up"}
                    className="text-gray-300 hover:text-[#4164a8] disabled:opacity-30 p-0.5"
                  ><ArrowUp size={14} /></button>
                  <button
                    onClick={() => moveMutation.mutate({ id: m.id, direction: 1 })}
                    disabled={idx === sorted.length - 1 || moveMutation.isPending || !!search}
                    title={search ? "Clear search to reorder" : "Move down"}
                    className="text-gray-300 hover:text-[#4164a8] disabled:opacity-30 p-0.5"
                  ><ArrowDown size={14} /></button>
                </div>

                {m.profilePhoto ? (
                  <img src={m.profilePhoto} alt={m.fullName} className="w-11 h-11 rounded-lg object-cover object-top border border-gray-200 shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <UserRound size={18} className="text-gray-300" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-[#0f2a4e] truncate">{m.fullName}</p>
                    {m.featured && <Star size={12} className="text-amber-400 shrink-0" fill="currentColor" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.designation}{m.department ? ` · ${m.department}` : ""}</p>
                </div>

                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${m.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-200 text-gray-500"}`}>
                  {m.status === "active" ? "Active" : "Inactive"}
                </span>

                <button
                  onClick={() => toggleStatus.mutate(m)}
                  disabled={toggleStatus.isPending}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${m.status === "active" ? "bg-[#4164a8]" : "bg-gray-300"}`}
                  title={m.status === "active" ? "Deactivate" : "Activate"}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${m.status === "active" ? "translate-x-4" : "translate-x-0"}`} />
                </button>

                <button onClick={() => openEdit(m)} className="text-gray-400 hover:text-[#4164a8] p-1.5" title="Edit"><Pencil size={15} /></button>
                <button onClick={() => setConfirmDelete(m)} className="text-gray-400 hover:text-red-500 p-1.5" title="Delete"><Trash2 size={15} /></button>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
            className="p-1.5 text-gray-400 hover:text-[#4164a8] disabled:opacity-30"><ChevronLeft size={16} /></button>
          <span className="text-xs text-gray-500">Page {safePage} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
            className="p-1.5 text-gray-400 hover:text-[#4164a8] disabled:opacity-30"><ChevronRight size={16} /></button>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h4 className="font-bold text-[#0f2a4e] mb-2">Delete team member?</h4>
            <p className="text-sm text-gray-500 mb-5">
              This will permanently remove <span className="font-semibold text-[#0f2a4e]">{confirmDelete.fullName}</span> from the website. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete.id)}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {deleteMutation.isPending && <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

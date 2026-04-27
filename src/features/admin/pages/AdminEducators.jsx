import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Save, X, ExternalLink, Loader2, RefreshCw } from "lucide-react"
import { adminGetEducators, adminUpsertEducator, adminDeleteEducator } from "@database/services/admin"
import { useRealtimeSync } from "@hooks/useRealtimeSync"

const EMPTY_FORM = {
    name: "", tagline: "", subject: "", exam_focus: [], platform: "YouTube",
    language: [], level: "All Levels", is_famous: false,
    curator_note: "", primary_link: "", playlist_links: [],
}

export default function AdminEducators() {
    const [educators, setEducators] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            const { records } = await adminGetEducators()
            setEducators(records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadData() }, [loadData])
    useRealtimeSync("educators", () => loadData())

    const startEdit = (edu) => { setForm({ ...edu }); setEditingId(edu.id); setShowForm(true) }
    const startNew = () => { setForm({ ...EMPTY_FORM }); setEditingId(null); setShowForm(true) }

    const handleSave = async () => {
        try {
            setSaving(true)
            const saved = await adminUpsertEducator(form)
            if (editingId) {
                setEducators(prev => prev.map(e => e.id === editingId ? saved : e))
            } else {
                setEducators(prev => [...prev, saved])
            }
            setShowForm(false); setEditingId(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await adminDeleteEducator(id)
            setEducators(prev => prev.filter(e => e.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    const addPlaylist = () => setForm(f => ({ ...f, playlist_links: [...(f.playlist_links || []), { title: "", url: "" }] }))
    const updatePlaylist = (idx, field, val) => setForm(f => ({ ...f, playlist_links: (f.playlist_links || []).map((p, i) => i === idx ? { ...p, [field]: val } : p) }))
    const removePlaylist = (idx) => setForm(f => ({ ...f, playlist_links: (f.playlist_links || []).filter((_, i) => i !== idx) }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Educator CMS</h1>
                    <p className="text-[11px] text-slate-600 mt-1">{educators.length} educators</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={startNew}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/15 transition">
                        <Plus size={14} /> Add Educator
                    </button>
                    <button onClick={loadData} disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 transition text-xs font-medium">
                        {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    </button>
                </div>
            </div>

            {error && <div className="rounded-xl bg-rose-500/8 border border-rose-500/15 px-4 py-3 text-xs text-rose-400">{error}</div>}

            {/* Editor Form */}
            {showForm && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-indigo-500/15 bg-[#0d0e1a] p-5 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-white">{editingId ? "Edit Educator" : "New Educator"}</h2>
                        <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-500"><X size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormInput label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                        <FormInput label="Tagline" value={form.tagline} onChange={v => setForm(f => ({ ...f, tagline: v }))} />
                        <FormInput label="Subject" value={form.subject} onChange={v => setForm(f => ({ ...f, subject: v }))} />
                        <FormInput label="Primary Link" value={form.primary_link} onChange={v => setForm(f => ({ ...f, primary_link: v }))} />
                        <FormSelect label="Platform" value={form.platform} options={["YouTube", "Telegram", "Website", "Unacademy", "PW", "Other"]}
                            onChange={v => setForm(f => ({ ...f, platform: v }))} />
                        <FormSelect label="Level" value={form.level} options={["Beginner", "Intermediate", "Advanced", "All Levels"]}
                            onChange={v => setForm(f => ({ ...f, level: v }))} />
                        <FormInput label="Exams (comma-separated)" value={(form.exam_focus || []).join(", ")}
                            onChange={v => setForm(f => ({ ...f, exam_focus: v.split(",").map(s => s.trim()).filter(Boolean) }))} />
                        <FormInput label="Languages (comma-separated)" value={(form.language || []).join(", ")}
                            onChange={v => setForm(f => ({ ...f, language: v.split(",").map(s => s.trim()).filter(Boolean) }))} />
                    </div>
                    <div>
                        <label className="text-[9px] text-slate-600 font-black uppercase tracking-wider block mb-1">Curator Note</label>
                        <textarea value={form.curator_note} onChange={e => setForm(f => ({ ...f, curator_note: e.target.value }))}
                            className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-xs text-slate-300 outline-none resize-none h-16 focus:border-indigo-500/40 transition placeholder:text-slate-700" />
                    </div>
                    {/* Playlist Links */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Playlist Links</label>
                            <button onClick={addPlaylist} className="text-[10px] text-indigo-400 font-bold hover:underline">+ Add Link</button>
                        </div>
                        <div className="space-y-2">
                            {(form.playlist_links || []).map((pl, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input value={pl.title} onChange={e => updatePlaylist(idx, "title", e.target.value)} placeholder="Title"
                                        className="flex-1 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500/40" />
                                    <input value={pl.url} onChange={e => updatePlaylist(idx, "url", e.target.value)} placeholder="URL"
                                        className="flex-[2] rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500/40" />
                                    <button onClick={() => removePlaylist(idx)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-400"><Trash2 size={13} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                        <input type="checkbox" checked={form.is_famous} onChange={e => setForm(f => ({ ...f, is_famous: e.target.checked }))} className="accent-indigo-500" />
                        Mark as Famous
                    </label>
                    <button onClick={handleSave} disabled={saving}
                        className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2.5 text-xs font-bold hover:bg-emerald-500/15 transition flex items-center gap-2 disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {editingId ? "Update" : "Create"} Educator
                    </button>
                </motion.div>
            )}

            {/* Table */}
            {loading && educators.length === 0 ? (
                <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl bg-white/[0.02] animate-pulse" />)}</div>
            ) : (
                <div className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.04]">
                                {["Educator", "Subject", "Platform", "Playlists", "Upvotes", "Actions"].map(h => (
                                    <th key={h} className="text-left text-[9px] font-black uppercase tracking-wider text-slate-600 px-5 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {educators.map((edu, i) => (
                                <tr key={edu.id} className={`border-b border-white/[0.02] ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-white/[0.03] transition`}>
                                    <td className="px-5 py-3">
                                        <p className="text-xs font-semibold text-white">{edu.name}</p>
                                        <p className="text-[10px] text-slate-600">{edu.tagline}</p>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-slate-400">{edu.subject}</td>
                                    <td className="px-5 py-3">
                                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">{edu.platform}</span>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{(edu.playlist_links || []).length} links</td>
                                    <td className="px-5 py-3 text-xs font-bold text-amber-400">{edu.upvotes || 0}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => startEdit(edu)} className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-600 hover:text-indigo-400 transition"><Pencil size={13} /></button>
                                            <button onClick={() => handleDelete(edu.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 transition"><Trash2 size={13} /></button>
                                            {edu.primary_link && <a href={edu.primary_link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-600 hover:text-slate-300 transition"><ExternalLink size={13} /></a>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {educators.length === 0 && (
                                <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-600">No educators yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

function FormInput({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label className="text-[9px] text-slate-600 font-black uppercase tracking-wider block mb-1">{label}</label>
            <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500/40 transition placeholder:text-slate-700" />
        </div>
    )
}

function FormSelect({ label, value, options, onChange }) {
    return (
        <div>
            <label className="text-[9px] text-slate-600 font-black uppercase tracking-wider block mb-1">{label}</label>
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500/40 transition appearance-none">
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    )
}

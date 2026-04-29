import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { Building2, Plus, Pencil, Trash2, Save, X, Star, Loader2, RefreshCw } from "lucide-react"
import { adminGetColleges, adminUpsertCollege, adminDeleteCollege, adminToggleFeatured } from "@database/services/admin"
import { useRealtimeSync } from "@hooks/useRealtimeSync"

const EMPTY = { name: "", city: "", state: "", admission_mode: "", is_featured: false, website: "" }

export default function AdminColleges() {
    const [colleges, setColleges] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            const { records } = await adminGetColleges()
            setColleges(records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadData() }, [loadData])
    useRealtimeSync("colleges", () => loadData())

    const startEdit = (c) => { setForm({ ...c }); setEditingId(c.id); setShowForm(true) }
    const startNew = () => { setForm({ ...EMPTY }); setEditingId(null); setShowForm(true) }

    const handleSave = async () => {
        try {
            setSaving(true)
            const saved = await adminUpsertCollege(form)
            if (editingId) {
                setColleges(prev => prev.map(c => c.id === editingId ? saved : c))
            } else {
                setColleges(prev => [...prev, saved])
            }
            setShowForm(false); setEditingId(null)
        } catch (err) { setError(err.message) }
        finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        try { await adminDeleteCollege(id); setColleges(prev => prev.filter(c => c.id !== id)) }
        catch (err) { setError(err.message) }
    }

    const handleToggleFeatured = async (id, val) => {
        try { await adminToggleFeatured(id, val); setColleges(prev => prev.map(c => c.id === id ? { ...c, is_featured: val } : c)) }
        catch (err) { setError(err.message) }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">College CMS</h1>
                    <p className="text-[14px] text-slate-600 mt-1">{colleges.length} colleges</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={startNew}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/15 transition">
                        <Plus size={14} /> Add College
                    </button>
                    <button onClick={loadData} disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 transition text-xs font-medium">
                        {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    </button>
                </div>
            </div>

            {error && <div className="rounded-xl bg-rose-500/8 border border-rose-500/15 px-4 py-3 text-xs text-rose-400">{error}</div>}

            {showForm && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-indigo-500/15 bg-[#0d0e1a] p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-white">{editingId ? "Edit" : "New"} College</h2>
                        <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-500"><X size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[["Name", "name"], ["City", "city"], ["State", "state"], ["Admission Mode", "admission_mode"], ["Website", "website"]].map(([label, key]) => (
                            <div key={key}>
                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-wider block mb-1">{label}</label>
                                <input type="text" value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500/40 transition" />
                            </div>
                        ))}
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                        <input type="checkbox" checked={form.is_featured || false} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="accent-indigo-500" />
                        Featured
                    </label>
                    <button onClick={handleSave} disabled={saving}
                        className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2.5 text-xs font-bold hover:bg-emerald-500/15 transition flex items-center gap-2 disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {editingId ? "Update" : "Create"}
                    </button>
                </motion.div>
            )}

            {loading && colleges.length === 0 ? (
                <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl bg-white/[0.02] animate-pulse" />)}</div>
            ) : (
                <div className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] overflow-hidden">
                    <table className="w-full">
                        <thead><tr className="border-b border-white/[0.04]">
                            {["College", "City", "State", "Admission", "Featured", "Actions"].map(h => (
                                <th key={h} className="text-left text-[9px] font-black uppercase tracking-wider text-slate-600 px-5 py-3">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {colleges.map((c, i) => (
                                <tr key={c.id} className={`border-b border-white/[0.02] ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-white/[0.03] transition`}>
                                    <td className="px-5 py-3 text-xs font-semibold text-white">{c.name}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{c.city || "—"}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{c.state || "—"}</td>
                                    <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">{c.admission_mode || "—"}</span></td>
                                    <td className="px-5 py-3">
                                        <button onClick={() => handleToggleFeatured(c.id, !c.is_featured)}
                                            className={`p-1 rounded-lg transition ${c.is_featured ? "text-amber-400 hover:text-amber-300" : "text-slate-700 hover:text-amber-400"}`}>
                                            <Star size={14} fill={c.is_featured ? "currentColor" : "none"} />
                                        </button>
                                    </td>
                                    <td className="px-5 py-3"><div className="flex gap-1">
                                        <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-600 hover:text-indigo-400"><Pencil size={12} /></button>
                                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-400"><Trash2 size={12} /></button>
                                    </div></td>
                                </tr>
                            ))}
                            {colleges.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-600">No colleges yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

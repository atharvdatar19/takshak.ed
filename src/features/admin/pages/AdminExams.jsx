import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { Clock, Plus, Pencil, Trash2, Save, X, Loader2, RefreshCw } from "lucide-react"
import { adminGetExams, adminUpsertExam, adminDeleteExam } from "@database/services/admin"
import { useRealtimeSync } from "@hooks/useRealtimeSync"

const EMPTY = { name: "", stream: "", start_date: "", end_date: "", priority: 1, is_national: true }

export default function AdminExams() {
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            const { records } = await adminGetExams()
            setExams(records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadData() }, [loadData])
    useRealtimeSync("exams_timeline", () => loadData())

    const startEdit = (e) => { setForm({ ...e }); setEditingId(e.id); setShowForm(true) }
    const startNew = () => { setForm({ ...EMPTY }); setEditingId(null); setShowForm(true) }

    const handleSave = async () => {
        try {
            setSaving(true)
            const saved = await adminUpsertExam(form)
            if (editingId) { setExams(prev => prev.map(e => e.id === editingId ? saved : e)) }
            else { setExams(prev => [...prev, saved]) }
            setShowForm(false); setEditingId(null)
        } catch (err) { setError(err.message) }
        finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        try { await adminDeleteExam(id); setExams(prev => prev.filter(e => e.id !== id)) }
        catch (err) { setError(err.message) }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Exam Timeline</h1>
                    <p className="text-[14px] text-slate-600 mt-1">{exams.length} exams</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={startNew}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/15 transition">
                        <Plus size={14} /> Add Exam
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
                        <h2 className="text-sm font-bold text-white">{editingId ? "Edit" : "New"} Exam</h2>
                        <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-500"><X size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[["Exam Name", "name", "text"], ["Stream", "stream", "text"], ["Start Date", "start_date", "date"], ["End Date", "end_date", "date"]].map(([label, key, type]) => (
                            <div key={key}>
                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-wider block mb-1">{label}</label>
                                <input type={type} value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500/40 transition" />
                            </div>
                        ))}
                        <div>
                            <label className="text-[9px] text-slate-600 font-black uppercase tracking-wider block mb-1">Priority</label>
                            <input type="number" min={0} max={5} value={form.priority || 1} onChange={e => setForm(f => ({ ...f, priority: parseInt(e.target.value) || 1 }))}
                                className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500/40 transition" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                        <input type="checkbox" checked={form.is_national !== false} onChange={e => setForm(f => ({ ...f, is_national: e.target.checked }))} className="accent-indigo-500" />
                        National Exam
                    </label>
                    <button onClick={handleSave} disabled={saving}
                        className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2.5 text-xs font-bold hover:bg-emerald-500/15 transition flex items-center gap-2 disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {editingId ? "Update" : "Create"}
                    </button>
                </motion.div>
            )}

            {loading && exams.length === 0 ? (
                <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl bg-white/[0.02] animate-pulse" />)}</div>
            ) : (
                <div className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] overflow-hidden">
                    <table className="w-full">
                        <thead><tr className="border-b border-white/[0.04]">
                            {["Exam", "Stream", "Start", "End", "Priority", "National", "Actions"].map(h => (
                                <th key={h} className="text-left text-[9px] font-black uppercase tracking-wider text-slate-600 px-5 py-3">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {exams.map((e, i) => (
                                <tr key={e.id} className={`border-b border-white/[0.02] ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-white/[0.03] transition`}>
                                    <td className="px-5 py-3 text-xs font-semibold text-white">{e.name}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{e.stream || "—"}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{e.start_date || "—"}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{e.end_date || "—"}</td>
                                    <td className="px-5 py-3 text-xs text-amber-400 font-bold">P{e.priority || 0}</td>
                                    <td className="px-5 py-3">{e.is_national && <span className="text-emerald-400 text-[10px]">✓</span>}</td>
                                    <td className="px-5 py-3"><div className="flex gap-1">
                                        <button onClick={() => startEdit(e)} className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-600 hover:text-indigo-400"><Pencil size={12} /></button>
                                        <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-400"><Trash2 size={12} /></button>
                                    </div></td>
                                </tr>
                            ))}
                            {exams.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-xs text-slate-600">No exams yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

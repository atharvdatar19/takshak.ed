import { useCallback, useEffect, useState } from "react"
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react"
import {
    adminGetExams,
    adminUpsertExam,
    adminDeleteExam,
} from "../../services/admin"

const EMPTY_EXAM = {
    title: "",
    event_type: "",
    stream: "",
    target_exam: "",
    start_date: "",
    end_date: "",
    state: "",
    is_national: true,
    priority: 0,
    official_link: "",
}

export default function ExamManager() {
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [streamFilter, setStreamFilter] = useState("")
    const [editing, setEditing] = useState(null)
    const [saving, setSaving] = useState(false)
    const [showImport, setShowImport] = useState(false)
    const [csvText, setCsvText] = useState("")
    const [importStatus, setImportStatus] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const result = await adminGetExams()
            setExams(result.records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const filtered = exams.filter(e =>
        !streamFilter || e.stream === streamFilter,
    )

    async function handleSave() {
        setSaving(true)
        try {
            const payload = { ...editing }
            payload.priority = Number(payload.priority) || 0
            if (!payload.id) delete payload.id
            await adminUpsertExam(payload)
            setEditing(null)
            await load()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this exam entry?")) return
        try {
            await adminDeleteExam(id)
            await load()
        } catch (err) {
            setError(err.message)
        }
    }

    async function handleBulkImport() {
        const lines = csvText.trim().split("\n").filter(Boolean)
        if (lines.length === 0) return

        setImportStatus("Importing...")
        let imported = 0
        let failed = 0

        for (const line of lines) {
            const parts = line.split(",").map(s => s.trim())
            if (parts.length < 4) { failed++; continue }

            const [title, stream, event_type, start_date, end_date, is_national, priority] = parts
            try {
                await adminUpsertExam({
                    title,
                    stream: stream || "",
                    event_type: event_type || "exam",
                    start_date: start_date || "",
                    end_date: end_date || start_date || "",
                    is_national: is_national?.toLowerCase() !== "false",
                    priority: Number(priority) || 0,
                })
                imported++
            } catch { failed++ }
        }

        setImportStatus(`Done: ${imported} imported, ${failed} failed`)
        setCsvText("")
        setTimeout(() => setImportStatus(""), 5000)
        await load()
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-200" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>
            )}

            <div className="flex flex-wrap items-center gap-3">
                <select
                    value={streamFilter}
                    onChange={e => setStreamFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">All Streams</option>
                    <option value="PCM">PCM</option>
                    <option value="PCB">PCB</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="Defence">Defence</option>
                </select>
                <button
                    type="button"
                    onClick={() => setEditing({ ...EMPTY_EXAM })}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                    <Plus size={14} /> Add Exam
                </button>
                <button
                    type="button"
                    onClick={() => setShowImport(prev => !prev)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    <Upload size={14} /> Bulk Import
                </button>
            </div>

            {/* ── Bulk Import Section ── */}
            {showImport && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 space-y-3">
                    <p className="text-sm font-medium text-indigo-900">Paste CSV data — one exam per line:</p>
                    <p className="text-xs text-indigo-600">Format: title, stream, event_type, start_date, end_date, is_national, priority</p>
                    <textarea
                        value={csvText}
                        onChange={e => setCsvText(e.target.value)}
                        rows={5}
                        placeholder={"JEE Main 2025, PCM, exam, 2025-04-01, 2025-04-15, true, 10\nNEET 2025, PCB, exam, 2025-05-04, 2025-05-04, true, 10"}
                        className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-indigo-400"
                    />
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleBulkImport}
                            disabled={!csvText.trim()}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            Import All
                        </button>
                        {importStatus && (
                            <span className="text-sm font-medium text-indigo-700">{importStatus}</span>
                        )}
                    </div>
                </div>
            )}

            <p className="text-xs text-slate-500">
                Showing {filtered.length} of {exams.length} exams
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-600">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Stream</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Start</th>
                            <th className="px-4 py-3">End</th>
                            <th className="px-4 py-3 text-center">National</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(exam => (
                            <tr key={exam.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-900">{exam.title}</td>
                                <td className="px-4 py-3 text-slate-600">{exam.stream || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{exam.event_type || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{exam.start_date || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{exam.end_date || "—"}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${exam.is_national ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                        {exam.is_national ? "Yes" : "No"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="inline-flex gap-2">
                                        <button type="button" onClick={() => setEditing({ ...exam })} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
                                            <Pencil size={14} />
                                        </button>
                                        <button type="button" onClick={() => handleDelete(exam.id)} className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No exams found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Edit Modal ── */}
            {editing !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="relative mx-4 w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">{editing.id ? "Edit Exam" : "Add Exam"}</h3>
                            <button type="button" onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Title" value={editing.title} set={v => setEditing(p => ({ ...p, title: v }))} />
                            <Field label="Event Type" value={editing.event_type} set={v => setEditing(p => ({ ...p, event_type: v }))} />
                            <Field label="Stream" value={editing.stream} set={v => setEditing(p => ({ ...p, stream: v }))} />
                            <Field label="Target Exam" value={editing.target_exam} set={v => setEditing(p => ({ ...p, target_exam: v }))} />
                            <Field label="Start Date" value={editing.start_date} set={v => setEditing(p => ({ ...p, start_date: v }))} type="date" />
                            <Field label="End Date" value={editing.end_date} set={v => setEditing(p => ({ ...p, end_date: v }))} type="date" />
                            <Field label="State" value={editing.state} set={v => setEditing(p => ({ ...p, state: v }))} />
                            <Field label="Priority" value={editing.priority} set={v => setEditing(p => ({ ...p, priority: v }))} type="number" />
                        </div>
                        <Field label="Official Link" value={editing.official_link} set={v => setEditing(p => ({ ...p, official_link: v }))} />

                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={editing.is_national}
                                onChange={e => setEditing(p => ({ ...p, is_national: e.target.checked }))}
                                className="rounded border-slate-300"
                            />
                            National Exam
                        </label>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Cancel</button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || !editing.title}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function Field({ label, value, set, type = "text" }) {
    return (
        <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
            <input
                type={type}
                value={value || ""}
                onChange={e => set(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
        </label>
    )
}

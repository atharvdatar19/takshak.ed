import { useCallback, useEffect, useState } from "react"
import { Pencil, Plus, Star, Trash2, X } from "lucide-react"
import {
    adminGetColleges,
    adminUpsertCollege,
    adminDeleteCollege,
    adminToggleFeatured,
} from "../../services/admin"

const EMPTY_COLLEGE = {
    name: "",
    state: "",
    city: "",
    type: "",
    streams_supported: [],
    admission_mode: "",
    application_start: "",
    application_end: "",
    is_featured: false,
    official_link: "",
}

export default function CollegeManager() {
    const [colleges, setColleges] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [editing, setEditing] = useState(null)
    const [saving, setSaving] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const result = await adminGetColleges()
            setColleges(result.records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const filtered = colleges.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()),
    )

    async function handleSave() {
        setSaving(true)
        try {
            const payload = { ...editing }
            if (typeof payload.streams_supported === "string") {
                payload.streams_supported = payload.streams_supported
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean)
            }
            if (!payload.id) delete payload.id
            await adminUpsertCollege(payload)
            setEditing(null)
            await load()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this college?")) return
        try {
            await adminDeleteCollege(id)
            await load()
        } catch (err) {
            setError(err.message)
        }
    }

    async function handleToggleFeatured(id, current) {
        try {
            await adminToggleFeatured(id, !current)
            setColleges(prev =>
                prev.map(c => (c.id === id ? { ...c, is_featured: !current } : c)),
            )
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-lg bg-surface-container-high" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-lg border border-error/20 bg-error/10 px-4 py-2 text-sm text-error">
                    {error}
                </div>
            )}

            {/* ── Top Bar ── */}
            <div className="flex flex-wrap items-center gap-3">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search colleges..."
                    className="flex-1 rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                    type="button"
                    onClick={() => setEditing({ ...EMPTY_COLLEGE })}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/100"
                >
                    <Plus size={14} /> Add College
                </button>
            </div>

            <p className="text-xs text-on-surface-variant">
                Showing {filtered.length} of {colleges.length} colleges
            </p>

            {/* ── Table ── */}
            <div className="overflow-x-auto rounded-xl border border-outline-variant/20 glass shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-outline-variant/20 bg-surface-container-low text-left text-xs font-semibold text-on-surface-variant">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Mode</th>
                            <th className="px-4 py-3">End Date</th>
                            <th className="px-4 py-3 text-center">Featured</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(college => (
                            <tr key={college.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low">
                                <td className="px-4 py-3 font-medium text-on-surface">{college.name}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{college.city}, {college.state}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{college.admission_mode || "—"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{college.application_end || "—"}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFeatured(college.id, college.is_featured)}
                                        className={`rounded-full p-1 transition ${college.is_featured ? "text-tertiary hover:text-amber-600" : "text-on-surface-variant/40 hover:text-tertiary"}`}
                                        title={college.is_featured ? "Remove featured" : "Mark as featured"}
                                    >
                                        <Star size={16} fill={college.is_featured ? "currentColor" : "none"} />
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="inline-flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditing({
                                                ...college,
                                                streams_supported: Array.isArray(college.streams_supported)
                                                    ? college.streams_supported.join(", ")
                                                    : college.streams_supported || "",
                                            })}
                                            className="rounded-lg p-1 text-on-surface-variant/60 transition hover:bg-surface-container hover:text-primary"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(college.id)}
                                            className="rounded-lg p-1 text-on-surface-variant/60 transition hover:bg-error/10 hover:text-error"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-sm text-on-surface-variant/60">
                                    No colleges found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Edit Modal ── */}
            {editing !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="relative mx-4 w-full max-w-lg space-y-4 rounded-2xl glass p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-on-surface">
                                {editing.id ? "Edit College" : "Add College"}
                            </h3>
                            <button type="button" onClick={() => setEditing(null)} className="text-on-surface-variant/60 hover:text-on-surface-variant">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <FormField label="Name" value={editing.name} onChange={v => setEditing(p => ({ ...p, name: v }))} />
                            <FormField label="State" value={editing.state} onChange={v => setEditing(p => ({ ...p, state: v }))} />
                            <FormField label="City" value={editing.city} onChange={v => setEditing(p => ({ ...p, city: v }))} />
                            <FormField label="Type" value={editing.type} onChange={v => setEditing(p => ({ ...p, type: v }))} />
                            <FormField label="Admission Mode" value={editing.admission_mode} onChange={v => setEditing(p => ({ ...p, admission_mode: v }))} />
                            <FormField label="Official Link" value={editing.official_link} onChange={v => setEditing(p => ({ ...p, official_link: v }))} />
                            <FormField label="Application Start" value={editing.application_start} onChange={v => setEditing(p => ({ ...p, application_start: v }))} type="date" />
                            <FormField label="Application End" value={editing.application_end} onChange={v => setEditing(p => ({ ...p, application_end: v }))} type="date" />
                        </div>
                        <FormField
                            label="Streams (comma separated)"
                            value={typeof editing.streams_supported === "string" ? editing.streams_supported : (editing.streams_supported || []).join(", ")}
                            onChange={v => setEditing(p => ({ ...p, streams_supported: v }))}
                            full
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className="rounded-lg border border-outline-variant/20 px-4 py-2 text-sm transition hover:bg-surface-container-low"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || !editing.name}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/100 disabled:opacity-50"
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

function FormField({ label, value, onChange, type = "text", full = false }) {
    return (
        <label className={full ? "sm:col-span-2" : ""}>
            <span className="mb-1 block text-xs font-medium text-on-surface-variant">{label}</span>
            <input
                type={type}
                value={value || ""}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary"
            />
        </label>
    )
}

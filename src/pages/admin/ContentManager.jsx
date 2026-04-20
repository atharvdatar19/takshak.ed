import { useCallback, useEffect, useState } from "react"
import {
    Save, RotateCcw, Plus, Trash2, ChevronDown, ChevronUp,
    CheckCircle2, AlertTriangle, Megaphone, Users, DollarSign, Quote,
} from "lucide-react"
import { getSiteContent, updateSiteContent, resetToDefault } from "../../services/siteContent"

const SECTIONS = [
    { key: "announcements", label: "Announcements", icon: Megaphone, description: "Site-wide banners and alerts" },
    { key: "defenceMentors", label: "Defence Mentors", icon: Users, description: "Edit Raghav & Hemant profiles" },
    { key: "defencePricing", label: "Defence Pricing", icon: DollarSign, description: "Update plan prices and names" },
    { key: "motivationalQuotes", label: "Dashboard Quotes", icon: Quote, description: "Motivational quotes on dashboard" },
]

export default function ContentManager() {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(null)
    const [saved, setSaved] = useState(null)
    const [expanded, setExpanded] = useState("defenceMentors")

    const load = useCallback(async () => {
        setLoading(true)
        const result = {}
        for (const section of SECTIONS) {
            result[section.key] = await getSiteContent(section.key)
        }
        setData(result)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    async function handleSave(key) {
        setSaving(key)
        await updateSiteContent(key, data[key])
        setSaving(null)
        setSaved(key)
        setTimeout(() => setSaved(null), 2000)
    }

    function handleReset(key) {
        if (!confirm(`Reset "${key}" to defaults? This will discard your changes.`)) return
        const defaults = resetToDefault(key)
        setData(prev => ({ ...prev, [key]: defaults }))
    }

    function updateField(sectionKey, index, field, value) {
        setData(prev => {
            const copy = { ...prev }
            const arr = [...(copy[sectionKey] || [])]
            arr[index] = { ...arr[index], [field]: value }
            copy[sectionKey] = arr
            return copy
        })
    }

    function addItem(sectionKey) {
        setData(prev => {
            const copy = { ...prev }
            const arr = [...(copy[sectionKey] || [])]
            if (sectionKey === "announcements") {
                arr.push({ id: Date.now().toString(), text: "New announcement", type: "info", active: true })
            } else if (sectionKey === "motivationalQuotes") {
                arr.push("New inspirational quote here.")
            }
            copy[sectionKey] = arr
            return copy
        })
    }

    function removeItem(sectionKey, index) {
        setData(prev => {
            const copy = { ...prev }
            copy[sectionKey] = [...(copy[sectionKey] || [])].filter((_, i) => i !== index)
            return copy
        })
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-container-high" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 bg-primary/10 p-4 text-sm text-blue-700">
                <AlertTriangle size={14} className="inline mr-1.5" />
                Changes are saved to your browser immediately and will sync to the database when available.
            </div>

            {SECTIONS.map(section => {
                const isOpen = expanded === section.key
                const Icon = section.icon
                const isSaving = saving === section.key
                const isSaved = saved === section.key

                return (
                    <div key={section.key} className="rounded-xl border border-outline-variant/20 glass shadow-sm overflow-hidden">
                        {/* Header */}
                        <button
                            onClick={() => setExpanded(isOpen ? null : section.key)}
                            className="flex items-center gap-3 w-full p-4 text-left hover:bg-surface-container-low transition"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                <Icon size={16} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-on-surface">{section.label}</p>
                                <p className="text-xs text-on-surface-variant">{section.description}</p>
                            </div>
                            {isOpen ? <ChevronUp size={16} className="text-on-surface-variant/60" /> : <ChevronDown size={16} className="text-on-surface-variant/60" />}
                        </button>

                        {/* Content */}
                        {isOpen && (
                            <div className="border-t border-outline-variant/10 p-4 space-y-4">
                                {/* ── ANNOUNCEMENTS ── */}
                                {section.key === "announcements" && (
                                    <>
                                        {(data.announcements || []).map((ann, i) => (
                                            <div key={i} className="flex gap-3 items-start rounded-lg border border-outline-variant/20 p-3">
                                                <div className="flex-1 space-y-2">
                                                    <input
                                                        value={ann.text}
                                                        onChange={e => updateField("announcements", i, "text", e.target.value)}
                                                        className="w-full rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40"
                                                        placeholder="Announcement text..."
                                                    />
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={ann.type}
                                                            onChange={e => updateField("announcements", i, "type", e.target.value)}
                                                            className="rounded-lg border border-outline-variant/20 px-2 py-1 text-xs"
                                                        >
                                                            <option value="info">Info</option>
                                                            <option value="warning">Warning</option>
                                                            <option value="success">Success</option>
                                                        </select>
                                                        <label className="flex items-center gap-1 text-xs text-on-surface-variant">
                                                            <input type="checkbox" checked={ann.active} onChange={e => updateField("announcements", i, "active", e.target.checked)} />
                                                            Active
                                                        </label>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeItem("announcements", i)} className="text-error hover:text-error p-1">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => addItem("announcements")} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary">
                                            <Plus size={14} /> Add Announcement
                                        </button>
                                    </>
                                )}

                                {/* ── DEFENCE MENTORS ── */}
                                {section.key === "defenceMentors" && (
                                    <div className="space-y-5">
                                        {(data.defenceMentors || []).map((mentor, i) => (
                                            <div key={i} className="rounded-lg border border-outline-variant/20 p-4 space-y-3">
                                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Mentor {i + 1}</p>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-on-surface-variant mb-1">Name</label>
                                                        <input value={mentor.name} onChange={e => updateField("defenceMentors", i, "name", e.target.value)}
                                                            className="w-full rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-on-surface-variant mb-1">Title</label>
                                                        <input value={mentor.title} onChange={e => updateField("defenceMentors", i, "title", e.target.value)}
                                                            className="w-full rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Bio</label>
                                                    <textarea value={mentor.bio} onChange={e => updateField("defenceMentors", i, "bio", e.target.value)} rows={3}
                                                        className="w-full rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" />
                                                </div>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-on-surface-variant mb-1">Email</label>
                                                        <input value={mentor.email} onChange={e => updateField("defenceMentors", i, "email", e.target.value)}
                                                            className="w-full rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-on-surface-variant mb-1">Rating</label>
                                                        <input type="number" step="0.1" min="0" max="5" value={mentor.rating}
                                                            onChange={e => updateField("defenceMentors", i, "rating", parseFloat(e.target.value))}
                                                            className="w-full rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Tags (comma-separated)</label>
                                                    <input value={(mentor.tags || []).join(", ")}
                                                        onChange={e => updateField("defenceMentors", i, "tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                                        className="w-full rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── DEFENCE PRICING ── */}
                                {section.key === "defencePricing" && (
                                    <div className="space-y-3">
                                        {(data.defencePricing || []).map((plan, i) => (
                                            <div key={i} className="flex items-center gap-3 rounded-lg border border-outline-variant/20 p-3">
                                                <div className="flex-1 grid sm:grid-cols-3 gap-2">
                                                    <input value={plan.name} onChange={e => updateField("defencePricing", i, "name", e.target.value)}
                                                        className="rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" placeholder="Plan name" />
                                                    <input value={plan.price} onChange={e => updateField("defencePricing", i, "price", e.target.value)}
                                                        className="rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" placeholder="Price" />
                                                    <input value={plan.priceNote} onChange={e => updateField("defencePricing", i, "priceNote", e.target.value)}
                                                        className="rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" placeholder="Note" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── MOTIVATIONAL QUOTES ── */}
                                {section.key === "motivationalQuotes" && (
                                    <>
                                        {(data.motivationalQuotes || []).map((quote, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <input value={quote}
                                                    onChange={e => {
                                                        setData(prev => {
                                                            const copy = { ...prev }
                                                            const arr = [...(copy.motivationalQuotes || [])]
                                                            arr[i] = e.target.value
                                                            copy.motivationalQuotes = arr
                                                            return copy
                                                        })
                                                    }}
                                                    className="flex-1 rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary/40" />
                                                <button onClick={() => removeItem("motivationalQuotes", i)} className="text-error hover:text-error p-1">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => addItem("motivationalQuotes")} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary">
                                            <Plus size={14} /> Add Quote
                                        </button>
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2 border-t border-outline-variant/10">
                                    <button
                                        onClick={() => handleSave(section.key)}
                                        disabled={isSaving}
                                        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition ${isSaved
                                                ? "bg-tertiary/15 text-tertiary"
                                                : "bg-primary text-white hover:bg-primary"
                                            }`}
                                    >
                                        {isSaved ? <><CheckCircle2 size={13} /> Saved!</> : <><Save size={13} /> {isSaving ? "Saving..." : "Save Changes"}</>}
                                    </button>
                                    <button
                                        onClick={() => handleReset(section.key)}
                                        className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container-low transition"
                                    >
                                        <RotateCcw size={13} /> Reset to Default
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

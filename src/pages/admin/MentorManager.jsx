import { useCallback, useEffect, useState } from "react"
import { ShieldCheck, ShieldOff, Trash2 } from "lucide-react"
import {
    adminGetMentors,
    adminToggleVerified,
    adminDeleteMentor,
} from "../../services/admin"

export default function MentorManager() {
    const [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [streamFilter, setStreamFilter] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const result = await adminGetMentors()
            setMentors(result.records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const filtered = mentors.filter(m => !streamFilter || m.stream === streamFilter)

    async function handleToggle(id, current) {
        try {
            await adminToggleVerified(id, !current)
            setMentors(prev => prev.map(m => (m.id === id ? { ...m, is_verified: !current } : m)))
        } catch (err) {
            setError(err.message)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this mentor?")) return
        try {
            await adminDeleteMentor(id)
            await load()
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
                <div className="rounded-lg border border-error/20 bg-error/10 px-4 py-2 text-sm text-error">{error}</div>
            )}

            <div className="flex items-center gap-3">
                <select
                    value={streamFilter}
                    onChange={e => setStreamFilter(e.target.value)}
                    className="rounded-lg border border-outline-variant/20 px-3 py-2 text-sm"
                >
                    <option value="">All Streams</option>
                    <option value="PCM">PCM</option>
                    <option value="PCB">PCB</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="Defence">Defence</option>
                </select>
                <p className="text-xs text-on-surface-variant">
                    {filtered.length} mentor{filtered.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-outline-variant/20 glass shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-outline-variant/20 bg-surface-container-low text-left text-xs font-semibold text-on-surface-variant">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Stream</th>
                            <th className="px-4 py-3">Specialization</th>
                            <th className="px-4 py-3">Experience</th>
                            <th className="px-4 py-3">Rating</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3 text-center">Verified</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(mentor => (
                            <tr key={mentor.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low">
                                <td className="px-4 py-3 font-medium text-on-surface">{mentor.name}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{mentor.stream || "—"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{mentor.specialization || "—"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{mentor.experience_years || 0}y</td>
                                <td className="px-4 py-3 text-on-surface-variant">⭐ {mentor.rating || "0"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">₹{mentor.price || "0"}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(mentor.id, mentor.is_verified)}
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition ${mentor.is_verified
                                                ? "bg-tertiary/15 text-tertiary hover:bg-emerald-200"
                                                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                                            }`}
                                    >
                                        {mentor.is_verified ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
                                        {mentor.is_verified ? "Verified" : "Unverified"}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(mentor.id)}
                                        className="rounded-lg p-1 text-on-surface-variant/60 hover:bg-error/10 hover:text-error"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-sm text-on-surface-variant/60">No mentors found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

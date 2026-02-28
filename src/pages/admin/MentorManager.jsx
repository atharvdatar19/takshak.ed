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

            <div className="flex items-center gap-3">
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
                <p className="text-xs text-slate-500">
                    {filtered.length} mentor{filtered.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-600">
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
                            <tr key={mentor.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-900">{mentor.name}</td>
                                <td className="px-4 py-3 text-slate-600">{mentor.stream || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{mentor.specialization || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{mentor.experience_years || 0}y</td>
                                <td className="px-4 py-3 text-slate-600">⭐ {mentor.rating || "0"}</td>
                                <td className="px-4 py-3 text-slate-600">₹{mentor.price || "0"}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(mentor.id, mentor.is_verified)}
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition ${mentor.is_verified
                                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
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
                                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">No mentors found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

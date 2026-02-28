import { useCallback, useEffect, useState } from "react"
import { Crown } from "lucide-react"
import { adminGetUsers, adminTogglePremium } from "../../services/admin"

export default function UserManager() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [streamFilter, setStreamFilter] = useState("")
    const [search, setSearch] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const result = await adminGetUsers()
            setUsers(result.records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const filtered = users.filter(u => {
        const matchesStream = !streamFilter || u.stream === streamFilter
        const matchesSearch = !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
        return matchesStream && matchesSearch
    })

    async function handleTogglePremium(id, current) {
        try {
            await adminTogglePremium(id, !current)
            setUsers(prev => prev.map(u => (u.id === id ? { ...u, is_premium: !current } : u)))
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

    const premiumCount = users.filter(u => u.is_premium).length

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>
            )}

            <div className="flex flex-wrap items-center gap-3">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
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
            </div>

            <div className="flex gap-4 text-xs text-slate-500">
                <span>{filtered.length} user{filtered.length !== 1 ? "s" : ""} shown</span>
                <span>•</span>
                <span className="font-medium text-amber-600">{premiumCount} premium</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-600">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Stream</th>
                            <th className="px-4 py-3">State</th>
                            <th className="px-4 py-3">Target Exam</th>
                            <th className="px-4 py-3 text-center">Premium</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(user => (
                            <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-900">{user.full_name || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{user.email || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{user.stream || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{user.state || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{user.target_exam || "—"}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleTogglePremium(user.id, user.is_premium)}
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition ${user.is_premium
                                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                            }`}
                                    >
                                        <Crown size={12} />
                                        {user.is_premium ? "Premium" : "Free"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

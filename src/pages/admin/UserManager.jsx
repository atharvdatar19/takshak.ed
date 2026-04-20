import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
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
                    <div key={i} className="h-16 animate-pulse rounded-lg bg-surface-container-high" />
                ))}
            </div>
        )
    }

    const premiumCount = users.filter(u => u.is_premium).length

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-lg border border-error/20 bg-error/10 px-4 py-2 text-sm text-error">{error}</div>
            )}

            <div className="flex flex-wrap items-center gap-3">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="flex-1 rounded-lg border border-outline-variant/20 px-3 py-2 text-sm outline-none focus:border-primary"
                />
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
            </div>

            <div className="flex gap-4 text-xs text-on-surface-variant">
                <span>{filtered.length} user{filtered.length !== 1 ? "s" : ""} shown</span>
                <span>•</span>
                <span className="font-medium text-amber-600">{premiumCount} premium</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-outline-variant/20 glass shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-outline-variant/20 bg-surface-container-low text-left text-xs font-semibold text-on-surface-variant">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Stream</th>
                            <th className="px-4 py-3">State</th>
                            <th className="px-4 py-3">Target Exam</th>
                            <th className="px-4 py-3 text-center">Premium</th>
                        </tr>
                    </thead>
                    <motion.tbody
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                    >
                        {filtered.map(user => (
                            <motion.tr 
                                key={user.id} 
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="border-b border-outline-variant/10 hover:bg-surface-container-low"
                            >
                                <td className="px-4 py-3 font-medium text-on-surface">{user.full_name || "—"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{user.email || "—"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{user.stream || "—"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{user.state || "—"}</td>
                                <td className="px-4 py-3 text-on-surface-variant">{user.target_exam || "—"}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleTogglePremium(user.id, user.is_premium)}
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition ${user.is_premium
                                                ? "bg-tertiary/15 text-amber-700 hover:bg-amber-200"
                                                : "bg-surface-container text-on-surface-variant/60 hover:bg-surface-container-high"
                                            }`}
                                    >
                                        <Crown size={12} />
                                        {user.is_premium ? "Premium" : "Free"}
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-sm text-on-surface-variant/60">No users found.</td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>
        </div>
    )
}

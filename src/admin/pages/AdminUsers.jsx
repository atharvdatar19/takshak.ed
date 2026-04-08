import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { Users, Shield, Search, Loader2, RefreshCw } from "lucide-react"
import { adminGetUsers, adminUpdateUserRole } from "../../services/admin"
import { useRealtimeSync } from "../../hooks/useRealtimeSync"

const ROLE_COLORS = {
    admin: "bg-error/100/10 text-error border-rose-500/15",
    mentor: "bg-primary/100/10 text-primary/70 border-primary/15",
    moderator: "bg-violet-500/10 text-violet-400 border-violet-500/15",
    content_editor: "bg-tertiary/100/10 text-tertiary border-tertiary/15",
    finance_viewer: "bg-tertiary/100/10 text-tertiary border-tertiary/15",
    student: "bg-surface-container-low0/10 text-on-surface-variant/60 border-slate-500/15",
}

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true)
            const { records } = await adminGetUsers()
            setUsers(records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadUsers() }, [loadUsers])
    useRealtimeSync("users", () => loadUsers())

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminUpdateUserRole(userId, newRole)
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
        } catch (err) {
            setError(err.message)
        }
    }

    const filtered = users.filter(u => {
        const matchSearch = !search || (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === "all" || u.role === roleFilter
        return matchSearch && matchRole
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Users</h1>
                    <p className="text-[11px] text-on-surface-variant mt-1">{users.length} total users</p>
                </div>
                <button onClick={loadUsers} disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl glass/[0.03] border border-white/[0.05] text-on-surface-variant hover:text-primary/70 transition text-xs font-medium">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
                </button>
            </div>

            {error && <div className="rounded-xl bg-error/100/8 border border-rose-500/15 px-4 py-3 text-xs text-error">{error}</div>}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                        className="w-full rounded-xl border border-white/[0.05] glass/[0.02] pl-9 pr-4 py-2.5 text-xs text-on-surface-variant/40 outline-none focus:border-primary/40 transition placeholder:text-on-surface" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {["all", "student", "mentor", "admin", "moderator", "content_editor", "finance_viewer"].map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${roleFilter === r
                                ? "bg-primary/100/15 text-primary/70 border border-primary/20"
                                : "text-on-surface-variant hover:text-on-surface-variant/60 hover:glass/[0.03]"
                                }`}>
                            {r === "all" ? "All" : r.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {loading && users.length === 0 ? (
                <div className="space-y-2">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 rounded-xl glass/[0.02] animate-pulse" />)}</div>
            ) : (
                <div className="rounded-2xl border border-outline-variant/10 bg-[#0d0e1a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-outline-variant/10">
                                    {["Name", "Email", "Role", "Joined", "Actions"].map(h => (
                                        <th key={h} className="text-left text-[9px] font-black uppercase tracking-wider text-on-surface-variant px-5 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u, i) => (
                                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                        className={`border-b border-white/[0.02] ${i % 2 === 0 ? "glass/[0.01]" : ""} hover:glass/[0.03] transition`}>
                                        <td className="px-5 py-3 text-xs font-semibold text-white">{u.full_name || "—"}</td>
                                        <td className="px-5 py-3 text-xs text-on-surface-variant">{u.email || "—"}</td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${ROLE_COLORS[u.role] || ROLE_COLORS.student}`}>
                                                {u.role || "student"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-[10px] text-on-surface-variant">
                                            {u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <select value={u.role || "student"} onChange={e => handleRoleChange(u.id, e.target.value)}
                                                className="rounded-lg border border-white/[0.05] glass/[0.02] px-2 py-1 text-[10px] text-on-surface-variant/60 outline-none focus:border-primary/40 appearance-none cursor-pointer">
                                                {["student", "mentor", "admin", "moderator", "content_editor", "finance_viewer"].map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={5} className="px-5 py-12 text-center text-xs text-on-surface-variant">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

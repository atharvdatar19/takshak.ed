import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { ShieldCheck, Plus, Trash2, Loader2, RefreshCw } from "lucide-react"
import { adminGetTeamMembers, adminUpdateUserRole } from "../../services/admin"
import { useRealtimeSync } from "../../hooks/useRealtimeSync"

const ROLES = ["admin", "moderator", "content_editor", "finance_viewer"]

const ROLE_COLORS = {
    admin: "bg-rose-500/10 text-rose-400 border-rose-500/15",
    moderator: "bg-violet-500/10 text-violet-400 border-violet-500/15",
    content_editor: "bg-amber-500/10 text-amber-400 border-amber-500/15",
    finance_viewer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
}

export default function AdminTeamAccess() {
    const [team, setTeam] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newEmail, setNewEmail] = useState("")
    const [newRole, setNewRole] = useState("moderator")
    const [adding, setAdding] = useState(false)

    const loadTeam = useCallback(async () => {
        try {
            setLoading(true)
            const { records } = await adminGetTeamMembers()
            setTeam(records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadTeam() }, [loadTeam])
    useRealtimeSync("users", () => loadTeam())

    const handleRemove = async (userId) => {
        try {
            await adminUpdateUserRole(userId, "student")
            setTeam(prev => prev.filter(t => t.id !== userId))
        } catch (err) {
            setError(err.message)
        }
    }

    const handleChangeRole = async (userId, newRole) => {
        try {
            await adminUpdateUserRole(userId, newRole)
            setTeam(prev => prev.map(t => t.id === userId ? { ...t, role: newRole } : t))
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Team Access</h1>
                    <p className="text-[11px] text-slate-600 mt-1">{team.length} team members with admin roles</p>
                </div>
                <button onClick={loadTeam} disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 transition text-xs font-medium">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
                </button>
            </div>

            {error && <div className="rounded-xl bg-rose-500/8 border border-rose-500/15 px-4 py-3 text-xs text-rose-400">{error}</div>}

            {/* Team Table */}
            {loading && team.length === 0 ? (
                <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl bg-white/[0.02] animate-pulse" />)}</div>
            ) : (
                <div className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.04]">
                                {["Name", "Email", "Role", "Joined", "Actions"].map(h => (
                                    <th key={h} className="text-left text-[9px] font-black uppercase tracking-wider text-slate-600 px-5 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {team.map((m, i) => (
                                <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                    className={`border-b border-white/[0.02] ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-white/[0.03] transition`}>
                                    <td className="px-5 py-3 text-xs font-semibold text-white">{m.full_name || m.email?.split("@")[0] || "—"}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{m.email || "—"}</td>
                                    <td className="px-5 py-3">
                                        <select value={m.role} onChange={e => handleChangeRole(m.id, e.target.value)}
                                            className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-[10px] text-slate-400 outline-none focus:border-indigo-500/40 appearance-none cursor-pointer">
                                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-5 py-3 text-[10px] text-slate-600">
                                        {m.created_at ? new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                    </td>
                                    <td className="px-5 py-3">
                                        {m.role !== "admin" && (
                                            <button onClick={() => handleRemove(m.id)}
                                                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 transition">
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                            {team.length === 0 && (
                                <tr><td colSpan={5} className="px-5 py-12 text-center text-xs text-slate-600">No team members found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Info Note */}
            <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 px-4 py-3 text-[11px] text-slate-500">
                <ShieldCheck size={13} className="inline mr-1.5 text-indigo-400" />
                To add a new team member, first have them sign up as a regular user, then change their role from the <strong className="text-indigo-400">Users</strong> page.
                Team members shown here are users with admin, moderator, content_editor, or finance_viewer roles.
            </div>
        </div>
    )
}

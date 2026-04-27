import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { CalendarDays, Loader2, RefreshCw } from "lucide-react"
import { adminGetSessions } from "@database/services/admin"
import { useRealtimeSync } from "@hooks/useRealtimeSync"

const STATUS_COLORS = {
    completed: "bg-emerald-500/10 text-emerald-400",
    confirmed: "bg-indigo-500/10 text-indigo-400",
    pending_payment: "bg-amber-500/10 text-amber-400",
    cancelled: "bg-rose-500/10 text-rose-400",
    disputed: "bg-orange-500/10 text-orange-400",
    refunded: "bg-slate-500/10 text-slate-400",
}

export default function AdminSessions() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState("all")

    const loadSessions = useCallback(async () => {
        try {
            setLoading(true)
            const { records } = await adminGetSessions()
            setSessions(records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadSessions() }, [loadSessions])
    useRealtimeSync("sessions", () => loadSessions())

    const statuses = ["all", ...new Set(sessions.map(s => s.status).filter(Boolean))]
    const filtered = statusFilter === "all" ? sessions : sessions.filter(s => s.status === statusFilter)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Sessions</h1>
                    <p className="text-[11px] text-slate-600 mt-1">{sessions.length} total sessions</p>
                </div>
                <button onClick={loadSessions} disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 transition text-xs font-medium">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
                </button>
            </div>

            {error && <div className="rounded-xl bg-rose-500/8 border border-rose-500/15 px-4 py-3 text-xs text-rose-400">{error}</div>}

            {/* Status Filter */}
            <div className="flex gap-1.5 flex-wrap">
                {statuses.map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${statusFilter === s
                            ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                            : "text-slate-600 hover:text-slate-400 hover:bg-white/[0.03]"
                            }`}>
                        {s === "all" ? "All" : s.replace("_", " ")}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading && sessions.length === 0 ? (
                <div className="space-y-2">{[1, 2, 3, 4].map(i => <div key={i} className="h-14 rounded-xl bg-white/[0.02] animate-pulse" />)}</div>
            ) : (
                <div className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.04]">
                                    {["Topic", "Mentor", "Duration", "Rate", "Date", "Status"].map(h => (
                                        <th key={h} className="text-left text-[9px] font-black uppercase tracking-wider text-slate-600 px-5 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s, i) => (
                                    <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                        className={`border-b border-white/[0.02] ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-white/[0.03] transition`}>
                                        <td className="px-5 py-3 text-xs font-semibold text-white">{s.topic || "—"}</td>
                                        <td className="px-5 py-3 text-xs text-slate-400">{s.mentors?.full_name || "—"}</td>
                                        <td className="px-5 py-3 text-xs text-slate-500">{s.duration_minutes || "—"}min</td>
                                        <td className="px-5 py-3 text-xs text-emerald-400 font-bold">₹{s.agreed_rate_inr || 0}</td>
                                        <td className="px-5 py-3 text-[10px] text-slate-600">
                                            {s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${STATUS_COLORS[s.status] || "bg-slate-500/10 text-slate-400"}`}>
                                                {(s.status || "unknown").replace("_", " ")}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-600">No sessions found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

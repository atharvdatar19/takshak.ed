import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { Users, GraduationCap, CalendarDays, DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp, RefreshCw, Loader2 } from "lucide-react"
import { adminGetDataHealth, adminGetSessions, adminGetReports, adminGetMentors } from "../../services/admin"
import { useRealtimeSync } from "../../hooks/useRealtimeSync"

const COLORS = {
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/15", glow: "shadow-indigo-500/5" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/15", glow: "shadow-emerald-500/5" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/15", glow: "shadow-amber-500/5" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/15", glow: "shadow-rose-500/5" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/15", glow: "shadow-violet-500/5" },
}

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [recentSessions, setRecentSessions] = useState([])
    const [pendingMentors, setPendingMentors] = useState([])
    const [openReports, setOpenReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastRefresh, setLastRefresh] = useState(null)

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const [health, sessionsData, reportsData, mentorsData] = await Promise.all([
                adminGetDataHealth(),
                adminGetSessions(),
                adminGetReports(),
                adminGetMentors(false), // unverified only
            ])
            setStats(health)
            setRecentSessions((sessionsData.records || []).slice(0, 5))
            setOpenReports((reportsData.records || []).filter(r => r.status === "open").slice(0, 5))
            setPendingMentors((mentorsData.records || []).slice(0, 5))
            setLastRefresh(new Date())
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadData() }, [loadData])

    // Real-time sync — refresh dashboard on changes
    useRealtimeSync("users", () => loadData())
    useRealtimeSync("sessions", () => loadData())
    useRealtimeSync("mentors", () => loadData())

    if (loading && !stats) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 rounded-xl bg-white/[0.03] animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                    ))}
                </div>
                <div className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
            </div>
        )
    }

    const statCards = [
        { label: "Total Users", value: stats?.totals?.users?.toLocaleString() || "0", icon: Users, color: "indigo" },
        { label: "Active Mentors", value: stats?.totals?.mentors?.toLocaleString() || "0", icon: GraduationCap, color: "emerald" },
        { label: "Sessions", value: stats?.totals?.sessions?.toLocaleString() || "0", icon: CalendarDays, color: "amber" },
        { label: "Revenue", value: `₹${(stats?.health?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "rose" },
    ]

    const healthCards = [
        { label: "Pending Reviews", value: stats?.health?.unverifiedMentors || 0, icon: Clock, color: "amber" },
        { label: "Open Reports", value: stats?.health?.openReports || 0, icon: AlertTriangle, color: "rose" },
        { label: "Completed Sessions", value: stats?.health?.completedSessions || 0, icon: CheckCircle, color: "emerald" },
        { label: "Platform Earnings", value: `₹${(stats?.health?.platformFees || 0).toLocaleString()}`, icon: TrendingUp, color: "violet" },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-[11px] text-slate-600 mt-1">
                        {lastRefresh ? `Last synced ${lastRefresh.toLocaleTimeString("en-IN")}` : "Loading..."}
                    </p>
                </div>
                <button onClick={loadData} disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 hover:border-indigo-500/20 transition text-xs font-medium disabled:opacity-50">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    Refresh
                </button>
            </div>

            {error && (
                <div className="rounded-xl bg-rose-500/8 border border-rose-500/15 px-4 py-3 text-xs text-rose-400">
                    {error}
                </div>
            )}

            {/* Primary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon
                    const c = COLORS[stat.color]
                    return (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                            className={`rounded-2xl border ${c.border} bg-[#0d0e1a] p-5 shadow-lg ${c.glow}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                                    <Icon size={18} className={c.text} />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-white tabular-nums">{stat.value}</p>
                            <p className="text-[10px] text-slate-500 mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Health Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {healthCards.map((h, i) => {
                    const Icon = h.icon
                    const c = COLORS[h.color]
                    return (
                        <motion.div key={h.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
                            className="rounded-xl border border-white/[0.04] bg-[#0d0e1a] p-4 flex items-center gap-3"
                        >
                            <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                                <Icon size={14} className={c.text} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white tabular-nums">{h.value}</p>
                                <p className="text-[9px] text-slate-600 uppercase tracking-wider">{h.label}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Three Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Sessions */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] p-5"
                >
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <CalendarDays size={12} /> Recent Sessions
                    </h3>
                    <div className="space-y-2">
                        {recentSessions.length === 0 ? (
                            <p className="text-xs text-slate-600 py-4 text-center">No sessions yet</p>
                        ) : recentSessions.map((s, i) => (
                            <div key={s.id || i} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-white truncate">{s.topic || "Session"}</p>
                                    <p className="text-[10px] text-slate-600">{s.mentors?.full_name || "Mentor"}</p>
                                </div>
                                <span className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${s.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                                    s.status === "confirmed" ? "bg-indigo-500/10 text-indigo-400" :
                                        s.status === "cancelled" ? "bg-rose-500/10 text-rose-400" :
                                            "bg-amber-500/10 text-amber-400"
                                    }`}>{s.status?.replace("_", " ") || "pending"}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Pending Mentor Apps */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                    className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] p-5"
                >
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <GraduationCap size={12} /> Pending Mentor Apps
                        {pendingMentors.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[8px] font-black">{pendingMentors.length}</span>
                        )}
                    </h3>
                    <div className="space-y-2">
                        {pendingMentors.length === 0 ? (
                            <p className="text-xs text-slate-600 py-4 text-center">✅ All caught up!</p>
                        ) : pendingMentors.map((m, i) => (
                            <div key={m.id || i} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-[10px] font-bold">
                                        {(m.full_name || "?")[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-white truncate">{m.full_name}</p>
                                        <p className="text-[10px] text-slate-600">{m.college} · {m.branch}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-amber-500/10 text-amber-400">Pending</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Open Reports */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] p-5"
                >
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <AlertTriangle size={12} /> Open Reports
                        {openReports.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[8px] font-black">{openReports.length}</span>
                        )}
                    </h3>
                    <div className="space-y-2">
                        {openReports.length === 0 ? (
                            <p className="text-xs text-slate-600 py-4 text-center">🛡️ No open reports</p>
                        ) : openReports.map((r, i) => (
                            <div key={r.id || i} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-white truncate">{r.title}</p>
                                    <p className="text-[10px] text-slate-600">{r.type?.replace("_", " ")}</p>
                                </div>
                                <span className="shrink-0 ml-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-rose-500/10 text-rose-400">Open</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

import { motion } from "framer-motion"
import { Users, GraduationCap, CalendarDays, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const DEMO_STATS = [
    { label: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "indigo" },
    { label: "Active Mentors", value: "34", change: "+5", icon: GraduationCap, color: "emerald" },
    { label: "Sessions This Month", value: "156", change: "+28%", icon: CalendarDays, color: "amber" },
    { label: "Revenue (Mar)", value: "₹47,200", change: "+18%", icon: DollarSign, color: "rose" },
]

const DEMO_PENDING = [
    { id: 1, type: "Mentor Application", name: "Rohan Verma — IIT Kanpur", time: "2 hours ago", status: "pending" },
    { id: 2, type: "Reported Listing", name: "Marketplace item #482 — flagged by 3 users", time: "5 hours ago", status: "review" },
    { id: 3, type: "Payout Ready", name: "₹2,394 → Priya S. (4 sessions cleared)", time: "1 day ago", status: "ready" },
    { id: 4, type: "Mentor Application", name: "Aisha Khan — AIIMS Delhi", time: "2 days ago", status: "pending" },
    { id: 5, type: "Dispute", name: "Session #s12 — student requests refund", time: "3 days ago", status: "review" },
]

const COLORS = {
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
}

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Overview of platform activity and pending actions.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DEMO_STATS.map((stat, i) => {
                    const Icon = stat.icon
                    const c = COLORS[stat.color]
                    return (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                            className={`rounded-2xl border ${c.border} bg-[#111120] p-5`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                                    <Icon size={18} className={c.text} />
                                </div>
                                <span className={`text-[10px] font-bold ${c.text} ${c.bg} px-2 py-0.5 rounded-full`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Pending Actions */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="rounded-2xl border border-[#1f1f35] bg-[#111120] overflow-hidden"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f35]">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertTriangle size={15} className="text-amber-400" /> Pending Actions
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {DEMO_PENDING.length} items
                    </span>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#1f1f35]">
                            <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Type</th>
                            <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Details</th>
                            <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Time</th>
                            <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DEMO_PENDING.map((item, i) => (
                            <tr key={item.id} className={`border-b border-[#1f1f35]/50 ${i % 2 === 0 ? "bg-[#0d0e1a]" : ""} hover:bg-[#161830] transition`}>
                                <td className="px-5 py-3 text-xs font-semibold text-indigo-400">{item.type}</td>
                                <td className="px-5 py-3 text-xs text-slate-300">{item.name}</td>
                                <td className="px-5 py-3 text-xs text-slate-500">{item.time}</td>
                                <td className="px-5 py-3 text-right">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${item.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                                            item.status === "ready" ? "bg-emerald-500/10 text-emerald-400" :
                                                "bg-rose-500/10 text-rose-400"
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="rounded-2xl border border-[#1f1f35] bg-[#111120] p-5"
                >
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Sessions</h3>
                    <div className="space-y-2">
                        {[
                            { student: "Neha D.", mentor: "Arjun M.", status: "completed" },
                            { student: "Varun K.", mentor: "Arjun M.", status: "confirmed" },
                            { student: "Priya S.", mentor: "Anita R.", status: "completed" },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-[#1f1f35]/50 last:border-0">
                                <div>
                                    <p className="text-xs font-semibold text-white">{s.student} → {s.mentor}</p>
                                </div>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                                    }`}>{s.status}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-[#1f1f35] bg-[#111120] p-5"
                >
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Mentors</h3>
                    <div className="space-y-2">
                        {[
                            { name: "Arjun Mehta", sessions: 47, rating: 4.85 },
                            { name: "Priya Sharma", sessions: 32, rating: 4.72 },
                            { name: "Rahul Kumar", sessions: 28, rating: 4.60 },
                        ].map((m, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-[#1f1f35]/50 last:border-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 text-[10px] font-bold">
                                        #{i + 1}
                                    </div>
                                    <p className="text-xs font-semibold text-white">{m.name}</p>
                                </div>
                                <p className="text-[10px] text-slate-400">{m.sessions} sessions · ⭐ {m.rating}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                    className="rounded-2xl border border-[#1f1f35] bg-[#111120] p-5"
                >
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Platform Health</h3>
                    <div className="space-y-3">
                        {[
                            { label: "Avg Response Time", value: "4.2 hrs", icon: Clock, color: "indigo" },
                            { label: "Session Complete Rate", value: "94%", icon: CheckCircle, color: "emerald" },
                            { label: "User Growth (MoM)", value: "+18%", icon: TrendingUp, color: "amber" },
                        ].map((h, i) => {
                            const Icon = h.icon
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${COLORS[h.color].bg} flex items-center justify-center`}>
                                        <Icon size={14} className={COLORS[h.color].text} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-500">{h.label}</p>
                                        <p className="text-sm font-bold text-white">{h.value}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

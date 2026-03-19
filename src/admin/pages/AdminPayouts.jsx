import { motion } from "framer-motion"
import { useState } from "react"
import { DollarSign, Download, CheckCircle, Clock, CalendarDays, ExternalLink } from "lucide-react"

const DEMO_PAYOUT_DATA = [
    { session_id: "s1", student: "Neha D.", mentor: "Arjun Mehta", mentor_id: "m1", amount: 499, mentor_share: 399.20, platform_fee: 99.80, date: "2026-03-10", status: "cleared", payout_status: "paid" },
    { session_id: "s4", student: "Rahul M.", mentor: "Arjun Mehta", mentor_id: "m1", amount: 299, mentor_share: 239.20, platform_fee: 59.80, date: "2026-03-08", status: "cleared", payout_status: "paid" },
    { session_id: "s5", student: "Ananya R.", mentor: "Priya S.", mentor_id: "m2", amount: 499, mentor_share: 399.20, platform_fee: 99.80, date: "2026-03-06", status: "cleared", payout_status: "pending" },
    { session_id: "s6", student: "Karan J.", mentor: "Priya S.", mentor_id: "m2", amount: 299, mentor_share: 239.20, platform_fee: 59.80, date: "2026-03-05", status: "cleared", payout_status: "pending" },
    { session_id: "s7", student: "Simran K.", mentor: "Arjun Mehta", mentor_id: "m1", amount: 499, mentor_share: 399.20, platform_fee: 99.80, date: "2026-03-03", status: "completed", payout_status: "hold" },
]

export default function AdminPayouts() {
    const [data, setData] = useState(DEMO_PAYOUT_DATA)
    const [filter, setFilter] = useState("all")

    const filtered = filter === "all" ? data : data.filter(d => d.payout_status === filter)

    const totalRevenue = data.reduce((s, d) => s + d.amount, 0)
    const totalPlatformFee = data.reduce((s, d) => s + d.platform_fee, 0)
    const totalPending = data.filter(d => d.payout_status === "pending").reduce((s, d) => s + d.mentor_share, 0)

    const handleReleasePayout = (sessionId) => {
        setData(prev => prev.map(d => d.session_id === sessionId ? { ...d, payout_status: "paid" } : d))
        // In production: call release-payout Edge Function
    }

    const exportCSV = () => {
        const headers = "Session ID,Student,Mentor,Amount,Mentor Share,Platform Fee,Date,Status,Payout\n"
        const rows = data.map(d => `${d.session_id},${d.student},${d.mentor},${d.amount},${d.mentor_share},${d.platform_fee},${d.date},${d.status},${d.payout_status}`).join("\n")
        const blob = new Blob([headers + rows], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url; a.download = `payouts_${new Date().toISOString().split("T")[0]}.csv`; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Payouts</h1>
                    <p className="text-sm text-slate-500 mt-1">Track session revenue and release mentor payouts.</p>
                </div>
                <button onClick={exportCSV}
                    className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2 text-xs font-bold hover:bg-indigo-500/20 transition flex items-center gap-2"
                >
                    <Download size={14} /> Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "emerald" },
                    { label: "Platform Earnings", value: `₹${totalPlatformFee.toFixed(0)}`, color: "indigo" },
                    { label: "Pending Payouts", value: `₹${totalPending.toFixed(0)}`, color: "amber" },
                ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className={`rounded-2xl border border-${stat.color === "emerald" ? "emerald" : stat.color === "indigo" ? "indigo" : "amber"}-500/20 bg-[#111120] p-5`}
                    >
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black text-${stat.color}-400`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {["all", "pending", "paid", "hold"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${filter === f
                            ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                            : "text-slate-500 hover:text-slate-300 hover:bg-[#1f1f35]"
                            }`}
                    >
                        {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-[#1f1f35] bg-[#111120] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#1f1f35]">
                                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Session</th>
                                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Student → Mentor</th>
                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Amount</th>
                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Mentor Share</th>
                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Platform Fee</th>
                                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Date</th>
                                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Payout</th>
                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row, i) => (
                                <tr key={row.session_id} className={`border-b border-[#1f1f35]/50 ${i % 2 === 0 ? "bg-[#0d0e1a]" : ""} hover:bg-[#161830] transition`}>
                                    <td className="px-5 py-3 text-xs font-mono text-slate-400">{row.session_id}</td>
                                    <td className="px-5 py-3 text-xs text-slate-300">{row.student} → <span className="font-semibold text-white">{row.mentor}</span></td>
                                    <td className="px-5 py-3 text-xs text-right font-bold text-white">₹{row.amount}</td>
                                    <td className="px-5 py-3 text-xs text-right text-emerald-400">₹{row.mentor_share}</td>
                                    <td className="px-5 py-3 text-xs text-right text-indigo-400">₹{row.platform_fee}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{row.date}</td>
                                    <td className="px-5 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${row.payout_status === "paid" ? "bg-emerald-500/10 text-emerald-400" :
                                                row.payout_status === "pending" ? "bg-amber-500/10 text-amber-400" :
                                                    "bg-slate-500/10 text-slate-400"
                                            }`}>
                                            {row.payout_status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        {row.payout_status === "pending" && (
                                            <button onClick={() => handleReleasePayout(row.session_id)}
                                                className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 text-[10px] font-bold hover:bg-emerald-500/20 transition"
                                            >
                                                Release ₹{row.mentor_share}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

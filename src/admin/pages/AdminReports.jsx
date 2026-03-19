import { motion } from "framer-motion"
import { useState } from "react"
import { AlertTriangle, Eye, EyeOff, Ban, CheckCircle, Flag, MessageSquare } from "lucide-react"

const DEMO_REPORTS = [
    {
        id: "r1", type: "marketplace_listing", target_id: "ml482",
        title: "Suspicious listing: 'JEE Notes - ₹5000'", reported_by: "Neha D.",
        reason: "Price too high, seems like a scam. No photos provided.",
        content_preview: "JEE Advanced Complete Notes Package — Guaranteed Rank Improvement",
        report_count: 3, created_at: "2026-03-18T12:00:00Z", status: "open",
    },
    {
        id: "r2", type: "campus_post", target_id: "cp91",
        title: "Inappropriate campus post", reported_by: "Varun K.",
        reason: "Contains abusive language and personal attacks.",
        content_preview: "This guy is such a loser, don't listen to anything he says about [college name]...",
        report_count: 5, created_at: "2026-03-17T08:00:00Z", status: "open",
    },
    {
        id: "r3", type: "review", target_id: "rv5",
        title: "Fake review on mentor profile", reported_by: "Arjun M.",
        reason: "This person never booked a session with me. Fake 1-star review.",
        content_preview: "Worst mentor ever. Complete waste of money. Don't book.",
        report_count: 1, created_at: "2026-03-15T14:00:00Z", status: "open",
    },
]

export default function AdminReports() {
    const [reports, setReports] = useState(DEMO_REPORTS)

    const handleAction = (id, action) => {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Reports Queue</h1>
                <p className="text-sm text-slate-500 mt-1">Review flagged content and take action.</p>
            </div>

            {reports.filter(r => r.status === "open").length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-[#1f1f35] bg-[#111120]">
                    <p className="text-4xl mb-3">🛡️</p>
                    <p className="text-sm text-slate-500">No open reports. Platform is clean!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report, idx) => (
                        <motion.div key={report.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className={`rounded-2xl border bg-[#111120] overflow-hidden ${report.status === "open" ? "border-rose-500/20" : "border-[#1f1f35] opacity-60"
                                }`}
                        >
                            {/* Header */}
                            <div className="px-5 py-4 border-b border-[#1f1f35]">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <Flag size={14} className="text-rose-400" />
                                        <h3 className="text-sm font-bold text-white">{report.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                            {report.report_count} reports
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${report.status === "open" ? "bg-amber-500/10 text-amber-400" :
                                                report.status === "dismissed" ? "bg-slate-500/10 text-slate-400" :
                                                    report.status === "hidden" ? "bg-indigo-500/10 text-indigo-400" :
                                                        "bg-rose-500/10 text-rose-400"
                                            }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                    Reported by <span className="text-slate-400 font-medium">{report.reported_by}</span> ·{" "}
                                    {new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                                    Type: <span className="text-indigo-400">{report.type.replace("_", " ")}</span>
                                </p>
                            </div>

                            {/* Content */}
                            <div className="px-5 py-4">
                                <div className="rounded-xl bg-[#0d0e1a] border border-[#1f1f35] p-3 mb-3">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Content Preview</p>
                                    <p className="text-xs text-slate-300 leading-relaxed italic">"{report.content_preview}"</p>
                                </div>
                                <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-3 mb-4">
                                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-1">Report Reason</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">{report.reason}</p>
                                </div>

                                {/* Actions */}
                                {report.status === "open" && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAction(report.id, "dismissed")}
                                            className="rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-400 px-3 py-2 text-[11px] font-bold hover:bg-slate-500/20 transition flex items-center gap-1.5"
                                        >
                                            <CheckCircle size={12} /> Dismiss
                                        </button>
                                        <button onClick={() => handleAction(report.id, "hidden")}
                                            className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-2 text-[11px] font-bold hover:bg-indigo-500/20 transition flex items-center gap-1.5"
                                        >
                                            <EyeOff size={12} /> Hide Content
                                        </button>
                                        <button onClick={() => handleAction(report.id, "banned")}
                                            className="rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2 text-[11px] font-bold hover:bg-rose-500/20 transition flex items-center gap-1.5"
                                        >
                                            <Ban size={12} /> Ban User
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

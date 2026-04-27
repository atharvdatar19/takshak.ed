import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { AlertTriangle, CheckCircle, EyeOff, Ban, Flag, Loader2, RefreshCw } from "lucide-react"
import { adminGetReports, adminUpdateReport } from "@database/services/admin"
import { useRealtimeSync } from "@hooks/useRealtimeSync"

export default function AdminReports() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [actionLoading, setActionLoading] = useState(null)
    const [statusFilter, setStatusFilter] = useState("open")

    const loadReports = useCallback(async () => {
        try {
            setLoading(true)
            const { records } = await adminGetReports()
            setReports(records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadReports() }, [loadReports])
    useRealtimeSync("reports", () => loadReports())

    const handleAction = async (id, action) => {
        try {
            setActionLoading(id)
            await adminUpdateReport(id, action)
            setReports(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
        } catch (err) {
            setError(err.message)
        } finally {
            setActionLoading(null)
        }
    }

    const filtered = statusFilter === "all" ? reports : reports.filter(r => r.status === statusFilter)
    const openCount = reports.filter(r => r.status === "open").length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Reports Queue</h1>
                    <p className="text-[11px] text-slate-600 mt-1">{openCount} open reports</p>
                </div>
                <button onClick={loadReports} disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 transition text-xs font-medium">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
                </button>
            </div>

            {error && <div className="rounded-xl bg-rose-500/8 border border-rose-500/15 px-4 py-3 text-xs text-rose-400">{error}</div>}

            {/* Filters */}
            <div className="flex gap-1.5 flex-wrap">
                {["open", "all", "dismissed", "hidden", "banned"].map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${statusFilter === f
                            ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                            : "text-slate-600 hover:text-slate-400 hover:bg-white/[0.03]"
                            }`}>
                        {f === "open" ? `Open (${openCount})` : f}
                    </button>
                ))}
            </div>

            {loading && reports.length === 0 ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/[0.02] animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-white/[0.04] bg-[#0d0e1a]">
                    <p className="text-4xl mb-3">🛡️</p>
                    <p className="text-sm text-slate-600">{statusFilter === "open" ? "No open reports. Platform is clean!" : "No reports match filter"}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((report, idx) => {
                        const isActioning = actionLoading === report.id
                        return (
                            <motion.div key={report.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                                className={`rounded-2xl border bg-[#0d0e1a] overflow-hidden ${report.status === "open" ? "border-rose-500/15" : "border-white/[0.04] opacity-60"}`}>
                                <div className="px-5 py-4 border-b border-white/[0.04]">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <Flag size={13} className="text-rose-400" />
                                            <h3 className="text-sm font-bold text-white">{report.title}</h3>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${report.status === "open" ? "bg-amber-500/10 text-amber-400" :
                                            report.status === "dismissed" ? "bg-slate-500/10 text-slate-400" :
                                                report.status === "hidden" ? "bg-indigo-500/10 text-indigo-400" :
                                                    "bg-rose-500/10 text-rose-400"
                                            }`}>{report.status}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-600">
                                        Type: <span className="text-indigo-400">{(report.type || "").replace("_", " ")}</span>
                                        {report.created_at && <> · {new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</>}
                                    </p>
                                </div>

                                <div className="px-5 py-4">
                                    <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-3 mb-4">
                                        <p className="text-[9px] text-rose-400 font-black uppercase tracking-wider mb-1">Reason</p>
                                        <p className="text-xs text-slate-400 leading-relaxed">{report.reason}</p>
                                    </div>

                                    {report.status === "open" && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAction(report.id, "dismissed")} disabled={isActioning}
                                                className="rounded-xl bg-slate-500/8 border border-slate-500/15 text-slate-400 px-3 py-2 text-[10px] font-bold hover:bg-slate-500/15 transition flex items-center gap-1.5 disabled:opacity-50">
                                                <CheckCircle size={12} /> Dismiss
                                            </button>
                                            <button onClick={() => handleAction(report.id, "hidden")} disabled={isActioning}
                                                className="rounded-xl bg-indigo-500/8 border border-indigo-500/15 text-indigo-400 px-3 py-2 text-[10px] font-bold hover:bg-indigo-500/15 transition flex items-center gap-1.5 disabled:opacity-50">
                                                <EyeOff size={12} /> Hide Content
                                            </button>
                                            <button onClick={() => handleAction(report.id, "banned")} disabled={isActioning}
                                                className="rounded-xl bg-rose-500/8 border border-rose-500/15 text-rose-400 px-3 py-2 text-[10px] font-bold hover:bg-rose-500/15 transition flex items-center gap-1.5 disabled:opacity-50">
                                                <Ban size={12} /> Ban User
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

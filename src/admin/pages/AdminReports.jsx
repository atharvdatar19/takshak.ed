import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { AlertTriangle, CheckCircle, EyeOff, Ban, Flag, Loader2, RefreshCw } from "lucide-react"
import { adminGetReports, adminUpdateReport } from "../../services/admin"
import { useRealtimeSync } from "../../hooks/useRealtimeSync"

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
                    <p className="text-[11px] text-on-surface-variant mt-1">{openCount} open reports</p>
                </div>
                <button onClick={loadReports} disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl glass/[0.03] border border-white/[0.05] text-on-surface-variant hover:text-primary/70 transition text-xs font-medium">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
                </button>
            </div>

            {error && <div className="rounded-xl bg-error/100/8 border border-rose-500/15 px-4 py-3 text-xs text-error">{error}</div>}

            {/* Filters */}
            <div className="flex gap-1.5 flex-wrap">
                {["open", "all", "dismissed", "hidden", "banned"].map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${statusFilter === f
                            ? "bg-primary/100/15 text-primary/70 border border-primary/20"
                            : "text-on-surface-variant hover:text-on-surface-variant/60 hover:glass/[0.03]"
                            }`}>
                        {f === "open" ? `Open (${openCount})` : f}
                    </button>
                ))}
            </div>

            {loading && reports.length === 0 ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl glass/[0.02] animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-outline-variant/10 bg-[#0d0e1a]">
                    <p className="text-4xl mb-3">🛡️</p>
                    <p className="text-sm text-on-surface-variant">{statusFilter === "open" ? "No open reports. Platform is clean!" : "No reports match filter"}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((report, idx) => {
                        const isActioning = actionLoading === report.id
                        return (
                            <motion.div key={report.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                                className={`rounded-2xl border bg-[#0d0e1a] overflow-hidden ${report.status === "open" ? "border-rose-500/15" : "border-outline-variant/10 opacity-60"}`}>
                                <div className="px-5 py-4 border-b border-outline-variant/10">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <Flag size={13} className="text-error" />
                                            <h3 className="text-sm font-bold text-white">{report.title}</h3>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${report.status === "open" ? "bg-tertiary/100/10 text-tertiary" :
                                            report.status === "dismissed" ? "bg-surface-container-low0/10 text-on-surface-variant/60" :
                                                report.status === "hidden" ? "bg-primary/100/10 text-primary/70" :
                                                    "bg-error/100/10 text-error"
                                            }`}>{report.status}</span>
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant">
                                        Type: <span className="text-primary/70">{(report.type || "").replace("_", " ")}</span>
                                        {report.created_at && <> · {new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</>}
                                    </p>
                                </div>

                                <div className="px-5 py-4">
                                    <div className="rounded-xl bg-error/100/5 border border-rose-500/10 p-3 mb-4">
                                        <p className="text-[9px] text-error font-black uppercase tracking-wider mb-1">Reason</p>
                                        <p className="text-xs text-on-surface-variant/60 leading-relaxed">{report.reason}</p>
                                    </div>

                                    {report.status === "open" && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAction(report.id, "dismissed")} disabled={isActioning}
                                                className="rounded-xl bg-surface-container-low0/8 border border-slate-500/15 text-on-surface-variant/60 px-3 py-2 text-[10px] font-bold hover:bg-surface-container-low0/15 transition flex items-center gap-1.5 disabled:opacity-50">
                                                <CheckCircle size={12} /> Dismiss
                                            </button>
                                            <button onClick={() => handleAction(report.id, "hidden")} disabled={isActioning}
                                                className="rounded-xl bg-primary/100/8 border border-primary/15 text-primary/70 px-3 py-2 text-[10px] font-bold hover:bg-primary/100/15 transition flex items-center gap-1.5 disabled:opacity-50">
                                                <EyeOff size={12} /> Hide Content
                                            </button>
                                            <button onClick={() => handleAction(report.id, "banned")} disabled={isActioning}
                                                className="rounded-xl bg-error/100/8 border border-rose-500/15 text-error px-3 py-2 text-[10px] font-bold hover:bg-error/100/15 transition flex items-center gap-1.5 disabled:opacity-50">
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

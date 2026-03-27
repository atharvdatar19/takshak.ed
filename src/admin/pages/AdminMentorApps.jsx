import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { CheckCircle, XCircle, ExternalLink, GraduationCap, ChevronDown, Loader2, RefreshCw } from "lucide-react"
import { adminGetMentors, adminToggleVerified, adminDeleteMentor } from "../../services/admin"
import { useRealtimeSync } from "../../hooks/useRealtimeSync"

export default function AdminMentorApps() {
    const [apps, setApps] = useState([])
    const [expandedId, setExpandedId] = useState(null)
    const [rejectReason, setRejectReason] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [actionLoading, setActionLoading] = useState(null)

    const loadApps = useCallback(async () => {
        try {
            setLoading(true)
            const { records } = await adminGetMentors(false)
            setApps(records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadApps() }, [loadApps])
    useRealtimeSync("mentors", () => loadApps())

    const handleApprove = async (id) => {
        try {
            setActionLoading(id)
            await adminToggleVerified(id, true)
            setApps(prev => prev.filter(a => a.id !== id))
        } catch (err) {
            setError(err.message)
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (id) => {
        try {
            setActionLoading(id)
            await adminDeleteMentor(id)
            setApps(prev => prev.filter(a => a.id !== id))
            setRejectReason("")
        } catch (err) {
            setError(err.message)
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Mentor Applications</h1>
                    <p className="text-[11px] text-slate-600 mt-1">{apps.length} pending applications</p>
                </div>
                <button onClick={loadApps} disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 transition text-xs font-medium">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
                </button>
            </div>

            {error && <div className="rounded-xl bg-rose-500/8 border border-rose-500/15 px-4 py-3 text-xs text-rose-400">{error}</div>}

            {loading && apps.length === 0 ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/[0.02] animate-pulse" />)}</div>
            ) : apps.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-white/[0.04] bg-[#0d0e1a]">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="text-sm text-slate-600">No pending applications. All caught up!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {apps.map((app, idx) => {
                        const isExpanded = expandedId === app.id
                        const isActioning = actionLoading === app.id
                        return (
                            <motion.div key={app.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                                className="rounded-2xl border border-white/[0.04] bg-[#0d0e1a] overflow-hidden"
                            >
                                {/* Header Row */}
                                <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition"
                                    onClick={() => setExpandedId(isExpanded ? null : app.id)}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-sm font-bold">
                                            {(app.full_name || "?").split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">{app.full_name}</h3>
                                            <p className="text-[10px] text-slate-600 flex items-center gap-1">
                                                <GraduationCap size={10} /> {app.college} · {app.branch} · {app.college_type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/15">
                                            Pending
                                        </span>
                                        <ChevronDown size={14} className={`text-slate-600 transition ${isExpanded ? "rotate-180" : ""}`} />
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                        className="border-t border-white/[0.04] px-5 py-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                                            <div className="space-y-2">
                                                <DetailRow label="Grad Year" value={app.grad_year} />
                                                <DetailRow label="City" value={app.city_origin} />
                                                <DetailRow label="Languages" value={(app.languages || []).join(", ")} />
                                                <DetailRow label="Exams" value={(app.exam_focus || []).join(", ")} />
                                                <DetailRow label="Subjects" value={(app.subjects || []).join(", ")} />
                                            </div>
                                            <div className="space-y-2">
                                                <DetailRow label="Rate (30min)" value={app.rate_30min_inr ? `₹${app.rate_30min_inr}` : "—"} />
                                                <DetailRow label="Rate (60min)" value={app.rate_60min_inr ? `₹${app.rate_60min_inr}` : "—"} />
                                                <DetailRow label="College Email" value={app.college_email || "—"} />
                                                {app.linkedin_url && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider w-24">LinkedIn</span>
                                                        <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                                                            View <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                )}
                                                <DetailRow label="Applied" value={app.created_at ? new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"} />
                                            </div>
                                        </div>

                                        {app.bio && (
                                            <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 mb-4">
                                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Bio</p>
                                                <p className="text-xs text-slate-400 leading-relaxed">{app.bio}</p>
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                                                placeholder="Rejection reason (optional)..."
                                                className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-xs text-slate-300 outline-none resize-none h-16 focus:border-indigo-500/40 transition placeholder:text-slate-700" />
                                        </div>

                                        <div className="flex gap-3">
                                            <button onClick={() => handleApprove(app.id)} disabled={isActioning}
                                                className="flex-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 text-xs font-bold hover:bg-emerald-500/15 transition flex items-center justify-center gap-2 disabled:opacity-50">
                                                {isActioning ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve & Verify
                                            </button>
                                            <button onClick={() => handleReject(app.id)} disabled={isActioning}
                                                className="flex-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2.5 text-xs font-bold hover:bg-rose-500/15 transition flex items-center justify-center gap-2 disabled:opacity-50">
                                                {isActioning ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function DetailRow({ label, value }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider w-24 shrink-0">{label}</span>
            <span className="text-xs text-slate-400">{value || "—"}</span>
        </div>
    )
}

import { motion } from "framer-motion"
import { useState } from "react"
import { CheckCircle, XCircle, ExternalLink, GraduationCap, MapPin, Globe, ChevronDown } from "lucide-react"

const DEMO_APPLICATIONS = [
    {
        id: "app1", full_name: "Rohan Verma", college: "IIT Kanpur", college_type: "IIT", branch: "Mechanical", grad_year: 2025,
        city_origin: "Lucknow", languages: ["Hindi", "English"], exam_focus: ["JEE"], subjects: ["Physics", "Maths"],
        rate_30min_inr: 249, rate_60min_inr: 399, linkedin_url: "https://linkedin.com/in/rohanverma",
        college_email: "rohan@iitk.ac.in", bio: "JEE Advanced AIR 890. Passionate about teaching mechanics and problem-solving.",
        applied_at: "2026-03-18T14:00:00Z", is_verified: false,
    },
    {
        id: "app2", full_name: "Aisha Khan", college: "AIIMS Delhi", college_type: "AIIMS", branch: "MBBS", grad_year: 2024,
        city_origin: "Delhi", languages: ["Hindi", "English", "Urdu"], exam_focus: ["NEET"], subjects: ["Biology", "Chemistry"],
        rate_30min_inr: 349, rate_60min_inr: 549, linkedin_url: "https://linkedin.com/in/aishakhan",
        college_email: "aisha@aiims.in", bio: "NEET AIR 220. I specialize in Biology and Chemistry for NEET aspirants.",
        applied_at: "2026-03-16T10:30:00Z", is_verified: false,
    },
    {
        id: "app3", full_name: "Karan Joshi", college: "NIT Trichy", college_type: "NIT", branch: "ECE", grad_year: 2025,
        city_origin: "Jaipur", languages: ["Hindi", "Hinglish"], exam_focus: ["JEE"], subjects: ["Maths", "Physics"],
        rate_30min_inr: 199, rate_60min_inr: 329, linkedin_url: "https://linkedin.com/in/karanjoshi",
        college_email: "karan@nitt.edu", bio: "Scored 99.2 percentile in JEE Mains. I focus on time-management and mock analysis.",
        applied_at: "2026-03-14T08:00:00Z", is_verified: false,
    },
]

export default function AdminMentorApps() {
    const [apps, setApps] = useState(DEMO_APPLICATIONS)
    const [expandedId, setExpandedId] = useState(null)
    const [rejectReason, setRejectReason] = useState("")

    const handleApprove = (id) => {
        setApps(prev => prev.filter(a => a.id !== id))
        // In production: call Edge Function with service_role to set is_verified=true
    }

    const handleReject = (id) => {
        setApps(prev => prev.filter(a => a.id !== id))
        setRejectReason("")
        // In production: delete application or set rejected flag, send email with reason
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Mentor Applications</h1>
                <p className="text-sm text-slate-500 mt-1">Review, verify, and approve pending mentor profiles.</p>
            </div>

            {apps.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-[#1f1f35] bg-[#111120]">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="text-sm text-slate-500">No pending applications. All caught up!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {apps.map((app, idx) => {
                        const isExpanded = expandedId === app.id
                        return (
                            <motion.div key={app.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                className="rounded-2xl border border-[#1f1f35] bg-[#111120] overflow-hidden"
                            >
                                {/* Header Row */}
                                <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#161830] transition"
                                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 text-sm font-bold">
                                            {app.full_name.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">{app.full_name}</h3>
                                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                                <GraduationCap size={11} /> {app.college} · {app.branch} · {app.college_type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            Pending
                                        </span>
                                        <ChevronDown size={16} className={`text-slate-500 transition ${isExpanded ? "rotate-180" : ""}`} />
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                        className="border-t border-[#1f1f35] px-5 py-5"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                                            <div className="space-y-2">
                                                <DetailRow label="Grad Year" value={app.grad_year} />
                                                <DetailRow label="City" value={app.city_origin} />
                                                <DetailRow label="Languages" value={app.languages.join(", ")} />
                                                <DetailRow label="Exams" value={app.exam_focus.join(", ")} />
                                                <DetailRow label="Subjects" value={app.subjects.join(", ")} />
                                            </div>
                                            <div className="space-y-2">
                                                <DetailRow label="Rate (30min)" value={`₹${app.rate_30min_inr}`} />
                                                <DetailRow label="Rate (60min)" value={`₹${app.rate_60min_inr}`} />
                                                <DetailRow label="College Email" value={app.college_email} />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider w-24">LinkedIn</span>
                                                    <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                                                        View Profile <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                                <DetailRow label="Applied" value={new Date(app.applied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
                                            </div>
                                        </div>

                                        {app.bio && (
                                            <div className="rounded-xl bg-[#0d0e1a] border border-[#1f1f35] p-3 mb-4">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Bio</p>
                                                <p className="text-xs text-slate-300 leading-relaxed">{app.bio}</p>
                                            </div>
                                        )}

                                        {/* Reject Reason */}
                                        <div className="mb-4">
                                            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                                                placeholder="Rejection reason (optional — sent to applicant)..."
                                                className="w-full rounded-xl border border-[#1f1f35] bg-[#0d0e1a] p-3 text-xs text-slate-300 outline-none resize-none h-16 focus:border-indigo-500 transition placeholder:text-slate-600"
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button onClick={() => handleApprove(app.id)}
                                                className="flex-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 text-xs font-bold hover:bg-emerald-500/20 transition flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={14} /> Approve & Verify
                                            </button>
                                            <button onClick={() => handleReject(app.id)}
                                                className="flex-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-2.5 text-xs font-bold hover:bg-rose-500/20 transition flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={14} /> Reject
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
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider w-24 shrink-0">{label}</span>
            <span className="text-xs text-slate-300">{value}</span>
        </div>
    )
}

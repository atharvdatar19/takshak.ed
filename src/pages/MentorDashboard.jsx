import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { CalendarDays, DollarSign, Clock, User, Video, CheckCircle, ExternalLink, TrendingUp, Calendar, AlertCircle } from "lucide-react"
import { getMentorSessions, getMyTransactions, markSessionComplete } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/Toast"
import LoadingSkeleton from "../components/LoadingSkeleton"

const TABS = [
    { id: "sessions", label: "Upcoming Sessions", icon: CalendarDays },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "profile", label: "Profile", icon: User },
]

// Demo data for mentor dashboard
const DEMO_UPCOMING = [
    { id: "s2", student_name: "Varun K.", topic: "Mock Test Analysis", duration_minutes: 30, agreed_rate_inr: 299, meet_link: "https://meet.jit.si/takshak-s2", status: "confirmed", created_at: new Date(Date.now() + 86400000).toISOString() },
    { id: "s3", student_name: "Priya S.", topic: "JEE Physics Strategy", duration_minutes: 60, agreed_rate_inr: 499, meet_link: "https://meet.jit.si/takshak-s3", status: "confirmed", created_at: new Date(Date.now() + 86400000 * 3).toISOString() },
]

const DEMO_EARNINGS = {
    total: 12450, thisMonth: 3200, pending: 798, lastPayout: "2026-03-15",
    sessions: [
        { id: "s1", student_name: "Neha D.", topic: "Electrostatics", amount: 499, payout: 399.20, date: "2026-03-10", status: "cleared" },
        { id: "s4", student_name: "Rahul M.", topic: "College Selection", amount: 299, payout: 239.20, date: "2026-03-08", status: "cleared" },
        { id: "s5", student_name: "Ananya R.", topic: "NEET Biology", amount: 499, payout: 399.20, date: "2026-03-03", status: "cleared" },
    ]
}

export default function MentorDashboard() {
    const [activeTab, setActiveTab] = useState("sessions")
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const { addToast } = useToast()

    useEffect(() => {
        setLoading(true)
        getMentorSessions("m1").then(data => {
            setSessions(data)
            setLoading(false)
        })
    }, [])

    const handleMarkComplete = async (sessionId) => {
        try {
            await markSessionComplete(sessionId)
            setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: "completed" } : s))
            addToast("success", "Session marked as complete. Payout will process in 24 hours.")
        } catch {
            addToast("error", "Could not mark session as complete.")
        }
    }

    return (
        <div className="space-y-8 pb-12 max-w-5xl mx-auto">
            <Helmet>
                <title>Mentor Dashboard | TAKSHAK</title>
            </Helmet>

            {/* Header */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-[32px] bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 px-8 py-10 text-white relative overflow-hidden shadow-xl"
            >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent" />
                <div className="relative z-10">
                    <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3 border border-white/20 text-emerald-200">
                        🎓 Mentor Panel
                    </span>
                    <h1 className="text-3xl font-black tracking-tight">Mentor Dashboard</h1>
                    <p className="text-emerald-100/80 text-sm mt-1">Manage sessions, track earnings, and update your availability.</p>
                </div>
            </motion.section>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab.id
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            <Icon size={15} /> {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            {loading ? <LoadingSkeleton rows={6} /> : (
                <>
                    {/* UPCOMING SESSIONS */}
                    {activeTab === "sessions" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {DEMO_UPCOMING.length === 0 ? (
                                <div className="text-center py-16 rounded-2xl border border-slate-200 bg-white">
                                    <p className="text-4xl mb-3">📅</p>
                                    <p className="text-sm text-slate-500">No upcoming sessions. Students will book you soon!</p>
                                </div>
                            ) : (
                                DEMO_UPCOMING.map((session, idx) => {
                                    const sessionDate = new Date(session.created_at)
                                    const isPast = sessionDate < new Date()
                                    const isCompleted = session.status === "completed"
                                    return (
                                        <motion.div key={session.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                            className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                                                            {isCompleted ? "Completed" : "Confirmed"}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">{session.duration_minutes} min</span>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-slate-900">{session.student_name}</h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">{session.topic}</p>
                                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                        <CalendarDays size={11} /> {sessionDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · {sessionDate.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-lg font-black text-emerald-600">₹{session.agreed_rate_inr}</span>
                                                    <a href={session.meet_link} target="_blank" rel="noopener noreferrer"
                                                        className="rounded-xl bg-indigo-50 text-indigo-600 px-3 py-2 text-xs font-bold border border-indigo-200 hover:bg-indigo-100 transition flex items-center gap-1"
                                                    >
                                                        <Video size={13} /> Join
                                                    </a>
                                                    {!isCompleted && (
                                                        <button onClick={() => handleMarkComplete(session.id)} disabled={!isPast}
                                                            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-2 text-xs font-bold shadow-sm hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                                                            title={isPast ? "Mark as complete" : "Wait until session time passes"}
                                                        >
                                                            <CheckCircle size={13} /> Complete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            )}
                        </motion.div>
                    )}

                    {/* EARNINGS */}
                    {activeTab === "earnings" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            {/* Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Earned", value: `₹${DEMO_EARNINGS.total.toLocaleString()}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                                    { label: "This Month", value: `₹${DEMO_EARNINGS.thisMonth.toLocaleString()}`, color: "text-indigo-600", bg: "bg-indigo-50" },
                                    { label: "Pending Clearance", value: `₹${DEMO_EARNINGS.pending.toLocaleString()}`, color: "text-amber-600", bg: "bg-amber-50" },
                                    { label: "Last Payout", value: DEMO_EARNINGS.lastPayout, color: "text-slate-600", bg: "bg-slate-50" },
                                ].map((stat, i) => (
                                    <div key={i} className={`rounded-2xl border border-slate-200 ${stat.bg} p-4`}>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
                                        <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Session breakdown */}
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-4">Per-Session Breakdown</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3">Student</th>
                                                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3">Topic</th>
                                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3">Paid</th>
                                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3">Your Share</th>
                                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3">Date</th>
                                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {DEMO_EARNINGS.sessions.map(s => (
                                                <tr key={s.id} className="border-b border-slate-50">
                                                    <td className="py-3 font-semibold text-slate-700">{s.student_name}</td>
                                                    <td className="py-3 text-slate-500 text-xs">{s.topic}</td>
                                                    <td className="py-3 text-right">₹{s.amount}</td>
                                                    <td className="py-3 text-right font-bold text-emerald-600">₹{s.payout}</td>
                                                    <td className="py-3 text-right text-xs text-slate-400">{s.date}</td>
                                                    <td className="py-3 text-right">
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-700">{s.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                                <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-700">Payouts are processed 24 hours after session completion. You receive <strong>80%</strong> of the session fee. Phase 2 will enable automated bank transfers via Razorpay.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* AVAILABILITY */}
                    {activeTab === "availability" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Calendar size={16} className="text-indigo-600" /> Manage Your Availability</h3>
                                <p className="text-xs text-slate-500 mb-6">Click on time slots to toggle them. Changes apply to future bookings only. Slots within 2 hours cannot be modified.</p>

                                <div className="grid grid-cols-7 gap-2">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                                        <div key={day} className="text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{day}</p>
                                            <div className="space-y-1.5">
                                                {["9:00 AM", "10:30 AM", "2:00 PM", "4:00 PM", "6:30 PM"].map(time => {
                                                    const isActive = Math.random() > 0.4 // demo randomization
                                                    return (
                                                        <button key={time}
                                                            className={`w-full px-1 py-2 rounded-lg text-[10px] font-bold transition ${isActive
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                                                : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100"
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* PROFILE */}
                    {activeTab === "profile" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-5">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><User size={16} className="text-indigo-600" /> Profile Editor</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Bio</label>
                                        <textarea defaultValue="Secured AIR 342 in JEE Advanced. I help students build foolproof strategies..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none resize-none h-24 focus:border-indigo-500 focus:bg-white transition" /></div>
                                    <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Specializations</label>
                                        <input type="text" defaultValue="Physics, Maths, JEE Strategy"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition" /></div>
                                    <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Languages</label>
                                        <input type="text" defaultValue="Hindi, English"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition" /></div>
                                    <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Intro Note</label>
                                        <input type="text" defaultValue="I make JEE Physics feel like a breeze 💨"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition" /></div>
                                </div>

                                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                                    <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-700"><strong>Rate changes</strong> take effect after a 24-hour delay. Existing bookings keep the rate locked at the time of booking.</p>
                                </div>

                                <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition">
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    )
}

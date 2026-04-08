import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { CalendarDays, DollarSign, Clock, User, Video, CheckCircle, XCircle, ExternalLink, TrendingUp, Calendar, AlertCircle, Link2, Shield, Loader, Gift } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/Toast"
import LoadingSkeleton from "../components/LoadingSkeleton"
import supabase from "../supabaseClient"

const TABS = [
    { id: "pending", label: "Pending Requests", icon: Clock },
    { id: "sessions", label: "Upcoming Sessions", icon: CalendarDays },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "profile", label: "Profile", icon: User },
]

export default function MentorDashboard() {
    const [activeTab, setActiveTab] = useState("pending")
    const [pendingSessions, setPendingSessions] = useState([])
    const [upcomingSessions, setUpcomingSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null) // track which session is being acted on
    const { user } = useAuth()
    const { addToast } = useToast()

    // Fetch sessions for this mentor
    useEffect(() => {
        async function loadSessions() {
            setLoading(true)
            try {
                if (supabase && user) {
                    // Get mentor record for this user
                    const { data: mentorData } = await supabase
                        .from("mentors")
                        .select("id")
                        .eq("user_id", user.id)
                        .single()

                    if (mentorData) {
                        // Fetch pending sessions
                        const { data: pending } = await supabase
                            .from("sessions")
                            .select("*")
                            .eq("mentor_id", mentorData.id)
                            .eq("status", "pending")
                            .order("created_at", { ascending: false })

                        // Fetch accepted/upcoming sessions
                        const { data: upcoming } = await supabase
                            .from("sessions")
                            .select("*")
                            .eq("mentor_id", mentorData.id)
                            .eq("status", "accepted")
                            .order("scheduled_at", { ascending: true })

                        setPendingSessions(pending || [])
                        setUpcomingSessions(upcoming || [])
                    }
                } else {
                    // Demo data
                    setPendingSessions([
                        { id: "demo-1", student_email: "varun@gmail.com", topic: "JEE Physics — Electrostatics doubt clearing", duration_minutes: 10, agreed_rate_inr: 0, is_free_session: true, status: "pending", created_at: new Date().toISOString() },
                        { id: "demo-2", student_email: "priya@gmail.com", topic: "College selection advice — NIT vs IIIT", duration_minutes: 10, agreed_rate_inr: 80, is_free_session: false, status: "pending", created_at: new Date(Date.now() - 3600000).toISOString() },
                    ])
                    setUpcomingSessions([
                        { id: "demo-3", student_email: "neha@gmail.com", topic: "Mock Test Analysis", duration_minutes: 10, agreed_rate_inr: 80, meet_link: "https://meet.jit.si/takshak-demo3", status: "accepted", scheduled_at: new Date(Date.now() + 86400000).toISOString(), created_at: new Date().toISOString() },
                    ])
                }
            } catch (err) {
                console.error("Failed to load sessions:", err)
            }
            setLoading(false)
        }
        loadSessions()
    }, [user])

    // Accept a session and generate Jitsi Meet link
    const handleAccept = async (sessionId) => {
        setActionLoading(sessionId)
        try {
            const meetId = `takshak-${sessionId.slice(0, 8)}-${Date.now().toString(36)}`
            const meetLink = `https://meet.jit.si/${meetId}`
            const meetPassword = Math.random().toString(36).slice(2, 8)

            if (supabase) {
                const { error } = await supabase
                    .from("sessions")
                    .update({
                        status: "accepted",
                        meet_link: meetLink,
                        meet_password: meetPassword,
                    })
                    .eq("id", sessionId)

                if (error) throw error
            }

            // Move from pending to upcoming
            const session = pendingSessions.find(s => s.id === sessionId)
            if (session) {
                const updated = { ...session, status: "accepted", meet_link: meetLink, meet_password: meetPassword }
                setPendingSessions(prev => prev.filter(s => s.id !== sessionId))
                setUpcomingSessions(prev => [updated, ...prev])
            }

            addToast("success", "Session accepted! Meet link generated and will be sent to student.")
        } catch (err) {
            console.error("Accept Error:", err)
            addToast("error", err.message || "Failed to accept session")
        }
        setActionLoading(null)
    }

    // Reject a session
    const handleReject = async (sessionId) => {
        setActionLoading(sessionId)
        try {
            if (supabase) {
                const { error } = await supabase
                    .from("sessions")
                    .update({ status: "rejected" })
                    .eq("id", sessionId)

                if (error) throw error
            }

            setPendingSessions(prev => prev.filter(s => s.id !== sessionId))
            addToast("success", "Session declined. Student will be notified.")
        } catch (err) {
            console.error("Reject Error:", err)
            addToast("error", err.message || "Failed to decline session")
        }
        setActionLoading(null)
    }

    // Mark session complete
    const handleMarkComplete = async (sessionId) => {
        setActionLoading(sessionId)
        try {
            if (supabase) {
                await supabase.from("sessions").update({ status: "completed" }).eq("id", sessionId)
            }
            setUpcomingSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: "completed" } : s))
            addToast("success", "Session marked as complete.")
        } catch {
            addToast("error", "Could not mark session as complete.")
        }
        setActionLoading(null)
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "Flexible"
        const d = new Date(dateStr)
        return `${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · ${d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: true })}`
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
                    <span className="inline-block rounded-full glass/10 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3 border border-outline-variant/20 text-emerald-200">
                        🎓 Mentor Panel
                    </span>
                    <h1 className="text-3xl font-black tracking-tight">Mentor Dashboard</h1>
                    <p className="text-emerald-100/80 text-sm mt-1">Manage session requests, track earnings, and update your availability.</p>
                    
                    {/* Quick stats */}
                    <div className="flex gap-6 mt-6">
                        <div>
                            <p className="text-2xl font-black text-white">{pendingSessions.length}</p>
                            <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Pending</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{upcomingSessions.length}</p>
                            <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Upcoming</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    const count = tab.id === "pending" ? pendingSessions.length : tab.id === "sessions" ? upcomingSessions.length : null
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab.id
                                ? "bg-surface-container-highest text-white shadow-md"
                                : "glass text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container-low"
                                }`}
                        >
                            <Icon size={15} /> {tab.label}
                            {count > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-error/100 text-white text-[9px] font-black">{count}</span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            {loading ? <LoadingSkeleton rows={6} /> : (
                <>
                    {/* PENDING REQUESTS */}
                    {activeTab === "pending" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {pendingSessions.length === 0 ? (
                                <div className="text-center py-16 rounded-2xl border border-outline-variant/20 glass">
                                    <p className="text-4xl mb-3">📭</p>
                                    <p className="text-sm text-on-surface-variant">No pending requests. Students will book you soon!</p>
                                </div>
                            ) : (
                                pendingSessions.map((session, idx) => (
                                    <motion.div key={session.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                        className="rounded-2xl border border-outline-variant/20 glass shadow-sm p-5"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-tertiary/15 text-amber-700">
                                                        Pending
                                                    </span>
                                                    {session.is_free_session && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-tertiary/15 text-tertiary flex items-center gap-0.5">
                                                            <Gift size={9} /> Free
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-on-surface-variant/60">{session.duration_minutes} min</span>
                                                </div>
                                                <h3 className="text-sm font-bold text-on-surface">{session.student_email || "Student"}</h3>
                                                <p className="text-xs text-on-surface-variant mt-0.5">{session.topic}</p>
                                                <p className="text-xs text-on-surface-variant/60 mt-1 flex items-center gap-1">
                                                    <CalendarDays size={11} /> Requested {formatDate(session.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-lg font-black text-tertiary">
                                                    {session.is_free_session ? "FREE" : `₹${session.agreed_rate_inr}`}
                                                </span>
                                                <button
                                                    onClick={() => handleReject(session.id)}
                                                    disabled={actionLoading === session.id}
                                                    className="rounded-xl bg-error/10 text-error px-3 py-2 text-xs font-bold border border-error/20 hover:bg-red-100 transition flex items-center gap-1 disabled:opacity-40"
                                                >
                                                    <XCircle size={13} /> Decline
                                                </button>
                                                <button
                                                    onClick={() => handleAccept(session.id)}
                                                    disabled={actionLoading === session.id}
                                                    className="rounded-xl bg-gradient-to-r from-tertiary to-tertiary text-white px-3 py-2 text-xs font-bold shadow-sm hover:shadow-md transition flex items-center gap-1 disabled:opacity-40"
                                                >
                                                    {actionLoading === session.id ? (
                                                        <Loader size={13} className="animate-spin" />
                                                    ) : (
                                                        <CheckCircle size={13} />
                                                    )}
                                                    Accept & Generate Link
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* UPCOMING SESSIONS */}
                    {activeTab === "sessions" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {upcomingSessions.length === 0 ? (
                                <div className="text-center py-16 rounded-2xl border border-outline-variant/20 glass">
                                    <p className="text-4xl mb-3">📅</p>
                                    <p className="text-sm text-on-surface-variant">No upcoming sessions. Accept pending requests to see them here.</p>
                                </div>
                            ) : (
                                upcomingSessions.map((session, idx) => {
                                    const isCompleted = session.status === "completed"
                                    return (
                                        <motion.div key={session.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                            className="rounded-2xl border border-outline-variant/20 glass shadow-sm p-5"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isCompleted ? "bg-tertiary/15 text-tertiary" : "bg-primary/15 text-primary"}`}>
                                                            {isCompleted ? "Completed" : "Confirmed"}
                                                        </span>
                                                        <span className="text-[10px] text-on-surface-variant/60">{session.duration_minutes} min</span>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-on-surface">{session.student_email || "Student"}</h3>
                                                    <p className="text-xs text-on-surface-variant mt-0.5">{session.topic}</p>
                                                    <p className="text-xs text-on-surface-variant/60 mt-1 flex items-center gap-1">
                                                        <CalendarDays size={11} /> {formatDate(session.scheduled_at || session.created_at)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-lg font-black text-tertiary">
                                                        {session.is_free_session ? "FREE" : `₹${session.agreed_rate_inr}`}
                                                    </span>
                                                    {session.meet_link && (
                                                        <a href={session.meet_link} target="_blank" rel="noopener noreferrer"
                                                            className="rounded-xl bg-primary/10 text-primary px-3 py-2 text-xs font-bold border border-primary/20 hover:bg-primary/15 transition flex items-center gap-1"
                                                        >
                                                            <Video size={13} /> Join
                                                        </a>
                                                    )}
                                                    {!isCompleted && (
                                                        <button onClick={() => handleMarkComplete(session.id)}
                                                            disabled={actionLoading === session.id}
                                                            className="rounded-xl bg-gradient-to-r from-tertiary to-tertiary text-white px-3 py-2 text-xs font-bold shadow-sm hover:shadow-md transition disabled:opacity-40 flex items-center gap-1"
                                                        >
                                                            <CheckCircle size={13} /> Complete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Meet link details */}
                                            {session.meet_link && (
                                                <div className="mt-3 rounded-xl bg-sky-50 border border-sky-200 p-3 flex items-start gap-2">
                                                    <Shield size={13} className="text-sky-600 mt-0.5 shrink-0" />
                                                    <div className="text-[10px] text-sky-700">
                                                        <p className="font-bold">Meet Link: <a href={session.meet_link} target="_blank" rel="noopener noreferrer" className="text-primary underline">{session.meet_link}</a></p>
                                                        {session.meet_password && <p>Password: <span className="font-mono font-bold">{session.meet_password}</span></p>}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )
                                })
                            )}
                        </motion.div>
                    )}

                    {/* EARNINGS */}
                    {activeTab === "earnings" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            <div className="rounded-2xl border border-outline-variant/20 glass shadow-sm p-5 text-center">
                                <TrendingUp size={32} className="mx-auto text-tertiary mb-3" />
                                <h3 className="text-lg font-bold text-on-surface">Earnings Dashboard</h3>
                                <p className="text-sm text-on-surface-variant mt-1">Earnings tracking will be available once Razorpay integration is set up.</p>
                                <p className="text-xs text-on-surface-variant/60 mt-2">You receive <strong>80%</strong> of each paid session (₹64 per ₹80 session).</p>
                            </div>
                        </motion.div>
                    )}

                    {/* AVAILABILITY */}
                    {activeTab === "availability" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="rounded-2xl border border-outline-variant/20 glass shadow-sm p-5">
                                <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2"><Calendar size={16} className="text-primary" /> Manage Your Availability</h3>
                                <p className="text-xs text-on-surface-variant mb-6">Click on time slots to toggle them. Changes apply to future bookings only.</p>

                                <div className="grid grid-cols-7 gap-2">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                                        <div key={day} className="text-center">
                                            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase mb-2">{day}</p>
                                            <div className="space-y-1.5">
                                                {["9:00 AM", "10:30 AM", "2:00 PM", "4:00 PM", "6:30 PM"].map(time => {
                                                    const isActive = Math.random() > 0.4
                                                    return (
                                                        <button key={time}
                                                            className={`w-full px-1 py-2 rounded-lg text-[10px] font-bold transition ${isActive
                                                                ? "bg-tertiary/10 text-tertiary border border-tertiary/20 hover:bg-tertiary/15"
                                                                : "bg-surface-container-low text-on-surface-variant/60 border border-outline-variant/10 hover:bg-surface-container"
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
                            <div className="rounded-2xl border border-outline-variant/20 glass shadow-sm p-5 space-y-5">
                                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2"><User size={16} className="text-primary" /> Profile Editor</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 block mb-1">Bio</label>
                                        <textarea defaultValue=""
                                            placeholder="Tell students about your experience, exam scores, and mentoring style..."
                                            className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low p-3 text-sm outline-none resize-none h-24 focus:border-primary focus:glass transition" /></div>
                                    <div><label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 block mb-1">Specializations</label>
                                        <input type="text" placeholder="e.g., Physics, Maths, JEE Strategy"
                                            className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary focus:glass transition" /></div>
                                    <div><label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 block mb-1">Languages</label>
                                        <input type="text" placeholder="e.g., Hindi, English"
                                            className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary focus:glass transition" /></div>
                                    <div><label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 block mb-1">LinkedIn URL</label>
                                        <input type="text" placeholder="https://linkedin.com/in/yourname"
                                            className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary focus:glass transition" /></div>
                                </div>

                                <div className="rounded-xl bg-tertiary/10 border border-amber-200 p-3 flex items-start gap-2">
                                    <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-700">Session pricing is fixed at <strong>₹80 per 10 min</strong>. First session is always free for new students.</p>
                                </div>

                                <button className="rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition">
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

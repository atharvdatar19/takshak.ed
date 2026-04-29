import { Helmet } from "react-helmet-async"
import {
  Bell, BookOpen, CalendarDays, ChevronRight, Clock,
  Compass, GraduationCap, MessageSquare, Shield,
  Users, Zap, ClipboardList, TrendingUp, AlertCircle,
  Search, ArrowRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@auth/AuthContext"
import { getDashboardBundle } from "@database/services/superapp"
import { formatDate, getDaysLeft } from "@lib/date"
import LoadingSkeleton from "@components/LoadingSkeleton"
import NotificationBell from "@components/NotificationBell"
import SearchBar from "@components/search/SearchBar"
import CountUp from "@components/motion/CountUp"

// ── Stream colour palette ─────────────────────────────────────────────────────
const STREAM_COLORS = {
  Engineering:    { bg: "rgba(99,102,241,0.10)",  text: "#6366f1",  dot: "#6366f1"  },
  Medical:        { bg: "rgba(16,185,129,0.10)",  text: "#10b981",  dot: "#10b981"  },
  Law:            { bg: "rgba(245,158,11,0.10)",  text: "#f59e0b",  dot: "#f59e0b"  },
  Management:     { bg: "rgba(139,92,246,0.10)",  text: "#8b5cf6",  dot: "#8b5cf6"  },
  "Civil Services":{ bg: "rgba(59,130,246,0.10)", text: "#3b82f6",  dot: "#3b82f6"  },
  Banking:        { bg: "rgba(20,184,166,0.10)",  text: "#14b8a6",  dot: "#14b8a6"  },
  Defence:        { bg: "rgba(239,68,68,0.10)",   text: "#ef4444",  dot: "#ef4444"  },
  University:     { bg: "rgba(249,115,22,0.10)",  text: "#f97316",  dot: "#f97316"  },
  Architecture:   { bg: "rgba(236,72,153,0.10)",  text: "#ec4899",  dot: "#ec4899"  },
  Design:         { bg: "rgba(168,85,247,0.10)",  text: "#a855f7",  dot: "#a855f7"  },
  Pharmacy:       { bg: "rgba(34,197,94,0.10)",   text: "#22c55e",  dot: "#22c55e"  },
  "Hotel Management":{ bg: "rgba(234,179,8,0.10)",text: "#eab308",  dot: "#eab308"  },
}
const streamColor = (s) => STREAM_COLORS[s] || { bg: "rgba(100,116,139,0.10)", text: "#64748b", dot: "#64748b" }

// Days-remaining urgency
const urgencyColor = (d) => {
  if (d <= 14)  return "#ef4444"
  if (d <= 45)  return "#f59e0b"
  return "#10b981"
}

// ── Exam countdown card (sidebar) ─────────────────────────────────────────────
function ExamCard({ exam }) {
  const dateField = exam.exam_date || exam.start_date
  const days = dateField ? getDaysLeft(dateField) : null
  if (days !== null && days < 0) return null

  const regDays = exam.registration_end ? getDaysLeft(exam.registration_end) : null
  const sc = streamColor(exam.stream || exam.category)
  const urg = days !== null ? urgencyColor(days) : sc.text

  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
      style={{ borderBottom: "1px solid var(--obsidian-outline-variant)" }}
    >
      {/* Days bubble */}
      <div
        className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-center"
        style={{ background: `${urg}18` }}
      >
        {days !== null ? (
          <>
            <span className="text-[15px] font-black leading-none" style={{ color: urg }}>{days}</span>
            <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: urg }}>days</span>
          </>
        ) : (
          <CalendarDays size={16} style={{ color: urg }} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-bold leading-snug" style={{ color: "var(--obsidian-on-surface)" }}>
          {exam.name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ background: sc.bg, color: sc.text }}
          >
            {exam.stream || exam.category}
          </span>
          {regDays !== null && regDays >= 0 && (
            <span className="text-[10px]" style={{ color: regDays <= 7 ? "#ef4444" : "var(--obsidian-on-surface-variant)" }}>
              Reg closes in {regDays}d
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sidebar box wrapper ───────────────────────────────────────────────────────
function SideWidget({ title, icon: Icon, iconColor, children, linkTo, linkLabel }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h3 className="flex items-center gap-2 text-[13px] font-bold" style={{ color: "var(--obsidian-on-surface)" }}>
          <Icon size={14} style={{ color: iconColor }} />
          {title}
        </h3>
        {linkTo && (
          <Link to={linkTo} className="text-[14px] font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--obsidian-primary)" }}>
            {linkLabel || "View all"}
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}

// ── Exam countdown sidebar widget ─────────────────────────────────────────────
function ExamCountdownWidget({ exams }) {
  const upcoming = useMemo(() => {
    const now = new Date()
    return (exams || [])
      .filter(e => {
        const d = e.exam_date || e.start_date
        return d && new Date(d) >= now
      })
      .sort((a, b) => new Date(a.exam_date || a.start_date) - new Date(b.exam_date || b.start_date))
      .slice(0, 6)
  }, [exams])

  return (
    <SideWidget title="Upcoming Exams" icon={CalendarDays} iconColor="#6366f1" linkTo="/prepare" linkLabel="All exams">
      <div className="px-2 pb-3">
        {upcoming.length === 0 ? (
          <p className="px-2 pb-3 text-[12px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
            No exam data yet. Admin can add via Exam Timeline.
          </p>
        ) : (
          upcoming.map(e => <ExamCard key={e.id || e.slug || e.name} exam={e} />)
        )}
      </div>
    </SideWidget>
  )
}

// ── Registration deadline strip ───────────────────────────────────────────────
function RegDeadlineWidget({ exams }) {
  const closing = useMemo(() => {
    const now = new Date()
    return (exams || [])
      .filter(e => {
        if (!e.registration_end) return false
        const d = getDaysLeft(e.registration_end)
        return d >= 0 && d <= 30
      })
      .sort((a, b) => new Date(a.registration_end) - new Date(b.registration_end))
      .slice(0, 4)
  }, [exams])

  if (closing.length === 0) return null

  return (
    <SideWidget title="Registration Closing Soon" icon={AlertCircle} iconColor="#f59e0b">
      <div className="space-y-1 px-2 pb-3">
        {closing.map(e => {
          const d = getDaysLeft(e.registration_end)
          const sc = streamColor(e.stream || e.category)
          return (
            <div key={e.id || e.name} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                style={{ background: d <= 7 ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)", color: d <= 7 ? "#ef4444" : "#f59e0b" }}
              >
                {d}d left
              </span>
              <span className="truncate text-[12px] font-medium" style={{ color: "var(--obsidian-on-surface)" }}>
                {e.name}
              </span>
            </div>
          )
        })}
      </div>
    </SideWidget>
  )
}

// ── Upcoming sessions sidebar widget ──────────────────────────────────────────
function SessionsWidget({ bookings }) {
  const upcoming = useMemo(() => {
    const now = new Date()
    return (bookings || [])
      .filter(b => b.status !== "cancelled" && new Date(b.requested_datetime) > now)
      .slice(0, 3)
  }, [bookings])

  return (
    <SideWidget title="Your Sessions" icon={Users} iconColor="#10b981" linkTo="/sessions" linkLabel="Manage">
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 pb-5 text-center">
          <p className="text-[12px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
            No upcoming sessions booked.
          </p>
          <Link
            to="/mentors"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-bold text-white"
            style={{ background: "var(--obsidian-primary)" }}
          >
            Find a Mentor <ArrowRight size={11} />
          </Link>
        </div>
      ) : (
        <div className="space-y-1 px-2 pb-3">
          {upcoming.map(b => (
            <div key={b.id} className="flex items-center gap-2.5 rounded-xl px-2 py-2">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
              >
                {(b.mentors?.name || "M").charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold" style={{ color: "var(--obsidian-on-surface)" }}>
                  {b.mentors?.name || "Mentor"}
                </p>
                <p className="text-[10.5px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                  {new Date(b.requested_datetime).toLocaleString("en-IN", {
                    weekday: "short", day: "numeric", month: "short",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold capitalize"
                style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
              >
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </SideWidget>
  )
}

// ── College deadline sidebar widget ───────────────────────────────────────────
function CollegeDeadlineWidget({ colleges }) {
  const urgent = useMemo(() => {
    return (colleges || [])
      .filter(c => c.application_end && getDaysLeft(c.application_end) >= 0 && getDaysLeft(c.application_end) <= 30)
      .sort((a, b) => new Date(a.application_end) - new Date(b.application_end))
      .slice(0, 4)
  }, [colleges])

  if (urgent.length === 0) return null

  return (
    <SideWidget title="College Deadlines" icon={Clock} iconColor="#ef4444" linkTo="/discover" linkLabel="Browse">
      <div className="space-y-1 px-2 pb-3">
        {urgent.map(c => {
          const d = getDaysLeft(c.application_end)
          return (
            <div key={c.id} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                style={{ background: d <= 5 ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.10)", color: d <= 5 ? "#ef4444" : "#f59e0b" }}
              >
                {d}d
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold" style={{ color: "var(--obsidian-on-surface)" }}>
                  {c.name}
                </p>
                <p className="text-[10px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                  {c.city}{c.state ? `, ${c.state}` : ""}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </SideWidget>
  )
}

// ── Contextual action tile ────────────────────────────────────────────────────
function ActionTile({ icon: Icon, color, bg, title, sub, to, tag }) {
  return (
    <Link
      to={to}
      className="group relative flex items-start gap-3.5 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: "var(--obsidian-surface)",
        border: "1px solid var(--obsidian-outline-variant)",
      }}
    >
      {/* left accent bar */}
      <span
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: color }}
      />
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
        style={{ background: bg }}
      >
        <Icon size={17} style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-bold leading-snug" style={{ color: "var(--obsidian-on-surface)" }}>
            {title}
          </p>
          {tag && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider"
              style={{ background: `${color}20`, color }}
            >
              {tag}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11.5px] leading-relaxed" style={{ color: "var(--obsidian-on-surface-variant)" }}>
          {sub}
        </p>
      </div>
      <ChevronRight
        size={13}
        className="mt-0.5 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60"
        style={{ color: "var(--obsidian-on-surface-variant)" }}
      />
    </Link>
  )
}

// ── Greeting section ──────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, profile } = useAuth?.() || {}
  const [bundle, setBundle]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [stats, setStats]       = useState({ students: 10000, colleges: 500, mentors: 50 })

  const displayName = profile?.full_name || profile?.name || user?.displayName || null

  useEffect(() => {
    getDashboardBundle()
      .then(b => setBundle(b))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const computed = useMemo(() => {
    if (!bundle) return {
      upcomingBookings: [], deadlineColleges: [], unreadCount: 0,
      studyMinutesWeek: 0, quizCount: 0, exams: [],
    }

    const now     = new Date()
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)

    const upcomingBookings = (bundle.bookings || [])
      .filter(b => b.status !== "cancelled" && new Date(b.requested_datetime) > now)
      .slice(0, 3)

    const deadlineColleges = (bundle.colleges || [])
      .filter(c => c.application_end && getDaysLeft(c.application_end) >= 0 && getDaysLeft(c.application_end) <= 30)
      .sort((a, b) => new Date(a.application_end) - new Date(b.application_end))
      .slice(0, 4)

    const unreadCount      = (bundle.notifications || []).filter(n => !n.is_read).length
    const studyMinutesWeek = (bundle.studySessions || [])
      .filter(s => new Date(s.created_date) > weekAgo)
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
    const quizCount        = (bundle.quizAttempts || []).length
    const exams            = bundle.exams || []

    return { upcomingBookings, deadlineColleges, unreadCount, studyMinutesWeek, quizCount, exams }
  }, [bundle])

  // Contextual insight line under greeting
  const insight = useMemo(() => {
    if (!bundle) return null
    const regClosing = (computed.exams || []).filter(e => {
      if (!e.registration_end) return false
      const d = getDaysLeft(e.registration_end)
      return d >= 0 && d <= 7
    }).length
    if (regClosing > 0) return `${regClosing} exam registration${regClosing > 1 ? "s" : ""} closing this week`
    if (computed.deadlineColleges.length > 0) return `${computed.deadlineColleges.length} college deadline${computed.deadlineColleges.length > 1 ? "s" : ""} in the next 30 days`
    if (computed.upcomingBookings.length > 0) return `You have ${computed.upcomingBookings.length} upcoming mentor session${computed.upcomingBookings.length > 1 ? "s" : ""}`
    return "You're all caught up — let's keep the momentum going."
  }, [computed, bundle])

  // Contextual action tiles
  const actionTiles = useMemo(() => {
    const hasSessions  = computed.upcomingBookings.length > 0
    const hasDeadlines = computed.deadlineColleges.length > 0
    const nextSession  = computed.upcomingBookings[0]

    return [
      {
        icon: Users,
        color: "#6366f1",
        bg: "rgba(99,102,241,0.10)",
        to: hasSessions ? "/sessions" : "/mentors",
        title: hasSessions
          ? `Session with ${nextSession?.mentors?.name || "Mentor"}`
          : "Book a Mentor",
        sub: hasSessions
          ? new Date(nextSession.requested_datetime).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
          : "1-on-1 guidance from IIT/AIIMS toppers and verified seniors",
        tag: hasSessions ? "Upcoming" : "Recommended",
      },
      {
        icon: Compass,
        color: "#0ea5e9",
        bg: "rgba(14,165,233,0.10)",
        to: "/discover",
        title: hasDeadlines ? `${computed.deadlineColleges.length} Deadlines This Month` : "Discover Colleges",
        sub: hasDeadlines
          ? `${computed.deadlineColleges[0]?.name} closes in ${getDaysLeft(computed.deadlineColleges[0]?.application_end)} days`
          : "Browse, compare and track college applications across India",
        tag: hasDeadlines ? "Urgent" : null,
      },
      {
        icon: BookOpen,
        color: "#10b981",
        bg: "rgba(16,185,129,0.10)",
        to: computed.studyMinutesWeek > 0 ? "/planner" : "/prepare",
        title: computed.studyMinutesWeek > 0 ? "Continue Studying" : "Start Preparing",
        sub: computed.studyMinutesWeek > 0
          ? `${Math.round(computed.studyMinutesWeek / 60)}h studied this week — keep it going`
          : "Study planner, resources, bridge courses and document checklist",
        tag: null,
      },
      {
        icon: MessageSquare,
        color: "#8b5cf6",
        bg: "rgba(139,92,246,0.10)",
        to: user ? "/forum" : "/community",
        title: "Ask a Doubt",
        sub: "Anonymous forum — no judgment, real answers from peers and mentors",
        tag: null,
      },
      {
        icon: Shield,
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.10)",
        to: "/defence",
        title: "Defence Prep",
        sub: "NDA, CDS, SSB preparation with verified ex-servicemen mentors",
        tag: "Free session",
      },
      {
        icon: ClipboardList,
        color: "#ec4899",
        bg: "rgba(236,72,153,0.10)",
        to: user ? "/applications" : "/signup",
        title: "Track Applications",
        sub: user ? "Your Kanban board for colleges, scholarships and internships" : "Sign in to track all your applications in one place",
        tag: null,
      },
    ]
  }, [computed, user])

  if (loading) return <LoadingSkeleton rows={12} />

  return (
    <div>
      <Helmet>
        <title>Home — TAKक्षक</title>
        <meta name="description" content="Your student command centre — exam countdowns, mentor sessions, college deadlines and more." />
      </Helmet>

      {/* ── Greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="mb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {displayName ? (
              <h1
                className="text-[22px] font-black tracking-tight"
                style={{ color: "var(--obsidian-on-surface)", letterSpacing: "-0.03em" }}
              >
                {getGreeting()}, {displayName.split(" ")[0]} 👋
              </h1>
            ) : (
              <h1
                className="text-[22px] font-black tracking-tight"
                style={{ color: "var(--obsidian-on-surface)", letterSpacing: "-0.03em" }}
              >
                Welcome to TAKक्षक
              </h1>
            )}
            {insight && (
              <p className="mt-1 text-[13px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                {insight}
              </p>
            )}
          </div>
          {user && (
            <div className="shrink-0 mt-1">
              <NotificationBell unreadCount={computed.unreadCount} />
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="flex gap-5 items-start">

        {/* ── LEFT: main content ── */}
        <div className="min-w-0 flex-1 space-y-6">

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            <SearchBar popularTags={["JEE", "NEET", "CUET", "GATE", "CLAT", "CAT", "NDA", "UPSC"]} />
          </motion.div>

          {/* Exam strip (mobile only — horizontal scroll) */}
          <motion.div
            className="lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.12 }}
          >
            <MobileExamStrip exams={computed.exams} />
          </motion.div>

          {/* Action tiles */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h2
              className="mb-3 flex items-center gap-2 text-[14px] font-black uppercase tracking-widest"
              style={{ color: "var(--obsidian-on-surface-variant)" }}
            >
              <Zap size={12} /> Quick Access
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {actionTiles.slice(0, 4).map(t => (
                <ActionTile key={t.title} {...t} />
              ))}
            </div>
            {/* Extra tiles — collapsed row */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {actionTiles.slice(4).map(t => (
                <ActionTile key={t.title} {...t} />
              ))}
            </div>
          </motion.section>

          {/* Mobile sessions + deadlines (stacked below tiles) */}
          <div className="lg:hidden space-y-4">
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
              >
                <SessionsWidget bookings={computed.upcomingBookings} />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
            >
              <CollegeDeadlineWidget colleges={computed.deadlineColleges} />
            </motion.div>
          </div>

          {/* Activity strip — logged in */}
          {user && bundle && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.22 }}
            >
              <h2
                className="mb-3 flex items-center gap-2 text-[14px] font-black uppercase tracking-widest"
                style={{ color: "var(--obsidian-on-surface-variant)" }}
              >
                <TrendingUp size={12} /> Your Activity
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  {
                    label: "Study time",
                    value: computed.studyMinutesWeek >= 60
                      ? `${Math.round(computed.studyMinutesWeek / 60)}h`
                      : `${computed.studyMinutesWeek}m`,
                    sub: "This week",
                    action: computed.studyMinutesWeek === 0 ? { label: "Start planning", to: "/planner" } : null,
                    color: "#6366f1",
                  },
                  {
                    label: "Quiz attempts",
                    value: computed.quizCount,
                    sub: "All time",
                    action: computed.quizCount === 0 ? { label: "Try one", to: "/prepare" } : null,
                    color: "#10b981",
                  },
                  {
                    label: "Sessions booked",
                    value: computed.upcomingBookings.length,
                    sub: "Upcoming",
                    action: computed.upcomingBookings.length === 0 ? { label: "Book now", to: "/mentors" } : null,
                    color: "#8b5cf6",
                  },
                  {
                    label: "Notifications",
                    value: computed.unreadCount,
                    sub: "Unread",
                    action: null,
                    color: computed.unreadCount > 0 ? "#f59e0b" : "#64748b",
                  },
                ].map(({ label, value, sub, action, color }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1.5 rounded-xl p-3.5"
                    style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
                  >
                    <span className="text-[14px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                      {label}
                    </span>
                    <span className="text-[22px] font-black leading-none" style={{ color }}>
                      {value}
                    </span>
                    {action ? (
                      <Link to={action.to} className="text-[10.5px] font-semibold underline" style={{ color }}>
                        {action.label}
                      </Link>
                    ) : (
                      <span className="text-[14px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>{sub}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Guest sign-up CTA */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.06))",
                border: "1px solid rgba(99,102,241,0.18)",
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[15px] font-bold" style={{ color: "var(--obsidian-on-surface)" }}>
                    Join 10,000+ students on TAKक्षक
                  </h3>
                  <p className="mt-0.5 text-[13px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                    Track applications, book mentors, get exam alerts — everything free.
                  </p>
                </div>
                <Link
                  to="/signup"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
                >
                  Get Started Free <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Platform stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center gap-6 border-t pt-5"
            style={{ borderColor: "var(--obsidian-outline-variant)" }}
          >
            {[
              { target: stats.students, suffix: "+", label: "Students" },
              { target: stats.colleges, suffix: "+", label: "Colleges" },
              { target: stats.mentors,  suffix: "+", label: "Mentors"  },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <CountUp target={target} suffix={suffix} className="stat-number" duration={1600} />
                <span className="text-[14px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: sidebar (desktop only) ── */}
        <motion.div
          className="hidden lg:flex flex-col gap-4 w-[272px] shrink-0"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        >
          <ExamCountdownWidget exams={computed.exams} />
          <RegDeadlineWidget exams={computed.exams} />
          {user && <SessionsWidget bookings={computed.upcomingBookings} />}
          <CollegeDeadlineWidget colleges={computed.deadlineColleges} />

          {/* Mentor tip card */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={14} style={{ color: "#6366f1" }} />
              <span className="text-[14px] font-black uppercase tracking-widest" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                Mentor Tip
              </span>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--obsidian-on-surface)" }}>
              Book your first free trial session — most students who book a session within 48 hrs
              are 3× more likely to get into their target college.
            </p>
            <Link
              to="/mentors"
              className="mt-3 flex items-center gap-1 text-[11.5px] font-bold transition-opacity hover:opacity-70"
              style={{ color: "#6366f1" }}
            >
              Browse mentors <ArrowRight size={11} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── Mobile horizontal exam strip ──────────────────────────────────────────────
function MobileExamStrip({ exams }) {
  const upcoming = useMemo(() => {
    const now = new Date()
    return (exams || [])
      .filter(e => {
        const d = e.exam_date || e.start_date
        return d && new Date(d) >= now
      })
      .sort((a, b) => new Date(a.exam_date || a.start_date) - new Date(b.exam_date || b.start_date))
      .slice(0, 8)
  }, [exams])

  if (upcoming.length === 0) return null

  return (
    <div>
      <p className="mb-2 text-[14px] font-black uppercase tracking-widest" style={{ color: "var(--obsidian-on-surface-variant)" }}>
        Upcoming Exams
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {upcoming.map(e => {
          const dateField = e.exam_date || e.start_date
          const days = dateField ? getDaysLeft(dateField) : null
          const sc   = streamColor(e.stream || e.category)
          const urg  = days !== null ? urgencyColor(days) : sc.text
          return (
            <div
              key={e.id || e.slug || e.name}
              className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-3 py-2.5"
              style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)", minWidth: 90 }}
            >
              {days !== null && (
                <span className="text-[18px] font-black leading-none" style={{ color: urg }}>{days}d</span>
              )}
              <span className="text-center text-[10px] font-semibold leading-tight" style={{ color: "var(--obsidian-on-surface)" }}>
                {e.name.replace(/ 20\d\d.*/i, "").replace(/ —.*/, "")}
              </span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                style={{ background: sc.bg, color: sc.text }}
              >
                {e.stream || e.category}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

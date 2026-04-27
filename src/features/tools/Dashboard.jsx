import { Helmet } from "react-helmet-async"
import {
  Bell, BookOpen, CalendarDays, ChevronRight, Clock,
  Compass, MessageSquare, Rocket, Shield, Target,
  TrendingUp, Users, Zap, ClipboardList,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@auth/AuthContext"
import { getDashboardBundle } from "@database/services/superapp"
import supabase from "@database/supabaseClient"
import { formatDate, getDaysLeft, isWithinRange } from "@lib/date"
import LoadingSkeleton from "@components/LoadingSkeleton"
import NotificationBell from "@components/NotificationBell"
import SearchBar from "@components/search/SearchBar"
import CountUp from "@components/motion/CountUp"
import { SlideIn, StaggerContainer, StaggerItem, FloatingElement } from "@components/animations/AnimationUtils"
import MagneticCard from "@components/animations/MagneticCard"

// ── Quick actions now point to hub routes ─────────────────────────────────────
const QUICK_ACTIONS = [
  { title: "Find a Mentor",   description: "1:1 guidance from toppers and verified seniors", icon: Users,        gradient: "card-gradient-blue",   tag: "RECOMMENDED", link: "/mentors"   },
  { title: "Discover Colleges", description: "Browse, compare and track college applications", icon: Compass,    gradient: "card-gradient-teal",   tag: null,          link: "/discover"  },
  { title: "Ask a Doubt",     description: "Anonymous forum — no judgment, real answers",     icon: MessageSquare, gradient: "card-gradient-purple", tag: null,        link: "/community" },
  { title: "Defence Prep",    description: "NDA, CDS, SSB prep — first session FREE",         icon: Shield,       gradient: "card-gradient-orange", tag: "FREE",       link: "/community" },
]

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl p-4" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "var(--accent-glow)" }}>
          <Icon size={16} style={{ color: "var(--obsidian-primary)" }} />
        </div>
        <span className="text-[12px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>{label}</span>
      </div>
      <p className="text-2xl font-black" style={{ color: "var(--obsidian-on-surface)" }}>{value}</p>
      <p className="text-[11px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>{sub}</p>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, profile } = useAuth?.() || {}
  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [platformStats, setPlatformStats] = useState({ students: 10000, colleges: 500, mentors: 50 })

  const displayName = profile?.full_name || profile?.name || user?.displayName || null
  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  }

  useEffect(() => {
    async function load() {
      const [payload] = await Promise.all([
        getDashboardBundle().catch(() => null),
      ])
      setBundle(payload)
      setLoading(false)
    }

    async function loadPlatformStats() {
      if (!supabase) return
      try {
        const [u, c, m] = await Promise.all([
          supabase.from("users").select("id", { count: "exact", head: true }),
          supabase.from("colleges").select("id", { count: "exact", head: true }),
          supabase.from("mentors").select("id", { count: "exact", head: true }),
        ])
        setPlatformStats({ students: u.count || 10000, colleges: c.count || 500, mentors: m.count || 50 })
      } catch { /* use defaults */ }
    }

    load()
    loadPlatformStats()
  }, [])

  const computed = useMemo(() => {
    if (!bundle) return { upcomingBookings: [], deadlineColleges: [], unreadCount: 0, studyMinutesWeek: 0, quizCount: 0 }
    const today = new Date().toDateString()
    const now = new Date()
    const bookings = bundle.bookings || []
    const colleges = bundle.colleges || []
    const notifications = bundle.notifications || []
    const studySessions = bundle.studySessions || []
    const quizAttempts = bundle.quizAttempts || []

    const upcomingBookings = bookings
      .filter(b => b.status !== "cancelled" && new Date(b.requested_datetime) > now)
      .slice(0, 3)

    const deadlineColleges = colleges
      .filter(c => c.application_end && getDaysLeft(c.application_end) >= 0 && getDaysLeft(c.application_end) <= 30)
      .sort((a, b) => new Date(a.application_end) - new Date(b.application_end))
      .slice(0, 4)

    const unreadCount = notifications.filter(n => !n.is_read).length

    // Study minutes this week
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    const studyMinutesWeek = studySessions
      .filter(s => new Date(s.created_date) > weekAgo)
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0)

    const quizCount = quizAttempts.length

    return { upcomingBookings, deadlineColleges, unreadCount, studyMinutesWeek, quizCount }
  }, [bundle])

  if (loading) return <LoadingSkeleton rows={12} />

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Home — TAKSHAK</title>
        <meta name="description" content="Your student command center — find colleges, book mentors, track applications and prepare for competitive exams." />
      </Helmet>

      {/* ── Hero — Search First ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        style={{ position: "relative", overflow: "hidden", paddingBottom: 8 }}
      >
        <div className="orb orb-indigo" style={{ width: 360, height: 360, top: -80, right: -80, opacity: 0.14 }} />
        <div className="orb orb-purple" style={{ width: 240, height: 240, bottom: -40, left: -60, opacity: 0.10 }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 680 }}>
          {/* Greeting */}
          {displayName && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-2 text-sm font-semibold"
              style={{ color: "var(--obsidian-on-surface-variant)" }}
            >
              {greeting()}, {displayName} 👋
            </motion.p>
          )}

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            style={{ fontSize: "clamp(26px, 4.5vw, 48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 12 }}
          >
            {["Find", "Your", "Perfect", "College"].map(w => (
              <motion.span
                key={w}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] } } }}
                style={{ color: "var(--obsidian-on-surface)", marginRight: "0.25em", display: "inline-block" }}
              >
                {w}
              </motion.span>
            ))}
            <br />
            {["Without", "the", "Confusion"].map(w => (
              <motion.span
                key={w}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] } } }}
                style={{ marginRight: "0.25em", display: "inline-block", background: "linear-gradient(90deg, #4edea3, #c0c1ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ fontSize: 15, color: "var(--obsidian-on-surface-variant)", marginBottom: 24, lineHeight: 1.7 }}
          >
            Discover colleges, book mentors, track deadlines and prepare — all in one place.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.55 }}>
            <SearchBar popularTags={["JEE", "NEET", "GATE", "CUET", "UPSC", "CAT"]} />
          </motion.div>

          {/* Platform stats + notification bell */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="mt-6 flex flex-wrap items-center gap-6"
          >
            {[
              { target: platformStats.students, suffix: "+", label: "Students" },
              { target: platformStats.colleges, suffix: "+", label: "Colleges" },
              { target: platformStats.mentors,  suffix: "+", label: "Mentors"  },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <CountUp target={target} suffix={suffix} className="stat-number" duration={1800} />
                <span style={{ fontSize: 12, color: "var(--obsidian-on-surface-variant)", fontWeight: 600 }}>{label}</span>
              </div>
            ))}
            {user && (
              <div className="ml-auto">
                <NotificationBell unreadCount={computed.unreadCount} />
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Quick Actions ── */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-base font-black" style={{ color: "var(--obsidian-on-surface)" }}>
          <Zap size={17} style={{ color: "#f59e0b" }} /> Quick Actions
        </h2>
        <StaggerContainer stagger={0.08} delay={0.1} className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon
            return (
              <StaggerItem key={action.title}>
                <MagneticCard intensity={0.04} className="h-full">
                  <Link
                    to={action.link}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl ${action.gradient} p-5 text-white transition-all duration-300 hover:shadow-2xl h-full`}
                  >
                    {action.tag && (
                      <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                        {action.tag}
                      </span>
                    )}
                    <FloatingElement amplitude={2} duration={3 + i}>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                        <Icon size={20} />
                      </div>
                    </FloatingElement>
                    <h3 className="text-[14px] font-bold leading-snug">{action.title}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-white/70 flex-1">{action.description}</p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-white/70 group-hover:text-white transition">
                      Open <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </MagneticCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </section>

      {/* ── Personal stats (only when logged in with data) ── */}
      {user && bundle && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-base font-black" style={{ color: "var(--obsidian-on-surface)" }}>
            <Rocket size={17} style={{ color: "var(--obsidian-primary)" }} /> Your Activity
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard icon={TrendingUp} label="Study time" value={`${Math.round(computed.studyMinutesWeek / 60)}h`} sub="This week" />
            <StatCard icon={Target}    label="Quiz attempts" value={computed.quizCount} sub="All time" />
            <StatCard icon={CalendarDays} label="Sessions" value={computed.upcomingBookings.length} sub="Upcoming" />
            <StatCard icon={Bell}      label="Unread" value={computed.unreadCount} sub="Notifications" />
          </div>
        </section>
      )}

      {/* ── Two-column: Upcoming sessions + Closing deadlines ── */}
      {user && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Upcoming mentor sessions */}
          <div className="rounded-2xl p-5" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-[14px] font-bold" style={{ color: "var(--obsidian-on-surface)" }}>
                <CalendarDays size={15} style={{ color: "var(--obsidian-primary)" }} /> Upcoming Sessions
              </h3>
              <Link to="/sessions" className="text-[12px] font-semibold" style={{ color: "var(--obsidian-primary)" }}>View all →</Link>
            </div>
            {computed.upcomingBookings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <Users size={28} className="opacity-25" style={{ color: "var(--obsidian-on-surface)" }} />
                <p className="text-[13px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>No upcoming sessions</p>
                <Link to="/mentors" className="rounded-lg px-4 py-2 text-[12px] font-bold text-white" style={{ background: "var(--obsidian-primary)" }}>
                  Find a Mentor
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {computed.upcomingBookings.map(b => (
                  <div key={b.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--accent-glow)", border: "1px solid var(--obsidian-outline-variant)" }}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--obsidian-primary)", color: "#fff", fontSize: 13, fontWeight: 900 }}>
                      {(b.mentors?.name || "M").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate" style={{ color: "var(--obsidian-on-surface)" }}>{b.mentors?.name || "Mentor"}</p>
                      <p className="text-[11px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                        {new Date(b.requested_datetime).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold capitalize" style={{ background: "rgba(99,102,241,0.15)", color: "var(--obsidian-primary)" }}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* College deadlines closing soon */}
          <div className="rounded-2xl p-5" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-[14px] font-bold" style={{ color: "var(--obsidian-on-surface)" }}>
                <Clock size={15} style={{ color: "#ef4444" }} /> Closing Soon
              </h3>
              <Link to="/discover" className="text-[12px] font-semibold" style={{ color: "var(--obsidian-primary)" }}>Discover →</Link>
            </div>
            {computed.deadlineColleges.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <ClipboardList size={28} className="opacity-25" style={{ color: "var(--obsidian-on-surface)" }} />
                <p className="text-[13px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>No deadlines in the next 30 days</p>
                <Link to="/discover" className="rounded-lg px-4 py-2 text-[12px] font-bold text-white" style={{ background: "var(--obsidian-primary)" }}>
                  Browse Colleges
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {computed.deadlineColleges.map(c => {
                  const d = getDaysLeft(c.application_end)
                  const urgent = d <= 5
                  return (
                    <div key={c.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--accent-glow)", border: `1px solid ${urgent ? "rgba(239,68,68,0.25)" : "var(--obsidian-outline-variant)"}` }}>
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black"
                        style={{ background: urgent ? "rgba(239,68,68,0.15)" : "var(--obsidian-outline-variant)", color: urgent ? "#ef4444" : "var(--obsidian-on-surface-variant)" }}
                      >
                        {d}d
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate" style={{ color: "var(--obsidian-on-surface)" }}>{c.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                          {c.city}{c.state ? `, ${c.state}` : ""} • Closes {formatDate(c.application_end)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Application tracker CTA (guest) ── */}
      {!user && (
        <SlideIn direction="up" delay={0.2}>
          <div
            className="flex flex-col items-center gap-4 rounded-2xl p-8 text-center"
            style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "var(--accent-glow)" }}>
              <ClipboardList size={24} style={{ color: "var(--obsidian-primary)" }} />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: "var(--obsidian-on-surface)" }}>Track Your Applications</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                Sign in to track colleges, internships, hackathons and scholarships — all in one Kanban board.
              </p>
            </div>
            <Link
              to="/signup"
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
            >
              Get Started Free
            </Link>
          </div>
        </SlideIn>
      )}

      {/* ── Prepare CTA ── */}
      <SlideIn direction="up" delay={0.3}>
        <div
          className="flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--obsidian-on-surface)" }}>Ready to prepare?</h3>
            <p className="mt-0.5 text-sm" style={{ color: "var(--obsidian-on-surface-variant)" }}>
              Study planner, resources, bridge courses, skill matcher, document checklist — everything in Prepare.
            </p>
          </div>
          <Link
            to="/prepare"
            className="flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
          >
            <BookOpen size={15} /> Go to Prepare
          </Link>
        </div>
      </SlideIn>
    </div>
  )
}

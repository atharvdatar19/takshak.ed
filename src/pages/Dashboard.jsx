import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Flame,
  MessageSquare,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import LoadingSkeleton from "../components/LoadingSkeleton"
import NotificationBell from "../components/NotificationBell"
import WeeklyTrendChart from "../components/WeeklyTrendChart"
import { formatDate, getDaysLeft, isWithinRange } from "../lib/date"
import { getDashboardBundle } from "../services/superapp"
import { useAutoReveal } from "../hooks/useScrollReveal"

const quoteOptions = [
  "Your future is shaped by the actions you take today.",
  "Small daily consistency compounds into rank-changing outcomes.",
  "Build discipline now, and opportunities will follow.",
]

const QUICK_ACTIONS = [
  { title: "Find a Mentor", description: "Get 1:1 expert guidance from top rankers", icon: Users, gradient: "card-gradient-blue", tag: "RECOMMENDED", link: "/sessions" },
  { title: "Study Planner", description: "Auto-generate revision timetable", icon: BookOpen, gradient: "card-gradient-teal", link: "/planner" },
  { title: "Ask Doubts", description: "Ask anonymously, learn together", icon: MessageSquare, gradient: "card-gradient-purple", link: "/forum" },
  { title: "Predict Cutoff", description: "Check your chances at top colleges", icon: Target, gradient: "card-gradient-orange", link: "/cutoff" },
]

export default function Dashboard() {
  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(true)

  useAutoReveal()

  useEffect(() => {
    async function loadBundle() {
      setLoading(true)
      const payload = await getDashboardBundle()
      setBundle(payload)
      setLoading(false)
    }
    loadBundle()
  }, [])

  const quote = useMemo(() => quoteOptions[new Date().getDay() % quoteOptions.length], [])

  const computed = useMemo(() => {
    if (!bundle) {
      return { xp: 0, level: 1, unreadCount: 0, deadlineAlerts: [], hasActivityToday: false, weeklyStudyData: [], weeklyScoreData: [], activeGoals: [], upcomingBookings: [], streamMentors: [] }
    }

    const today = new Date().toDateString()
    const studySessions = bundle.studySessions || []
    const quizAttempts = bundle.quizAttempts || []
    const bookings = bundle.bookings || []

    const xp = studySessions.length * 20 + quizAttempts.length * 35 + bookings.length * 40
    const level = Math.max(1, Math.floor(xp / 250) + 1)
    const unreadCount = (bundle.notifications || []).filter(n => !n.is_read).length
    const deadlineAlerts = (bundle.colleges || []).filter(c => isWithinRange(c.application_end, 3)).slice(0, 4)
    const hasActivityToday =
      studySessions.some(s => new Date(s.created_date).toDateString() === today) ||
      quizAttempts.some(a => new Date(a.created_date).toDateString() === today)

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const weeklyStudyData = weekdays.map((day, idx) => {
      const total = studySessions.filter(s => new Date(s.created_date).getDay() === ((idx + 1) % 7)).reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
      return { label: day, percent: Math.min(100, Math.round((total / 180) * 100)) }
    })
    const weeklyScoreData = weekdays.map((day, idx) => {
      const attempts = quizAttempts.filter(a => new Date(a.created_date).getDay() === ((idx + 1) % 7))
      const score = attempts.length ? attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length : 0
      return { label: day, percent: Math.round(score) }
    })

    const activeGoals = (bundle.goals || []).filter(g => g.status === "active" || g.status === "in_progress")
    const upcomingBookings = bookings.filter(b => new Date(b.requested_datetime) >= new Date())
    const streamMentors = (bundle.mentors || []).filter(m => !bundle.profile?.stream || m.stream === bundle.profile.stream)

    return { xp, level, unreadCount, deadlineAlerts, hasActivityToday, weeklyStudyData, weeklyScoreData, activeGoals, upcomingBookings, streamMentors }
  }, [bundle])

  if (loading) return <LoadingSkeleton rows={12} />

  const dayName = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="space-y-10 md:space-y-16">

      {/* ═══ HERO — BB Agency massive header ═══ */}
      <section className="relative overflow-hidden rounded-[32px] hero-gradient px-8 py-12 text-white md:px-14 md:py-20">
        {/* Floating orbs */}
        <div className="orb orb-purple w-40 h-40 -top-10 -right-10" />
        <div className="orb orb-blue w-32 h-32 bottom-0 left-10" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="pill pill-glass mb-4 text-xs">{dayName}</p>
            <h1 className="text-display text-4xl md:text-6xl lg:text-7xl">
              Welcome back,<br />
              <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                {bundle?.profile?.full_name || "Student"}
              </span>
            </h1>
            <p className="text-body-lg mt-4 max-w-md text-indigo-100/80 text-base">
              {quote}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <NotificationBell unreadCount={computed.unreadCount + computed.deadlineAlerts.length} />
            <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 text-center">
              <p className="text-xs text-indigo-200 uppercase tracking-widest">XP / Level</p>
              <p className="stat-number text-3xl mt-1">{computed.xp} <span className="text-lg text-indigo-200">· L{computed.level}</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUICK ACTIONS — Bento Grid ═══ */}
      <section>
        <h2 className="text-section text-2xl md:text-4xl text-slate-900 mb-6 md:mb-10">
          <Zap size={28} className="inline text-amber-500 mr-2" />
          Quick Actions
        </h2>
        <div className="bento-grid">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon
            return (
              <a
                key={action.title}
                href={action.link}
                className={`reveal reveal-delay-${i + 1} group relative overflow-hidden rounded-[28px] ${action.gradient} p-7 md:p-9 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${i === 0 ? "bento-span-2 md:row-span-2" : ""}`}
              >
                {action.tag && (
                  <span className="absolute right-4 top-4 pill pill-dark text-[10px] py-1 px-3">
                    ✨ {action.tag}
                  </span>
                )}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Icon size={28} />
                </div>
                <h3 className="text-card-title text-xl md:text-2xl">{action.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{action.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-white/80 group-hover:text-white transition">
                  Explore <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            )
          })}
        </div>
      </section>

      {/* ═══ TODAY'S PROGRESS — Stats Row ═══ */}
      <section>
        <h2 className="text-section text-2xl md:text-4xl text-slate-900 mb-6 md:mb-10">
          <Rocket size={28} className="inline text-indigo-600 mr-2" />
          Today's Progress
        </h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={TrendingUp} label="Study Sessions" value={bundle?.studySessions?.length || 0} sub="Tracked performance units" color="indigo" />
          <StatCard icon={Award} label="Quiz Attempts" value={bundle?.quizAttempts?.length || 0} sub="Assessment attempts" color="emerald" />
          <StatCard icon={CalendarDays} label="Upcoming Sessions" value={computed.upcomingBookings.length} sub="Mentor bookings" color="blue" />
          <StatCard icon={Bell} label="Unread Alerts" value={computed.unreadCount} sub="Notifications pending" color="amber" />
        </div>
      </section>

      {/* ═══ WEEKLY TRENDS ═══ */}
      <section>
        <div className="divider-gradient mb-10" />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="reveal card-bb p-6 md:p-8">
            <WeeklyTrendChart title="Weekly Study Minutes" data={computed.weeklyStudyData} color="indigo" />
          </div>
          <div className="reveal card-bb p-6 md:p-8">
            <WeeklyTrendChart title="Weekly Avg Score" data={computed.weeklyScoreData} color="emerald" />
          </div>
        </div>
      </section>

      {/* ═══ DEADLINE ALERTS ═══ */}
      <AnimatePresence>
        {computed.deadlineAlerts.length > 0 && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card-bb border-rose-200 bg-rose-50 p-6 md:p-8">
            <h3 className="text-card-title text-lg text-rose-800 mb-4 flex items-center gap-2">
              <Flame size={20} /> Applications closing within 3 days
            </h3>
            <ul className="space-y-2 text-sm text-rose-700">
              {computed.deadlineAlerts.map(a => (
                <li key={a.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {a.name} · closes {formatDate(a.application_end)} ({getDaysLeft(a.application_end)}d)
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══ NO ACTIVITY NUDGE ═══ */}
      {!computed.hasActivityToday && (
        <section className="card-bb border-indigo-100 bg-indigo-50/50 p-6 md:p-8 text-center">
          <p className="text-body-lg text-indigo-700">
            <Rocket size={18} className="inline mr-2 text-indigo-500" />
            No activity logged today. A 30-minute session keeps your streak alive!
          </p>
        </section>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color = "indigo" }) {
  const bgMap = { indigo: "bg-indigo-50", emerald: "bg-emerald-50", blue: "bg-blue-50", amber: "bg-amber-50" }
  const iconMap = { indigo: "text-indigo-600", emerald: "text-emerald-600", blue: "text-blue-600", amber: "text-amber-600" }

  return (
    <div className="reveal card-bb p-6 md:p-8">
      <div className={`mb-4 inline-flex rounded-2xl p-3 ${bgMap[color]}`}>
        <Icon size={22} className={iconMap[color]} />
      </div>
      <p className="text-sm text-slate-500 tracking-wide">{label}</p>
      <p className="stat-number text-4xl md:text-5xl text-slate-900 mt-1">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{sub}</p>
    </div>
  )
}

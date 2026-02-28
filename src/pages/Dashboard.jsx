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
import { Link } from "react-router-dom"
import LoadingSkeleton from "../components/LoadingSkeleton"
import NotificationBell from "../components/NotificationBell"
import WeeklyTrendChart from "../components/WeeklyTrendChart"
import { formatDate, getDaysLeft, isWithinRange } from "../lib/date"
import { getDashboardBundle } from "../services/superapp"

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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function Dashboard() {
  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(true)

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
      return { xp: 0, level: 1, unreadCount: 0, deadlineAlerts: [], hasActivityToday: false, weeklyStudyData: [], weeklyScoreData: [], upcomingBookings: [] }
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
    const upcomingBookings = bookings.filter(b => new Date(b.requested_datetime) >= new Date())
    return { xp, level, unreadCount, deadlineAlerts, hasActivityToday, weeklyStudyData, weeklyScoreData, upcomingBookings }
  }, [bundle])

  if (loading) return <LoadingSkeleton rows={12} />

  const dayName = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="space-y-8 md:space-y-12">

      {/* ═══ HERO ═══ */}
      <motion.section {...fadeUp(0)} className="relative overflow-hidden rounded-[32px] hero-gradient px-8 py-10 text-white md:px-12 md:py-16">
        <div className="orb orb-purple w-40 h-40 -top-10 -right-10" />
        <div className="orb orb-blue w-32 h-32 bottom-0 left-10" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="pill pill-glass text-xs mb-4">{dayName}</span>
            <h1 className="text-display text-3xl md:text-5xl lg:text-6xl mt-3">
              Welcome back,<br />
              <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                {bundle?.profile?.full_name || "Student"}
              </span>
            </h1>
            <p className="mt-3 max-w-md text-indigo-100/80 text-sm md:text-base">{quote}</p>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <NotificationBell unreadCount={computed.unreadCount + computed.deadlineAlerts.length} />
            <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 text-center">
              <p className="text-xs text-indigo-200 uppercase tracking-widest">XP / Level</p>
              <p className="stat-number text-3xl mt-1">{computed.xp} <span className="text-lg text-indigo-200">· L{computed.level}</span></p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ QUICK ACTIONS ═══ */}
      <section>
        <motion.h2 {...fadeUp(0.1)} className="text-section text-xl md:text-3xl text-slate-900 mb-5 md:mb-8 flex items-center gap-2">
          <Zap size={24} className="text-amber-500" /> Quick Actions
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon
            return (
              <motion.div key={action.title} {...fadeUp(0.15 + i * 0.08)}>
                <Link
                  to={action.link}
                  className={`group relative flex flex-col overflow-hidden rounded-[24px] ${action.gradient} p-6 md:p-8 text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl h-full`}
                >
                  {action.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                      ✨ {action.tag}
                    </span>
                  )}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-card-title text-base md:text-lg">{action.title}</h3>
                  <p className="mt-1.5 text-xs md:text-sm text-white/70 leading-relaxed flex-1">{action.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition">
                    Explore <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section>
        <motion.h2 {...fadeUp(0.2)} className="text-section text-xl md:text-3xl text-slate-900 mb-5 md:mb-8 flex items-center gap-2">
          <Rocket size={24} className="text-indigo-600" /> Today's Progress
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard delay={0.25} icon={TrendingUp} label="Study Sessions" value={bundle?.studySessions?.length || 0} sub="Tracked units" color="indigo" />
          <StatCard delay={0.3} icon={Award} label="Quiz Attempts" value={bundle?.quizAttempts?.length || 0} sub="Assessments" color="emerald" />
          <StatCard delay={0.35} icon={CalendarDays} label="Upcoming" value={computed.upcomingBookings.length} sub="Mentor bookings" color="blue" />
          <StatCard delay={0.4} icon={Bell} label="Unread" value={computed.unreadCount} sub="Notifications" color="amber" />
        </div>
      </section>

      {/* ═══ WEEKLY TRENDS ═══ */}
      <section>
        <div className="divider-gradient mb-8" />
        <div className="grid gap-5 xl:grid-cols-2">
          <motion.div {...fadeUp(0.3)} className="card-bb p-5 md:p-7">
            <WeeklyTrendChart title="Weekly Study Minutes" data={computed.weeklyStudyData} color="indigo" />
          </motion.div>
          <motion.div {...fadeUp(0.35)} className="card-bb p-5 md:p-7">
            <WeeklyTrendChart title="Weekly Avg Score" data={computed.weeklyScoreData} color="emerald" />
          </motion.div>
        </div>
      </section>

      {/* ═══ ALERTS ═══ */}
      <AnimatePresence>
        {computed.deadlineAlerts.length > 0 && (
          <motion.section {...fadeUp(0)} className="card-bb border-rose-200 bg-rose-50 p-5 md:p-7">
            <h3 className="text-card-title text-lg text-rose-800 mb-3 flex items-center gap-2">
              <Flame size={20} /> Applications closing within 3 days
            </h3>
            <ul className="space-y-2 text-sm text-rose-700">
              {computed.deadlineAlerts.map(a => (
                <li key={a.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                  {a.name} — closes {formatDate(a.application_end)} ({getDaysLeft(a.application_end)}d left)
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══ NO ACTIVITY NUDGE ═══ */}
      {!computed.hasActivityToday && (
        <motion.section {...fadeUp(0.4)} className="card-bb border-indigo-100 bg-indigo-50/60 p-5 md:p-7 text-center">
          <p className="text-sm text-indigo-700">
            <Rocket size={16} className="inline mr-1.5 text-indigo-500" />
            No activity logged today. A 30-minute session keeps your streak alive! 🔥
          </p>
        </motion.section>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color = "indigo", delay = 0 }) {
  const bgMap = { indigo: "bg-indigo-50 border-indigo-100", emerald: "bg-emerald-50 border-emerald-100", blue: "bg-blue-50 border-blue-100", amber: "bg-amber-50 border-amber-100" }
  const iconBg = { indigo: "bg-indigo-100 text-indigo-600", emerald: "bg-emerald-100 text-emerald-600", blue: "bg-blue-100 text-blue-600", amber: "bg-amber-100 text-amber-600" }

  return (
    <motion.div {...fadeUp(delay)} className={`card-bb ${bgMap[color]} p-5 md:p-6`}>
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${iconBg[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-xs text-slate-500 tracking-wide uppercase">{label}</p>
      <p className="stat-number text-3xl md:text-4xl text-slate-900 mt-1">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </motion.div>
  )
}

import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
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

const quoteOptions = [
  "Your future is shaped by the actions you take today.",
  "Small daily consistency compounds into rank-changing outcomes.",
  "Build discipline now, and opportunities will follow.",
]

const QUICK_ACTIONS = [
  {
    title: "Find a Mentor",
    description: "Get expert guidance",
    icon: Users,
    gradient: "card-gradient-blue",
    tag: "RECOMMENDED",
    link: "/mentors",
  },
  {
    title: "Study Materials",
    description: "Access resources",
    icon: BookOpen,
    gradient: "card-gradient-teal",
    link: "/",
  },
  {
    title: "Ask Questions",
    description: "Resolve doubts",
    icon: MessageSquare,
    gradient: "card-gradient-purple",
    link: "/forum",
  },
  {
    title: "College Directory",
    description: "Explore colleges",
    icon: Target,
    gradient: "card-gradient-orange",
    link: "/",
  },
]

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
      return {
        xp: 0,
        level: 1,
        unreadCount: 0,
        deadlineAlerts: [],
        hasActivityToday: false,
        weeklyStudyData: [],
        weeklyScoreData: [],
        activeGoals: [],
        upcomingBookings: [],
        streamMentors: [],
      }
    }

    const today = new Date().toDateString()
    const studySessions = bundle.studySessions || []
    const quizAttempts = bundle.quizAttempts || []
    const bookings = bundle.bookings || []

    const xp = studySessions.length * 20 + quizAttempts.length * 35 + bookings.length * 40
    const level = Math.max(1, Math.floor(xp / 250) + 1)
    const unreadCount = (bundle.notifications || []).filter(item => !item.is_read).length
    const deadlineAlerts = (bundle.colleges || []).filter(item => isWithinRange(item.application_end, 3)).slice(0, 4)

    const hasActivityToday =
      studySessions.some(session => new Date(session.created_date).toDateString() === today) ||
      quizAttempts.some(attempt => new Date(attempt.created_date).toDateString() === today)

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const weeklyStudyData = weekdays.map((day, idx) => {
      const total = studySessions
        .filter(session => new Date(session.created_date).getDay() === ((idx + 1) % 7))
        .reduce((sum, session) => sum + (session.duration_minutes || 0), 0)
      return { label: day, percent: Math.min(100, Math.round((total / 180) * 100)) }
    })

    const weeklyScoreData = weekdays.map((day, idx) => {
      const attempts = quizAttempts.filter(attempt => new Date(attempt.created_date).getDay() === ((idx + 1) % 7))
      const score = attempts.length
        ? attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / attempts.length
        : 0
      return { label: day, percent: Math.round(score) }
    })

    const activeGoals = (bundle.goals || []).filter(goal => goal.status === "active" || goal.status === "in_progress")
    const upcomingBookings = bookings.filter(booking => new Date(booking.requested_datetime) >= new Date())
    const streamMentors = (bundle.mentors || []).filter(
      mentor => !bundle.profile?.stream || mentor.stream === bundle.profile.stream,
    )

    return { xp, level, unreadCount, deadlineAlerts, hasActivityToday, weeklyStudyData, weeklyScoreData, activeGoals, upcomingBookings, streamMentors }
  }, [bundle])

  if (loading) return <LoadingSkeleton rows={12} />

  const dayName = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="scroll-3d-card flex items-center justify-between gap-4 rounded-3xl border border-slate-200/60 bg-white p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xl font-bold text-white shadow-lg shadow-indigo-200">
            {(bundle?.profile?.full_name || "U")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {bundle?.profile?.full_name || "Student"}</h1>
            <p className="text-sm text-slate-500">{dayName}</p>
          </div>
        </div>
        <NotificationBell unreadCount={computed.unreadCount + computed.deadlineAlerts.length} />
      </motion.section>

      {/* Quote + XP */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-3d-card rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium italic text-slate-700">
            <Sparkles size={16} className="text-indigo-600" /> {quote}
          </p>
          <div className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-white">
            <p className="text-xs text-slate-300">XP / Level</p>
            <p className="text-lg font-semibold">{computed.xp} XP · L{computed.level}</p>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900"><Zap size={20} className="text-amber-500" /> Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon
            return (
              <motion.div key={action.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className={`scroll-3d-card relative cursor-pointer overflow-hidden rounded-3xl ${action.gradient} p-6 text-white shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1`}>
                {action.tag && <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">✨ {action.tag}</span>}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20"><Icon size={24} /></div>
                <h3 className="text-lg font-bold">{action.title}</h3>
                <p className="mt-1 text-sm text-white/80">{action.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Today's Progress */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900"><Rocket size={20} className="text-indigo-600" /> Today's Progress</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={TrendingUp} title="Study Sessions" value={bundle?.studySessions?.length || 0} subtitle="Tracked performance units" color="indigo" />
          <MetricCard icon={Award} title="Quiz Attempts" value={bundle?.quizAttempts?.length || 0} subtitle="Assessment attempts captured" color="emerald" />
          <MetricCard icon={CalendarDays} title="Upcoming Sessions" value={computed.upcomingBookings.length} subtitle="Mentor bookings scheduled" color="blue" />
          <MetricCard icon={Bell} title="Unread Notifications" value={computed.unreadCount} subtitle="Messages and deadline alerts" color="amber" />
        </div>
      </section>

      {/* Weekly Trends */}
      <section className="grid gap-5 xl:grid-cols-2">
        <WeeklyTrendChart title="Weekly Study Minutes Trend" data={computed.weeklyStudyData} color="indigo" />
        <WeeklyTrendChart title="Weekly Average Score Trend" data={computed.weeklyScoreData} color="emerald" />
      </section>

      {/* Deadline Alerts */}
      <AnimatePresence>
        {computed.deadlineAlerts.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="scroll-3d-card rounded-3xl border border-rose-200 bg-rose-50 p-5 shadow-card">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-rose-800"><Flame size={16} /> Smart Alert — Applications closing within 3 days</h3>
            <ul className="space-y-2 text-sm text-rose-700">
              {computed.deadlineAlerts.map(alert => (
                <li key={alert.id}>{alert.name} · closes {formatDate(alert.application_end)} ({getDaysLeft(alert.application_end)}d)</li>
              ))}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>

      {/* No Activity Nudge */}
      {!computed.hasActivityToday && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="scroll-3d-card rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-card">
          <p className="flex items-center gap-2 text-sm text-emerald-700"><Rocket size={16} className="text-emerald-600" /> No activity logged today. A 30-minute session keeps your streak alive!</p>
        </motion.section>
      )}
    </div>
  )
}

function MetricCard({ icon: Icon, title, value, subtitle, color = "indigo" }) {
  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
  }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="scroll-3d-card rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${colorMap[color]}`}><Icon size={18} /></div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </motion.div>
  )
}

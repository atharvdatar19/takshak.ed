import {
  Award,
  Bell,
  CalendarDays,
  Flame,
  GraduationCap,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import LoadingSkeleton from "../components/LoadingSkeleton"
import NotificationBell from "../components/NotificationBell"
import PageHeader from "../components/PageHeader"
import WeeklyTrendChart from "../components/WeeklyTrendChart"
import { formatDate, getDaysLeft, isWithinRange } from "../lib/date"
import { getDashboardBundle } from "../services/superapp"

const quoteOptions = [
  "You are one focused week away from visible momentum.",
  "Small daily consistency compounds into rank-changing outcomes.",
  "Build discipline now, and opportunities will follow.",
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

  const quote = useMemo(
    () => quoteOptions[new Date().getDay() % quoteOptions.length],
    []
  )

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

    const xp =
      studySessions.length * 20 +
      quizAttempts.length * 35 +
      bookings.length * 40

    const level = Math.max(1, Math.floor(xp / 250) + 1)

    const unreadCount = (bundle.notifications || []).filter(
      (item) => !item.is_read
    ).length

    const deadlineAlerts = (bundle.colleges || [])
      .filter((item) => isWithinRange(item.application_end, 3))
      .slice(0, 4)

    const hasActivityToday =
      studySessions.some(
        (s) =>
          new Date(s.created_date).toDateString() === today
      ) ||
      quizAttempts.some(
        (a) =>
          new Date(a.created_date).toDateString() === today
      )

    const activeGoals = (bundle.goals || []).filter(
      (goal) =>
        goal.status === "active" ||
        goal.status === "in_progress"
    )

    const upcomingBookings = bookings.filter(
      (booking) =>
        new Date(booking.requested_datetime) >= new Date()
    )

    const streamMentors = (bundle.mentors || []).filter(
      (mentor) =>
        !bundle.profile?.stream ||
        mentor.stream === bundle.profile.stream
    )

    return {
      xp,
      level,
      unreadCount,
      deadlineAlerts,
      hasActivityToday,
      activeGoals,
      upcomingBookings,
      streamMentors,
    }
  }, [bundle])

  if (loading) {
    return <LoadingSkeleton rows={12} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${
          bundle?.profile?.full_name || "Student"
        }`}
        description={`Stream: ${
          bundle?.profile?.stream || "General"
        } • Target: ${
          bundle?.profile?.target_exam || "Not Set"
        }`}
        cta={
          <NotificationBell
            unreadCount={
              computed.unreadCount +
              computed.deadlineAlerts.length
            }
          />
        }
      />

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-slate-700">
            <Sparkles size={16} />
            {quote}
          </p>
          <div className="rounded-xl bg-slate-900 px-4 py-2 text-white">
            <p className="text-xs text-slate-300">
              XP / Level
            </p>
            <p className="text-lg font-semibold">
              {computed.xp} XP · L{computed.level}
            </p>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={TrendingUp}
          title="Study Sessions"
          value={bundle.studySessions?.length || 0}
          subtitle="Tracked performance units"
        />
        <MetricCard
          icon={Award}
          title="Quiz Attempts"
          value={bundle.quizAttempts?.length || 0}
          subtitle="Assessment attempts"
        />
        <MetricCard
          icon={CalendarDays}
          title="Upcoming Sessions"
          value={computed.upcomingBookings.length}
          subtitle="Mentor bookings"
        />
        <MetricCard
          icon={Bell}
          title="Unread Notifications"
          value={computed.unreadCount}
          subtitle="Messages & alerts"
        />
      </section>
    </div>
  )
}

function MetricCard({ icon: Icon, title, value, subtitle }) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-3 inline-flex rounded-lg bg-indigo-100 p-2 text-indigo-700">
        <Icon size={16} />
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-semibold text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </motion.article>
  )
}

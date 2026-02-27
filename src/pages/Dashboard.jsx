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

    return {
      xp,
      level,
      unreadCount,
      deadlineAlerts,
      hasActivityToday,
      weeklyStudyData,
      weeklyScoreData,
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
        title={`Welcome back, ${bundle?.profile?.full_name || "Student"}`}
        description={`Stream: ${bundle?.profile?.stream || "General"} • Target: ${bundle?.profile?.target_exam || "Not Set"}`}
        cta={<NotificationBell unreadCount={computed.unreadCount + computed.deadlineAlerts.length} />}
      />

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Sparkles size={16} className="text-indigo-600" />
            {quote}
          </p>
          <div className="rounded-xl bg-slate-900 px-4 py-2 text-white">
            <p className="text-xs text-slate-300">XP / Level</p>
            <p className="text-lg font-semibold">{computed.xp} XP · L{computed.level}</p>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={TrendingUp} title="Study Sessions" value={bundle.studySessions.length} subtitle="Tracked performance units" />
        <MetricCard icon={Award} title="Quiz Attempts" value={bundle.quizAttempts.length} subtitle="Assessment attempts captured" />
        <MetricCard icon={CalendarDays} title="Upcoming Sessions" value={computed.upcomingBookings.length} subtitle="Mentor bookings scheduled" />
        <MetricCard icon={Bell} title="Unread Notifications" value={computed.unreadCount} subtitle="Messages and deadline alerts" />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <WeeklyTrendChart title="Weekly Study Minutes Trend" data={computed.weeklyStudyData} color="indigo" />
        <WeeklyTrendChart title="Weekly Average Score Trend" data={computed.weeklyScoreData} color="emerald" />
      </section>

      <AnimatePresence>
        {computed.deadlineAlerts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-xl border border-rose-200 bg-rose-50 p-5"
          >
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-rose-800">
              <Flame size={16} />
              Smart Alert — Applications closing within 3 days
            </h3>
            <ul className="space-y-2 text-sm text-rose-700">
              {computed.deadlineAlerts.map(alert => (
                <li key={alert.id}>{alert.name} · closes {formatDate(alert.application_end)} ({getDaysLeft(alert.application_end)}d)</li>
              ))}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>

      {!computed.hasActivityToday && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"
        >
          <p className="text-sm font-medium text-emerald-800">No activity logged today. Start one 25-minute study sprint now to preserve your momentum.</p>
        </motion.section>
      )}

      <section className="grid gap-5 xl:grid-cols-3">
        <Panel
          title="Active Goals"
          icon={Target}
          items={computed.activeGoals.slice(0, 5).map(goal => ({
            id: goal.id,
            title: goal.title,
            subtitle: `${goal.progress_percentage || 0}% • due ${formatDate(goal.target_date)}`,
          }))}
        />

        <Panel
          title="Upcoming Mentor Sessions"
          icon={GraduationCap}
          items={computed.upcomingBookings.slice(0, 5).map(booking => ({
            id: booking.id,
            title: booking.topic || "Mentor Session",
            subtitle: `${formatDate(booking.requested_datetime)} • ${booking.duration_minutes || 30} min`,
          }))}
        />

        <Panel
          title="Recommended Mentors"
          icon={Rocket}
          items={computed.streamMentors.slice(0, 5).map(mentor => ({
            id: mentor.id,
            title: mentor.name,
            subtitle: `${mentor.specialization || mentor.stream} • ⭐ ${mentor.rating || "NA"}`,
          }))}
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
      <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </motion.article>
  )
}

function Panel({ title, icon: Icon, items }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon size={15} className="text-indigo-600" />
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No records yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-500">{item.subtitle}</p>
import { Building2, CalendarDays, IndianRupee, ShieldCheck, TrendingUp } from "lucide-react"
import { useMemo } from "react"
import DataState from "../components/DataState"
import PageHeader from "../components/PageHeader"
import { useAsyncData } from "../hooks/useAsyncData"
import { APP_CONFIG } from "../lib/config"
import { getDaysLeft, isWithinRange } from "../lib/date"
import { getColleges, getExamsTimeline } from "../services/api"

function StatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 inline-flex rounded-lg bg-indigo-50 p-2 text-indigo-700">
        <Icon size={18} />
      </div>
      <h3 className="text-sm text-slate-500">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </article>
  )
}

export default function Dashboard() {
  const collegesData = useAsyncData(getColleges, [])
  const examsData = useAsyncData(getExamsTimeline, [])

  const loading = collegesData.loading || examsData.loading
  const error = collegesData.error || examsData.error

  const colleges = collegesData.data
  const exams = examsData.data

  const closingSoon = useMemo(
    () => colleges.filter(c => isWithinRange(c.application_end, 7)),
    [colleges],
  )
  const upcomingExams = useMemo(() => exams.filter(e => isWithinRange(e.exam_date, 14)), [exams])

  const projectedMonthlyRevenue =
    APP_CONFIG.pricing.pro * Math.max(1, Math.floor(colleges.length / 10))

  return (
    <div>
      <PageHeader
        title="Investor-Ready Operations Dashboard"
        description="Scalable admissions operations with monetization and risk visibility."
        cta={
          <div className="rounded-xl bg-slate-900 px-4 py-3 text-white">
            <p className="text-xs text-slate-300">MRR Projection</p>
            <p className="text-lg font-semibold">₹{projectedMonthlyRevenue.toLocaleString("en-IN")}</p>
          </div>
        }
      />

      <DataState loading={loading} error={error} empty={!colleges.length && !exams.length}>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={Building2}
            title="Active Opportunities"
            value={colleges.length}
            subtitle="Live institutions in admissions funnel"
          />
          <StatCard
            icon={CalendarDays}
            title="Exams in 14 Days"
            value={upcomingExams.length}
            subtitle="Time-sensitive preparation queue"
          />
          <StatCard
            icon={TrendingUp}
            title="Deadline Risk"
            value={closingSoon.length}
            subtitle="Applications closing within 7 days"
          />
          <StatCard
            icon={IndianRupee}
            title="Pro Plan Price"
            value={`₹${APP_CONFIG.pricing.pro}`}
            subtitle="Monetization baseline for B2C upsell"
          />
          <StatCard
            icon={ShieldCheck}
            title="Admin Coverage"
            value="100%"
            subtitle="Data visible in Admin Control panel"
          />
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-2">
          <InsightList
            title="Critical Application Deadlines"
            items={closingSoon.slice(0, 6).map(item => ({
              id: item.id,
              title: item.name,
              daysLeft: getDaysLeft(item.application_end),
            }))}
            tone="rose"
          />

          <InsightList
            title="Upcoming Exam Events"
            items={upcomingExams.slice(0, 6).map(item => ({
              id: item.id,
              title: item.exam_name,
              daysLeft: getDaysLeft(item.exam_date),
            }))}
            tone="indigo"
          />
        </section>
      </DataState>
    </div>
  )
}

function InsightList({ title, items, tone }) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No urgent items.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map(item => (
            <li key={item.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-sm font-medium text-slate-800">{item.title}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  tone === "rose" ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {item.daysLeft}d left
              </span>
            </li>
          ))}
        </ul>
      )}
    </motion.article>
    </article>
  )
}

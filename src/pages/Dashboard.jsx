import { Helmet } from "react-helmet-async"
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
  Shield,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import LoadingSkeleton from "../components/LoadingSkeleton"
import NotificationBell from "../components/NotificationBell"

import { getDashboardBundle } from "../services/superapp"
import { formatDate, getDaysLeft, isWithinRange } from "../lib/date"
import { takshakCourses, takshakEducators, takshakDeadlines } from "../data/takshakData"
import { Bookmark, ShieldCheck, PlayCircle } from "lucide-react"

// Animation imports
import AnimatedCounter from "../components/animations/AnimatedCounter"
import TextReveal from "../components/animations/TextReveal"
import TypewriterText from "../components/animations/TypewriterText"
import MagneticCard from "../components/animations/MagneticCard"
import { StaggerContainer, StaggerItem, FloatingElement, PulseGlow, SlideIn } from "../components/animations/AnimationUtils"
import RevealSection from "../components/motion/RevealSection"
import CountUp from "../components/motion/CountUp"
import SearchBar from "../components/search/SearchBar"

const MOTIVATIONAL_QUOTES = [
  "Your future is shaped by the actions you take today.",
  "Small daily consistency compounds into rank-changing outcomes.",
  "Build discipline now, and opportunities will follow.",
  "Every practice test is a step closer to your dream college.",
  "Nations are built by minds that never stopped learning.",
]

const QUICK_ACTIONS = [
  { title: "Find a Mentor", description: "Get 1:1 expert guidance from top rankers", icon: Users, tag: "RECOMMENDED", link: "/sessions" },
  { title: "Defence Prep", description: "NDA, CDS, SSB prep — first session FREE", icon: Shield, tag: "NEW", link: "/defence" },
  { title: "Ask Doubts", description: "Ask anonymously, learn together", icon: MessageSquare, link: "/forum" },
  { title: "Predict Cutoff", description: "Check your chances at top colleges", icon: Target, link: "/cutoff" },
]

// Animation variants
const containerVariants = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}
const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

export default function Dashboard() {
  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBundle() {
      setLoading(true)
      try {
        const payload = await getDashboardBundle()
        setBundle(payload)
      } catch (err) {
        console.error("Dashboard API Error:", err)
        setBundle({
          profile: { full_name: "Student" },
          studySessions: [],
          quizAttempts: [],
          bookings: [],
          colleges: [],
          notifications: []
        })
      } finally {
        setLoading(false)
      }
    }
    loadBundle()
  }, [])

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

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"
  const userName = bundle?.profile?.full_name || "Student"

  return (
    <div className="relative z-10 pt-8 pb-24 px-2 md:px-6 max-w-7xl mx-auto space-y-12 md:space-y-16">

      {/* SEO Meta */}
      <Helmet>
        <title>Dashboard | TAKSHAK — Track your College Admissions</title>
        <meta name="description" content="View your college admission progress, track study sessions, and access personalized mentoring on the TAKSHAK dashboard." />
      </Helmet>

      {/* ═══ HERO HEADER ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary/60 mb-3">
            DASHBOARD
          </p>
          <h1 className="font-headline font-black text-[clamp(28px,4vw,42px)] italic text-on-surface leading-tight">
            Good {greeting}, {userName} ✦
          </h1>
          <p className="text-secondary font-light text-lg uppercase tracking-[0.1em] opacity-80 mt-2">
            Level {computed.level} • {computed.xp} XP earned
          </p>
        </div>
        <div className="flex gap-3">
          <NotificationBell unreadCount={computed.unreadCount + computed.deadlineAlerts.length} />
        </div>
      </motion.section>

      {/* ═══ SEARCH ═══ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <SearchBar popularTags={['JEE', 'NEET', 'GATE', 'CUET', 'UPSC', 'CAT']} />
      </motion.div>

      {/* ═══ METRIC GRID ═══ */}
      <motion.section
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <StatCard icon={TrendingUp} label="Study Sessions" value={bundle?.studySessions?.length || 0} sub="Tracked units" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard icon={Award} label="Quiz Attempts" value={bundle?.quizAttempts?.length || 0} sub="Assessments" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard icon={CalendarDays} label="Upcoming" value={computed.upcomingBookings.length} sub="Mentor bookings" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard icon={Bell} label="Unread" value={computed.unreadCount} sub="Notifications" />
        </motion.div>
      </motion.section>

      {/* ═══ QUICK ACTIONS ═══ */}
      <section>
        <h2 className="section-title text-2xl mb-8 flex items-center gap-3">
          <Zap size={24} className="text-tertiary" /> Quick Actions
        </h2>
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <motion.div key={action.title} variants={itemVariants}>
                <Link
                  to={action.link}
                  className="group flex flex-col glass rounded-lg p-6 md:p-8 transition-all duration-500 hover:bg-surface-container-high hover:scale-[1.01] h-full relative overflow-hidden"
                >
                  {action.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-tertiary/20 text-tertiary px-2.5 py-0.5 text-[9px] font-label uppercase tracking-widest font-bold">
                      {action.tag}
                    </span>
                  )}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-headline font-bold text-base md:text-lg text-on-surface italic">{action.title}</h3>
                  <p className="mt-2 text-xs md:text-sm text-on-surface-variant font-light leading-relaxed flex-1">{action.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-label uppercase tracking-wider text-primary/70 group-hover:text-primary transition-colors duration-400">
                    Explore <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform duration-400" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* ═══ SAVED & TRACKED ═══ */}
      <section>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Saved Courses & Mentors */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <div className="glass rounded-lg p-6 md:p-8 h-full flex flex-col">
              <h3 className="mb-6 flex items-center gap-2 font-headline font-bold text-lg text-on-surface italic">
                <Bookmark size={20} className="text-primary" /> Saved Mentors & Courses
              </h3>
              <div className="space-y-3 flex-1">
                {takshakCourses.slice(0, 2).map((course) => (
                  <div key={course.id} className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3 hover:bg-surface-container transition-all duration-400">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <PlayCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-on-surface">{course.title}</p>
                      <p className="text-xs text-on-surface-variant font-light">{course.provider} • {course.mode}</p>
                    </div>
                    <Link to="/marketplace" className="text-xs font-label uppercase tracking-wider text-primary hover:text-primary-fixed-dim transition-colors duration-400">View</Link>
                  </div>
                ))}
                {takshakEducators.slice(0, 1).map((mentor) => (
                  <div key={mentor.id} className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3 hover:bg-surface-container transition-all duration-400">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-tertiary">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-on-surface">{mentor.name}</p>
                      <p className="text-xs text-on-surface-variant font-light">{mentor.subject} • ⭐ {mentor.rating}</p>
                    </div>
                    <Link to="/mentors" className="text-xs font-label uppercase tracking-wider text-primary hover:text-primary-fixed-dim transition-colors duration-400">Book</Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tracked Deadlines */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          >
            <div className="glass rounded-lg p-6 md:p-8 h-full flex flex-col">
              <h3 className="mb-6 flex items-center gap-2 font-headline font-bold text-lg text-on-surface italic">
                <CalendarDays size={20} className="text-tertiary" /> Tracked Opportunities
              </h3>
              <div className="space-y-3 flex-1">
                {takshakDeadlines.slice(0, 3).map((deadline) => (
                  <div key={deadline.id} className="flex items-start gap-3 rounded-lg bg-surface-container-low p-3 hover:bg-surface-container transition-all duration-400">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
                      <span className="text-xs font-black">{new Date(deadline.date).getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-on-surface">{deadline.title}</p>
                      <p className="text-xs text-on-surface-variant font-light line-clamp-1">{deadline.description}</p>
                      <p className="mt-1 text-[10px] font-label font-bold uppercase tracking-widest text-error">
                        {formatDate(deadline.date)} • {getDaysLeft(deadline.date)}d left
                      </p>
                    </div>
                    <Link to="/applications" className="mt-2 text-xs font-label uppercase tracking-wider text-error hover:text-primary transition-colors duration-400">Track</Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ DEADLINE ALERTS ═══ */}
      <AnimatePresence>
        {computed.deadlineAlerts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass rounded-lg p-6 md:p-8 border-l-4 border-error"
          >
            <h3 className="font-headline font-bold text-lg text-on-surface italic mb-4 flex items-center gap-2">
              <Flame size={20} className="text-error" /> Applications closing within 3 days
            </h3>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              {computed.deadlineAlerts.map(a => (
                <li key={a.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-error shrink-0 animate-pulse" />
                  {a.name} — closes {formatDate(a.application_end)} ({getDaysLeft(a.application_end)}d left)
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══ NO ACTIVITY NUDGE ═══ */}
      {!computed.hasActivityToday && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="glass rounded-lg p-6 md:p-8 text-center"
        >
          <p className="text-sm text-on-surface-variant font-light">
            <Rocket size={16} className="inline mr-1.5 text-primary" />
            No activity logged today. A 30-minute session keeps your streak alive! 🔥
          </p>
        </motion.section>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="glass rounded-lg p-6 md:p-8 group hover:bg-surface-container-high transition-all duration-500 h-full">
      <p className="font-label text-xs uppercase tracking-widest text-secondary/60 mb-4">{label}</p>
      <div className="mb-3 inline-flex rounded-full p-2.5 bg-primary/10 text-primary">
        <Icon size={20} />
      </div>
      <AnimatedCounter value={value} className="stat-number text-[42px] md:text-[52px] text-primary group-hover:text-on-surface transition-colors duration-500 block" />
      <p className="text-on-surface-variant font-light text-sm mt-2">{sub}</p>
    </div>
  )
}

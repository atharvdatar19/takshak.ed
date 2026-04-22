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
import LoadingSkeleton from "../components/ui/LoadingSkeleton"
import NotificationBell from "../components/ui/NotificationBell"

import { getDashboardBundle } from "../services/superapp"
import { formatDate, getDaysLeft, isWithinRange } from "../lib/date"
import { takshakCourses, takshakEducators, takshakDeadlines } from "../data/takshakData"
import { Bookmark, ShieldCheck, PlayCircle } from "lucide-react"

// 🚀 Animation imports
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
  { title: "Find a Mentor", description: "Get 1:1 expert guidance from top rankers", icon: Users, gradient: "card-gradient-blue", tag: "RECOMMENDED", link: "/sessions" },
  { title: "Defence Prep", description: "NDA, CDS, SSB prep — first session FREE", icon: Shield, gradient: "card-gradient-teal", tag: "NEW", link: "/defence" },
  { title: "Ask Doubts", description: "Ask anonymously, learn together", icon: MessageSquare, gradient: "card-gradient-purple", link: "/forum" },
  { title: "Predict Cutoff", description: "Check your chances at top colleges", icon: Target, gradient: "card-gradient-orange", link: "/cutoff" },
]

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

  const dayName = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="space-y-8 md:space-y-12">

      {/* ── SEO Meta ── */}
      <Helmet>
        <title>Dashboard | TAKSHAK — Track your College Admissions</title>
        <meta name="description" content="View your college admission progress, track study sessions, and access personalized mentoring on the TAKSHAK dashboard." />
      </Helmet>

      {/* ═══ HERO — Search-First Layout (Edura-inspired, Takshak dark) ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        style={{ position: 'relative', overflow: 'hidden', padding: '48px 0 32px' }}
      >
        {/* Floating orbs */}
        <div className="orb orb-indigo" style={{ width: 360, height: 360, top: -80, right: -80, opacity: 0.18 }} />
        <div className="orb orb-purple" style={{ width: 280, height: 280, bottom: -40, left: -60, opacity: 0.12 }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 720, margin: '0 auto' }}>

          {/* 1 — Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}
          >
            <span style={{
              padding: '6px 16px',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 700,
              background: 'var(--accent-glow)',
              border: '1px solid var(--accent-glow-intense)',
              color: 'var(--obsidian-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}>
              ✦ AI-Powered Exam &amp; College Discovery
            </span>
          </motion.div>

          {/* 2 — Staggered headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: 16 }}
          >
            {['Find', 'Your', 'Perfect', 'College'].map((word) => (
              <motion.span
                key={word}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.19,1,0.22,1] } } }}
                style={{ color: 'var(--obsidian-on-surface)', marginRight: '0.25em', display: 'inline-block' }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            {['Without', 'the', 'Confusion'].map((word) => (
              <motion.span
                key={word}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.19,1,0.22,1] } } }}
                style={{
                  marginRight: '0.25em',
                  display: 'inline-block',
                  background: 'linear-gradient(90deg, #4edea3, #c0c1ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* 3 — Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
            style={{ fontSize: 16, color: 'var(--obsidian-on-surface-variant)', marginBottom: 28, lineHeight: 1.7 }}
          >
            Discover, compare, and choose exams, colleges, &amp; mentors for your journey. No confusion, no missed deadlines.
          </motion.p>

          {/* 4+5 — Search bar + popular tags */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1], delay: 0.6 }}
          >
            <SearchBar
              popularTags={['JEE', 'NEET', 'GATE', 'CUET', 'UPSC', 'CAT']}
            />
          </motion.div>

          {/* 6 — Stats row with CountUp */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: 1.0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 28, flexWrap: 'wrap' }}
          >
            {[
              { target: 10000, suffix: '+', label: 'Students' },
              { target: 500, suffix: '+', label: 'Colleges' },
              { target: 50, suffix: '+', label: 'Mentors' },
            ].map(({ target, suffix, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <CountUp
                  target={target}
                  suffix={suffix}
                  className="stat-number"
                  duration={1800}
                />
                <span style={{ fontSize: 13, color: '#a3aac4', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto' }}>
              <NotificationBell unreadCount={computed.unreadCount + computed.deadlineAlerts.length} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ QUICK ACTIONS — Staggered + Magnetic + Shimmer ═══ */}
      <section>
        <SlideIn direction="left" delay={0.1}>
          <h2 className="text-section text-xl md:text-3xl text-slate-900 mb-5 md:mb-8 flex items-center gap-2">
            <Zap size={24} className="text-amber-500" /> Quick Actions
          </h2>
        </SlideIn>

        <StaggerContainer stagger={0.1} delay={0.2} className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon
            return (
              <StaggerItem key={action.title}>
                <MagneticCard intensity={0.05} className="h-full">
                  <Link
                    to={action.link}
                    className={`shimmer-hover btn-ripple group flex flex-col overflow-hidden rounded-[24px] ${action.gradient} p-6 md:p-8 text-white transition-all duration-300 hover:shadow-2xl h-full`}
                  >
                    {action.tag && (
                      <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 z-20">
                        ✨ {action.tag}
                      </span>
                    )}
                    <FloatingElement amplitude={3} duration={3 + i}>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Icon size={24} />
                      </div>
                    </FloatingElement>
                    <h3 className="text-card-title text-base md:text-lg">{action.title}</h3>
                    <p className="mt-1.5 text-xs md:text-sm text-white/70 leading-relaxed flex-1">{action.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition">
                      Explore <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </MagneticCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </section>

      {/* ═══ STATS — Animated Counters ═══ */}
      <section>
        <SlideIn direction="left" delay={0.1}>
          <h2 className="text-section text-xl md:text-3xl text-slate-900 mb-5 md:mb-8 flex items-center gap-2">
            <Rocket size={24} className="text-indigo-600" /> Today's Progress
          </h2>
        </SlideIn>

        <StaggerContainer stagger={0.1} delay={0.15} className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StaggerItem>
            <StatCard icon={TrendingUp} label="Study Sessions" value={bundle?.studySessions?.length || 0} sub="Tracked units" color="indigo" />
          </StaggerItem>
          <StaggerItem>
            <StatCard icon={Award} label="Quiz Attempts" value={bundle?.quizAttempts?.length || 0} sub="Assessments" color="emerald" />
          </StaggerItem>
          <StaggerItem>
            <StatCard icon={CalendarDays} label="Upcoming" value={computed.upcomingBookings.length} sub="Mentor bookings" color="blue" />
          </StaggerItem>
          <StaggerItem>
            <StatCard icon={Bell} label="Unread" value={computed.unreadCount} sub="Notifications" color="amber" />
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* ═══ SAVED & TRACKED ═══ */}
      <section>
        <div className="divider-gradient mb-8" />
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Saved Courses & Mentors */}
          <SlideIn direction="up" delay={0.2} className="h-full">
            <div className="gradient-border h-full">
              <div className="glass-card p-6 rounded-[24px] h-full flex flex-col">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 z-10 relative">
                  <Bookmark size={20} className="text-indigo-600" /> Saved Mentors & Courses
                </h3>
                <div className="space-y-3 z-10 relative flex-1">
                  {takshakCourses.slice(0, 2).map((course) => (
                    <div key={course.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 transition">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <PlayCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{course.title}</p>
                        <p className="text-xs text-slate-500">{course.provider} • {course.mode}</p>
                      </div>
                      <Link to="/marketplace" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View</Link>
                    </div>
                  ))}
                  {takshakEducators.slice(0, 1).map((mentor) => (
                    <div key={mentor.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 transition">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{mentor.name}</p>
                        <p className="text-xs text-slate-500">{mentor.subject} • ⭐ {mentor.rating}</p>
                      </div>
                      <Link to="/mentors" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Book</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SlideIn>

          {/* Tracked Deadlines */}
          <SlideIn direction="up" delay={0.3} className="h-full">
            <div className="gradient-border h-full">
              <div className="glass-card p-6 rounded-[24px] h-full flex flex-col">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 z-10 relative">
                  <CalendarDays size={20} className="text-rose-600" /> Tracked Opportunities
                </h3>
                <div className="space-y-3 z-10 relative flex-1">
                  {takshakDeadlines.slice(0, 3).map((deadline) => (
                    <div key={deadline.id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 transition">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                        <span className="text-xs font-black">{new Date(deadline.date).getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{deadline.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{deadline.description}</p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                          {formatDate(deadline.date)} • {getDaysLeft(deadline.date)}d left
                        </p>
                      </div>
                      <Link to="/applications" className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-800">Track</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* ═══ DEADLINE ALERTS ═══ */}
      <AnimatePresence>
        {computed.deadlineAlerts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="card-bb border-rose-200 bg-rose-50 p-5 md:p-7 glow-breathe"
          >
            <h3 className="text-card-title text-lg text-rose-800 mb-3 flex items-center gap-2">
              <Flame size={20} /> Applications closing within 3 days
            </h3>
            <ul className="space-y-2 text-sm text-rose-700">
              {computed.deadlineAlerts.map(a => (
                <li key={a.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="card-bb border-indigo-100 bg-indigo-50/60 p-5 md:p-7 text-center"
        >
          <p className="text-sm text-indigo-700">
            <Rocket size={16} className="inline mr-1.5 text-indigo-500" />
            No activity logged today. A 30-minute session keeps your streak alive! 🔥
          </p>
        </motion.section>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color = "indigo" }) {
  const bgMap = { indigo: "bg-indigo-50 border-indigo-100", emerald: "bg-emerald-50 border-emerald-100", blue: "bg-blue-50 border-blue-100", amber: "bg-amber-50 border-amber-100" }
  const iconBg = { indigo: "bg-indigo-100 text-indigo-600", emerald: "bg-emerald-100 text-emerald-600", blue: "bg-blue-100 text-blue-600", amber: "bg-amber-100 text-amber-600" }

  return (
    <MagneticCard intensity={0.03} className="h-full">
      <div className={`glass-card ${bgMap[color]} p-5 md:p-6 h-full glass-glow reveal-up`}>
        <FloatingElement amplitude={2} duration={4}>
          <div className={`mb-3 inline-flex rounded-xl p-2.5 ${iconBg[color]}`}>
            <Icon size={20} />
          </div>
        </FloatingElement>
        <p className="text-xs text-slate-500 tracking-wide uppercase">{label}</p>
        <AnimatedCounter value={value} className="stat-number text-3xl md:text-4xl text-slate-900 block mt-1" />
        <p className="mt-1 text-xs text-slate-400">{sub}</p>
      </div>
    </MagneticCard>
  )
}

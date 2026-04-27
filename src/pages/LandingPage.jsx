import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  ArrowRight, BookOpen, Building2, CheckCircle2, ChevronDown,
  Compass, GraduationCap, Menu, MessageSquare, Shield,
  Star, Target, TrendingUp, Users, X, Zap, Mail,
} from "lucide-react"
import { useAuth } from "@auth/AuthContext"

/* Social icons as inline SVGs to avoid extra deps */
function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.84L2.025 2.25H8.1l4.258 5.63 5.886-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Floating hero UI preview cards
───────────────────────────────────────────── */
function MentorPreviewCard() {
  return (
    <div className="w-56 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-black text-white shrink-0">RS</div>
        <div>
          <p className="text-[11px] font-bold text-white leading-tight">Raghav Mishra</p>
          <p className="text-[9px] text-slate-400">NDA Coach · AIR 371</p>
        </div>
      </div>
      <div className="flex items-center gap-1 mb-2.5">
        {[1,2,3,4,5].map(i => <Star key={i} size={9} className="text-amber-400 fill-amber-400" />)}
        <span className="text-[9px] text-slate-400 ml-1">5.0 · 120 sessions</span>
      </div>
      <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1.5 text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Session confirmed · Tomorrow 4 PM
      </div>
    </div>
  )
}

function CutoffPreviewCard() {
  return (
    <div className="w-52 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl shadow-2xl shadow-black/40">
      <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">JEE Main Rank</p>
      <p className="text-3xl font-black text-white leading-none">12,450</p>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={9} /> NIT Trichy CSE</span>
          <span className="text-emerald-500 font-bold">95%</span>
        </div>
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-amber-400 font-bold flex items-center gap-1">~ VJTI Mumbai IT</span>
          <span className="text-amber-500 font-bold">72%</span>
        </div>
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-slate-400 font-bold flex items-center gap-1">~ COEP Pune ENTC</span>
          <span className="text-slate-500 font-bold">58%</span>
        </div>
      </div>
    </div>
  )
}

function PlannerPreviewCard() {
  return (
    <div className="w-52 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl shadow-2xl shadow-black/40">
      <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-2">Today's Study Goal</p>
      <div className="space-y-1.5 mb-3">
        {[
          { label: "Physics — Optics", done: true },
          { label: "Chemistry — Organic", done: true },
          { label: "Maths — Integration", done: false },
        ].map(g => (
          <div key={g.label} className="flex items-center gap-2 text-[10px]">
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${g.done ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>
              {g.done && <CheckCircle2 size={8} className="text-white" />}
            </div>
            <span className={g.done ? "text-slate-500 line-through" : "text-white font-medium"}>{g.label}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
      </div>
      <p className="text-[9px] text-slate-400 mt-1.5">2 of 3 done · 3h 40m studied</p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Nav
───────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Discover", href: "/discover" },
  { label: "Prepare",  href: "/prepare"  },
  { label: "Mentors",  href: "/mentors"  },
  { label: "Community",href: "/community"},
]

function Navbar({ scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#05080f]/80 backdrop-blur-2xl border-b border-white/[0.06]" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-[15px] font-black tracking-tight text-white">TAKSHAK</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <Link key={l.label} to={l.href} className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
          <Link to="/signup" className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#050811] text-[12px] font-black px-4 py-2 hover:bg-indigo-100 transition-colors">
            Get Started <ArrowRight size={12} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(v => !v)} className="md:hidden text-slate-400 hover:text-white transition-colors p-2">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#05080f]/95 backdrop-blur-2xl border-b border-white/[0.06] px-5 pb-6">
            <nav className="flex flex-col gap-4 pt-4">
              {NAV_LINKS.map(l => (
                <Link key={l.label} to={l.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{l.label}</Link>
              ))}
              <hr className="border-white/[0.06]" />
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white text-[#050811] text-sm font-black px-5 py-2.5 w-full">
                Get Started Free <ArrowRight size={13} />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ─────────────────────────────────────────────
   Section label
───────────────────────────────────────────── */
function Label({ children, color = "indigo" }) {
  const c = {
    indigo:  "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    violet:  "bg-violet-500/10 text-violet-400 border-violet-500/20",
    amber:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  }[color]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[10px] font-black uppercase tracking-widest ${c}`}>
      {children}
    </span>
  )
}

/* ─────────────────────────────────────────────
   Feature chip
───────────────────────────────────────────── */
function FeatureChip({ icon: Icon, label, sub }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors group">
      <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-indigo-500/30 transition-colors">
        <Icon size={16} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      <div>
        <p className="text-[12px] font-bold text-white">{label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   UI mockup panels (for feature sections)
───────────────────────────────────────────── */
function MentorsMockup() {
  const mentors = [
    { initials: "RS", name: "Raghav Mishra",  field: "NDA / SSB Coach",       rating: 5.0, color: "from-indigo-500 to-violet-600" },
    { initials: "PS", name: "Priya Sharma",   field: "NEET · AIIMS Delhi",    rating: 4.9, color: "from-rose-500 to-pink-600"     },
    { initials: "AM", name: "Arjun Mehta",    field: "CUET · DU Admissions",  rating: 4.7, color: "from-amber-500 to-orange-600"  },
  ]
  return (
    <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-3 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 pointer-events-none" />
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-4">Top Mentors</p>
      {mentors.map(m => (
        <div key={m.name} className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.04] p-3.5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-xs font-black text-white shrink-0`}>{m.initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-white truncate">{m.name}</p>
            <p className="text-[9px] text-slate-500 truncate">{m.field}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={9} className="text-amber-400 fill-amber-400" />
            <span className="text-[9px] text-amber-400 font-bold">{m.rating}</span>
          </div>
        </div>
      ))}
      <button className="w-full rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold py-2.5 mt-1 hover:bg-indigo-500/20 transition-colors">
        Book a Free Session →
      </button>
    </div>
  )
}

function CommunityMockup() {
  const posts = [
    { q: "Is dropping a year for JEE worth it in 2025?", ans: 24, votes: 89, tag: "JEE" },
    { q: "What's the cutoff for NEET AIIMS Delhi this year?", ans: 11, votes: 62, tag: "NEET" },
    { q: "Honest review of Allen vs Aakash for NEET prep", ans: 37, votes: 148, tag: "Coaching" },
  ]
  return (
    <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-3 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-emerald-500/5 pointer-events-none" />
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-4">Doubt Forum · Live</p>
      {posts.map(p => (
        <div key={p.q} className="rounded-2xl border border-white/[0.05] bg-white/[0.04] p-3.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] text-white font-semibold leading-relaxed flex-1">{p.q}</p>
            <span className="shrink-0 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 text-[8px] font-black uppercase">{p.tag}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[9px] text-slate-500">
            <span className="flex items-center gap-1">▲ {p.votes}</span>
            <span>{p.ans} answers</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function DiscoverMockup() {
  return (
    <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-4">Cutoff Predictor</p>
      {/* Rank input */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 mb-3">
        <p className="text-[9px] text-slate-500 mb-0.5">Your JEE Main Rank</p>
        <p className="text-xl font-black text-white">12,450</p>
      </div>
      {/* Results */}
      <div className="space-y-2">
        {[
          { college: "NIT Trichy — CSE",     chance: 95, color: "emerald" },
          { college: "VJTI Mumbai — IT",     chance: 72, color: "amber"   },
          { college: "COEP Pune — ENTC",     chance: 55, color: "orange"  },
          { college: "BITS Pilani — EEE",    chance: 28, color: "rose"    },
        ].map(r => (
          <div key={r.college} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[9px] text-slate-300 font-medium truncate">{r.college}</p>
              <div className="mt-1 h-1 rounded-full bg-white/[0.05]">
                <div className={`h-full rounded-full bg-${r.color}-500`} style={{ width: `${r.chance}%` }} />
              </div>
            </div>
            <span className={`text-[9px] font-black text-${r.color}-400 w-8 text-right`}>{r.chance}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function LandingPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true })
  }, [user, loading, navigate])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05080f] text-white overflow-x-hidden" style={{ fontFamily: "'Manrope', 'Inter', system-ui, sans-serif" }}>
      <Navbar scrolled={scrolled} />

      {/* ═══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-20 overflow-hidden">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[140px]" />
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-violet-500/15 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <motion.div style={{ y: heroY }} className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-[11px] font-bold text-indigo-300 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Trusted by 20,000+ students across India
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-black leading-[1.02] tracking-[-0.04em] mb-6">
            <span className="text-white">The education app</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
              that'll take you places
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Your home for JEE, NEET & CUET prep — cutoff predictions, 1:1 mentor sessions with IIT & AIIMS toppers, scholarship discovery, and a community that actually helps.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#05080f] font-black text-[14px] px-7 py-3.5 hover:scale-[1.03] transition-transform shadow-2xl shadow-white/10">
              Get Started Free <ArrowRight size={15} />
            </Link>
            <Link to="/discover"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] text-white font-semibold text-[14px] px-7 py-3.5 hover:bg-white/[0.08] transition-colors backdrop-blur-sm">
              Explore Features <ChevronDown size={14} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating preview cards */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-5 hidden md:grid grid-cols-3 gap-5">
          {[
            { component: <MentorPreviewCard />,   delay: 0.5, y: [0, -12, 0], duration: 3.5 },
            { component: <CutoffPreviewCard />,   delay: 0.65, y: [0, -8, 0], duration: 4   },
            { component: <PlannerPreviewCard />,  delay: 0.8, y: [0, -14, 0], duration: 3   },
          ].map(({ component, delay, y, duration }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay }}
              className="flex justify-center">
              <motion.div animate={{ y }} transition={{ duration, repeat: Infinity, ease: "easeInOut" }}>
                {component}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section className="relative border-y border-white/[0.05] bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "20,000+", label: "Students helped" },
            { value: "500+",    label: "Colleges listed" },
            { value: "50+",     label: "Verified mentors" },
            { value: "Free",    label: "Always free to start" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-2xl md:text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          DISCOVER SECTION
      ══════════════════════════════════════ */}
      <section className="relative py-24 px-5 overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <Label color="indigo"><Compass size={10} /> Discover</Label>
              <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-white">
                Find your college.<br />
                <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">Predict your cutoff.</span>
              </h2>
              <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-md">
                Browse 500+ colleges, predict admission chances with real cutoff data, compare side-by-side, and find scholarships you're actually eligible for.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <FeatureChip icon={Building2}   label="College Directory"     sub="500+ colleges with full data" />
                <FeatureChip icon={Target}       label="Cutoff Predictor"     sub="Real rank-based predictions" />
                <FeatureChip icon={TrendingUp}   label="Rank Reality Check"   sub="Know exactly where you stand" />
                <FeatureChip icon={GraduationCap}label="Scholarship Finder"   sub="Merit, need & category based" />
              </div>
              <Link to="/discover" className="mt-8 inline-flex items-center gap-2 text-indigo-400 font-bold text-sm hover:text-indigo-300 transition-colors">
                Explore Discover <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Right: mockup */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
              <DiscoverMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MENTORS SECTION
      ══════════════════════════════════════ */}
      <section className="relative py-24 px-5 overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: mockup */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="lg:order-1 order-2">
              <MentorsMockup />
            </motion.div>

            {/* Right: text */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="lg:order-2 order-1">
              <Label color="violet"><Users size={10} /> Mentors</Label>
              <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-white">
                Your Bhaiya & Didi<br />
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">from IIT & AIIMS.</span>
              </h2>
              <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-md">
                Book 1:1 video sessions with verified seniors who've been exactly where you are. Real guidance, real strategies — not generic advice.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Verified IIT, AIIMS, BITS & NDA alumni only",
                  "First 10-minute session always free",
                  "Book in seconds, meet via Google Meet",
                  "NDA, NEET, JEE, CUET specialists available",
                ].map(pt => (
                  <li key={pt} className="flex items-center gap-3 text-[13px] text-slate-300">
                    <CheckCircle2 size={15} className="text-violet-400 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
              <Link to="/mentors" className="mt-8 inline-flex items-center gap-2 text-violet-400 font-bold text-sm hover:text-violet-300 transition-colors">
                Find Your Mentor <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PREPARE SECTION
      ══════════════════════════════════════ */}
      <section className="relative py-24 px-5 overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-emerald-500/6 blur-[160px]" />
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <Label color="emerald"><BookOpen size={10} /> Prepare</Label>
            <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tight text-white">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">crack your exam.</span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
              From study planners and bridge courses to document checklists and exam resources — all in one place, completely free.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Target,       label: "Study Planner",       sub: "Set goals, log sessions, track progress with cloud sync", color: "indigo",  link: "/planner"   },
              { icon: BookOpen,     label: "Bridge Courses",       sub: "Free courses to fill gaps before your first college year", color: "emerald", link: "/bridge"    },
              { icon: GraduationCap,label: "Resource Hub",        sub: "Curated notes, PYQs, and educator channels by subject",   color: "violet",  link: "/resources" },
              { icon: Shield,       label: "Document Checklist",  sub: "Never miss a document — smart checklist for admissions",  color: "amber",   link: "/documents" },
              { icon: TrendingUp,   label: "Plan B Analyzer",     sub: "Smart backup college suggestions based on your profile",  color: "rose",    link: "/plan-b"    },
              { icon: Zap,          label: "AI Skill Matcher",    sub: "Find out which stream and career actually fits you",      color: "teal",    link: "/skill-matcher" },
            ].map((f, i) => {
              const c = {
                indigo:  { bg: "from-indigo-500/10 to-transparent",  border: "border-indigo-500/15",  icon: "bg-indigo-500/10 text-indigo-400",  dot: "bg-indigo-400" },
                emerald: { bg: "from-emerald-500/10 to-transparent", border: "border-emerald-500/15", icon: "bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-400" },
                violet:  { bg: "from-violet-500/10 to-transparent",  border: "border-violet-500/15",  icon: "bg-violet-500/10 text-violet-400",  dot: "bg-violet-400" },
                amber:   { bg: "from-amber-500/10 to-transparent",   border: "border-amber-500/15",   icon: "bg-amber-500/10 text-amber-400",   dot: "bg-amber-400" },
                rose:    { bg: "from-rose-500/10 to-transparent",    border: "border-rose-500/15",    icon: "bg-rose-500/10 text-rose-400",    dot: "bg-rose-400" },
                teal:    { bg: "from-teal-500/10 to-transparent",    border: "border-teal-500/15",    icon: "bg-teal-500/10 text-teal-400",    dot: "bg-teal-400" },
              }[f.color]
              return (
                <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <Link to={f.link} className={`group block rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} p-5 hover:scale-[1.02] transition-transform`}>
                    <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center mb-4`}>
                      <f.icon size={18} />
                    </div>
                    <p className="text-[13px] font-bold text-white mb-1.5">{f.label}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{f.sub}</p>
                    <div className={`mt-4 w-5 h-0.5 rounded-full ${c.dot} group-hover:w-8 transition-all`} />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          COMMUNITY SECTION
      ══════════════════════════════════════ */}
      <section className="relative py-24 px-5 overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-violet-500/8 blur-[130px]" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <Label color="violet"><MessageSquare size={10} /> Community</Label>
              <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-white">
                A community that<br />
                <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">actually helps.</span>
              </h2>
              <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-md">
                Ask doubts anonymously, get answers from real seniors, connect with future classmates, and check in on your mental wellness — because exams are stressful, and that's okay.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <FeatureChip icon={MessageSquare} label="Doubt Forum"         sub="Anonymous · no judgment" />
                <FeatureChip icon={Shield}         label="Defence Corner"      sub="NDA, CDS & SSB community" />
                <FeatureChip icon={Users}          label="Pre-Freshers"        sub="Meet your future batchmates" />
                <FeatureChip icon={Zap}            label="Wellness Check-in"  sub="Mental health matters too" />
              </div>
              <Link to="/community" className="mt-8 inline-flex items-center gap-2 text-violet-400 font-bold text-sm hover:text-violet-300 transition-colors">
                Join the Community <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Right: mockup */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
              <CommunityMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST SECTION
      ══════════════════════════════════════ */}
      <section className="relative py-20 px-5 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-10 md:p-14 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-transparent to-emerald-500/8" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05080f]/60" />
            <div className="relative z-10">
              <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-6">Why students choose Takshak</p>
              <div className="grid sm:grid-cols-3 gap-8 mb-10">
                {[
                  { icon: Shield, title: "No spam, ever",          sub: "We never sell your data or flood your inbox. Your information stays yours." },
                  { icon: CheckCircle2, title: "Verified mentors", sub: "Every mentor is verified with college ID before they can take sessions." },
                  { icon: Zap,    title: "Free to start",          sub: "Core features are always free. No credit card, no trial — just sign up." },
                ].map(t => (
                  <div key={t.title} className="text-center">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-white/[0.08] bg-white/[0.04] mb-4">
                      <t.icon size={20} className="text-indigo-400" />
                    </div>
                    <p className="text-[13px] font-bold text-white mb-2">{t.title}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{t.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="relative py-28 px-5 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-indigo-600/15 blur-[150px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.05] mb-6">
            Start your journey<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
              today. It's free.
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join 20,000+ students who are using Takshak to get into the colleges they deserve.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#05080f] font-black text-base px-8 py-4 hover:scale-[1.03] transition-transform shadow-2xl shadow-white/10">
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link to="/mentors"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] text-white font-semibold text-base px-8 py-4 hover:bg-white/[0.08] transition-colors">
              Browse Mentors
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-white/[0.05] px-5 pt-14 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-emerald-400 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="text-[15px] font-black tracking-tight text-white">TAKSHAK</span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed max-w-xs">
                The all-in-one platform for Indian students navigating JEE, NEET, CUET, and beyond. Built by students, for students.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Product", links: [["Discover Colleges","/discover"],["Cutoff Predictor","/cutoff"],["Mentors","/mentors"],["Study Planner","/planner"],["Scholarships","/scholarships"]] },
              { title: "Prepare", links: [["Resource Hub","/resources"],["Bridge Courses","/bridge"],["Document Checklist","/documents"],["Exam Timeline","/timeline"],["Plan B Analyzer","/plan-b"]] },
              { title: "Company", links: [["Sign Up","/signup"],["Login","/login"],["Community","/community"],["Defence Corner","/defence"],["Doubt Forum","/forum"]] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link to={href} className="text-[12px] text-slate-500 hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social + Legal bottom bar */}
          <div className="border-t border-white/[0.05] pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              {/* Social handles */}
              <div className="flex items-center gap-2">
                {[
                  { href: "https://x.com/takshaked",                     icon: <IconX />,         label: "X / Twitter" },
                  { href: "https://instagram.com/takshak.ed",            icon: <IconInstagram />, label: "Instagram" },
                  { href: "https://linkedin.com/company/takshak-ed",     icon: <IconLinkedIn />,  label: "LinkedIn" },
                  { href: "https://youtube.com/@takshaked",              icon: <IconYouTube />,   label: "YouTube" },
                  { href: "mailto:takshak.info@gmail.com",               icon: <Mail size={14} />,label: "Email" },
                ].map(s => (
                  <a key={s.label} href={s.href} target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer" aria-label={s.label}
                    className="w-8 h-8 rounded-xl border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-slate-500 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.06] transition-all">
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Legal links */}
              <div className="flex items-center gap-5 flex-wrap justify-center">
                <Link to="/privacy" className="text-[11px] text-slate-600 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms"   className="text-[11px] text-slate-600 hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="text-[11px] text-slate-600 hover:text-white transition-colors">Cookie Policy</Link>
                <a href="mailto:takshak.info@gmail.com" className="text-[11px] text-slate-600 hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            <p className="text-[11px] text-slate-700 mt-5 text-center sm:text-left">
              © 2025 Takshak. Made with ♥ for every Indian student. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

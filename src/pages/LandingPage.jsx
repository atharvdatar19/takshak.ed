import { useEffect, useRef, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useInView } from "framer-motion"
import {
  ArrowRight, BookOpen, Building2, CheckCircle2, ChevronDown,
  Compass, GraduationCap, Menu, MessageSquare, Shield,
  Star, Target, TrendingUp, Users, X, Zap, Mail, Sparkles,
  MousePointer2, Layers, Rocket, ClipboardList, Calendar,
  FileText, Brain, Heart, Sword,
} from "lucide-react"
import { useAuth } from "@auth/AuthContext"
import { MeshGradient } from "@paper-design/shaders-react"
import { ShinyButton } from "@components/ui/ShinyButton"

/* ─────────────────────────────────────────────
   PHANTOM-INSPIRED: Custom easing curves
───────────────────────────────────────────── */
const PHANTOM_EASE = {
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.1, 0.25, 1],
  snap:   [0.87, 0, 0.13, 1],
  float:  [0.45, 0, 0.55, 1],
}

/* ─────────────────────────────────────────────
   Floating mascot
───────────────────────────────────────────── */
function FloatingMascot() {
  const y      = useMotionValue(0)
  const rotate = useMotionValue(0)

  useEffect(() => {
    const id = setInterval(() => {
      y.set(Math.sin(Date.now() / 1000) * 15)
      rotate.set(Math.sin(Date.now() / 1500) * 5)
    }, 16)
    return () => clearInterval(id)
  }, [y, rotate])

  return (
    <motion.div style={{ y, rotate }} className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 opacity-20 blur-xl animate-pulse" />
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
        <Sparkles size={28} className="text-white" />
      </div>
      <motion.div
        animate={{ scaleY: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-violet-500 to-transparent rounded-full blur-md"
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Mesh Gradient Background
───────────────────────────────────────────── */
function EtherealBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <MeshGradient
        className="w-full h-full"
        colors={["#0a0a1a", "#1a1040", "#2e1065", "#0f172a"]}
        speed={0.4}
        backgroundColor="#0a0a1a"
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Scroll progress bar
───────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness:100, damping:30, restDelta:0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 origin-left z-[60]"
      style={{ scaleX }}
    />
  )
}

/* ─────────────────────────────────────────────
   Word-reveal text animation
───────────────────────────────────────────── */
function RevealText({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <span ref={ref}>
      {children.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y:"100%", rotate:5 }}
            animate={isInView ? { y:0, rotate:0 } : { y:"100%", rotate:5 }}
            transition={{ duration:0.6, delay: delay + i * 0.08, ease: PHANTOM_EASE.bounce }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ─────────────────────────────────────────────
   Magnetic button
───────────────────────────────────────────── */
function MagneticButton({ children, className = "", onClick, as: As = "button" }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness:150, damping:15 })
  const sy = useSpring(y, { stiffness:150, damping:15 })

  const onMove = useCallback((e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.2)
    y.set((e.clientY - (r.top  + r.height / 2)) * 0.2)
  }, [x, y])

  const onLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

/* ─────────────────────────────────────────────
   Parallax card
───────────────────────────────────────────── */
function ParallaxCard({ children, className = "", depth = 1 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end","end start"] })
  const y       = useTransform(scrollYProgress, [0,1], [100*depth, -100*depth])
  const rotateX = useTransform(scrollYProgress, [0,1], [10,-10])
  const opacity = useTransform(scrollYProgress, [0,0.2,0.8,1], [0,1,1,0])
  return (
    <motion.div ref={ref} style={{ y, rotateX, opacity }} className={`perspective-1000 ${className}`}>
      <div className="transform-gpu">{children}</div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Spotlight hover card
───────────────────────────────────────────── */
function SpotlightCard({ children, className = "" }) {
  const ref = useRef(null)
  const [pos, setPos]       = useState({ x:0, y:0 })
  const [hovered, setHover] = useState(false)

  const onMove = useCallback((e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }, [])

  return (
    <div ref={ref} onMouseMove={onMove} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(139,92,246,0.15), transparent 40%)` }}
      />
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Social icons
───────────────────────────────────────────── */
function IconX() {
  return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.84L2.025 2.25H8.1l4.258 5.63 5.886-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
}
function IconInstagram() {
  return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
}
function IconLinkedIn() {
  return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
}
function IconYouTube() {
  return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
}

/* ─────────────────────────────────────────────
   Hero floating preview cards
───────────────────────────────────────────── */
function MentorPreviewCard() {
  return (
    <SpotlightCard className="w-64 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 hover:border-purple-500/30 transition-colors duration-500">
      <div className="flex items-center gap-3 mb-4">
        <motion.div whileHover={{ scale:1.1, rotate:5 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg shadow-indigo-500/30">
          RS
        </motion.div>
        <div>
          <p className="text-xs font-bold text-white leading-tight">Raghav Mishra</p>
          <p className="text-[10px] text-slate-400">NDA Coach · AIR 371</p>
        </div>
      </div>
      <div className="flex items-center gap-1 mb-3">
        {[1,2,3,4,5].map(i => (
          <motion.div key={i} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay: i*0.1, type:"spring", stiffness:300 }}>
            <Star size={10} className="text-amber-400 fill-amber-400" />
          </motion.div>
        ))}
        <span className="text-[10px] text-slate-400 ml-1.5">5.0 · 120 sessions</span>
      </div>
      <motion.div whileHover={{ scale:1.02 }}
        className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-2">
        <motion.span animate={{ scale:[1,1.2,1] }} transition={{ duration:2, repeat:Infinity }}
          className="w-2 h-2 rounded-full bg-emerald-400" />
        Session confirmed · Tomorrow 4 PM
      </motion.div>
    </SpotlightCard>
  )
}

function CutoffPreviewCard() {
  return (
    <SpotlightCard className="w-60 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 hover:border-purple-500/30 transition-colors duration-500">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">JEE Main Rank</p>
      <p className="text-4xl font-black text-white leading-none bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">12,450</p>
      <div className="mt-4 space-y-2">
        {[
          { college:"NIT Trichy CSE", chance:95, color:"emerald" },
          { college:"VJTI Mumbai IT",  chance:72, color:"amber"   },
          { college:"COEP Pune ENTC",  chance:58, color:"slate"   },
        ].map((r, i) => (
          <motion.div key={r.college} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
            transition={{ delay: i*0.1 }} className="flex items-center justify-between text-[10px]">
            <span className={`text-${r.color}-400 font-bold flex items-center gap-1`}>
              {r.chance > 80 ? <CheckCircle2 size={10} /> : <TrendingUp size={10} />}
              {r.college}
            </span>
            <span className={`text-${r.color}-500 font-bold`}>{r.chance}%</span>
          </motion.div>
        ))}
      </div>
    </SpotlightCard>
  )
}

function PlannerPreviewCard() {
  return (
    <SpotlightCard className="w-60 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 hover:border-purple-500/30 transition-colors duration-500">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3">Today's Study Goal</p>
      <div className="space-y-2 mb-4">
        {[
          { label:"Physics — Optics",      done:true  },
          { label:"Chemistry — Organic",   done:true  },
          { label:"Maths — Integration",   done:false },
        ].map((g, i) => (
          <motion.div key={g.label} initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }}
            transition={{ delay: i*0.15 }} className="flex items-center gap-2.5 text-[14px]">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${g.done ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>
              {g.done && <CheckCircle2 size={10} className="text-white" />}
            </div>
            <span className={g.done ? "text-slate-500 line-through" : "text-white font-medium"}>{g.label}</span>
          </motion.div>
        ))}
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div initial={{ width:0 }} whileInView={{ width:"66%" }}
          transition={{ duration:1.5, ease: PHANTOM_EASE.smooth }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
      </div>
      <p className="text-[10px] text-slate-400 mt-2">2 of 3 done · 3h 40m studied</p>
    </SpotlightCard>
  )
}

/* ─────────────────────────────────────────────
   Navbar
───────────────────────────────────────────── */
const NAV_LINKS = [
  { label:"Discover",  href:"/discover"  },
  { label:"Prepare",   href:"/prepare"   },
  { label:"Mentors",   href:"/mentors"   },
  { label:"Community", href:"/community" },
]

function Navbar({ scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)

  return (
    <motion.header
      initial={{ y:-100 }}
      animate={{ y:0 }}
      transition={{ duration:0.8, ease: PHANTOM_EASE.smooth }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0a0a1a]/80 backdrop-blur-2xl border-b border-white/[0.06]" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.img
            src="/takshak_logo.jpg"
            alt="TAKक्षक"
            whileHover={{ rotate:10, scale:1.1 }}
            transition={{ type:"spring", stiffness:300 }}
            className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-indigo-500/30"
          />
          <span className="text-[16px] font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300">
            TAKक्षक
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l, i) => (
            <motion.div key={l.label} onHoverStart={() => setHoveredLink(i)} onHoverEnd={() => setHoveredLink(null)} className="relative">
              <Link
                to={l.href}
                className="relative px-4 py-2 rounded-xl block transition-colors duration-200"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: hoveredLink === i ? "#fff" : "rgba(255,255,255,0.55)",
                  letterSpacing: "-0.01em",
                }}
              >
                {hoveredLink === i && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            style={{ fontFamily:"'Inter',sans-serif", fontSize:"13.5px", fontWeight:500, color:"rgba(255,255,255,0.5)", letterSpacing:"-0.01em" }}
            className="hover:text-white transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link to="/signup">
            <ShinyButton>Get Started <ArrowRight size={13} /></ShinyButton>
          </Link>
        </div>

        <motion.button whileTap={{ scale:0.9 }} onClick={() => setMobileOpen(v => !v)}
          className="md:hidden text-slate-400 hover:text-white transition-colors p-2">
          <AnimatePresence mode="wait">
            {mobileOpen
              ? <motion.div key="close" initial={{ rotate:-90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:90, opacity:0 }}><X size={20} /></motion.div>
              : <motion.div key="menu"  initial={{ rotate:90, opacity:0 }}  animate={{ rotate:0, opacity:1 }} exit={{ rotate:-90, opacity:0 }}><Menu size={20} /></motion.div>
            }
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity:0, height:0, filter:"blur(10px)" }}
            animate={{ opacity:1, height:"auto", filter:"blur(0px)" }}
            exit={{ opacity:0, height:0, filter:"blur(10px)" }}
            transition={{ duration:0.5, ease: PHANTOM_EASE.smooth }}
            className="md:hidden bg-[#0a0a1a]/95 backdrop-blur-2xl border-b border-white/[0.06] px-5 pb-6 overflow-hidden"
          >
            <nav className="flex flex-col gap-4 pt-4">
              {NAV_LINKS.map((l, i) => (
                <motion.div key={l.label} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.1 }}>
                  <Link
                    to={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 hover:text-white transition-colors duration-200"
                    style={{ fontFamily:"'Inter',sans-serif", fontSize:"15px", fontWeight:500, color:"rgba(255,255,255,0.6)", letterSpacing:"-0.01em" }}
                  >{l.label}</Link>
                </motion.div>
              ))}
              <hr className="border-white/[0.06]" />
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full block">
                  <ShinyButton className="w-full justify-center">Get Started Free</ShinyButton>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

/* ─────────────────────────────────────────────
   Section label pill
───────────────────────────────────────────── */
function Label({ children, color = "indigo" }) {
  const colors = {
    indigo:  "from-indigo-500/20 to-indigo-500/5 text-indigo-300 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/30",
    violet:  "from-violet-500/20 to-violet-500/5 text-violet-300 border-violet-500/30",
    amber:   "from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-500/30",
    purple:  "from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/30",
    rose:    "from-rose-500/20 to-rose-500/5 text-rose-300 border-rose-500/30",
  }
  return (
    <motion.span whileHover={{ scale:1.05 }}
      className={`inline-flex items-center gap-2 rounded-full border bg-gradient-to-r ${colors[color]} px-4 py-1.5 text-[14px] font-black uppercase tracking-widest shadow-lg backdrop-blur-sm`}>
      {children}
    </motion.span>
  )
}

/* ─────────────────────────────────────────────
   Feature chip card
───────────────────────────────────────────── */
function FeatureChip({ icon: Icon, label, sub }) {
  return (
    <SpotlightCard>
      <motion.div whileHover={{ y:-2, scale:1.02 }} transition={{ type:"spring", stiffness:400, damping:25 }}
        className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors group cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all duration-300">
          <Icon size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">{label}</p>
          <p className="text-[14px] text-slate-500 mt-0.5 leading-relaxed">{sub}</p>
        </div>
      </motion.div>
    </SpotlightCard>
  )
}

/* ─────────────────────────────────────────────
   3D Mockup panels
───────────────────────────────────────────── */
function MentorsMockup() {
  const mentors = [
    { initials:"RS", name:"Raghav Mishra", field:"NDA / SSB Coach",      rating:5.0, color:"from-indigo-500 to-violet-600" },
    { initials:"PS", name:"Priya Sharma",  field:"NEET · AIIMS Delhi",   rating:4.9, color:"from-rose-500 to-pink-600"     },
    { initials:"AM", name:"Arjun Mehta",   field:"CUET · DU Admissions", rating:4.7, color:"from-amber-500 to-orange-600"  },
  ]
  return (
    <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-3 overflow-hidden group hover:border-purple-500/20 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a1a]/60 pointer-events-none" />
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-4 relative z-10">Top Mentors</p>
      {mentors.map((m, i) => (
        <motion.div key={m.name}
          initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }}
          transition={{ delay: i*0.15, type:"spring", stiffness:100 }}
          whileHover={{ x:5, scale:1.02 }}
          className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.04] p-3.5 hover:bg-white/[0.08] transition-colors relative z-10 cursor-pointer">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg`}>
            {m.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-white truncate">{m.name}</p>
            <p className="text-[9px] text-slate-500 truncate">{m.field}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={9} className="text-amber-400 fill-amber-400" />
            <span className="text-[9px] text-amber-400 font-bold">{m.rating}</span>
          </div>
        </motion.div>
      ))}
      <Link to="/mentors">
        <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          className="w-full rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold py-2.5 mt-1 hover:bg-indigo-500/25 transition-colors relative z-10 text-center cursor-pointer">
          Book a Free Session →
        </motion.div>
      </Link>
    </div>
  )
}

function CommunityMockup() {
  const posts = [
    { q:"Is dropping a year for JEE worth it in 2025?",          ans:24, votes:89,  tag:"JEE"      },
    { q:"What's the cutoff for NEET AIIMS Delhi this year?",     ans:11, votes:62,  tag:"NEET"     },
    { q:"Honest review of Allen vs Aakash for NEET prep",        ans:37, votes:148, tag:"Coaching" },
  ]
  return (
    <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-3 overflow-hidden group hover:border-purple-500/20 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-4">Doubt Forum · Live</p>
      {posts.map((p, i) => (
        <motion.div key={p.q}
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ delay: i*0.15 }}
          whileHover={{ y:-2, scale:1.02 }}
          className="rounded-2xl border border-white/[0.05] bg-white/[0.04] p-3.5 hover:bg-white/[0.08] transition-all cursor-pointer">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] text-white font-semibold leading-relaxed flex-1">{p.q}</p>
            <span className="shrink-0 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 text-[8px] font-black uppercase">
              {p.tag}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[9px] text-slate-500">
            <span className="flex items-center gap-1"><TrendingUp size={10} /> {p.votes}</span>
            <span>{p.ans} answers</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function DiscoverMockup() {
  return (
    <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 overflow-hidden group hover:border-purple-500/20 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-4">Cutoff Predictor</p>
      <motion.div whileHover={{ scale:1.02 }} className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 mb-4">
        <p className="text-[9px] text-slate-500 mb-0.5">Your JEE Main Rank</p>
        <motion.p initial={{ opacity:0, scale:0.5 }} whileInView={{ opacity:1, scale:1 }}
          transition={{ type:"spring", stiffness:200 }} className="text-2xl font-black text-white">12,450</motion.p>
      </motion.div>
      <div className="space-y-3">
        {[
          { college:"NIT Trichy — CSE",  chance:95, color:"emerald" },
          { college:"VJTI Mumbai — IT",  chance:72, color:"amber"   },
          { college:"COEP Pune — ENTC",  chance:55, color:"orange"  },
          { college:"BITS Pilani — EEE", chance:28, color:"rose"    },
        ].map((r, i) => (
          <motion.div key={r.college} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
            transition={{ delay: i*0.1 }} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[9px] text-slate-300 font-medium truncate">{r.college}</p>
              <div className="mt-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div initial={{ width:0 }} whileInView={{ width:`${r.chance}%` }}
                  transition={{ duration:1, delay: i*0.2, ease: PHANTOM_EASE.smooth }}
                  className={`h-full rounded-full bg-${r.color}-500`} />
              </div>
            </div>
            <span className={`text-[9px] font-black text-${r.color}-400 w-8 text-right`}>{r.chance}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main LandingPage
───────────────────────────────────────────── */
export default function LandingPage() {
  const { user, loading } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()

  const smoothProgress = useSpring(scrollYProgress, { stiffness:100, damping:30, restDelta:0.001 })
  const heroY       = useTransform(smoothProgress, [0,0.3], [0,-120])
  const heroOpacity = useTransform(smoothProgress, [0,0.18], [1,0])
  const heroScale   = useTransform(smoothProgress, [0,0.25], [1,0.92])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
          className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200"
      style={{ fontFamily:"'Inter','SF Pro Display',system-ui,sans-serif" }}>
      <EtherealBackground />
      <ScrollProgress />
      <Navbar scrolled={scrolled} />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-20 overflow-hidden">
        <motion.div style={{ y:heroY, opacity:heroOpacity, scale:heroScale }} className="relative z-10 max-w-5xl mx-auto">
          {/* Mascot */}
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, ease: PHANTOM_EASE.smooth }} className="mb-8 flex justify-center">
            <FloatingMascot />
          </motion.div>

          {/* Badge */}
          <motion.div initial={{ opacity:0, y:20, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }}
            transition={{ duration:0.6, delay:0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/[0.08] px-4 py-1.5 text-[14px] font-bold text-purple-300 mb-8 backdrop-blur-sm">
            <motion.span animate={{ scale:[1,1.3,1] }} transition={{ duration:2, repeat:Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Trusted by 20,000+ students across India
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-black leading-[1.02] tracking-[-0.04em] mb-6">
            <RevealText delay={0.3}>The education app</RevealText>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              <RevealText delay={0.6}>that'll take you places</RevealText>
            </span>
          </h1>

          {/* Sub */}
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.9 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Your home for JEE, NEET & CUET prep — cutoff predictions, 1:1 mentor sessions with IIT & AIIMS toppers, scholarship discovery, and a community that actually helps.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <ShinyButton>Get Started Free <ArrowRight size={15} /></ShinyButton>
            </Link>
            <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
              <Link to="/discover"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] text-white font-semibold text-[14px] px-8 py-4 hover:bg-white/[0.08] transition-colors backdrop-blur-sm">
                Explore Features
                <motion.span animate={{ y:[0,3,0] }} transition={{ duration:1.5, repeat:Infinity }}>
                  <ChevronDown size={14} />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating preview cards */}
        <div className="relative z-10 mt-20 w-full max-w-5xl mx-auto px-5 hidden md:grid grid-cols-3 gap-6">
          {[
            { component:<MentorPreviewCard />,  delay:1.3, y:[0,-15,0], duration:4,   rotate:-2 },
            { component:<CutoffPreviewCard />,  delay:1.5, y:[0,-10,0], duration:5,   rotate:0  },
            { component:<PlannerPreviewCard />, delay:1.7, y:[0,-18,0], duration:3.5, rotate:2  },
          ].map(({ component, delay, y, duration, rotate }, i) => (
            <motion.div key={i} initial={{ opacity:0, y:50 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8, delay }} className="flex justify-center">
              <motion.div animate={{ y, rotate }} transition={{ duration, repeat:Infinity, ease:"easeInOut" }}>
                {component}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.5, repeat:Infinity }}>
            <MousePointer2 size={16} className="text-slate-500 rotate-180" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section className="relative border-y border-white/[0.05] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value:"20,000+", label:"Students helped"      },
            { value:"500+",    label:"Colleges listed"      },
            { value:"50+",     label:"Verified mentors"     },
            { value:"Free",    label:"Always free to start" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay: i*0.1, type:"spring", stiffness:100 }} whileHover={{ scale:1.05 }} className="group cursor-default">
              <motion.p initial={{ scale:0.5 }} whileInView={{ scale:1 }} viewport={{ once:true }}
                transition={{ delay: i*0.1+0.2, type:"spring", stiffness:200 }}
                className="text-3xl md:text-4xl font-black text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300">
                {s.value}
              </motion.p>
              <p className="text-[14px] text-slate-500 font-medium uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          DISCOVER SECTION
      ══════════════════════════════════════ */}
      <section className="relative py-28 px-5 overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-0 w-[600px] h-[600px] -translate-y-1/2 rounded-full bg-indigo-600/[0.08] blur-[150px]" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              transition={{ duration:0.8, ease: PHANTOM_EASE.smooth }}>
              <Label color="purple"><Compass size={10} /> Discover</Label>
              <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                <RevealText>Find your college.</RevealText><br />
                <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">
                  <RevealText delay={0.3}>Predict your cutoff.</RevealText>
                </span>
              </h2>
              <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                transition={{ delay:0.5 }} className="mt-6 text-slate-400 text-base leading-relaxed max-w-md">
                Browse 500+ colleges, predict admission chances with real cutoff data, compare side-by-side, and find scholarships you're actually eligible for.
              </motion.p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <FeatureChip icon={Building2}    label="College Directory"   sub="500+ colleges with full data"   />
                <FeatureChip icon={Target}        label="Cutoff Predictor"   sub="Real rank-based predictions"    />
                <FeatureChip icon={TrendingUp}    label="Rank Reality Check" sub="Know exactly where you stand"   />
                <FeatureChip icon={GraduationCap} label="Scholarship Finder" sub="Merit, need & category based"   />
              </div>
              <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="mt-8">
                <Link to="/discover" className="inline-flex items-center gap-2 text-indigo-400 font-bold text-sm hover:text-indigo-300 transition-colors group">
                  Explore Discover <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
            <ParallaxCard depth={0.5}><DiscoverMockup /></ParallaxCard>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MENTORS SECTION
      ══════════════════════════════════════ */}
      <section className="relative py-28 px-5 overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 rounded-full bg-violet-600/[0.08] blur-[150px]" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ParallaxCard depth={0.5} className="lg:order-1 order-2"><MentorsMockup /></ParallaxCard>
            <motion.div initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              transition={{ duration:0.8, ease: PHANTOM_EASE.smooth }} className="lg:order-2 order-1">
              <Label color="violet"><Users size={10} /> Mentors</Label>
              <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                <RevealText>Your Bhaiya &amp; Didi</RevealText><br />
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  <RevealText delay={0.3}>from IIT &amp; AIIMS.</RevealText>
                </span>
              </h2>
              <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                transition={{ delay:0.5 }} className="mt-6 text-slate-400 text-base leading-relaxed max-w-md">
                Book 1:1 video sessions with verified seniors who've been exactly where you are. Real guidance, real strategies — not generic advice.
              </motion.p>
              <ul className="mt-8 space-y-3">
                {[
                  "Verified IIT, AIIMS, BITS & NDA alumni only",
                  "First 10-minute session always free",
                  "Book in seconds, meet via Google Meet",
                  "NDA, NEET, JEE, CUET specialists available",
                ].map((pt, i) => (
                  <motion.li key={pt} initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                    transition={{ delay: i*0.1 }} className="flex items-center gap-3 text-[13px] text-slate-300">
                    <motion.div initial={{ scale:0 }} whileInView={{ scale:1 }} viewport={{ once:true }}
                      transition={{ delay: i*0.1+0.2, type:"spring", stiffness:300 }}>
                      <CheckCircle2 size={15} className="text-violet-400 shrink-0" />
                    </motion.div>
                    {pt}
                  </motion.li>
                ))}
              </ul>
              <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="mt-8">
                <Link to="/mentors" className="inline-flex items-center gap-2 text-violet-400 font-bold text-sm hover:text-violet-300 transition-colors group">
                  Browse all mentors <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PREPARE SECTION — 6-card grid
      ══════════════════════════════════════ */}
      <section className="relative py-28 px-5 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-emerald-600/[0.06] blur-[180px]" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Label color="emerald"><BookOpen size={10} /> Prepare</Label>
            <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
              <RevealText>Everything you need</RevealText><br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                <RevealText delay={0.2}>to crack the exam.</RevealText>
              </span>
            </h2>
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.4 }} className="mt-4 text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              From daily study planning to bridge courses and document checklists — all the tools serious aspirants need, in one place.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon:Calendar,       label:"Study Planner",        sub:"Daily goals, weekly targets, cloud-synced progress",          color:"indigo",  to:"/planner"    },
              { icon:Layers,         label:"Bridge Courses",        sub:"Fill knowledge gaps before college starts",                   color:"emerald", to:"/bridge"     },
              { icon:FileText,       label:"Document Checklist",    sub:"Never miss a form, certificate or deadline again",            color:"amber",   to:"/documents"  },
              { icon:Brain,          label:"Doubt Forum",           sub:"Anonymous Q&A — real answers from students & mentors",        color:"violet",  to:"/forum"      },
              { icon:Target,         label:"Plan B Analyser",       sub:"Backup strategy if things don't go as planned",              color:"rose",    to:"/plan-b"     },
              { icon:Rocket,         label:"Skill Matcher",         sub:"Discover career paths that match your strengths",             color:"purple",  to:"/skill-matcher"},
            ].map((c, i) => {
              const Icon = c.icon
              const colorMap = {
                indigo:  { bg:"rgba(99,102,241,0.10)",   text:"#6366f1", border:"rgba(99,102,241,0.20)"   },
                emerald: { bg:"rgba(16,185,129,0.10)",   text:"#10b981", border:"rgba(16,185,129,0.20)"   },
                amber:   { bg:"rgba(245,158,11,0.10)",   text:"#f59e0b", border:"rgba(245,158,11,0.20)"   },
                violet:  { bg:"rgba(139,92,246,0.10)",   text:"#8b5cf6", border:"rgba(139,92,246,0.20)"   },
                rose:    { bg:"rgba(244,63,94,0.10)",    text:"#f43f5e", border:"rgba(244,63,94,0.20)"    },
                purple:  { bg:"rgba(168,85,247,0.10)",   text:"#a855f7", border:"rgba(168,85,247,0.20)"   },
              }
              const col = colorMap[c.color]
              return (
                <motion.div key={c.label}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.08, type:"spring", stiffness:100 }}>
                  <SpotlightCard>
                    <Link to={c.to}>
                      <motion.div whileHover={{ y:-3 }} transition={{ type:"spring", stiffness:400, damping:25 }}
                        className="group flex flex-col gap-4 rounded-2xl border bg-white/[0.03] p-5 hover:bg-white/[0.06] transition-colors h-full cursor-pointer"
                        style={{ borderColor:"rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: col.bg }}>
                            <Icon size={18} style={{ color: col.text }} />
                          </div>
                          <ArrowRight size={13} className="opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" style={{ color: col.text }} />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-white">{c.label}</p>
                          <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">{c.sub}</p>
                        </div>
                        <div className="mt-auto h-[2px] w-0 group-hover:w-full rounded-full transition-all duration-500" style={{ background: col.text }} />
                      </motion.div>
                    </Link>
                  </SpotlightCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMMUNITY SECTION
      ══════════════════════════════════════ */}
      <section className="relative py-28 px-5 overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-violet-600/[0.07] blur-[160px]" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              transition={{ duration:0.8, ease: PHANTOM_EASE.smooth }}>
              <Label color="amber"><MessageSquare size={10} /> Community</Label>
              <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                <RevealText>No judgment.</RevealText><br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  <RevealText delay={0.3}>Just real answers.</RevealText>
                </span>
              </h2>
              <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                transition={{ delay:0.5 }} className="mt-6 text-slate-400 text-base leading-relaxed max-w-md">
                Ask doubts anonymously, connect with students preparing for the same exam, join pre-freshers groups and beat the stress together.
              </motion.p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <FeatureChip icon={MessageSquare} label="Doubt Forum"       sub="Anonymous, real-time Q&A"           />
                <FeatureChip icon={Heart}          label="Wellness Check-in" sub="Stress tracking & mental wellness"  />
                <FeatureChip icon={Users}          label="Pre-Freshers"      sub="Connect before your first day"      />
                <FeatureChip icon={Shield}         label="Defence Prep"      sub="NDA, CDS & SSB specialist group"    />
              </div>
              <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="mt-8">
                <Link to="/community" className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors group">
                  Join the community <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
            <ParallaxCard depth={0.5}><CommunityMockup /></ParallaxCard>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DEFENCE SPECIAL SECTION
      ══════════════════════════════════════ */}
      <section className="relative py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="relative rounded-3xl overflow-hidden border border-rose-500/20 p-10 md:p-14 text-center"
            style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.08),rgba(251,113,133,0.04),rgba(139,92,246,0.06))" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            <div className="relative z-10">
              <Label color="rose"><Shield size={10} /> Defence</Label>
              <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05]">
                <RevealText>NDA. CDS. SSB.</RevealText><br />
                <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                  <RevealText delay={0.2}>First session free — always.</RevealText>
                </span>
              </h2>
              <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                transition={{ delay:0.4 }} className="mt-4 text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
                Verified ex-servicemen mentors help you prepare for every stage — written, physical and SSB interview — with personalised guidance.
              </motion.p>
              <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:0.6 }} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/defence">
                  <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-500 text-white font-black text-sm px-7 py-3.5 shadow-lg shadow-rose-500/30 hover:bg-rose-400 transition-colors">
                    <Sword size={15} /> Explore Defence Prep
                  </motion.div>
                </Link>
                <Link to="/mentors" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                  Browse defence mentors →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="relative py-28 px-5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Label color="indigo"><Star size={10} /> Student Stories</Label>
            <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight">
              <RevealText>Real students.</RevealText>{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">
                <RevealText delay={0.2}>Real results.</RevealText>
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name:"Ananya Sharma",   exam:"NEET 2025",    score:"AIR 1,842",   text:"The mentor sessions changed everything. My AIIMS mentor showed me exactly where I was losing marks in Zoology. Booked within 3 days of joining TAKक्षक.",  color:"emerald" },
              { name:"Rohan Patil",     exam:"JEE Advanced", score:"AIR 3,210",   text:"The cutoff predictor was scary accurate. It told me I had 87% chance at NIT Trichy CSE — and I got exactly that. Stopped guessing, started targeting.",       color:"indigo"  },
              { name:"Priya Nambiar",   exam:"NDA 1 2025",   score:"Selected",    text:"First session with my NDA mentor was free — he gave me a 90-day SSB strategy in that one call. I'd never have figured that out from YouTube videos.",          color:"rose"    },
              { name:"Kartik Mehta",    exam:"CUET 2025",    score:"DU Economics",text:"The application tracker kept me sane during admission season. I was managing 12 colleges simultaneously and never missed a single deadline.",                  color:"amber"   },
              { name:"Simran Kaur",     exam:"CAT 2025",     score:"99.2 %ile",   text:"Used the study planner for 6 months. The streak tracking and weekly review made me consistent in a way no coaching institute ever did.",                        color:"violet"  },
              { name:"Aditya Verma",    exam:"CLAT 2025",    score:"NLSIU Seat",  text:"Scholarship finder helped me get a 60% fee waiver I didn't even know I was eligible for. That one feature paid for itself 10× over.",                          color:"teal"    },
            ].map((t, i) => {
              const colorMap = { emerald:"#10b981", indigo:"#6366f1", rose:"#f43f5e", amber:"#f59e0b", violet:"#8b5cf6", teal:"#14b8a6" }
              return (
                <motion.div key={t.name} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.1, type:"spring", stiffness:100 }}>
                  <SpotlightCard>
                    <motion.div whileHover={{ y:-3 }} transition={{ type:"spring", stiffness:400, damping:25 }}
                      className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 hover:bg-white/[0.05] transition-colors h-full">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={11} className="text-amber-400 fill-amber-400" />)}
                      </div>
                      <p className="text-[13px] text-slate-300 leading-relaxed flex-1">"{t.text}"</p>
                      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-black text-white shrink-0"
                          style={{ background:`linear-gradient(135deg, ${colorMap[t.color]}40, ${colorMap[t.color]}20)`, border:`1px solid ${colorMap[t.color]}30` }}>
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-white">{t.name}</p>
                          <p className="text-[10px] text-slate-500">{t.exam} · {t.score}</p>
                        </div>
                      </div>
                    </motion.div>
                  </SpotlightCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="relative py-28 px-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            transition={{ duration:0.6, type:"spring", stiffness:100 }}>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/40">
              <Sparkles size={36} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.04em] leading-[1.05] mb-6">
              <RevealText>Your dream college</RevealText><br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                <RevealText delay={0.2}>is one plan away.</RevealText>
              </span>
            </h2>
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.4 }} className="text-slate-400 text-lg leading-relaxed mb-10">
              Join 20,000+ students already using TAKक्षक to prepare smarter, find mentors, and navigate college admissions with confidence.
            </motion.p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <ShinyButton>Get Started Free <ArrowRight size={16} /></ShinyButton>
              </Link>
              <Link to="/mentors"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-semibold text-sm transition-colors">
                Browse mentors <ArrowRight size={13} />
              </Link>
            </div>
            <p className="mt-6 text-[12px] text-slate-600">No credit card required · Free forever for students</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="relative border-t border-white/[0.06] pt-16 pb-10 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4 group">
                <img src="/takshak_logo.jpg" alt="TAKक्षक" className="w-8 h-8 rounded-xl object-cover" />
                <span className="text-[14px] font-black text-white">TAKक्षक</span>
              </Link>
              <p className="text-[12px] text-slate-500 leading-relaxed mb-5">
                Your complete college admission & exam prep platform — built for India's students.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { href:"https://x.com/takshaked",              icon:<IconX /> },
                  { href:"https://instagram.com/takshak.ed",     icon:<IconInstagram /> },
                  { href:"https://linkedin.com/company/takshak-ed", icon:<IconLinkedIn /> },
                  { href:"https://youtube.com/@takshaked",       icon:<IconYouTube /> },
                ].map(({ href, icon }) => (
                  <motion.a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale:1.2, y:-2 }} whileTap={{ scale:0.9 }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-white hover:border-white/20 transition-colors">
                    {icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <p className="text-[14px] font-black uppercase tracking-widest text-slate-500 mb-4">Platform</p>
              <ul className="space-y-2.5">
                {[
                  { label:"Discover Colleges", to:"/discover"    },
                  { label:"Cutoff Predictor",  to:"/cutoff"      },
                  { label:"Rank Reality",      to:"/rank-reality"},
                  { label:"Scholarship Finder",to:"/scholarships"},
                  { label:"Compare Colleges",  to:"/compare"     },
                ].map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[12.5px] text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mentors */}
            <div>
              <p className="text-[14px] font-black uppercase tracking-widest text-slate-500 mb-4">Mentors</p>
              <ul className="space-y-2.5">
                {[
                  { label:"Find a Mentor",       to:"/mentors"           },
                  { label:"Book a Session",       to:"/mentors"           },
                  { label:"My Sessions",          to:"/sessions"          },
                  { label:"Events & Seminars",    to:"/events"            },
                  { label:"Become a Mentor",      to:"/become-mentor"     },
                  { label:"Defence Specialists",  to:"/defence"           },
                ].map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[12.5px] text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-[14px] font-black uppercase tracking-widest text-slate-500 mb-4">Resources</p>
              <ul className="space-y-2.5">
                {[
                  { label:"Study Planner",      to:"/planner"       },
                  { label:"Exam Timeline",      to:"/prepare"       },
                  { label:"Document Checklist", to:"/documents"     },
                  { label:"Bridge Courses",     to:"/bridge"        },
                  { label:"Doubt Forum",        to:"/forum"         },
                ].map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[12.5px] text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[14px] font-black uppercase tracking-widest text-slate-500 mb-4">Legal</p>
              <ul className="space-y-2.5">
                {[
                  { label:"Privacy Policy",  to:"/privacy" },
                  { label:"Terms of Service",to:"/terms"   },
                  { label:"Cookie Policy",   to:"/cookies" },
                ].map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[12.5px] text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
                <li>
                  <a href="mailto:takshak.info@gmail.com" className="text-[12.5px] text-slate-500 hover:text-white transition-colors flex items-center gap-1.5">
                    <Mail size={11} /> Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
            <p className="text-[14px] text-slate-600">
              © {new Date().getFullYear()} TAKक्षक. Made with ❤️ for India's students.
            </p>
            <div className="flex items-center gap-4">
              {["/privacy","/terms","/cookies"].map((to, i) => (
                <Link key={to} to={to} className="text-[14px] text-slate-600 hover:text-slate-400 transition-colors">
                  {["Privacy","Terms","Cookies"][i]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  Search, Star, GraduationCap, MapPin, Zap, Shield, X,
  Clock, Calendar, MessageCircle, ArrowUpRight, Users, Filter,
} from "lucide-react"
import { getMentors, getMentorById, getMentorAvailability, getMentorReviews } from "@database/services/api"
import { useNavigate, Link } from "react-router-dom"
import WaveBackground from "@components/ui/WaveBackground"

/* ─── colour palette per card index ─── */
const ACCENTS = [
  "#6366f1", "#8b5cf6", "#06b6d4",
  "#10b981", "#f59e0b", "#ec4899",
  "#3b82f6", "#a855f7",
]

const STREAMS = ["All", "Engineering", "Medical", "Design", "Commerce", "Arts"]

/* ─── mouse-following spotlight ──────────────────────── */
function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 })
  useEffect(() => {
    const fn = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", fn)
    return () => window.removeEventListener("mousemove", fn)
  }, [])
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-500"
      style={{
        background: `radial-gradient(700px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.07), transparent 50%)`,
      }}
    />
  )
}

/* ─── count-up stat ──────────────────────────────────── */
function StatNumber({ target, suffix = "" }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 50)
    const t = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(t) }
      else setVal(start)
    }, 28)
    return () => clearInterval(t)
  }, [target])
  return <>{val.toLocaleString()}{suffix}</>
}

/* ─── 3-D tilt card ──────────────────────────────────── */
function TiltCard({ children, className, style, onClick }) {
  const ref = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotX = useSpring(rawX, { stiffness: 200, damping: 20 })
  const rotY = useSpring(rawY, { stiffness: 200, damping: 20 })
  const shadow = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })

  const onMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = ((e.clientY - r.top) / r.height - 0.5) * -12
    const y = ((e.clientX - r.left) / r.width - 0.5) * 12
    rawX.set(x); rawY.set(y)
  }
  const onLeave = () => { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={className}
      whileHover={{ scale: 1.025 }}
      transition={{ scale: { duration: 0.3 } }}
    >
      {children}
    </motion.div>
  )
}

/* ─── mentor card ────────────────────────────────────── */
function MentorCard({ mentor, index, onClick }) {
  const [hovered, setHovered] = useState(false)
  const accent = ACCENTS[index % ACCENTS.length]
  const initials = (mentor.full_name || mentor.name || "M")
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard
        onClick={() => onClick(mentor)}
        className="relative cursor-pointer rounded-[24px] overflow-hidden h-[500px] select-none"
        style={{
          background: "#0b1020",
          boxShadow: hovered
            ? `0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px ${accent}55, 0 0 40px ${accent}22`
            : `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)`,
          transition: "box-shadow 0.4s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Photo / avatar ─────────────────────────── */}
        <div className="absolute inset-0 overflow-hidden">
          {mentor.photo_url ? (
            <motion.img
              src={mentor.photo_url}
              alt={mentor.full_name}
              className="w-full h-full object-cover object-top"
              animate={{ scale: hovered ? 1.07 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <motion.div
              className="w-full h-full flex items-center justify-center"
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.6 }}
              style={{
                background: `linear-gradient(145deg, ${accent}18 0%, #050810 60%)`,
              }}
            >
              <span
                className="font-black select-none"
                style={{
                  fontSize: "clamp(80px,18vw,130px)",
                  color: `${accent}18`,
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {initials}
              </span>
            </motion.div>
          )}

          {/* Vignette layers */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #050810 0%, rgba(5,8,16,0.85) 35%, rgba(5,8,16,0.3) 55%, rgba(5,8,16,0.15) 75%, transparent 100%)",
            }}
          />
          {/* Top vignette for badges */}
          <div
            className="absolute inset-x-0 top-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, rgba(5,8,16,0.6), transparent)" }}
          />
        </div>

        {/* Top badges ──────────────────────────────── */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg,#10b981,#059669)",
              color: "#002919",
              boxShadow: "0 4px 16px rgba(16,185,129,0.45)",
            }}
          >
            <Zap size={10} className="fill-current" /> Free 10 min
          </div>
          <div className="flex items-center gap-2">
            {mentor.is_verified && (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Shield size={13} style={{ color: "#4edea3", filter: "drop-shadow(0 0 5px #4edea3)" }} />
              </div>
            )}
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md"
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-black text-white">{mentor.rating ?? "5.0"}</span>
            </div>
          </div>
        </div>

        {/* Bottom info ─────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-6 pt-4">
          {/* Accent bar */}
          <motion.div
            className="mb-3 h-[2px] rounded-full"
            style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            animate={{ width: hovered ? "60%" : "30%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Name */}
          <h3
            className="text-[22px] font-bold leading-tight text-white mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.02em" }}
          >
            {mentor.full_name || mentor.name || "Mentor"}
          </h3>

          {/* College */}
          <p
            className="flex items-center gap-1.5 text-[12.5px] mb-3"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
          >
            <GraduationCap size={13} style={{ color: accent, flexShrink: 0 }} />
            <span className="truncate">{mentor.college || "Top Institution"}</span>
            {mentor.city_origin && (
              <span className="flex items-center gap-1 ml-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                · <MapPin size={10} /> {mentor.city_origin}
              </span>
            )}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(mentor.exam_focus || []).slice(0, 3).map((e) => (
              <span
                key={e}
                className="rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: `${accent}20`,
                  border: `1px solid ${accent}40`,
                  color: accent,
                }}
              >
                {e}
              </span>
            ))}
            {(mentor.subjects || []).slice(0, 2).map((s) => (
              <span
                key={s}
                className="rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Price + CTA — reveals on hover */}
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center justify-between pt-4"
            style={{ borderTop: `1px solid ${accent}30` }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest font-black" style={{ color: "rgba(255,255,255,0.35)" }}>
                10 min session
              </p>
              <p className="text-[18px] font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                ₹80
              </p>
            </div>
            <div
              className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-[13px] font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${accent}ee, ${accent}99)`,
                boxShadow: `0 8px 24px ${accent}55`,
              }}
            >
              View Profile <ArrowUpRight size={14} />
            </div>
          </motion.div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

/* ─── slide-in drawer ────────────────────────────────── */
function MentorDrawer({ mentorSnap, onClose, onNavigate }) {
  const [data, setData] = useState({ mentor: null, availability: [], reviews: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mentorSnap) return
    setLoading(true)
    setData({ mentor: null, availability: [], reviews: [] })
    Promise.all([
      getMentorById(mentorSnap.id),
      getMentorAvailability(mentorSnap.id),
      getMentorReviews(mentorSnap.id),
    ]).then(([m, a, r]) => {
      setData({ mentor: m, availability: a, reviews: r })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [mentorSnap?.id])

  const mentor = data.mentor || mentorSnap
  const name = mentor?.full_name || mentor?.name || "Mentor"
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  const accent = ACCENTS[(mentorSnap?.id?.charCodeAt(0) ?? 0) % ACCENTS.length]
  const exams = mentor?.exam_focus || []
  const subjects = mentor?.subjects || []
  const nextSlot = data.availability.find((s) => new Date(s.slot_start) > new Date())
  const upcomingCount = data.availability.filter((s) => new Date(s.slot_start) > new Date()).length

  return (
    <motion.div
      key="drawer"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 38 }}
      className="fixed top-0 right-0 h-full z-50 flex flex-col"
      style={{
        width: "min(540px, 100vw)",
        background: "linear-gradient(170deg, #0d1428 0%, #07090f 100%)",
        borderLeft: `1px solid ${accent}30`,
        boxShadow: `-32px 0 80px rgba(0,0,0,0.8), inset 1px 0 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span
          className="text-[11px] font-black uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          Mentor Profile
        </span>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
        >
          <X size={14} />
        </motion.button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-4 p-6">
            {[200, 28, 20, 120, 90].map((h, i) => (
              <div key={i} className="animate-pulse rounded-2xl" style={{ height: h, background: "rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Hero photo */}
            <div className="relative h-72 w-full overflow-hidden shrink-0">
              {mentor.photo_url ? (
                <img src={mentor.photo_url} alt={name} className="w-full h-full object-cover object-top" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `linear-gradient(145deg, ${accent}18, #07090f)` }}
                >
                  <span
                    style={{
                      fontSize: 96,
                      color: `${accent}25`,
                      fontFamily: "'Playfair Display',serif",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {initials}
                  </span>
                </div>
              )}
              <div
                className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
                style={{ background: "linear-gradient(to top, #07090f, transparent)" }}
              />
              {/* Accent stripe */}
              <div className="absolute bottom-0 inset-x-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            </div>

            <div className="px-6 pb-8 pt-4 space-y-6">
              {/* Name + verified */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2
                    className="text-[26px] font-bold text-white leading-tight"
                    style={{ fontFamily: "'Playfair Display',serif", letterSpacing: "-0.03em" }}
                  >
                    {name}
                  </h2>
                  {mentor.is_verified && (
                    <div
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 shrink-0 mt-1"
                      style={{ background: "rgba(78,222,163,0.1)", border: "1px solid rgba(78,222,163,0.3)" }}
                    >
                      <Shield size={11} style={{ color: "#4edea3" }} />
                      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: "#4edea3" }}>Verified</span>
                    </div>
                  )}
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm" style={{ color: "#94a3b8" }}>
                  <GraduationCap size={14} style={{ color: accent }} /> {mentor.college}
                </p>
                {mentor.city_origin && (
                  <p className="mt-1 flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
                    <MapPin size={12} /> {mentor.city_origin}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Rating", value: mentor.rating ?? "5.0", icon: <Star size={15} className="fill-amber-400 text-amber-400" /> },
                  { label: "Sessions", value: mentor.total_sessions ?? 0, icon: <MessageCircle size={15} style={{ color: accent }} /> },
                  { label: "Slots", value: upcomingCount, icon: <Calendar size={15} style={{ color: "#10b981" }} /> },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center rounded-2xl py-3.5 text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="mb-1.5">{s.icon}</div>
                    <p className="text-[17px] font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.value}</p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#475569" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Bio */}
              {mentor.bio && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] font-black mb-2" style={{ color: accent }}>About</p>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: "#94a3b8" }}>{mentor.bio}</p>
                </div>
              )}

              {/* Exams & subjects */}
              {(exams.length > 0 || subjects.length > 0) && (
                <div className="space-y-3">
                  {exams.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] font-black mb-2" style={{ color: accent }}>Exams</p>
                      <div className="flex flex-wrap gap-2">
                        {exams.map((e) => (
                          <span
                            key={e}
                            className="rounded-xl px-3 py-1.5 text-[12px] font-bold"
                            style={{ background: `${accent}15`, border: `1px solid ${accent}35`, color: accent }}
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {subjects.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] font-black mb-2" style={{ color: "#94a3b8" }}>Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((s) => (
                          <span
                            key={s}
                            className="rounded-xl px-3 py-1.5 text-[12px] font-semibold"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Next slot */}
              {nextSlot && (
                <div
                  className="flex items-center gap-3 rounded-2xl p-4"
                  style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(16,185,129,0.15)" }}
                  >
                    <Clock size={15} style={{ color: "#4ade80" }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-white">Next Available Slot</p>
                    <p className="text-[11px]" style={{ color: "#94a3b8" }}>
                      {new Date(nextSlot.slot_start).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                      {" · "}
                      {new Date(nextSlot.slot_start).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              )}

              {/* Reviews */}
              {data.reviews.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] font-black mb-3" style={{ color: accent }}>
                    Reviews ({data.reviews.length})
                  </p>
                  <div className="space-y-3">
                    {data.reviews.slice(0, 3).map((r, i) => (
                      <div
                        key={i}
                        className="rounded-2xl p-4"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={10} className={s <= (r.rating ?? 5) ? "fill-amber-400 text-amber-400" : "text-slate-700"} />
                          ))}
                        </div>
                        <p className="text-[12.5px] leading-relaxed" style={{ color: "#94a3b8" }}>
                          "{r.comment || r.review || "Great mentor!"}"
                        </p>
                        {r.student_name && (
                          <p className="mt-1.5 text-[11px] font-bold" style={{ color: "#475569" }}>— {r.student_name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Free session note */}
              <div
                className="flex items-center gap-3 rounded-2xl p-4"
                style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}
              >
                <Zap size={15} style={{ color: accent, flexShrink: 0 }} />
                <p className="text-[12.5px]" style={{ color: "#94a3b8" }}>
                  <span className="font-black text-white">First 10 minutes free.</span> No commitment, just clarity.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-2">
                <motion.button
                  onClick={() => onNavigate(`/mentors/${mentor.id}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-[14px] font-black text-white"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
                    boxShadow: `0 8px 32px ${accent}40`,
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}
                >
                  Book a Session · ₹80 <ArrowUpRight size={15} />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate(`/mentors/${mentor.id}`)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 w-full rounded-2xl py-3 text-[13px] font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                  }}
                >
                  View Full Profile
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── main page ──────────────────────────────────────── */
export default function Mentors() {
  const navigate = useNavigate()
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeStream, setActiveStream] = useState("All")
  const [selected, setSelected] = useState(null)
  const searchRef = useRef(null)

  useEffect(() => {
    getMentors()
      .then((d) => { setMentors(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () =>
      mentors.filter((m) => {
        const q = searchQuery.toLowerCase()
        const matchSearch =
          !q ||
          m.full_name?.toLowerCase().includes(q) ||
          m.college?.toLowerCase().includes(q) ||
          m.exam_focus?.some((e) => e.toLowerCase().includes(q))
        const matchStream = activeStream === "All" || (m.subjects || []).includes(activeStream)
        return matchSearch && matchStream
      }),
    [mentors, searchQuery, activeStream]
  )

  const handleCardClick = useCallback((m) => setSelected(m), [])
  const handleClose = useCallback(() => setSelected(null), [])
  const handleNavigate = useCallback((p) => { navigate(p); setSelected(null) }, [navigate])

  return (
    <div className="relative min-h-screen" style={{ background: "#050810" }}>
      <Helmet>
        <title>Find a Mentor — TAKक्षक</title>
        <meta name="description" content="Connect with verified IIT, AIIMS & NDA seniors for 1:1 mentorship." />
      </Helmet>

      {/* Wave canvas background */}
      <WaveBackground />

      {/* Cursor spotlight */}
      <CursorSpotlight />

      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero ──────────────────────────────── */}
        <div className="pt-12 pb-16 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
            />
            <span
              className="text-[11px] font-black uppercase tracking-[0.2em]"
              style={{ color: "#818cf8", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              50+ Verified Mentors
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(42px,7vw,80px)] font-bold leading-[1.0] tracking-[-0.04em] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="text-white">Learn from those</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontStyle: "italic",
              }}
            >
              who made it.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto text-[16px] leading-relaxed mb-12"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            Verified seniors from IITs, AIIMS, BITS & NDA —
            your success story starts with one honest conversation.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-8 md:gap-16"
          >
            {[
              { target: 50, suffix: "+", label: "Mentors" },
              { target: 20000, suffix: "+", label: "Students" },
              { target: 100, suffix: "%", label: "First session free" },
            ].map((s, i) => (
              <div key={s.label} className="text-center">
                <p
                  className="text-[28px] md:text-[34px] font-black text-white leading-none"
                  style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.04em" }}
                >
                  <StatNumber target={s.target} suffix={s.suffix} />
                </p>
                <p
                  className="mt-1 text-[12px] uppercase tracking-wider font-semibold"
                  style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Search & filter bar ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="sticky top-3 z-40 mb-12"
        >
          <div
            className="rounded-[20px] p-4"
            style={{
              background: "rgba(7,9,15,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(32px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search by name, college, exam…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl py-3.5 pl-11 pr-10 text-[14px] text-white outline-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    caretColor: "#6366f1",
                    color: "rgba(255,255,255,0.9)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Stream pills */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <Filter size={13} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                {STREAMS.map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => setActiveStream(s)}
                    whileTap={{ scale: 0.95 }}
                    className="whitespace-nowrap rounded-xl px-4 py-2.5 text-[12px] font-bold shrink-0 relative overflow-hidden"
                    style={{
                      color: activeStream === s ? "#fff" : "rgba(255,255,255,0.4)",
                      background: activeStream === s
                        ? "linear-gradient(135deg,#4f46e5,#7c3aed)"
                        : "transparent",
                      boxShadow: activeStream === s ? "0 4px 16px rgba(99,102,241,0.4)" : "none",
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Count line ─────────────────────────── */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-8"
          >
            <p
              className="text-[13px] font-medium"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              {filtered.length} mentor{filtered.length !== 1 ? "s" : ""} available
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className="text-[12px] font-semibold"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
              >
                Live
              </span>
            </div>
          </motion.div>
        )}

        {/* ── Grid ───────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 pb-24">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[500px] rounded-[24px] animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div
              className="w-20 h-20 rounded-full mb-6 flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <Search size={30} style={{ color: "rgba(255,255,255,0.25)" }} />
            </div>
            <h3
              className="text-[22px] font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display',serif" }}
            >
              No mentors found
            </h3>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              Try different filters or clear your search.
            </p>
            <motion.button
              onClick={() => { setSearchQuery(""); setActiveStream("All") }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="rounded-full px-6 py-2.5 text-[13px] font-bold"
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#818cf8",
              }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 pb-24">
              {filtered.map((mentor, i) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  index={i}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Events CTA banner ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl mb-16 px-4"
      >
        <div
          className="relative rounded-3xl border border-indigo-500/20 p-7 flex flex-col sm:flex-row items-center justify-between gap-5 overflow-hidden"
          style={{ background: "rgba(99,102,241,0.07)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.10),transparent_60%)] pointer-events-none" />
          <div className="relative text-center sm:text-left">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400 mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              From the community
            </p>
            <h3
              className="text-[20px] font-bold text-white leading-snug"
              style={{ fontFamily: "'Playfair Display',serif" }}
            >
              See where these mentors have spoken
            </h3>
            <p
              className="text-[13px] mt-1"
              style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              18+ free seminars · 8,400+ students · 12 cities
            </p>
          </div>
          <Link
            to="/events"
            className="relative shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[14px] font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              boxShadow: "0 8px 24px rgba(99,102,241,0.25)",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            View Events
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </motion.div>

      {/* ── Backdrop ────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 cursor-pointer"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* ── Drawer ──────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <MentorDrawer
            mentorSnap={selected}
            onClose={handleClose}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

import { motion, AnimatePresence } from "framer-motion"
import { Calendar, CheckCircle2, Clock, Star, Users, Video, X, AlertCircle, Loader2, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@auth/AuthContext"
import { getUserBookings, cancelBooking } from "@database/services/sessions"
import { getTopMentors } from "@database/services/mentors"

const STATUS_STYLES = {
  pending:   "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-slate-100 text-slate-600",
}
const STATUS_LABELS = {
  pending:   "⏳ Pending",
  confirmed: "✅ Confirmed",
  cancelled: "❌ Cancelled",
  completed: "✔ Completed",
}

function BookingCard({ booking, onCancel, cancelling }) {
  const d = new Date(booking.scheduled_at || booking.requested_at)
  const dateStr = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  const timeStr = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  const initials = (booking.mentor_name || "M").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  const canCancel = booking.status === "pending" || booking.status === "confirmed"

  return (
    <motion.div layout className="card-bb p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[var(--obsidian-on-surface)] truncate">{booking.mentor_name || "Mentor"}</p>
          <p className="text-sm text-[var(--obsidian-on-surface-variant)] mt-0.5">{booking.mentor_field || "Mentorship Session"}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--obsidian-on-surface-variant)]">
            <span className="flex items-center gap-1"><Calendar size={12} />{dateStr}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{timeStr}</span>
          </div>
          {booking.status === "confirmed" && !booking.meet_link && (
            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle size={12} /> Meet link will be shared soon
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`pill text-xs px-3 py-1 ${STATUS_STYLES[booking.status] || STATUS_STYLES.pending}`}>
            {STATUS_LABELS[booking.status] || booking.status}
          </span>
          {booking.status === "confirmed" && booking.meet_link && (
            <a href={booking.meet_link} target="_blank" rel="noopener noreferrer"
              className="pill pill-primary text-xs gap-1">
              <Video size={12} /> Join Meet
            </a>
          )}
          {canCancel && (
            <button type="button" onClick={() => onCancel(booking.id)}
              disabled={cancelling === booking.id}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 disabled:opacity-50">
              {cancelling === booking.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
              Cancel
            </button>
          )}
        </div>
      </div>
      {booking.message && (
        <p className="mt-3 text-xs text-[var(--obsidian-on-surface-variant)] bg-[var(--obsidian-surface)] rounded-xl px-4 py-2.5 border border-[var(--obsidian-outline-variant)]">
          "{booking.message}"
        </p>
      )}
    </motion.div>
  )
}

function MentorCard({ mentor }) {
  const initials = mentor.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className="card-bb p-5 flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-bold text-white">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[var(--obsidian-on-surface)] truncate">{mentor.name}</p>
        <p className="text-xs text-indigo-500 truncate">{mentor.stream || mentor.field}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--obsidian-on-surface-variant)]">
          <span className="flex items-center gap-0.5"><Star size={11} className="text-amber-400 fill-amber-400" />{mentor.rating?.toFixed(1)}</span>
          <span className="flex items-center gap-0.5"><Users size={11} />{mentor.sessions_count || 0}</span>
        </div>
      </div>
      <Link to="/mentors" className="pill pill-outline text-xs shrink-0">Book</Link>
    </div>
  )
}

const TABS = ["upcoming", "past"]

export default function MeetingScheduler() {
  const { user } = useAuth()
  const [tab, setTab] = useState("upcoming")
  const [bookings, setBookings] = useState([])
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [cancelError, setCancelError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([
      user ? getUserBookings(user.email) : Promise.resolve([]),
      getTopMentors(6),
    ]).then(([b, m]) => {
      if (!active) return
      setBookings(Array.isArray(b) ? b : [])
      setMentors(Array.isArray(m) ? m : [])
      setLoading(false)
    }).catch(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [user])

  async function handleCancel(id) {
    if (!user) return
    setCancelling(id)
    setCancelError(null)
    const { error } = await cancelBooking(id, user.email)
    if (error) {
      setCancelError("Could not cancel. Please try again.")
    } else {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b))
    }
    setCancelling(null)
  }

  const now = new Date()
  const upcoming = bookings.filter(b => {
    const d = new Date(b.scheduled_at || b.requested_at)
    return d >= now && b.status !== "cancelled" && b.status !== "completed"
  })
  const past = bookings.filter(b => {
    const d = new Date(b.scheduled_at || b.requested_at)
    return d < now || b.status === "cancelled" || b.status === "completed"
  })
  const shown = tab === "upcoming" ? upcoming : past

  return (
    <div className="space-y-10 md:space-y-14">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-500 to-emerald-600 px-8 py-12 text-white md:px-14 md:py-20">
        <div className="orb orb-blue w-44 h-44 -top-12 -right-12" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm p-4">
            <Video size={36} />
          </div>
          <h1 className="text-display text-4xl md:text-5xl">My Sessions</h1>
          <p className="text-body-lg mt-3 text-emerald-100/80">
            Book → Mentor confirms → Google Meet link shared
          </p>
          <Link to="/mentors" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/20 border border-white/30 px-6 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/30 transition">
            <BookOpen size={16} /> Browse Mentors
          </Link>
        </div>
      </section>

      {/* CANCEL ERROR */}
      <AnimatePresence>
        {cancelError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            {cancelError}
            <button type="button" onClick={() => setCancelError(null)} className="ml-auto"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        {/* LEFT — bookings */}
        <div className="space-y-6">
          {/* GUEST STATE */}
          {!user && (
            <div className="card-bb p-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <Calendar size={28} className="text-indigo-500" />
              </div>
              <p className="font-semibold text-[var(--obsidian-on-surface)]">Sign in to view your sessions</p>
              <p className="text-sm text-[var(--obsidian-on-surface-variant)]">Your bookings, meet links, and session history will appear here.</p>
              <Link to="/login" className="pill pill-primary inline-flex">Sign In</Link>
            </div>
          )}

          {user && (
            <>
              {/* TABS */}
              <div className="flex gap-1 rounded-2xl border border-[var(--obsidian-outline-variant)] bg-[var(--obsidian-surface)] p-1 w-fit">
                {TABS.map(t => (
                  <button key={t} type="button" onClick={() => setTab(t)}
                    className={`rounded-xl px-5 py-2 text-sm font-semibold capitalize transition-all ${
                      tab === t
                        ? "bg-[var(--obsidian-primary)] text-white shadow-sm"
                        : "text-[var(--obsidian-on-surface-variant)] hover:text-[var(--obsidian-on-surface)]"
                    }`}>
                    {t}
                    {t === "upcoming" && upcoming.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white/30 px-1.5 text-xs">
                        {upcoming.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* LOADING */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={28} className="animate-spin text-indigo-500" />
                </div>
              )}

              {/* BOOKINGS */}
              {!loading && (
                <AnimatePresence mode="wait">
                  <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                    {shown.length === 0 ? (
                      <div className="card-bb p-10 text-center space-y-3">
                        <CheckCircle2 size={32} className="mx-auto text-slate-300" />
                        <p className="font-semibold text-[var(--obsidian-on-surface)]">
                          {tab === "upcoming" ? "No upcoming sessions" : "No past sessions"}
                        </p>
                        <p className="text-sm text-[var(--obsidian-on-surface-variant)]">
                          {tab === "upcoming" ? "Browse mentors and book your first session!" : "Completed sessions will appear here."}
                        </p>
                        {tab === "upcoming" && (
                          <Link to="/mentors" className="pill pill-primary inline-flex mt-2">Find a Mentor</Link>
                        )}
                      </div>
                    ) : (
                      shown.map(b => (
                        <BookingCard key={b.id} booking={b} onCancel={handleCancel} cancelling={cancelling} />
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          )}
        </div>

        {/* RIGHT — top mentors */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-[var(--obsidian-on-surface)]">Top Mentors</h2>
          {mentors.length === 0 && !loading && (
            <p className="text-sm text-[var(--obsidian-on-surface-variant)]">Loading mentors…</p>
          )}
          {mentors.map(m => <MentorCard key={m.id} mentor={m} />)}
          <Link to="/mentors" className="pill pill-outline w-full justify-center text-sm">
            View All Mentors
          </Link>
        </div>
      </div>
    </div>
  )
}

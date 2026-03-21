import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, MapPin, GraduationCap, Globe, CalendarDays, Clock, CheckCircle, ExternalLink, Video, ChevronLeft, ChevronRight } from "lucide-react"
import { getMentorById, getMentorAvailability, getMentorReviews } from "../services/api"
import BookingModal from "../components/BookingModal"
import LoadingSkeleton from "../components/LoadingSkeleton"

export default function MentorDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [mentor, setMentor] = useState(null)
    const [availability, setAvailability] = useState([])
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookingOpen, setBookingOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [calendarOffset, setCalendarOffset] = useState(0) // week offset

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getMentorById(id),
            getMentorAvailability(id),
            getMentorReviews(id),
        ]).then(([m, a, r]) => {
            setMentor(m); setAvailability(a); setReviews(r); setLoading(false)
        })
    }, [id])

    // Group slots by day for calendar view
    const calendarDays = useMemo(() => {
        const days = []
        for (let i = 0; i < 14; i++) {
            const d = new Date()
            d.setDate(d.getDate() + i + calendarOffset * 14)
            const dateStr = d.toISOString().split("T")[0]
            const daySlots = availability.filter(s => s.slot_start.split("T")[0] === dateStr)
            days.push({ date: d, dateStr, slots: daySlots })
        }
        return days
    }, [availability, calendarOffset])

    if (loading) return <div className="space-y-6 pb-12"><LoadingSkeleton rows={8} /></div>
    if (!mentor) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <p className="text-5xl">🔍</p>
            <p className="text-slate-500">Mentor not found.</p>
            <button onClick={() => navigate("/mentors")} className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2.5 text-sm font-semibold">← Back to Mentors</button>
        </div>
    )

    const name = mentor.full_name || mentor.name || "Mentor"
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    const subjects = mentor.subjects || []
    const exams = mentor.exam_focus || []

    return (
        <div className="space-y-8 pb-12 max-w-5xl mx-auto">
            <Helmet>
                <title>{name} — Book a Session | TAKSHAK Mentors</title>
                <meta name="description" content={`Book a 1:1 mentoring session with ${name} from ${mentor.college}. ${mentor.bio?.slice(0, 120) || ""}`} />
            </Helmet>

            {/* Back */}
            <button onClick={() => navigate("/mentors")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition font-medium">
                <ArrowLeft size={16} /> Back to Mentors
            </button>

            {/* Profile Header */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
                {/* Top gradient */}
                <div className="h-28 bg-gradient-to-r from-indigo-500 to-blue-500 relative">
                    <div className="absolute -bottom-10 left-6">
                        {mentor.photo_url ? (
                            <img src={mentor.photo_url} alt={name} className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover" />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                                {initials}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 pt-14 pb-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-xl font-black text-slate-900">{name}</h1>
                                {mentor.is_verified && (
                                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                                        <CheckCircle size={10} /> Verified via LinkedIn + College Email
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                <GraduationCap size={14} /> {mentor.college} · {mentor.branch} · '{(mentor.grad_year || "").toString().slice(-2)}
                            </p>
                            {mentor.city_origin && (
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                    <MapPin size={11} /> From {mentor.city_origin} 📍
                                </p>
                            )}

                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {exams.map(e => (
                                    <span key={e} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">{e}</span>
                                ))}
                                {subjects.map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[9px] font-bold uppercase tracking-wider rounded-md border border-purple-100">{s}</span>
                                ))}
                                {(mentor.languages || []).map(l => (
                                    <span key={l} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-wider rounded-md border border-amber-100">{l}</span>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 mt-3 text-sm">
                                <span className="flex items-center gap-1 text-amber-500">
                                    <Star size={14} fill="currentColor" />
                                    <span className="font-bold text-slate-700">{mentor.rating || "New"}</span>
                                </span>
                                <span className="text-slate-400">{mentor.total_sessions || 0} sessions</span>
                            </div>
                        </div>

                        {/* Price + Book CTA */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center min-w-[200px]">
                            <div className="flex gap-4 justify-center mb-4">
                                <div>
                                    <p className="text-2xl font-black text-emerald-600">₹{mentor.rate_30min_inr || mentor.session_price || "Free"}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">per 30 min</p>
                                </div>
                                <div className="w-px bg-slate-200" />
                                <div>
                                    <p className="text-2xl font-black text-emerald-600">₹{mentor.rate_60min_inr || (mentor.session_price ? mentor.session_price * 1.6 : "Free")}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">per 60 min</p>
                                </div>
                            </div>
                            <button onClick={() => setBookingOpen(true)}
                                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
                            >
                                <CalendarDays size={16} /> Book a Session
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    {mentor.bio && (
                        <div className="mt-6 pt-5 border-t border-slate-100">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">{mentor.bio}</p>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Two column: Calendar + Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Availability Calendar */}
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><CalendarDays size={16} className="text-indigo-600" /> Available Slots</h2>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCalendarOffset(Math.max(0, calendarOffset - 1))} disabled={calendarOffset === 0}
                                className="p-1.5 rounded-lg hover:bg-slate-100 transition disabled:opacity-30"><ChevronLeft size={16} /></button>
                            <span className="text-xs text-slate-500 font-medium px-2">
                                {calendarOffset === 0 ? "Next 14 days" : `Week ${calendarOffset + 1}`}
                            </span>
                            <button onClick={() => setCalendarOffset(calendarOffset + 1)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 transition"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                        {calendarDays.slice(0, 7).map(day => (
                            <div key={day.dateStr} className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                    {day.date.toLocaleDateString("en", { weekday: "short" })}
                                </p>
                                <p className="text-xs font-bold text-slate-700 mb-2">{day.date.getDate()}</p>
                                <div className="space-y-1">
                                    {day.slots.length === 0 && (
                                        <div className="h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                            <span className="text-[9px] text-slate-300">—</span>
                                        </div>
                                    )}
                                    {day.slots.map(slot => {
                                        const time = new Date(slot.slot_start).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: true })
                                        const booked = slot.is_booked || slot.is_locked
                                        return (
                                            <button
                                                key={slot.id}
                                                disabled={booked}
                                                onClick={() => { setSelectedSlot(slot); setBookingOpen(true) }}
                                                className={`w-full px-1 py-1.5 rounded-lg text-[10px] font-bold transition ${booked
                                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed line-through"
                                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:shadow-sm cursor-pointer"
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Second week row */}
                    {calendarDays.length > 7 && (
                        <div className="grid grid-cols-7 gap-1.5 mt-4 pt-4 border-t border-slate-100">
                            {calendarDays.slice(7, 14).map(day => (
                                <div key={day.dateStr} className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                        {day.date.toLocaleDateString("en", { weekday: "short" })}
                                    </p>
                                    <p className="text-xs font-bold text-slate-700 mb-2">{day.date.getDate()}</p>
                                    <div className="space-y-1">
                                        {day.slots.length === 0 && (
                                            <div className="h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                <span className="text-[9px] text-slate-300">—</span>
                                            </div>
                                        )}
                                        {day.slots.map(slot => {
                                            const time = new Date(slot.slot_start).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: true })
                                            const booked = slot.is_booked || slot.is_locked
                                            return (
                                                <button
                                                    key={slot.id} disabled={booked}
                                                    onClick={() => { setSelectedSlot(slot); setBookingOpen(true) }}
                                                    className={`w-full px-1 py-1.5 rounded-lg text-[10px] font-bold transition ${booked
                                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed line-through"
                                                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:shadow-sm cursor-pointer"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.section>

                {/* Reviews */}
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
                >
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <Star size={16} className="text-amber-500" /> Reviews ({reviews.length})
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-3xl mb-2">💬</p>
                            <p className="text-xs text-slate-400">No reviews yet. Be the first to book!</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                            {reviews.map(review => (
                                <div key={review.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-bold text-slate-700">{review.reviewer_name || "Student"}</span>
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={10} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>
                                    <p className="text-[10px] text-slate-400 mt-1.5">{new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={bookingOpen}
                onClose={() => { setBookingOpen(false); setSelectedSlot(null) }}
                mentor={mentor}
                selectedSlot={selectedSlot}
            />
        </div>
    )
}

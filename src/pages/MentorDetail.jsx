import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, MapPin, GraduationCap, Globe, CalendarDays, Clock, CheckCircle, ExternalLink, Video, ChevronLeft, ChevronRight, Gift } from "lucide-react"
import { getMentorById, getMentorAvailability, getMentorReviews } from "../services/api"
import BookingModal from "../components/modals/BookingModal"
import LoadingSkeleton from "../components/ui/LoadingSkeleton"

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
            <p style={{ color: '#a3aac4' }}>Mentor not found.</p>
            <button onClick={() => navigate("/mentors")} className="rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #4edea3, #10b981)', color: '#002919' }}>← Back to Mentors</button>
        </div>
    )

    const name = mentor.full_name || mentor.name || "Mentor"
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    const subjects = mentor.subjects || []
    const exams = mentor.exam_focus || []

    return (
        <div className="space-y-8 pb-12 max-w-5xl mx-auto pt-4 relative">
            <Helmet>
                <title>{name} — Book a Session | TAKSHAK Mentors</title>
                <meta name="description" content={`Book a 1:1 mentoring session with ${name} from ${mentor.college}. ${mentor.bio?.slice(0, 120) || ""}`} />
            </Helmet>

            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #4edea3, transparent 70%)', filter: 'blur(80px)' }} />
            <div className="absolute top-96 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #3131c0, transparent 70%)', filter: 'blur(80px)' }} />

            {/* Back */}
            <button onClick={() => navigate("/mentors")} className="relative z-10 flex items-center gap-2 text-sm transition font-medium" style={{ color: '#a3aac4' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#dee5ff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a3aac4'}>
                <ArrowLeft size={16} /> Back to Mentors
            </button>

            {/* Profile Header */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="relative z-10 rounded-3xl overflow-hidden"
                style={{ background: 'rgba(45, 52, 73, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(64, 72, 93, 0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            >
                {/* Top gradient */}
                <div className="h-32 relative" style={{ background: 'linear-gradient(135deg, #10b981 0%, #3131c0 100%)' }}>
                    <div className="absolute -bottom-10 left-8">
                        {mentor.photo_url ? (
                            <img src={mentor.photo_url} alt={name} className="w-24 h-24 rounded-2xl shadow-xl object-cover" style={{ border: '4px solid #0f1930' }} />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center text-3xl font-black"
                                style={{ border: '4px solid #0f1930', background: 'linear-gradient(135deg, #3131c0, #6366f1)', color: '#dee5ff' }}>
                                {initials}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-8 pt-16 pb-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-extrabold" style={{ color: '#dee5ff' }}>{name}</h1>
                                {mentor.is_verified && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full border"
                                        style={{ background: 'rgba(78, 222, 163, 0.15)', borderColor: 'rgba(78, 222, 163, 0.3)', color: '#4edea3' }}>
                                        <CheckCircle size={10} /> Verified via LinkedIn
                                    </span>
                                )}
                            </div>
                            <p className="text-[13px] flex items-center gap-1.5" style={{ color: '#a3aac4' }}>
                                <GraduationCap size={14} /> {mentor.college} · {mentor.branch} · '{(mentor.grad_year || "").toString().slice(-2)}
                            </p>
                            {mentor.city_origin && (
                                <p className="text-xs flex items-center gap-1 mt-1.5" style={{ color: '#6d758c' }}>
                                    <MapPin size={11} /> From {mentor.city_origin}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 mt-4">
                                {exams.map(e => (
                                    <span key={e} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border"
                                        style={{ background: 'rgba(78, 222, 163, 0.1)', borderColor: 'rgba(78, 222, 163, 0.2)', color: '#4edea3' }}>{e}</span>
                                ))}
                                {subjects.map(s => (
                                    <span key={s} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border"
                                        style={{ background: 'rgba(192, 193, 255, 0.1)', borderColor: 'rgba(192, 193, 255, 0.2)', color: '#c0c1ff' }}>{s}</span>
                                ))}
                                {(mentor.languages || []).map(l => (
                                    <span key={l} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border"
                                        style={{ background: 'rgba(255, 111, 126, 0.1)', borderColor: 'rgba(255, 111, 126, 0.2)', color: '#ff6f7e' }}>{l}</span>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 mt-5">
                                <span className="flex items-center gap-1.5" style={{ color: '#4edea3' }}>
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-extrabold text-sm text-white">{mentor.rating || "New"}</span>
                                </span>
                                <span className="text-sm" style={{ color: '#6d758c' }}>{mentor.total_sessions || 0} sessions complete</span>
                            </div>
                        </div>

                        {/* Price + Book CTA */}
                        <div className="rounded-2xl p-6 text-center w-full md:w-[260px] relative overflow-hidden shrink-0"
                            style={{ background: '#141f38', border: '1px solid rgba(64, 72, 93, 0.3)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, #4edea3, transparent 60%)' }} />

                            {/* Free first session badge */}
                            <div className="rounded-xl p-3 mb-5 border relative z-10"
                                style={{ background: 'rgba(78, 222, 163, 0.08)', borderColor: 'rgba(78, 222, 163, 0.2)' }}>
                                <p className="text-xs font-black flex items-center justify-center gap-1.5" style={{ color: '#4edea3' }}>
                                    <Gift size={12} /> First Session FREE
                                </p>
                                <p className="text-[10px] mt-1" style={{ color: '#a3aac4' }}>10-min intro • No card</p>
                            </div>
                            
                            <div className="mb-5 relative z-10 flex flex-col items-center">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black" style={{ color: '#dee5ff' }}>₹80</span>
                                </div>
                                <span className="text-xs font-medium" style={{ color: '#6d758c' }}>per 10 min (after free)</span>
                            </div>
                            
                            <button onClick={() => setBookingOpen(true)}
                                className="relative z-10 w-full rounded-2xl px-4 py-3.5 text-sm font-bold shadow-lg transition flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #4edea3, #10b981)', color: '#002919' }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(78, 222, 163, 0.4)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)'}
                            >
                                <CalendarDays size={16} /> Book a Session
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    {mentor.bio && (
                        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(64, 72, 93, 0.2)' }}>
                            <h2 className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: '#6d758c' }}>About {name.split(" ")[0]}</h2>
                            <p className="text-sm leading-relaxed" style={{ color: '#a3aac4' }}>{mentor.bio}</p>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Two column: Calendar + Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">

                {/* Availability Calendar */}
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-3 rounded-2xl p-6"
                    style={{ background: 'rgba(45, 52, 73, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(64, 72, 93, 0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-bold flex items-center gap-2.5" style={{ color: '#dee5ff' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(192, 193, 255, 0.1)', color: '#c0c1ff' }}>
                                <CalendarDays size={16} />
                            </div>
                            Available Slots
                        </h2>
                        <div className="flex items-center gap-2 p-1 rounded-lg" style={{ background: 'rgba(15, 25, 48, 0.5)' }}>
                            <button onClick={() => setCalendarOffset(Math.max(0, calendarOffset - 1))} disabled={calendarOffset === 0}
                                className="p-1.5 rounded-md transition disabled:opacity-30" style={{ color: '#a3aac4' }}
                                onMouseEnter={(e) => { if (calendarOffset !== 0) e.currentTarget.style.background = 'rgba(64, 72, 93, 0.3)' }}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><ChevronLeft size={16} /></button>
                            <span className="text-[11px] font-bold px-2 uppercase tracking-wide" style={{ color: '#dee5ff' }}>
                                {calendarOffset === 0 ? "Next 14 days" : `Week ${calendarOffset + 1}`}
                            </span>
                            <button onClick={() => setCalendarOffset(calendarOffset + 1)}
                                className="p-1.5 rounded-md transition" style={{ color: '#a3aac4' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(64, 72, 93, 0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.slice(0, 7).map(day => (
                            <div key={day.dateStr} className="text-center">
                                <div className="py-2 mb-2 rounded-lg" style={{ background: 'rgba(15, 25, 48, 0.4)' }}>
                                    <p className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: '#6d758c' }}>
                                        {day.date.toLocaleDateString("en", { weekday: "short" })}
                                    </p>
                                    <p className="text-sm font-extrabold" style={{ color: '#dee5ff' }}>{day.date.getDate()}</p>
                                </div>
                                <div className="space-y-1.5">
                                    {day.slots.length === 0 && (
                                        <div className="h-9 rounded-lg flex items-center justify-center border border-dashed"
                                            style={{ borderColor: 'rgba(64, 72, 93, 0.4)' }}>
                                            <span className="text-[10px]" style={{ color: '#40485d' }}>—</span>
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
                                                className="w-full h-9 rounded-lg text-[10px] font-bold transition flex items-center justify-center border"
                                                style={booked
                                                    ? { background: 'rgba(15, 25, 48, 0.5)', borderColor: 'transparent', color: '#40485d', textDecoration: 'line-through', cursor: 'not-allowed' }
                                                    : { background: 'rgba(78, 222, 163, 0.1)', borderColor: 'rgba(78, 222, 163, 0.25)', color: '#4edea3', cursor: 'pointer' }
                                                }
                                                onMouseEnter={(e) => {
                                                    if (!booked) {
                                                        e.currentTarget.style.background = 'rgba(78, 222, 163, 0.2)'
                                                        e.currentTarget.style.borderColor = 'rgba(78, 222, 163, 0.5)'
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!booked) {
                                                        e.currentTarget.style.background = 'rgba(78, 222, 163, 0.1)'
                                                        e.currentTarget.style.borderColor = 'rgba(78, 222, 163, 0.25)'
                                                    }
                                                }}
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
                        <div className="grid grid-cols-7 gap-2 mt-5 pt-5" style={{ borderTop: '1px solid rgba(64, 72, 93, 0.2)' }}>
                            {calendarDays.slice(7, 14).map(day => (
                                <div key={day.dateStr} className="text-center">
                                    <div className="py-2 mb-2 rounded-lg" style={{ background: 'rgba(15, 25, 48, 0.4)' }}>
                                        <p className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: '#6d758c' }}>
                                            {day.date.toLocaleDateString("en", { weekday: "short" })}
                                        </p>
                                        <p className="text-sm font-extrabold" style={{ color: '#dee5ff' }}>{day.date.getDate()}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        {day.slots.length === 0 && (
                                            <div className="h-9 rounded-lg flex items-center justify-center border border-dashed"
                                                style={{ borderColor: 'rgba(64, 72, 93, 0.4)' }}>
                                                <span className="text-[10px]" style={{ color: '#40485d' }}>—</span>
                                            </div>
                                        )}
                                        {day.slots.map(slot => {
                                            const time = new Date(slot.slot_start).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: true })
                                            const booked = slot.is_booked || slot.is_locked
                                            return (
                                                <button
                                                    key={slot.id} disabled={booked}
                                                    onClick={() => { setSelectedSlot(slot); setBookingOpen(true) }}
                                                    className="w-full h-9 rounded-lg text-[10px] font-bold transition flex items-center justify-center border"
                                                    style={booked
                                                        ? { background: 'rgba(15, 25, 48, 0.5)', borderColor: 'transparent', color: '#40485d', textDecoration: 'line-through', cursor: 'not-allowed' }
                                                        : { background: 'rgba(78, 222, 163, 0.1)', borderColor: 'rgba(78, 222, 163, 0.25)', color: '#4edea3', cursor: 'pointer' }
                                                    }
                                                    onMouseEnter={(e) => {
                                                        if (!booked) {
                                                            e.currentTarget.style.background = 'rgba(78, 222, 163, 0.2)'
                                                            e.currentTarget.style.borderColor = 'rgba(78, 222, 163, 0.5)'
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!booked) {
                                                            e.currentTarget.style.background = 'rgba(78, 222, 163, 0.1)'
                                                            e.currentTarget.style.borderColor = 'rgba(78, 222, 163, 0.25)'
                                                        }
                                                    }}
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
                    className="lg:col-span-2 rounded-2xl p-6"
                    style={{ background: 'rgba(45, 52, 73, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(64, 72, 93, 0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
                >
                    <h2 className="text-sm font-bold flex items-center gap-2.5 mb-5" style={{ color: '#dee5ff' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 111, 126, 0.1)', color: '#ff6f7e' }}>
                            <Star size={16} fill="currentColor" />
                        </div>
                        Reviews ({reviews.length})
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="text-center py-10 rounded-xl" style={{ border: '1px dashed rgba(64, 72, 93, 0.3)' }}>
                            <p className="text-3xl mb-3">💬</p>
                            <p className="text-xs" style={{ color: '#a3aac4' }}>No reviews yet. Be the first!</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {reviews.map(review => (
                                <div key={review.id} className="rounded-xl p-4 transition hover:bg-white/5" style={{ background: 'rgba(15, 25, 48, 0.4)', border: '1px solid rgba(64, 72, 93, 0.15)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold" style={{ color: '#dee5ff' }}>{review.reviewer_name || "Student"}</span>
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={10} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs leading-relaxed" style={{ color: '#a3aac4' }}>{review.comment}</p>
                                    <p className="text-[9px] font-medium uppercase tracking-wider mt-2.5" style={{ color: '#6d758c' }}>{new Date(review.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
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

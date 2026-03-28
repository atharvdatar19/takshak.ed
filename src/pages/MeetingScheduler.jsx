import { motion, AnimatePresence } from "framer-motion"
import {
    Calendar,
    CheckCircle2,
    Clock,
    Star,
    Users,
    Video,
    X,
} from "lucide-react"
import { useState } from "react"
import { useAutoReveal } from "../hooks/useScrollReveal"

import { getMentors } from "../services/api"

const LS_KEY = "mentorbhaiyaa_bookings"
function loadBookings() { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]") } catch { return [] } }
function saveBookings(b) { try { localStorage.setItem(LS_KEY, JSON.stringify(b)) } catch { } }

export default function MeetingScheduler() {
    const [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState(loadBookings)
    const [selected, setSelected] = useState(null)
    const [date, setDate] = useState("")
    const [slot, setSlot] = useState("")
    const [message, setMessage] = useState("")
    const [success, setSuccess] = useState(null)
    useAutoReveal()

    useEffect(() => {
        setLoading(true)
        getMentors()
            .then(data => { setMentors(data.slice(0, 9)); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    function openModal(mentor) { setSelected(mentor); setDate(""); setSlot(""); setMessage("") }

    function submitRequest() {
        if (!date || !slot) return
        const booking = { id: Date.now(), mentor_id: selected.id, mentor_name: selected.full_name, field: selected.headline || selected.field, date, slot, message, status: "pending", meet_link: null, requested_at: new Date().toISOString() }
        const updated = [booking, ...bookings]
        setBookings(updated)
        saveBookings(updated)
        setSuccess(booking)
        setSelected(null)
    }

    return (
        <div className="space-y-10 md:space-y-16">
            {/* ═══ HERO ═══ */}
            <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-teal-500 to-emerald-600 px-8 py-12 text-white md:px-14 md:py-20">
                <div className="orb orb-blue w-44 h-44 -top-12 -right-12" />
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
                        <Video size={40} />
                    </div>
                    <h1 className="text-display text-4xl md:text-6xl">Mentor Sessions</h1>
                    <p className="text-body-lg mt-4 text-emerald-100/80 text-base">Schedule 1:1 sessions — mentor accepts and Google Meet link is shared</p>
                    <div className="mt-5 inline-flex items-center gap-2 pill pill-glass text-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Book → Mentor Confirms → Meet Link
                    </div>
                </div>
            </section>

            {/* ═══ SUCCESS ═══ */}
            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card-bb border-emerald-200 bg-emerald-50 p-6 md:p-8 flex items-center gap-4">
                        <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
                        <div className="flex-1">
                            <p className="text-card-title text-emerald-800">Session Request Sent! 🎉</p>
                            <p className="text-sm text-emerald-600 mt-1">Requested <strong>{success.mentor_name}</strong> on {success.date} at {success.slot}. You'll get a Meet link once accepted.</p>
                        </div>
                        <button type="button" onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-600"><X size={18} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ MY BOOKINGS ═══ */}
            {bookings.length > 0 && (
                <section>
                    <h2 className="text-section text-2xl md:text-3xl text-slate-900 mb-6">📋 My Session Requests</h2>
                    <div className="space-y-4">
                        {bookings.map(b => (
                            <div key={b.id} className="card-bb flex items-center gap-4 p-5 md:p-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
                                    {b.mentor_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-card-title text-base text-slate-900">{b.mentor_name}</p>
                                    <p className="text-sm text-slate-500">{b.field} · {b.date} at {b.slot}</p>
                                </div>
                                {b.status === "confirmed" && b.meet_link ? (
                                    <a href={b.meet_link} target="_blank" rel="noopener noreferrer" className="pill pill-primary"><Video size={14} /> Join Meet</a>
                                ) : (
                                    <span className={`pill text-xs ${b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                        {b.status === "confirmed" ? "✅ Confirmed" : "⏳ Pending"}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══ MENTORS ═══ */}
            <section>
                <h2 className="text-section text-2xl md:text-4xl text-slate-900 mb-6 md:mb-10">👨‍🏫 Choose Your Mentor</h2>
                {loading ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                         {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card-bb h-64 bg-slate-50 animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {mentors.map((mentor, i) => {
                            const initials = (mentor.full_name || "M").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                            const slots = mentor.slots || ["10:00 AM", "2:00 PM", "6:00 PM"]
                            
                            return (
                                <div key={mentor.id} className={`reveal reveal-delay-${(i % 4) + 1} card-bb overflow-hidden`}>
                                    <div className="p-6 md:p-8 space-y-4">
                                        <div className="flex items-center gap-4">
                                            {mentor.photo_url ? (
                                                <img src={mentor.photo_url} alt={mentor.full_name} className="h-14 w-14 shrink-0 rounded-2xl object-cover object-top shadow-md" />
                                            ) : (
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-lg font-bold text-white">
                                                    {initials}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-card-title text-base text-slate-900">{mentor.full_name}</p>
                                                <p className="text-sm text-indigo-600 font-medium line-clamp-1">{mentor.headline || mentor.college || "Expert Mentor"}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{mentor.bio || "An expert mentor ready to guide you."}</p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {mentor.rating || "5.0"}</span>
                                            <span className="flex items-center gap-1"><Users size={14} /> {mentor.total_sessions || mentor.sessions || 40}+ sessions</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {slots.map(s => <span key={s} className="pill pill-outline text-[10px] py-0.5 px-2.5"><Clock size={10} className="mr-0.5" /> {s}</span>)}
                                        </div>
                                        <button type="button" onClick={() => openModal({ ...mentor, slots })} className="pill pill-primary w-full justify-center py-3 text-sm">
                                            📅 Schedule Session
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* ═══ BOOKING MODAL ═══ */}
            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="mx-4 w-full max-w-md space-y-5 rounded-[28px] bg-white p-8 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-section text-xl text-slate-900">Schedule with {selected.full_name}</h3>
                                <button type="button" onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                            </div>
                            <p className="text-sm text-slate-500">{selected.headline || selected.college}</p>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Preferred Date</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Preferred Time</label>
                                <div className="flex flex-wrap gap-2">
                                    {selected.slots.map(s => <button key={s} type="button" onClick={() => setSlot(s)} className={`pill text-sm ${slot === s ? "pill-primary" : "pill-outline"}`}>{s}</button>)}
                                </div>
                            </div>
                            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="What do you want to discuss? (optional)" rows={3} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">⚡ Mentor will review and share a Google Meet link after acceptance.</div>
                            <button type="button" onClick={submitRequest} disabled={!date || !slot} className="pill pill-primary w-full justify-center py-3.5 text-base disabled:opacity-50">Send Session Request</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

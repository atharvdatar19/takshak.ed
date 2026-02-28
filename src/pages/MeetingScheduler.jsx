import { motion, AnimatePresence } from "framer-motion"
import {
    Calendar,
    CheckCircle2,
    Clock,
    Link,
    Video,
    X,
    Users,
    Star,
    Sparkles,
} from "lucide-react"
import { useState } from "react"

const DEMO_MENTORS = [
    { id: "m1", name: "Raghav Mishra", field: "JEE / IIT Preparation", rating: 4.9, sessions: 120, bio: "IIT Bombay alum. Cracked JEE Advanced with AIR 204. 3 years of mentoring experience.", avatar: "RM", slots: ["10:00 AM", "2:00 PM", "6:00 PM"] },
    { id: "m2", name: "Hemant Singh Bhadoriya", field: "NDA / Defence", rating: 4.8, sessions: 85, bio: "Ex-NDA cadet. Cleared SSB in first attempt. Specializes in defence exam strategy.", avatar: "HS", slots: ["9:00 AM", "11:00 AM", "4:00 PM"] },
    { id: "m3", name: "Priya Sharma", field: "NEET / MBBS Admission", rating: 4.9, sessions: 200, bio: "AIIMS Delhi MBBS student. NEET AIR 312. Expert in biology strategy and counselling.", avatar: "PS", slots: ["8:00 AM", "1:00 PM", "7:00 PM"] },
    { id: "m4", name: "Arjun Mehta", field: "CUET / DU Admissions", rating: 4.7, sessions: 60, bio: "DU student (St. Stephens). CUET top scorer. Helps with DU college selection & forms.", avatar: "AM", slots: ["12:00 PM", "3:00 PM", "8:00 PM"] },
    { id: "m5", name: "Sneha Kapoor", field: "Career Guidance / Stream Selection", rating: 4.8, sessions: 150, bio: "Counsellor with 5+ years helping Class 10-12 students choose the right stream & career.", avatar: "SK", slots: ["10:00 AM", "12:00 PM", "5:00 PM"] },
    { id: "m6", name: "Vikram Nair", field: "Scholarship & Abroad Studies", rating: 4.6, sessions: 45, bio: "MS from TU Delft. Helped 30+ students with foreign university applications & scholarships.", avatar: "VN", slots: ["11:00 AM", "3:00 PM", "9:00 PM"] },
]

const LS_KEY = "mentorbhaiyaa_bookings"
function loadBookings() { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]") } catch { return [] } }
function saveBookings(b) { try { localStorage.setItem(LS_KEY, JSON.stringify(b)) } catch { } }

export default function MeetingScheduler() {
    const [bookings, setBookings] = useState(loadBookings)
    const [selected, setSelected] = useState(null)
    const [date, setDate] = useState("")
    const [slot, setSlot] = useState("")
    const [message, setMessage] = useState("")
    const [success, setSuccess] = useState(null)

    function openModal(mentor) {
        setSelected(mentor)
        setDate("")
        setSlot("")
        setMessage("")
    }

    function submitRequest() {
        if (!date || !slot) return
        const booking = {
            id: Date.now(),
            mentor_id: selected.id,
            mentor_name: selected.name,
            field: selected.field,
            date,
            slot,
            message,
            status: "pending",
            meet_link: null,
            requested_at: new Date().toISOString(),
        }
        const updated = [booking, ...bookings]
        setBookings(updated)
        saveBookings(updated)
        setSuccess(booking)
        setSelected(null)
    }

    return (
        <div className="space-y-6">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 p-8 text-center text-white shadow-xl md:p-10"
            >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
                    <Video size={40} />
                </div>
                <h1 className="text-4xl font-extrabold md:text-5xl">Mentor Sessions</h1>
                <p className="mt-3 text-lg text-white/80">Schedule a 1:1 session — mentor accepts and Google Meet link is shared</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" /> No live calls yet — book a session, mentor confirms with Meet link
                </div>
            </motion.section>

            {/* Success Banner */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-5"
                    >
                        <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-emerald-800">Session Request Sent! 🎉</p>
                            <p className="text-sm text-emerald-600">Your request to <strong>{success.mentor_name}</strong> on {success.date} at {success.slot} is <strong>pending</strong>. You'll get a notification with the Google Meet link once they accept.</p>
                        </div>
                        <button type="button" onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-600"><X size={16} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* My Bookings */}
            {bookings.length > 0 && (
                <section>
                    <h2 className="mb-3 text-lg font-bold text-slate-900">📋 My Session Requests</h2>
                    <div className="space-y-3">
                        {bookings.map(b => (
                            <div key={b.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                                    {b.mentor_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">{b.mentor_name}</p>
                                    <p className="text-sm text-slate-500">{b.field} · {b.date} at {b.slot}</p>
                                </div>
                                {b.status === "confirmed" && b.meet_link ? (
                                    <a href={b.meet_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
                                        <Video size={14} /> Join Meet
                                    </a>
                                ) : (
                                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                        {b.status === "confirmed" ? "✅ Confirmed" : "⏳ Pending"}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Mentor Grid */}
            <section>
                <h2 className="mb-4 text-lg font-bold text-slate-900">👨‍🏫 Choose Your Mentor</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {DEMO_MENTORS.map((mentor, i) => (
                        <motion.article
                            key={mentor.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="scroll-3d-card overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
                        >
                            <div className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-base font-bold text-white">
                                        {mentor.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{mentor.name}</p>
                                        <p className="text-xs text-indigo-600 font-medium">{mentor.field}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600">{mentor.bio}</p>

                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> {mentor.rating}</span>
                                    <span className="flex items-center gap-1"><Users size={12} /> {mentor.sessions} sessions</span>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {mentor.slots.map(s => (
                                        <span key={s} className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[10px] font-medium text-teal-700">
                                            <Clock size={10} className="mr-0.5 inline" /> {s}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => openModal(mentor)}
                                    className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    📅 Schedule Session
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* Booking Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="mx-4 w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Schedule with {selected.name}</h3>
                                <button type="button" onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                            </div>
                            <p className="text-sm text-slate-500">{selected.field}</p>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">Preferred Date</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">Preferred Time Slot</label>
                                <div className="flex flex-wrap gap-2">
                                    {selected.slots.map(s => (
                                        <button key={s} type="button" onClick={() => setSlot(s)} className={`rounded-full border px-3 py-1.5 text-sm transition ${slot === s ? "border-teal-500 bg-teal-500 text-white" : "border-slate-200 text-slate-600 hover:border-teal-300"}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="What do you want to discuss? (optional)" rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-400" />

                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                                ⚡ After you submit, the mentor will review and accept your request. You'll receive a Google Meet link via notification.
                            </div>

                            <button
                                type="button"
                                onClick={submitRequest}
                                disabled={!date || !slot}
                                className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
                            >
                                Send Session Request
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

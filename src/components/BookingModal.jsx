import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, Clock, CalendarDays, CreditCard, CheckCircle, Loader, ExternalLink, Calendar } from "lucide-react"
import { useToast } from "./Toast"
import supabase from "../supabaseClient"

const STEPS = ["slot", "topic", "payment", "processing", "confirmed", "failed"]

export default function BookingModal({ isOpen, onClose, mentor, selectedSlot }) {
    const [step, setStep] = useState("slot")
    const [duration, setDuration] = useState(30)
    const [topic, setTopic] = useState("")
    const [pickedSlot, setPickedSlot] = useState(selectedSlot)
    const { addToast } = useToast()

    if (!isOpen || !mentor) return null

    const name = mentor.full_name || mentor.name || "Mentor"
    const rate = duration === 30 ? (mentor.rate_30min_inr || mentor.session_price || 299) : (mentor.rate_60min_inr || (mentor.session_price ? Math.round(mentor.session_price * 1.6) : 499))
    const gatewayFee = Math.round(rate * 0.02)
    const total = rate + gatewayFee

    const slotToUse = pickedSlot || selectedSlot

    const handlePayNow = async () => {
        setStep("processing")
        try {
            // 1. Call Edge Function to create Razorpay Order
            const { data, error } = await supabase.functions.invoke('create-booking-order', {
                body: { 
                    slot_id: slotToUse.id, 
                    mentor_id: mentor.id, 
                    duration_minutes: duration, 
                    topic 
                }
            })

            if (error || !data) throw error || new Error("Failed to create order")

            // 2. Open Razorpay Checkout (Frontend UI)
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_key_id", // Fallback to test key if env not set
                amount: Math.round(data.amount_inr * 100), // paise
                currency: "INR",
                name: "NetraX Session",
                description: `1-on-1 Mentorship with ${name}`,
                order_id: data.razorpay_order_id,
                handler: function (response) {
                    // Payment successful! Webhook handles the DB update in the background.
                    setStep("confirmed")
                    addToast("success", "Payment successful! Session confirmed.")
                },
                theme: { color: "#4f46e5" }
            }

            const rzp = new window.Razorpay(options)
            rzp.on('payment.failed', function (response) {
                setStep("failed")
                addToast("error", "Payment failed or was cancelled.")
            })
            rzp.open()

        } catch (err) {
            console.error("Booking Error:", err)
            setStep("failed")
            addToast("error", err.message || "Failed to initiate payment")
        }
    }

    const handleClose = () => {
        setStep("slot")
        setTopic("")
        setPickedSlot(null)
        setDuration(30)
        onClose()
    }

    const formatSlot = (slot) => {
        if (!slot) return "—"
        const d = new Date(slot.slot_start)
        return `${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · ${d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: true })}`
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl border border-slate-100"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Booking session with</p>
                            <p className="text-sm font-bold text-slate-900">{name}</p>
                        </div>
                        <button onClick={handleClose} className="p-2 rounded-xl hover:bg-slate-200 transition"><X size={18} /></button>
                    </div>

                    {/* Progress */}
                    <div className="px-6 pt-4">
                        <div className="flex gap-1">
                            {["Slot", "Topic", "Pay", "Done"].map((label, i) => {
                                const stepIdx = ["slot", "topic", "payment", "confirmed"].indexOf(
                                    step === "processing" ? "payment" : step === "failed" ? "payment" : step
                                )
                                return (
                                    <div key={label} className="flex-1">
                                        <div className={`h-1 rounded-full transition-all ${i <= stepIdx ? "bg-indigo-500" : "bg-slate-100"}`} />
                                        <p className={`text-[9px] font-bold mt-1 ${i <= stepIdx ? "text-indigo-600" : "text-slate-300"}`}>{label}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* STEP: SLOT SELECTION */}
                        {step === "slot" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock size={16} /> Choose Duration</h3>

                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    {[30, 60].map(d => (
                                        <button key={d} onClick={() => setDuration(d)}
                                            className={`rounded-xl border p-4 text-center transition ${d === duration
                                                ? "border-indigo-400 bg-indigo-50 ring-1 ring-indigo-300"
                                                : "border-slate-200 bg-white hover:border-indigo-200"
                                                }`}
                                        >
                                            <p className="text-lg font-black text-slate-900">{d} min</p>
                                            <p className="text-emerald-600 font-bold text-sm">₹{d === 30 ? (mentor.rate_30min_inr || mentor.session_price || 299) : (mentor.rate_60min_inr || 499)}</p>
                                        </button>
                                    ))}
                                </div>

                                {slotToUse && (
                                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 mb-4">
                                        <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"><CalendarDays size={13} /> Selected Slot</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">{formatSlot(slotToUse)}</p>
                                    </div>
                                )}

                                <button onClick={() => setStep("topic")}
                                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                                >
                                    Continue →
                                </button>
                            </motion.div>
                        )}

                        {/* STEP: TOPIC */}
                        {step === "topic" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h3 className="text-sm font-bold text-slate-900 mb-4">What do you need help with?</h3>
                                <textarea
                                    value={topic} onChange={e => setTopic(e.target.value)}
                                    placeholder="E.g., JEE Physics — Electrostatics doubt clearing, mock analysis, college selection advice..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none resize-none h-28 focus:border-indigo-500 focus:bg-white transition"
                                />
                                <div className="flex gap-3 mt-4">
                                    <button onClick={() => setStep("slot")}
                                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Back</button>
                                    <button disabled={!topic.trim()} onClick={() => setStep("payment")}
                                        className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        Review & Pay →
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP: PAYMENT REVIEW */}
                        {step === "payment" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard size={16} /> Booking Summary</h3>

                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Mentor</span><span className="font-semibold">{name}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Duration</span><span className="font-semibold">{duration} min</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Slot</span><span className="font-semibold text-xs">{formatSlot(slotToUse)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Topic</span><span className="font-semibold text-xs truncate max-w-[180px]">{topic}</span></div>
                                    <hr className="border-slate-100" />
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Session fee</span><span>₹{rate}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Gateway fee (~2%)</span><span>₹{gatewayFee}</span></div>
                                    <div className="flex justify-between text-base font-black"><span>Total</span><span className="text-emerald-600">₹{total}</span></div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep("topic")}
                                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Back</button>
                                    <button onClick={handlePayNow}
                                        className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-emerald-200 hover:-translate-y-0.5 hover:shadow-xl transition flex items-center justify-center gap-2"
                                    >
                                        <CreditCard size={15} /> Pay ₹{total}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP: PROCESSING */}
                        {step === "processing" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                                <Loader size={36} className="mx-auto text-indigo-600 animate-spin mb-4" />
                                <p className="text-sm font-bold text-slate-700">Processing your payment...</p>
                                <p className="text-xs text-slate-400 mt-1">Do not close this window.</p>
                            </motion.div>
                        )}

                        {/* STEP: CONFIRMED */}
                        {step === "confirmed" && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-1">Session Booked! 🎉</h3>
                                <p className="text-sm text-slate-500 mb-5">You'll receive a confirmation email shortly.</p>

                                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 mb-5">
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">Session ID</span><span className="font-mono font-bold text-slate-600">NTX-{Date.now().toString(36).toUpperCase()}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">Meet Link</span>
                                        <a href={`https://meet.jit.si/netrax-${Date.now()}`} target="_blank" rel="noopener noreferrer"
                                            className="text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                                            Join <ExternalLink size={10} />
                                        </a>
                                    </div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">When</span><span className="font-semibold text-slate-600">{formatSlot(slotToUse)}</span></div>
                                </div>

                                <div className="flex gap-3">
                                    <a href={`https://calendar.google.com/calendar/r/eventedit?text=Mentor+Session+with+${encodeURIComponent(name)}&dates=${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${new Date(Date.now() + duration * 60000).toISOString().replace(/[-:]/g, "").split(".")[0]}Z`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
                                    >
                                        <Calendar size={14} /> Add to Calendar
                                    </a>
                                    <button onClick={handleClose}
                                        className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition"
                                    >
                                        Done
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP: FAILED */}
                        {step === "failed" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                    <X size={32} className="text-red-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-1">Payment Failed</h3>
                                <p className="text-sm text-slate-500 mb-5">Your slot has been released. Please try again.</p>
                                <button onClick={() => setStep("payment")}
                                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition"
                                >
                                    Retry Payment
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

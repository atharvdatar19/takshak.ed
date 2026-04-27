import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Clock, CalendarDays, CreditCard, CheckCircle, Loader, ExternalLink, Calendar, Gift, Shield } from "lucide-react"
import { useToast } from "./Toast"
import { useAuth } from "@auth/AuthContext"
import supabase from "@database/supabaseClient"

const SESSION_RATE_INR = 80
const SESSION_DURATION_MIN = 10

function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true)
            return
        }
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export default function BookingModal({ isOpen, onClose, mentor, selectedSlot }) {
    const [step, setStep] = useState("topic")
    const [topic, setTopic] = useState("")
    const [pickedSlot, setPickedSlot] = useState(selectedSlot)
    const [isFreeSession, setIsFreeSession] = useState(false)
    const [checkingFree, setCheckingFree] = useState(true)
    const { user } = useAuth()
    const { addToast } = useToast()

    // Check if this is the student's first session with this mentor
    useEffect(() => {
        if (!isOpen || !mentor || !user) {
            setCheckingFree(false)
            return
        }
        
        async function checkFreeEligibility() {
            setCheckingFree(true)
            try {
                if (supabase) {
                    const { data } = await supabase
                        .from("free_session_tracker")
                        .select("id")
                        .eq("student_id", user.id)
                        .eq("mentor_id", mentor.id)
                        .limit(1)
                    
                    setIsFreeSession(!data || data.length === 0)
                } else {
                    // Demo mode: check localStorage
                    const key = `free_used_${user.id}_${mentor.id}`
                    setIsFreeSession(!localStorage.getItem(key))
                }
            } catch {
                setIsFreeSession(false)
            }
            setCheckingFree(false)
        }
        
        checkFreeEligibility()
    }, [isOpen, mentor, user])

    if (!isOpen || !mentor) return null

    const name = mentor.full_name || mentor.name || "Mentor"
    const rate = isFreeSession ? 0 : SESSION_RATE_INR
    const gatewayFee = isFreeSession ? 0 : Math.round(rate * 0.02)
    const total = rate + gatewayFee

    const slotToUse = pickedSlot || selectedSlot

    const handleBookFree = async () => {
        setStep("processing")
        try {
            if (supabase && user) {
                // Create free session in DB
                const { error } = await supabase.from("sessions").insert({
                    student_id: user.id,
                    mentor_id: mentor.id,
                    status: "pending",
                    duration_minutes: SESSION_DURATION_MIN,
                    topic,
                    agreed_rate_inr: 0,
                    is_free_session: true,
                    scheduled_at: slotToUse?.slot_start || null,
                    student_email: user.email,
                })
                
                if (error) throw error

                // Track free session usage
                await supabase.from("free_session_tracker").insert({
                    student_id: user.id,
                    mentor_id: mentor.id,
                })
            } else {
                // Demo mode
                const key = `free_used_${user?.id || 'demo'}_${mentor.id}`
                localStorage.setItem(key, "true")
                await new Promise(r => setTimeout(r, 1500))
            }
            
            setStep("confirmed")
            addToast("success", "Free session booked! Awaiting mentor confirmation.")
        } catch (err) {
            console.error("Free Booking Error:", err)
            setStep("failed")
            addToast("error", err.message || "Failed to book session")
        }
    }

    const handlePayNow = async () => {
        setStep("processing")
        try {
            if (supabase && user) {
                // 1. Load Razorpay Script
                const isLoaded = await loadRazorpayScript()
                if (!isLoaded) {
                    addToast("error", "Razorpay SDK failed to load. Are you online?")
                    setStep("topic")
                    return
                }

                // 2. Call our Vercel API to create Order
                const orderResp = await fetch('/api/createOrder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: SESSION_RATE_INR, receipt: `session_${Date.now()}` })
                })

                if (!orderResp.ok) {
                    const errStatus = await orderResp.text()
                    throw new Error(`Server returned ${orderResp.status}: ${errStatus}`)
                }
                const orderData = await orderResp.json()

                // 3. Open Razorpay Checkout
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "TAKSHAK Session",
                    description: `10-min Mentorship with ${name}`,
                    order_id: orderData.id,
                    handler: async function (response) {
                        // 4. Verify Payment Signature
                        const verifyResp = await fetch('/api/verifyPayment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response)
                        })

                        if (verifyResp.ok) {
                            // Valid payment -> Create Session Database Record
                            await supabase.from("sessions").insert({
                                student_id: user.id,
                                mentor_id: mentor.id,
                                status: "pending",
                                duration_minutes: SESSION_DURATION_MIN,
                                topic,
                                agreed_rate_inr: SESSION_RATE_INR,
                                is_free_session: false,
                                scheduled_at: slotToUse?.slot_start || null,
                                student_email: user.email,
                                razorpay_payment_id: response.razorpay_payment_id
                            })

                            setStep("confirmed")
                            addToast("success", "Payment successful! Session booked.")
                        } else {
                            const vErr = await verifyResp.json()
                            addToast("error", vErr.error || "Payment verification failed.")
                            setStep("failed")
                        }
                    },
                    prefill: {
                        email: user?.email || "",
                        name: user?.user_metadata?.full_name || "",
                    },
                    theme: { color: "#4edea3" }
                }

                const rzp = new window.Razorpay(options)
                rzp.on('payment.failed', function (resp) {
                    setStep("failed")
                    addToast("error", resp.error.description || "Payment failed or was cancelled.")
                })
                rzp.open()
            } else {
                // Demo mode (no supabase)
                await new Promise(r => setTimeout(r, 1500))
                setStep("confirmed")
                addToast("success", "Session booked! (Demo mode)")
            }
        } catch (err) {
            console.error("Booking Error:", err)
            setStep("failed")
            addToast("error", err.message || "Failed to initiate payment. Ensure you are running via 'vercel dev'.")
        }
    }

    const handleClose = () => {
        setStep("topic")
        setTopic("")
        setPickedSlot(null)
        onClose()
    }

    const formatSlot = (slot) => {
        if (!slot) return "Flexible (mentor will suggest)"
        const d = new Date(slot.slot_start)
        return `${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · ${d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: true })}`
    }

    const jitsiLink = `https://meet.jit.si/takshak-${mentor.id?.slice(0, 8)}-${Date.now().toString(36)}`
    const jitsiPassword = Math.random().toString(36).slice(2, 8)

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
                        <div className="flex items-center gap-2">
                            {isFreeSession && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                                    <Gift size={10} /> FREE
                                </span>
                            )}
                            <button onClick={handleClose} className="p-2 rounded-xl hover:bg-slate-200 transition"><X size={18} /></button>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="px-6 pt-4">
                        <div className="flex gap-1">
                            {["Topic", isFreeSession ? "Confirm" : "Pay", "Done"].map((label, i) => {
                                const steps = ["topic", isFreeSession ? "review" : "payment", "confirmed"]
                                const stepIdx = steps.indexOf(
                                    step === "processing" ? steps[1] : step === "failed" ? steps[1] : step === "review" ? steps[1] : step
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
                        {/* Loading check */}
                        {checkingFree && (
                            <div className="text-center py-8">
                                <Loader size={24} className="mx-auto text-indigo-600 animate-spin mb-3" />
                                <p className="text-xs text-slate-400">Checking eligibility...</p>
                            </div>
                        )}

                        {/* STEP: TOPIC (combines old slot + topic steps) */}
                        {!checkingFree && step === "topic" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                {/* Free session banner */}
                                {isFreeSession && (
                                    <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-3 mb-4">
                                        <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                                            <Gift size={13} /> Your first session with {name} is FREE! 🎉
                                        </p>
                                        <p className="text-[10px] text-emerald-600 mt-1">10-minute intro session — no payment required</p>
                                    </div>
                                )}

                                {/* Session info */}
                                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock size={13} /> {SESSION_DURATION_MIN} min session
                                        </div>
                                        <span className={`text-sm font-black ${isFreeSession ? "text-emerald-600" : "text-indigo-600"}`}>
                                            {isFreeSession ? "FREE" : `₹${SESSION_RATE_INR}`}
                                        </span>
                                    </div>
                                </div>

                                {slotToUse && (
                                    <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 mb-4">
                                        <p className="text-xs font-bold text-indigo-700 flex items-center gap-1.5"><CalendarDays size={13} /> Selected Slot</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">{formatSlot(slotToUse)}</p>
                                    </div>
                                )}

                                <h3 className="text-sm font-bold text-slate-900 mb-3">What do you need help with?</h3>
                                <textarea
                                    value={topic} onChange={e => setTopic(e.target.value)}
                                    placeholder="E.g., JEE Physics — Electrostatics doubt clearing, college selection advice..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none resize-none h-24 focus:border-indigo-500 focus:bg-white transition"
                                />

                                <button disabled={!topic.trim()} onClick={() => setStep(isFreeSession ? "review" : "payment")}
                                    className="w-full mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isFreeSession ? "Review & Book Free →" : "Review & Pay →"}
                                </button>
                            </motion.div>
                        )}

                        {/* STEP: FREE SESSION REVIEW */}
                        {step === "review" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Gift size={16} className="text-emerald-600" /> Free Session Summary</h3>

                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Mentor</span><span className="font-semibold">{name}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Duration</span><span className="font-semibold">{SESSION_DURATION_MIN} min</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Slot</span><span className="font-semibold text-xs">{formatSlot(slotToUse)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Topic</span><span className="font-semibold text-xs truncate max-w-[180px]">{topic}</span></div>
                                    <hr className="border-slate-100" />
                                    <div className="flex justify-between text-base font-black"><span>Total</span><span className="text-emerald-600">FREE 🎁</span></div>
                                </div>

                                <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 mb-4 flex items-start gap-2">
                                    <Shield size={14} className="text-sky-600 mt-0.5 shrink-0" />
                                    <p className="text-[10px] text-sky-700">Your session request will be sent to {name}. They'll accept and share a secure video call link.</p>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep("topic")}
                                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Back</button>
                                    <button onClick={handleBookFree}
                                        className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-emerald-200 hover:-translate-y-0.5 hover:shadow-xl transition flex items-center justify-center gap-2"
                                    >
                                        <Gift size={15} /> Book Free Session
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP: PAYMENT REVIEW (for paid sessions) */}
                        {step === "payment" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard size={16} /> Booking Summary</h3>

                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Mentor</span><span className="font-semibold">{name}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Duration</span><span className="font-semibold">{SESSION_DURATION_MIN} min</span></div>
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
                                <p className="text-sm font-bold text-slate-700">{isFreeSession ? "Booking your free session..." : "Processing your payment..."}</p>
                                <p className="text-xs text-slate-400 mt-1">Do not close this window.</p>
                            </motion.div>
                        )}

                        {/* STEP: CONFIRMED */}
                        {step === "confirmed" && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-1">
                                    {isFreeSession ? "Free Session Requested! 🎉" : "Session Booked! 🎉"}
                                </h3>
                                <p className="text-sm text-slate-500 mb-5">
                                    {name} will review your request and share a video call link via email.
                                </p>

                                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 mb-5">
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">Session ID</span><span className="font-mono font-bold text-slate-600">NTX-{Date.now().toString(36).toUpperCase()}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">Status</span>
                                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black">AWAITING MENTOR</span>
                                    </div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">When</span><span className="font-semibold text-slate-600">{formatSlot(slotToUse)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">Price</span><span className="font-bold text-emerald-600">{isFreeSession ? "FREE" : `₹${total}`}</span></div>
                                </div>

                                <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 mb-4">
                                    <p className="text-[10px] text-sky-700 flex items-center gap-1">
                                        <Shield size={11} /> The mentor will accept and generate a secure Jitsi Meet link for your session.
                                    </p>
                                </div>

                                <button onClick={handleClose}
                                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition"
                                >
                                    Done
                                </button>
                            </motion.div>
                        )}

                        {/* STEP: FAILED */}
                        {step === "failed" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                    <X size={32} className="text-red-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-1">Booking Failed</h3>
                                <p className="text-sm text-slate-500 mb-5">Something went wrong. Please try again.</p>
                                <button onClick={() => setStep("topic")}
                                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn, Mail, Rocket, User, Lock, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { signUpWithEmail, signInWithEmail, signInWithGoogle, resetPassword } from "../services/auth"
import ParticleField from "../components/animations/ParticleField"

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
]

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function AuthPage({ defaultTab = "signup" }) {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from || "/"

    const [tab, setTab] = useState(defaultTab)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showForgot, setShowForgot] = useState(false)

    // Form fields
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [stream, setStream] = useState("")
    const [state, setState] = useState("")
    const [role, setRole] = useState("student")

    async function handleSignUp(e) {
        e.preventDefault()
        setError("")
        if (password !== confirmPassword) { setError("Passwords don't match"); return }
        if (password.length < 6) { setError("Password must be at least 6 characters"); return }
        if (!fullName.trim()) { setError("Please enter your name"); return }

        setLoading(true)
        const { data, error: err } = await signUpWithEmail({ email, password, fullName, stream, state, role })
        setLoading(false)

        if (err) { setError(err.message); return }
        setSuccess("Account created! Check your email to verify, then log in.")
        setTimeout(() => setTab("login"), 2000)
    }

    async function handleLogin(e) {
        e.preventDefault()
        setError("")
        setLoading(true)
        const { data, error: err } = await signInWithEmail(email, password)
        setLoading(false)

        if (err) { setError(err.message); return }
        navigate(from, { replace: true })
    }

    async function handleGoogleAuth() {
        setError("")
        const { error: err } = await signInWithGoogle()
        if (err) setError(err.message)
    }

    async function handleForgotPassword(e) {
        e.preventDefault()
        setError("")
        if (!email) { setError("Enter your email first"); return }
        setLoading(true)
        const { error: err } = await resetPassword(email)
        setLoading(false)
        if (err) { setError(err.message); return }
        setSuccess("Password reset email sent! Check your inbox.")
        setShowForgot(false)
    }

    return (
        <div className="min-h-screen flex">
            {/* ═══ LEFT — Gradient Hero ═══ */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden hero-gradient items-center justify-center p-12">
                <ParticleField count={35} color="rgba(255,255,255,0.5)" lineColor="rgba(255,255,255,0.1)" maxDist={100} />
                <div className="orb orb-purple w-60 h-60 -top-20 -right-20" />
                <div className="orb orb-blue w-48 h-48 bottom-0 left-10" />

                <div className="relative z-10 max-w-md text-white">
                    <motion.img
                        src="/logo.png"
                        alt="MentorBhaiyaaa"
                        className="w-20 h-20 object-contain mb-6 drop-shadow-xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    />
                    <motion.h1 {...fadeUp(0.2)} className="text-display text-4xl">
                        Your journey to a<br />
                        <span className="text-gradient-animated">brighter future</span><br />
                        starts here.
                    </motion.h1>
                    <motion.p {...fadeUp(0.4)} className="mt-4 text-indigo-100/80 text-base leading-relaxed">
                        Join thousands of students who trust MentorBhaiyaaa for exam preparation,
                        college admissions, and career guidance.
                    </motion.p>

                    <motion.div {...fadeUp(0.6)} className="mt-8 flex gap-6 text-sm text-indigo-200">
                        <div className="text-center">
                            <p className="stat-number text-2xl text-white">10K+</p>
                            <p>Students</p>
                        </div>
                        <div className="text-center">
                            <p className="stat-number text-2xl text-white">500+</p>
                            <p>Mentors</p>
                        </div>
                        <div className="text-center">
                            <p className="stat-number text-2xl text-white">50+</p>
                            <p>Colleges</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══ RIGHT — Form ═══ */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50">
                <motion.div {...fadeUp(0)} className="w-full max-w-md">
                    {/* Logo mobile */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <img src="/logo.png" alt="MentorBhaiyaaa" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-bold text-slate-900">mentor<span className="text-indigo-600">bhaiyaaa</span></span>
                    </div>

                    {/* Tab Toggle */}
                    <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => { setTab("signup"); setError(""); setSuccess("") }}
                            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${tab === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            onClick={() => { setTab("login"); setError(""); setSuccess("") }}
                            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${tab === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                        >
                            Log In
                        </button>
                    </div>

                    <h2 className="text-section text-2xl text-slate-900 mb-1">
                        {tab === "signup" ? "Create your account" : showForgot ? "Reset password" : "Welcome back"}
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                        {tab === "signup"
                            ? "Start your exam preparation journey today"
                            : showForgot
                                ? "We'll send a reset link to your email"
                                : "Log in to continue where you left off"}
                    </p>

                    {/* Error / Success messages */}
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                            {success}
                        </motion.div>
                    )}

                    {/* ── FORGOT PASSWORD ── */}
                    {showForgot ? (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
                            <button type="submit" disabled={loading} className="btn-ripple w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg disabled:opacity-50">
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                            <button type="button" onClick={() => setShowForgot(false)} className="w-full text-center text-sm text-indigo-600 hover:underline">
                                ← Back to login
                            </button>
                        </form>
                    ) : tab === "signup" ? (
                        /* ── SIGN UP FORM ── */
                        <form onSubmit={handleSignUp} className="space-y-3">
                            <InputField icon={User} placeholder="Full Name" value={fullName} onChange={setFullName} autoComplete="name" />
                            <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} autoComplete="email" />

                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <select value={stream} onChange={e => setStream(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-8 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                                        <option value="">Stream</option>
                                        <option value="PCM">PCM</option>
                                        <option value="PCB">PCB</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select value={state} onChange={e => setState(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-8 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                                        <option value="">State</option>
                                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Role selector */}
                            <div className="flex rounded-xl border border-slate-200 p-1 gap-1">
                                <button type="button" onClick={() => setRole("student")} className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${role === "student" ? "bg-indigo-100 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}>
                                    🎓 Student
                                </button>
                                <button type="button" onClick={() => setRole("mentor")} className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${role === "mentor" ? "bg-indigo-100 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}>
                                    👨‍🏫 Mentor
                                </button>
                            </div>

                            <div className="relative">
                                <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={setPassword} autoComplete="new-password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <InputField icon={Lock} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />

                            <button type="submit" disabled={loading} className="btn-ripple w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 disabled:opacity-50 hover:shadow-xl hover:-translate-y-0.5 transition">
                                {loading ? <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : "Create Account"}
                            </button>

                            <Divider />
                            <GoogleButton onClick={handleGoogleAuth} label="Sign up with Google" />
                        </form>
                    ) : (
                        /* ── LOGIN FORM ── */
                        <form onSubmit={handleLogin} className="space-y-3">
                            <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} autoComplete="email" />
                            <div className="relative">
                                <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={setPassword} autoComplete="current-password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <div className="flex justify-end">
                                <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-indigo-600 hover:underline">
                                    Forgot password?
                                </button>
                            </div>

                            <button type="submit" disabled={loading} className="btn-ripple w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 disabled:opacity-50 hover:shadow-xl hover:-translate-y-0.5 transition">
                                {loading ? <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : "Log In"}
                            </button>

                            <Divider />
                            <GoogleButton onClick={handleGoogleAuth} label="Continue with Google" />
                        </form>
                    )}

                    <p className="mt-6 text-center text-xs text-slate-400">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

function InputField({ icon: Icon, type = "text", placeholder, value, onChange, autoComplete }) {
    return (
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition">
            {Icon && <Icon size={16} className="text-slate-400 shrink-0" />}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                autoComplete={autoComplete}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
        </div>
    )
}

function Divider() {
    return (
        <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
        </div>
    )
}

function GoogleButton({ onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md transition"
        >
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {label}
        </button>
    )
}

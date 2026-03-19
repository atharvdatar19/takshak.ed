import { Eye, EyeOff, LogIn, Mail, User, Lock, ChevronDown, ChevronRight, Sparkles, ArrowRight, Smartphone } from "lucide-react"
import { useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { signUpWithEmail, signInWithEmail, signInWithGoogle, resetPassword, signInWithOtp, verifyOtp } from "../services/auth"

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
]

/* ═══ Brilliant-style sliding variants ═══ */
const slideVariants = {
    enterRight: { x: 300, opacity: 0, scale: 0.95 },
    enterLeft: { x: -300, opacity: 0, scale: 0.95 },
    center: { x: 0, opacity: 1, scale: 1 },
    exitLeft: { x: -300, opacity: 0, scale: 0.95 },
    exitRight: { x: 300, opacity: 0, scale: 0.95 },
}

const slideTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
}

export default function AuthPage({ defaultTab = "signup" }) {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from || "/"

    const [tab, setTab] = useState(defaultTab)
    const [direction, setDirection] = useState(1) // 1 = right, -1 = left
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showForgot, setShowForgot] = useState(false)

    // Signup fields
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [stream, setStream] = useState("")
    const [state, setState] = useState("")
    const [role, setRole] = useState("student")

    // Login fields
    const [loginMethod, setLoginMethod] = useState("email")
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)

    // Signup step (Brilliant-style multi-step)
    const [signupStep, setSignupStep] = useState(0)

    function switchTab(newTab) {
        setDirection(newTab === "login" ? 1 : -1)
        setTab(newTab)
        setError("")
        setSuccess("")
        setShowForgot(false)
        setSignupStep(0)
        setOtpSent(false)
    }

    async function handleSignUp(e) {
        e.preventDefault()
        setError("")
        if (password !== confirmPassword) { setError("Passwords don't match"); return }
        if (password.length < 6) { setError("Password must be at least 6 characters"); return }
        if (!fullName.trim()) { setError("Please enter your name"); return }

        setLoading(true)
        const { error: err } = await signUpWithEmail({ email, password, fullName, stream, state, role })
        setLoading(false)
        if (err) { setError(err.message); return }
        setSuccess("Account created! Check your email to verify, then log in.")
        setTimeout(() => switchTab("login"), 2000)
    }

    async function handleLogin(e) {
        e.preventDefault()
        setError("")
        setLoading(true)
        if (loginMethod === "email") {
            const { error: err } = await signInWithEmail(email, password)
            setLoading(false)
            if (err) { setError(err.message); return }
            navigate(from, { replace: true })
        } else {
            if (!otpSent) {
                const { error: err } = await signInWithOtp(phone)
                setLoading(false)
                if (err) { setError(err.message); return }
                setOtpSent(true)
                setSuccess("OTP sent to your phone!")
            } else {
                const { error: err } = await verifyOtp(phone, otp)
                setLoading(false)
                if (err) { setError(err.message); return }
                navigate(from, { replace: true })
            }
        }
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

    function nextStep() {
        if (signupStep === 0 && !fullName.trim()) { setError("Please enter your name"); return }
        if (signupStep === 0 && !email.trim()) { setError("Please enter your email"); return }
        setError("")
        setDirection(1)
        setSignupStep(s => s + 1)
    }

    function prevStep() {
        setError("")
        setDirection(-1)
        setSignupStep(s => s - 1)
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
            {/* ═══ LEFT HERO ═══ */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-12"
                style={{ background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 35%, #7c3aed 65%, #6366f1 100%)" }}>

                {/* Animated grid dots */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }} />

                {/* Floating orbs */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: 60 + i * 30,
                            height: 60 + i * 30,
                            background: `radial-gradient(circle, rgba(255,255,255,${0.08 + i * 0.02}), transparent)`,
                            left: `${15 + i * 15}%`,
                            top: `${10 + i * 18}%`,
                        }}
                        animate={{
                            y: [0, -20 - i * 5, 0],
                            x: [0, 10 + i * 3, 0],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}

                <div className="relative z-10 max-w-md text-white">
                    <motion.img
                        src="/logo.png"
                        alt="NetraX"
                        className="w-16 h-16 object-contain mb-8 drop-shadow-xl rounded-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-extrabold leading-tight tracking-tight"
                    >
                        Learn, prepare,<br />
                        <span className="text-gradient-animated">succeed together.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-indigo-100/80 text-[15px] leading-relaxed"
                    >
                        Join thousands of students who trust NetraX for exam preparation,
                        cutoff predictions, and 1:1 guidance from top rankers.
                    </motion.p>

                    {/* Stat pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-10 flex gap-3"
                    >
                        {[
                            { val: "10K+", label: "Students" },
                            { val: "500+", label: "Mentors" },
                            { val: "50+", label: "Exams" },
                        ].map(s => (
                            <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3 text-center">
                                <p className="text-lg font-bold">{s.val}</p>
                                <p className="text-[10px] text-indigo-200 uppercase tracking-wider">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ═══ RIGHT FORM — Brilliant-style sliding panels ═══ */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile brand */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <img src="/logo.png" alt="NetraX" className="w-10 h-10 object-contain rounded-xl" />
                        <span className="text-xl font-bold text-slate-900">NetraX</span>
                    </div>

                    {/* Tab toggle — pill style */}
                    <div className="flex rounded-2xl bg-white border border-slate-200 p-1 mb-6 shadow-sm">
                        {["signup", "login"].map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => switchTab(t)}
                                className="flex-1 relative rounded-xl py-2.5 text-sm font-semibold transition-colors duration-200"
                            >
                                {tab === t && (
                                    <motion.div
                                        layoutId="auth-tab"
                                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <span className={`relative z-10 ${tab === t ? "text-white" : "text-slate-500"}`}>
                                    {t === "signup" ? "Sign Up" : "Log In"}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Error / Success */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ═══ SLIDING FORM PANELS ═══ */}
                    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl shadow-indigo-100/20 min-h-[400px]">
                        <AnimatePresence mode="wait" custom={direction}>
                            {tab === "signup" ? (
                                /* ── SIGNUP MULTI-STEP ── */
                                <motion.div
                                    key={`signup-${signupStep}`}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial={direction > 0 ? "enterRight" : "enterLeft"}
                                    animate="center"
                                    exit={direction > 0 ? "exitLeft" : "exitRight"}
                                    transition={slideTransition}
                                    className="p-6 md:p-8"
                                >
                                    {signupStep === 0 && (
                                        <div className="space-y-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
                                                <p className="text-sm text-slate-500 mt-1">Step 1 of 3 — Your details</p>
                                            </div>
                                            <StepDots current={0} total={3} />
                                            <InputField icon={User} placeholder="Full Name" value={fullName} onChange={setFullName} autoComplete="name" />
                                            <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} autoComplete="email" />
                                            <div className="flex rounded-xl border border-slate-200 p-1 gap-1">
                                                {[{ key: "student", emoji: "🎓", label: "Student" }, { key: "mentor", emoji: "👨‍🏫", label: "Mentor" }].map(r => (
                                                    <button key={r.key} type="button" onClick={() => setRole(r.key)}
                                                        className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition ${role === r.key ? "bg-indigo-100 text-indigo-700 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
                                                        {r.emoji} {r.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <button type="button" onClick={nextStep}
                                                className="btn-ripple w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition">
                                                Continue <ArrowRight size={16} />
                                            </button>
                                            <Divider />
                                            <GoogleButton onClick={handleGoogleAuth} label="Sign up with Google" />
                                        </div>
                                    )}

                                    {signupStep === 1 && (
                                        <div className="space-y-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">Almost there!</h2>
                                                <p className="text-sm text-slate-500 mt-1">Step 2 of 3 — Your preferences</p>
                                            </div>
                                            <StepDots current={1} total={3} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <SelectField label="Stream" value={stream} onChange={setStream} options={["PCM", "PCB", "Commerce", "Arts"]} />
                                                <SelectField label="State" value={state} onChange={setState} options={INDIAN_STATES} />
                                            </div>
                                            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                                                <p className="text-xs text-indigo-700 font-medium flex items-center gap-1.5">
                                                    <Sparkles size={14} /> We personalize your experience based on stream & state
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button type="button" onClick={prevStep}
                                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                                                    Back
                                                </button>
                                                <button type="button" onClick={nextStep}
                                                    className="btn-ripple flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition">
                                                    Continue <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {signupStep === 2 && (
                                        <form onSubmit={handleSignUp} className="space-y-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">Set your password</h2>
                                                <p className="text-sm text-slate-500 mt-1">Step 3 of 3 — Secure your account</p>
                                            </div>
                                            <StepDots current={2} total={3} />
                                            <div className="relative">
                                                <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="Password (min. 6 chars)" value={password} onChange={setPassword} autoComplete="new-password" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10">
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <InputField icon={Lock} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
                                            {password && (
                                                <PasswordStrength password={password} />
                                            )}
                                            <div className="flex gap-3">
                                                <button type="button" onClick={prevStep}
                                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                                                    Back
                                                </button>
                                                <button type="submit" disabled={loading}
                                                    className="btn-ripple flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition disabled:opacity-50">
                                                    {loading ? <Spinner /> : "Create Account"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </motion.div>

                            ) : showForgot ? (
                                /* ── FORGOT PASSWORD ── */
                                <motion.div
                                    key="forgot"
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enterRight"
                                    animate="center"
                                    exit="exitLeft"
                                    transition={slideTransition}
                                    className="p-6 md:p-8"
                                >
                                    <form onSubmit={handleForgotPassword} className="space-y-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">Reset password</h2>
                                            <p className="text-sm text-slate-500 mt-1">We'll send a reset link to your email</p>
                                        </div>
                                        <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
                                        <button type="submit" disabled={loading}
                                            className="btn-ripple w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50">
                                            {loading ? <Spinner /> : "Send Reset Link"}
                                        </button>
                                        <button type="button" onClick={() => { setDirection(-1); setShowForgot(false) }}
                                            className="w-full text-center text-sm text-indigo-600 hover:underline">
                                            ← Back to login
                                        </button>
                                    </form>
                                </motion.div>

                            ) : (
                                /* ── LOGIN ── */
                                <motion.div
                                    key="login"
                                    custom={direction}
                                    variants={slideVariants}
                                    initial={direction > 0 ? "enterRight" : "enterLeft"}
                                    animate="center"
                                    exit={direction > 0 ? "exitLeft" : "exitRight"}
                                    transition={slideTransition}
                                    className="p-6 md:p-8"
                                >
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
                                            <p className="text-sm text-slate-500 mt-1">Log in to continue where you left off</p>
                                        </div>

                                        <div className="flex rounded-xl border border-slate-200 p-1 gap-1">
                                            <button type="button" onClick={() => { setLoginMethod("email"); setOtpSent(false); }} className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition ${loginMethod === "email" ? "bg-indigo-100 text-indigo-700 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>Email</button>
                                            <button type="button" onClick={() => { setLoginMethod("phone"); setOtpSent(false); }} className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition ${loginMethod === "phone" ? "bg-indigo-100 text-indigo-700 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>Phone (OTP)</button>
                                        </div>

                                        {loginMethod === "email" ? (
                                            <>
                                                <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} autoComplete="email" />
                                                <div className="relative">
                                                    <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={setPassword} autoComplete="current-password" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10">
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                <div className="flex justify-end">
                                                    <button type="button" onClick={() => { setDirection(1); setShowForgot(true) }} className="text-xs text-indigo-600 hover:underline">
                                                        Forgot password?
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <InputField icon={Smartphone} type="tel" placeholder="Phone Number (e.g. 9876543210)" value={phone} onChange={setPhone} autoComplete="tel" />
                                                {otpSent && (
                                                    <InputField icon={Lock} type="text" placeholder="Enter OTP" value={otp} onChange={setOtp} autoComplete="one-time-code" />
                                                )}
                                            </>
                                        )}

                                        <button type="submit" disabled={loading}
                                            className="btn-ripple w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-50">
                                            {loading ? <Spinner /> : (loginMethod === "phone" && !otpSent ? "Send OTP" : "Log In")}
                                        </button>
                                        <Divider />
                                        <GoogleButton onClick={handleGoogleAuth} label="Continue with Google" />
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="mt-5 text-center text-xs text-slate-400">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}

/* ═══ Sub-components ═══ */

function StepDots({ current, total }) {
    return (
        <div className="flex gap-2">
            {Array.from({ length: total }).map((_, i) => (
                <motion.div
                    key={i}
                    className="h-1.5 rounded-full"
                    animate={{
                        width: i === current ? 32 : 12,
                        backgroundColor: i <= current ? "#6366f1" : "#e2e8f0",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
            ))}
        </div>
    )
}

function PasswordStrength({ password }) {
    const checks = [
        { label: "6+ characters", pass: password.length >= 6 },
        { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
        { label: "Number", pass: /\d/.test(password) },
    ]
    const strength = checks.filter(c => c.pass).length
    const color = strength === 3 ? "emerald" : strength === 2 ? "amber" : "rose"

    return (
        <div className="space-y-2">
            <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        className="h-1 flex-1 rounded-full"
                        animate={{
                            backgroundColor: i < strength
                                ? color === "emerald" ? "#10b981" : color === "amber" ? "#f59e0b" : "#f43f5e"
                                : "#e2e8f0",
                        }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
                {checks.map(c => (
                    <span key={c.label} className={`text-[10px] ${c.pass ? "text-emerald-600" : "text-slate-400"}`}>
                        {c.pass ? "✓" : "○"} {c.label}
                    </span>
                ))}
            </div>
        </div>
    )
}

function InputField({ icon: Icon, type = "text", placeholder, value, onChange, autoComplete }) {
    return (
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition">
            {Icon && <Icon size={16} className="text-slate-400 shrink-0" />}
            <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
                autoComplete={autoComplete} className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </div>
    )
}

function SelectField({ label, value, onChange, options }) {
    return (
        <div className="relative">
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-8 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition">
                <option value="">{label}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
    )
}

function Divider() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
        </div>
    )
}

function GoogleButton({ onClick, label }) {
    return (
        <button type="button" onClick={onClick}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md transition">
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

function Spinner() {
    return <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
}

import { Eye, EyeOff, LogIn, Mail, User, Lock, ChevronDown, ChevronRight, Sparkles, ArrowRight, Smartphone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { signUpWithEmail, signInWithEmail, signInWithGoogle, resetPassword, signInWithOtp, verifyOtp } from "../services/auth"
import { StaggerContainer, StaggerItem, PulseGlow } from "../components/animations/AnimationUtils"

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
]

/* ═══ Sliding variants ═══ */
const slideVariants = {
    enterRight: { x: 300, opacity: 0, scale: 0.95 },
    enterLeft: { x: -300, opacity: 0, scale: 0.95 },
    center: { x: 0, opacity: 1, scale: 1 },
    exitLeft: { x: -300, opacity: 0, scale: 0.95 },
    exitRight: { x: 300, opacity: 0, scale: 0.95 },
}

const slideTransition = {
    type: "spring", stiffness: 300, damping: 30, mass: 0.8,
}

export default function AuthPage({ defaultTab = "signup" }) {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from || "/"

    const [tab, setTab] = useState(defaultTab)
    const [direction, setDirection] = useState(1)
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
        setSuccess("Account created! Check your email to verify.")
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
        <div className="min-h-screen flex bg-background relative overflow-hidden">
            {/* Atmospheric glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full pointer-events-none" style={{ filter: "blur(120px)" }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-secondary/5 rounded-full pointer-events-none" style={{ filter: "blur(140px)" }} />

            {/* ═══ LEFT DECORATIVE PANEL ═══ */}
            <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden items-center justify-center p-12 z-10"
                 style={{ background: "linear-gradient(to bottom right, #b77466, #9a5e50)" }}>

                {/* Giant "T" */}
                <span className="absolute bottom-[-40px] left-[-20px] font-headline font-black text-on-primary/10 pointer-events-none select-none"
                      style={{ fontSize: "400px", lineHeight: 1 }}>T</span>

                <div className="relative z-10 max-w-sm">
                    <p className="font-label text-[9px] uppercase tracking-[0.4em] text-on-primary-fixed/60 mb-4">
                        THE ACADEMIC ATELIER
                    </p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                        className="font-headline font-black text-on-primary-fixed text-5xl leading-tight tracking-tighter mb-8"
                    >
                        TAKSHAK
                    </motion.h1>

                    {/* Giant "T" removed for cleaner look, metrics removed per request */}
                </div>
            </div>

            {/* ═══ RIGHT FORM PANEL ═══ */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10 bg-surface-container-low">
                <div className="w-full max-w-md">
                    {/* Mobile brand */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <span className="font-headline font-black text-primary text-2xl tracking-tight">TAKSHAK</span>
                    </div>

                    {/* Tab toggle */}
                    <div className="flex rounded-full glass p-1 mb-8">
                        {["signup", "login"].map(t => (
                            <button
                                key={t} type="button" onClick={() => switchTab(t)}
                                className="flex-1 relative rounded-full py-3 text-xs font-label uppercase tracking-wider font-bold transition-all duration-400"
                            >
                                {tab === t && (
                                    <motion.div
                                        layoutId="auth-tab"
                                        className="absolute inset-0 rounded-full bg-primary shadow-[0_0_20px_rgba(255,180,165,0.2)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <span className={`relative z-10 ${tab === t ? "text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
                                    {t === "signup" ? "Sign Up" : "Log In"}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Error / Success */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-6 rounded-lg bg-error/10 px-4 py-3 text-sm text-error font-headline font-light italic overflow-hidden"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-6 rounded-lg bg-tertiary/10 px-4 py-3 text-sm text-tertiary font-light italic overflow-hidden"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ═══ SLIDING FORM PANELS ═══ */}
                    <div className="relative overflow-hidden glass rounded-xl min-h-[440px]">
                        <AnimatePresence mode="wait" custom={direction}>
                            {tab === "signup" ? (
                                /* ── SIGNUP MULTI-STEP ── */
                                <motion.div key={`signup-${signupStep}`} custom={direction} variants={slideVariants} initial={direction > 0 ? "enterRight" : "enterLeft"} animate="center" exit={direction > 0 ? "exitLeft" : "exitRight"} transition={slideTransition} className="p-8 md:p-10">
                                    {signupStep === 0 && (
                                        <div className="space-y-5">
                                            <div>
                                                <h2 className="font-headline font-bold text-2xl text-on-surface italic">Create your account</h2>
                                                <p className="text-sm text-on-surface-variant font-light mt-1">Step 1 of 3 — Your details</p>
                                            </div>
                                            <StepDots current={0} total={3} />
                                            <InputField icon={User} placeholder="Full Name" value={fullName} onChange={setFullName} autoComplete="name" />
                                            <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} autoComplete="email" />

                                            <div className="flex rounded-full glass p-1 gap-1">
                                                {[{ key: "student", emoji: "🎓", label: "Student" }, { key: "mentor", emoji: "👨‍🏫", label: "Mentor" }].map(r => (
                                                    <button key={r.key} type="button" onClick={() => setRole(r.key)}
                                                        className={`flex-1 rounded-full py-3 text-xs font-label uppercase tracking-wider font-bold transition-all duration-400 ${role === r.key ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,180,165,0.2)]" : "text-on-surface-variant hover:text-on-surface"}`}>
                                                        {r.emoji} {r.label}
                                                    </button>
                                                ))}
                                            </div>

                                            <button type="button" onClick={nextStep} className="btn-primary w-full justify-center py-4 text-sm">
                                                Continue <ArrowRight size={16} />
                                            </button>

                                            <Divider />
                                            <GoogleButton onClick={handleGoogleAuth} label="Sign up with Google" />
                                        </div>
                                    )}

                                    {signupStep === 1 && (
                                        <div className="space-y-5">
                                            <div>
                                                <h2 className="font-headline font-bold text-2xl text-on-surface italic">Almost there!</h2>
                                                <p className="text-sm text-on-surface-variant font-light mt-1">Step 2 of 3 — Your preferences</p>
                                            </div>
                                            <StepDots current={1} total={3} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <SelectField label="Stream" value={stream} onChange={setStream} options={["PCM", "PCB", "Commerce", "Arts"]} />
                                                <SelectField label="State" value={state} onChange={setState} options={INDIAN_STATES} />
                                            </div>
                                            <div className="rounded-lg glass p-4">
                                                <p className="text-on-surface-variant text-xs font-light leading-relaxed flex items-center gap-2">
                                                    <Sparkles size={16} className="text-tertiary shrink-0" /> We personalize your dashboard based on your stream & state.
                                                </p>
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <button type="button" onClick={prevStep} className="btn-ghost w-1/3 justify-center py-3.5">Back</button>
                                                <button type="button" onClick={nextStep} className="btn-primary flex-1 justify-center py-3.5 text-sm">
                                                    Continue <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {signupStep === 2 && (
                                        <form onSubmit={handleSignUp}>
                                            <div className="space-y-5">
                                                <div>
                                                    <h2 className="font-headline font-bold text-2xl text-on-surface italic">Set your password</h2>
                                                    <p className="text-sm text-on-surface-variant font-light mt-1">Step 3 of 3 — Secure your account</p>
                                                </div>
                                                <StepDots current={2} total={3} />
                                                <div className="relative">
                                                    <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="Password (min. 6 chars)" value={password} onChange={setPassword} autoComplete="new-password" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors duration-400 z-10 pr-1">
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                <InputField icon={Lock} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
                                                {password && <PasswordStrength password={password} />}
                                                <div className="flex gap-3 pt-2">
                                                    <button type="button" onClick={prevStep} className="btn-ghost w-1/3 justify-center py-3.5">Back</button>
                                                    <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3.5 text-sm">
                                                        {loading ? <Spinner /> : "Create Account"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </motion.div>

                            ) : showForgot ? (
                                /* ── FORGOT PASSWORD ── */
                                <motion.div key="forgot" custom={direction} variants={slideVariants} initial="enterRight" animate="center" exit="exitLeft" transition={slideTransition} className="p-8 md:p-10">
                                    <form onSubmit={handleForgotPassword}>
                                        <div className="space-y-5">
                                            <div>
                                                <h2 className="font-headline font-bold text-2xl text-on-surface italic">Reset password</h2>
                                                <p className="text-sm text-on-surface-variant font-light mt-1">We'll send a reset link to your email</p>
                                            </div>
                                            <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
                                            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-sm mt-2">
                                                {loading ? <Spinner /> : "Send Reset Link"}
                                            </button>
                                            <button type="button" onClick={() => { setDirection(-1); setShowForgot(false) }} className="w-full text-center text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface mt-4 transition-colors duration-400">
                                                ← Back to login
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>

                            ) : (
                                /* ── LOGIN ── */
                                <motion.div key="login" custom={direction} variants={slideVariants} initial={direction > 0 ? "enterRight" : "enterLeft"} animate="center" exit={direction > 0 ? "exitLeft" : "exitRight"} transition={slideTransition} className="p-8 md:p-10">
                                    <form onSubmit={handleLogin}>
                                        <div className="space-y-5">
                                            <div>
                                                <h2 className="font-headline font-bold text-2xl text-on-surface italic">Welcome back</h2>
                                                <p className="text-sm text-on-surface-variant font-light mt-1">Log in to continue your preparation</p>
                                            </div>

                                            <div className="flex rounded-full glass p-1 gap-1">
                                                <button type="button" onClick={() => { setLoginMethod("email"); setOtpSent(false); }} className={`flex-1 rounded-full py-2.5 text-xs font-label uppercase tracking-wider font-bold transition-all duration-400 ${loginMethod === "email" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,180,165,0.2)]" : "text-on-surface-variant hover:text-on-surface"}`}>Email</button>
                                                <button type="button" onClick={() => { setLoginMethod("phone"); setOtpSent(false); }} className={`flex-1 rounded-full py-2.5 text-xs font-label uppercase tracking-wider font-bold transition-all duration-400 ${loginMethod === "phone" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,180,165,0.2)]" : "text-on-surface-variant hover:text-on-surface"}`}>Phone (OTP)</button>
                                            </div>

                                            {loginMethod === "email" ? (
                                                <>
                                                    <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} autoComplete="email" />
                                                    <div className="relative">
                                                        <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={setPassword} autoComplete="current-password" />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors duration-400 z-10 pr-1">
                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button type="button" onClick={() => { setDirection(1); setShowForgot(true) }} className="text-[11px] font-label font-bold uppercase tracking-wider text-secondary/60 hover:text-secondary transition-colors duration-400">
                                                            Forgot password?
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <InputField icon={Smartphone} type="tel" placeholder="Phone Number (e.g. 9876543210)" value={phone} onChange={setPhone} autoComplete="tel" />
                                                    {otpSent && <InputField icon={Lock} type="text" placeholder="Enter OTP" value={otp} onChange={setOtp} autoComplete="one-time-code" />}
                                                </>
                                            )}

                                            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-sm mt-2">
                                                {loading ? <Spinner /> : (loginMethod === "phone" && !otpSent ? "Send OTP" : "Log In")}
                                            </button>
                                            <Divider />
                                            <GoogleButton onClick={handleGoogleAuth} label="Continue with Google" />
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="mt-8 text-center text-[10px] uppercase font-label font-bold tracking-widest text-on-surface-variant/40">
                        By continuing, you agree to our Terms & Privacy Policy
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
                    animate={{ width: i === current ? 32 : 12, backgroundColor: i <= current ? "#ffb4a5" : "rgba(82, 67, 64, 0.3)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
            ))}
        </div>
    )
}

function PasswordStrength({ password }) {
    const checks = [
        { label: "6+ chars", pass: password.length >= 6 },
        { label: "Upper", pass: /[A-Z]/.test(password) },
        { label: "Number", pass: /\d/.test(password) },
    ]
    const strength = checks.filter(c => c.pass).length

    return (
        <div className="space-y-3 p-4 rounded-lg glass">
            <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i} className="h-1 flex-1 rounded-full"
                        animate={{ backgroundColor: i < strength ? (strength === 3 ? "#dfc393" : strength === 2 ? "#ebbda2" : "#ffb4ab") : "rgba(82, 67, 64, 0.3)" }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {checks.map(c => (
                    <span key={c.label} className={`text-[10px] font-label font-bold uppercase tracking-wider ${c.pass ? "text-tertiary" : "text-on-surface-variant/40"}`}>
                        {c.pass ? "✓" : "○"} {c.label}
                    </span>
                ))}
            </div>
        </div>
    )
}

function InputField({ icon: Icon, type = "text", placeholder, value, onChange, autoComplete }) {
    return (
        <div className="flex items-center gap-3">
            {Icon && <Icon size={16} className="text-on-surface-variant/60 shrink-0" />}
            <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
                autoComplete={autoComplete}
                className="flex-1 border-0 border-b border-outline-variant/40 bg-transparent rounded-none px-0 py-3 text-on-surface text-sm font-light placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_rgba(255,180,165,0.4)] transition-all duration-400 w-full"
            />
        </div>
    )
}

function SelectField({ label, value, onChange, options }) {
    return (
        <div className="relative">
            <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/60 mb-1 block">{label}</label>
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full appearance-none border-0 border-b border-outline-variant/40 bg-transparent rounded-none px-0 py-3 text-sm font-light text-on-surface outline-none focus:border-primary transition-all duration-400">
                <option value="" className="bg-surface-container">{label}</option>
                {options.map(o => <option key={o} value={o} className="bg-surface-container">{o}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-0 bottom-3 text-on-surface-variant/40 pointer-events-none" />
        </div>
    )
}

function Divider() {
    return (
        <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-outline-variant/20" />
            <span className="text-[10px] font-label font-bold uppercase text-on-surface-variant/40 tracking-widest">or</span>
            <div className="flex-1 h-px bg-outline-variant/20" />
        </div>
    )
}

function GoogleButton({ onClick, label }) {
    return (
        <button type="button" onClick={onClick}
            className="btn-ghost w-full justify-center">
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
    return <span className="animate-spin inline-block h-4 w-4 border-2 border-on-primary border-t-transparent rounded-full" />
}

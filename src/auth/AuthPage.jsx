import { Eye, EyeOff, LogIn, Mail, User, Lock, ChevronDown, ChevronRight, Sparkles, ArrowRight, Smartphone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { signUpWithEmail, signInWithEmail, signInWithGoogle, resetPassword, signInWithOtp, verifyOtp } from "@auth/auth"
import { StaggerContainer, StaggerItem, PulseGlow } from "@components/animations/AnimationUtils"

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
        <div className="min-h-screen flex bg-[#0b1326] relative overflow-hidden">
            {/* Ambient Base Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* ═══ LEFT HERO ═══ */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-12 border-r border-white/5 bg-[#0f1930]/40 backdrop-blur-3xl z-10">
                
                {/* Animated grid dots */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }} />

                {/* Floating orbs */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: 60 + i * 30, height: 60 + i * 30,
                            background: `radial-gradient(circle, rgba(78,222,163,${0.02 + i * 0.01}), transparent)`,
                            left: `${15 + i * 15}%`, top: `${10 + i * 18}%`,
                        }}
                        animate={{
                            y: [0, -20 - i * 5, 0], x: [0, 10 + i * 3, 0], scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}

                <div className="relative z-10 max-w-md text-white">
                    <motion.img
                        src="/takshak_logo.jpg"
                        alt="TAKक्षक"
                        className="w-16 h-16 object-cover mb-8 drop-shadow-[0_0_15px_rgba(78,222,163,0.3)] rounded-2xl border border-white/10"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg"
                    >
                        Learn, prepare,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">succeed together.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="mt-6 text-[#a3aac4] text-base leading-relaxed"
                    >
                        Join thousands of students who trust TAKक्षक for exam preparation,
                        cutoff predictions, and 1:1 guidance from top rankers.
                    </motion.p>

                    {/* Stat pills */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-10 flex gap-3">
                        {[
                            { val: "10K+", label: "Students" },
                            { val: "500+", label: "Mentors" },
                            { val: "50+", label: "Exams" },
                        ].map(s => (
                            <div key={s.label} className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 text-center flex-1">
                                <p className="text-xl font-black text-white">{s.val}</p>
                                <p className="text-[9px] text-[#6d758c] uppercase tracking-widest font-bold mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ═══ RIGHT FORM ═══ */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
                <div className="w-full max-w-md">
                    {/* Mobile brand */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <img src="/takshak_logo.jpg" alt="TAKक्षक" className="w-10 h-10 object-cover rounded-xl shadow-lg border border-white/10" />
                        <span className="text-xl font-bold text-white tracking-widest">TAKक्षक</span>
                    </div>

                    {/* Tab toggle — pill style */}
                    <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1.5 mb-8 backdrop-blur-md">
                        {["signup", "login"].map(t => (
                            <button
                                key={t} type="button" onClick={() => switchTab(t)}
                                className="flex-1 relative rounded-xl py-3 text-sm font-bold transition-colors duration-200"
                            >
                                {tab === t && (
                                    <motion.div
                                        layoutId="auth-tab"
                                        className="absolute inset-0 rounded-xl bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <span className={`relative z-10 ${tab === t ? "text-white" : "text-[#a3aac4] hover:text-white"}`}>
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
                                className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400 backdrop-blur-md relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400 backdrop-blur-md relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ═══ SLIDING FORM PANELS ═══ */}
                    <div className="relative overflow-hidden rounded-[2rem] bg-[#0f1930]/80 backdrop-blur-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] min-h-[440px]">
                        <AnimatePresence mode="wait" custom={direction}>
                            {tab === "signup" ? (
                                /* ── SIGNUP MULTI-STEP ── */
                                <motion.div key={`signup-${signupStep}`} custom={direction} variants={slideVariants} initial={direction > 0 ? "enterRight" : "enterLeft"} animate="center" exit={direction > 0 ? "exitLeft" : "exitRight"} transition={slideTransition} className="p-8">
                                    {signupStep === 0 && (
                                        <StaggerContainer stagger={0.08} className="space-y-5">
                                            <StaggerItem>
                                                <h2 className="text-2xl font-extrabold text-white tracking-tight">Create your account</h2>
                                                <p className="text-sm text-[#6d758c] mt-1">Step 1 of 3 — Your details</p>
                                            </StaggerItem>
                                            <StaggerItem><StepDots current={0} total={3} /></StaggerItem>
                                            
                                            <StaggerItem>
                                                <InputField icon={User} placeholder="Full Name" value={fullName} onChange={setFullName} autoComplete="name" />
                                            </StaggerItem>
                                            
                                            <StaggerItem>
                                                <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} autoComplete="email" />
                                            </StaggerItem>

                                            <StaggerItem>
                                                <div className="flex rounded-xl border border-white/10 bg-white/5 p-1.5 gap-1.5">
                                                    {[{ key: "student", emoji: "🎓", label: "Student" }, { key: "mentor", emoji: "👨‍🏫", label: "Mentor" }].map(r => (
                                                        <button key={r.key} type="button" onClick={() => setRole(r.key)}
                                                            className={`flex-1 rounded-lg py-3 text-xs font-bold transition-colors ${role === r.key ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "text-[#a3aac4] hover:text-white"}`}>
                                                            {r.emoji} {r.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </StaggerItem>

                                            <StaggerItem>
                                                <button type="button" onClick={nextStep} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-[#002919] uppercase tracking-wider shadow-[0_0_20px_rgba(78,222,163,0.3)] hover:shadow-[0_0_30px_rgba(78,222,163,0.5)] hover:-translate-y-0.5 transition-all">
                                                    Continue <ArrowRight size={16} />
                                                </button>
                                            </StaggerItem>

                                            <StaggerItem><Divider /></StaggerItem>
                                            <StaggerItem><GoogleButton onClick={handleGoogleAuth} label="Sign up with Google" /></StaggerItem>
                                        </StaggerContainer>
                                    )}

                                    {signupStep === 1 && (
                                        <StaggerContainer stagger={0.08} className="space-y-5">
                                            <StaggerItem>
                                                <h2 className="text-2xl font-extrabold text-white tracking-tight">Almost there!</h2>
                                                <p className="text-sm text-[#6d758c] mt-1">Step 2 of 3 — Your preferences</p>
                                            </StaggerItem>
                                            <StaggerItem><StepDots current={1} total={3} /></StaggerItem>
                                            <StaggerItem>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <SelectField label="Stream" value={stream} onChange={setStream} options={["PCM", "PCB", "Commerce", "Arts"]} />
                                                    <SelectField label="State" value={state} onChange={setState} options={INDIAN_STATES} />
                                                </div>
                                            </StaggerItem>
                                            <StaggerItem>
                                                <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 backdrop-blur-md">
                                                    <p className="text-[#a3aac4] text-xs font-medium leading-relaxed flex items-center gap-2">
                                                        <Sparkles size={16} className="text-indigo-400 shrink-0" /> We personalize your dashboard specifically based on your stream & state.
                                                    </p>
                                                </div>
                                            </StaggerItem>
                                            <StaggerItem>
                                                <div className="flex gap-3 pt-2">
                                                    <button type="button" onClick={prevStep} className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">Back</button>
                                                    <button type="button" onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-[#002919] uppercase tracking-wider shadow-[0_0_20px_rgba(78,222,163,0.3)] hover:-translate-y-0.5 transition-all">
                                                        Continue <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </StaggerItem>
                                        </StaggerContainer>
                                    )}

                                    {signupStep === 2 && (
                                        <form onSubmit={handleSignUp}>
                                            <StaggerContainer stagger={0.08} className="space-y-5">
                                                <StaggerItem>
                                                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Set your password</h2>
                                                    <p className="text-sm text-[#6d758c] mt-1">Step 3 of 3 — Secure your account</p>
                                                </StaggerItem>
                                                <StaggerItem><StepDots current={2} total={3} /></StaggerItem>
                                                <StaggerItem>
                                                    <div className="relative">
                                                        <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="Password (min. 6 chars)" value={password} onChange={setPassword} autoComplete="new-password" />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6d758c] hover:text-white transition-colors z-10">
                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </StaggerItem>
                                                <StaggerItem>
                                                    <InputField icon={Lock} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
                                                </StaggerItem>
                                                {password && <StaggerItem><PasswordStrength password={password} /></StaggerItem>}
                                                <StaggerItem>
                                                    <div className="flex gap-3 pt-2">
                                                        <button type="button" onClick={prevStep} className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">Back</button>
                                                        <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-[#002919] uppercase tracking-wider shadow-[0_0_20px_rgba(78,222,163,0.3)] hover:-translate-y-0.5 disabled:opacity-50 transition-all">
                                                            {loading ? <Spinner /> : "Create Account"}
                                                        </button>
                                                    </div>
                                                </StaggerItem>
                                            </StaggerContainer>
                                        </form>
                                    )}
                                </motion.div>

                            ) : showForgot ? (
                                /* ── FORGOT PASSWORD ── */
                                <motion.div key="forgot" custom={direction} variants={slideVariants} initial="enterRight" animate="center" exit="exitLeft" transition={slideTransition} className="p-8">
                                    <form onSubmit={handleForgotPassword}>
                                        <StaggerContainer stagger={0.08} className="space-y-5">
                                            <StaggerItem>
                                                <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset password</h2>
                                                <p className="text-sm text-[#6d758c] mt-1">We'll send a reset link to your email</p>
                                            </StaggerItem>
                                            <StaggerItem>
                                                <InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
                                            </StaggerItem>
                                            <StaggerItem>
                                                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 disabled:opacity-50 transition-all mt-2">
                                                    {loading ? <Spinner /> : "Send Reset Link"}
                                                </button>
                                            </StaggerItem>
                                            <StaggerItem>
                                                <button type="button" onClick={() => { setDirection(-1); setShowForgot(false) }} className="w-full text-center text-xs font-bold uppercase tracking-wider text-[#a3aac4] hover:text-white mt-4 transition-colors">
                                                    &larr; Back to login
                                                </button>
                                            </StaggerItem>
                                        </StaggerContainer>
                                    </form>
                                </motion.div>

                            ) : (
                                /* ── LOGIN ── */
                                <motion.div key="login" custom={direction} variants={slideVariants} initial={direction > 0 ? "enterRight" : "enterLeft"} animate="center" exit={direction > 0 ? "exitLeft" : "exitRight"} transition={slideTransition} className="p-8">
                                    <form onSubmit={handleLogin}>
                                        <StaggerContainer stagger={0.08} className="space-y-5">
                                            <StaggerItem>
                                                <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome back</h2>
                                                <p className="text-sm text-[#6d758c] mt-1">Log in to continue your preparation</p>
                                            </StaggerItem>

                                            <StaggerItem>
                                                <div className="flex rounded-xl border border-white/10 bg-white/5 p-1.5 gap-1.5">
                                                    <button type="button" onClick={() => { setLoginMethod("email"); setOtpSent(false); }} className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-colors ${loginMethod === "email" ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "text-[#a3aac4] hover:text-white"}`}>Email</button>
                                                    <button type="button" onClick={() => { setLoginMethod("phone"); setOtpSent(false); }} className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-colors ${loginMethod === "phone" ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "text-[#a3aac4] hover:text-white"}`}>Phone (OTP)</button>
                                                </div>
                                            </StaggerItem>

                                            {loginMethod === "email" ? (
                                                <>
                                                    <StaggerItem><InputField icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} autoComplete="email" /></StaggerItem>
                                                    <StaggerItem>
                                                        <div className="relative">
                                                            <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={setPassword} autoComplete="current-password" />
                                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6d758c] hover:text-white transition-colors z-10">
                                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        </div>
                                                    </StaggerItem>
                                                    <StaggerItem>
                                                        <div className="flex justify-end">
                                                            <button type="button" onClick={() => { setDirection(1); setShowForgot(true) }} className="text-[14px] font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors">
                                                                Forgot password?
                                                            </button>
                                                        </div>
                                                    </StaggerItem>
                                                </>
                                            ) : (
                                                <>
                                                    <StaggerItem><InputField icon={Smartphone} type="tel" placeholder="Phone Number (e.g. 9876543210)" value={phone} onChange={setPhone} autoComplete="tel" /></StaggerItem>
                                                    {otpSent && <StaggerItem><InputField icon={Lock} type="text" placeholder="Enter OTP" value={otp} onChange={setOtp} autoComplete="one-time-code" /></StaggerItem>}
                                                </>
                                            )}

                                            <StaggerItem>
                                                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-[#002919] uppercase tracking-wider shadow-[0_0_20px_rgba(78,222,163,0.3)] hover:-translate-y-0.5 disabled:opacity-50 transition-all mt-2">
                                                    {loading ? <Spinner /> : (loginMethod === "phone" && !otpSent ? "Send OTP" : "Log In")}
                                                </button>
                                            </StaggerItem>
                                            <StaggerItem><Divider /></StaggerItem>
                                            <StaggerItem><GoogleButton onClick={handleGoogleAuth} label="Continue with Google" /></StaggerItem>
                                        </StaggerContainer>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="mt-8 text-center text-[10px] uppercase font-bold tracking-widest text-[#6d758c]">
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
                    animate={{ width: i === current ? 32 : 12, backgroundColor: i <= current ? "#4edea3" : "rgba(255,255,255,0.1)" }}
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
    const color = strength === 3 ? "emerald" : strength === 2 ? "amber" : "rose"

    return (
        <div className="space-y-3 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md">
            <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i} className="h-1 flex-1 rounded-full"
                        animate={{ backgroundColor: i < strength ? (color === "emerald" ? "#4edea3" : color === "amber" ? "#fbbf24" : "#f43f5e") : "rgba(255,255,255,0.1)" }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {checks.map(c => (
                    <span key={c.label} className={`text-[10px] font-black uppercase tracking-wider ${c.pass ? "text-emerald-400" : "text-[#6d758c]"}`}>
                        {c.pass ? "✓" : "○"} {c.label}
                    </span>
                ))}
            </div>
        </div>
    )
}

function InputField({ icon: Icon, type = "text", placeholder, value, onChange, autoComplete }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 focus-within:border-indigo-500 focus-within:bg-indigo-500/10 transition-all shadow-inner">
            {Icon && <Icon size={16} className="text-[#a3aac4] shrink-0" />}
            <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
                autoComplete={autoComplete} className="flex-1 bg-transparent text-sm text-white font-medium outline-none placeholder:text-[#6d758c] w-full" />
        </div>
    )
}

function SelectField({ label, value, onChange, options }) {
    return (
        <div className="relative">
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 py-3.5 text-sm font-medium text-white outline-none focus:border-indigo-500 focus:bg-indigo-500/10 transition-all shadow-inner">
                <option value="" className="bg-[#0f1930]">{label}</option>
                {options.map(o => <option key={o} value={o} className="bg-[#0f1930]">{o}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3aac4] pointer-events-none" />
        </div>
    )
}

function Divider() {
    return (
        <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-black uppercase text-[#6d758c] tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
        </div>
    )
}

function GoogleButton({ onClick, label }) {
    return (
        <button type="button" onClick={onClick}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
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
    return <span className="animate-spin inline-block h-4 w-4 border-2 border-[#002919] border-t-transparent rounded-full" />
}

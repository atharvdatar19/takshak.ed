import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@auth/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import {
  GraduationCap, Users, Star, ArrowRight, CheckCircle2,
  Upload, AlertCircle, Sparkles, BookOpen,
} from "lucide-react"
import supabase from "@database/supabaseClient"
import WaveBackground from "@components/ui/WaveBackground"

/* ─── why mentor perks ───────────────────────────────────── */
const PERKS = [
  {
    icon: Star,
    title: "Earn on your terms",
    desc: "Set your own rates and availability. Guide students around your schedule — no minimums.",
    color: "#f59e0b",
  },
  {
    icon: Users,
    title: "Real impact",
    desc: "You've been where these students are. Your story is exactly what they need to hear.",
    color: "#6366f1",
  },
  {
    icon: GraduationCap,
    title: "Give back",
    desc: "Help someone crack the exam that changed your life. That feeling doesn't compare to anything.",
    color: "#10b981",
  },
  {
    icon: BookOpen,
    title: "Build your profile",
    desc: "Reviews, ratings, and a profile card seen by thousands of aspirants across India.",
    color: "#8b5cf6",
  },
]

/* ─── eligible colleges ──────────────────────────────────── */
const COLLEGES = ["IIT", "AIIMS", "IIM", "NDA / NIA", "NID / NIFT", "BITS", "NLU", "LBSNAA", "AFMC", "Other premier institutions"]

/* ─── field wrapper ──────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-[13px] font-semibold text-white/60"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {label}
        {required && <span className="text-indigo-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  "w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-[14px] text-white/85 outline-none placeholder:text-white/20 focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all duration-200"

/* ─── main ───────────────────────────────────────────────── */
export default function BecomeMentor() {
  const { user, profile } = useAuth()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    grad_year: "",
    city_origin: "",
    languages: "",
    exam_focus: "",
    subjects: "",
    rate_30min_inr: "",
    rate_60min_inr: "",
    bio: "",
    linkedin_url: "",
    photo: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  /* pre-fill known fields from auth */
  useEffect(() => {
    if (!user) return
    setFormData((prev) => ({
      ...prev,
      email: user.email || prev.email,
      full_name: profile?.full_name || user.displayName || prev.full_name,
    }))
  }, [user, profile])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const data = new FormData()
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
          data.append(key, formData[key])
        }
      })
      const { error: funcError } = await supabase.functions.invoke("mentor-apply", { body: data })
      if (funcError) throw funcError
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError(err.message || "Submission failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="relative min-h-screen bg-[#07080f] flex items-center justify-center px-4">
        <WaveBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-md space-y-5"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-emerald-400" />
          </div>
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Application received!
          </h2>
          <p
            className="text-[15px] text-white/55 leading-relaxed"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            We'll review your application and reach out within 3–5 business days.
            Thank you for wanting to give back.
          </p>
          <Link
            to="/mentors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-[14px] font-semibold transition-all duration-200"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Browse mentors
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Become a Mentor — TAKक्षक | Guide JEE, NEET, UPSC, NDA Aspirants</title>
        <meta
          name="description"
          content="Are you an IIT, AIIMS, IIM, or NDA alumnus? Apply to become a TAKक्षक mentor and help aspirants crack the exams you've already conquered."
        />
        <link rel="canonical" href="https://takshak.ed/become-mentor" />
      </Helmet>

      <div className="relative min-h-screen bg-[#07080f] text-white overflow-x-hidden">
        <WaveBackground />

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="relative z-10 pt-20 pb-16 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[13px] font-medium text-indigo-300"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Sparkles size={13} />
              Applications open · TAKक्षक Mentors
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold leading-[1.08] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Share what you know.{" "}
              <span className="italic bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Guide who you were.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-[16px] sm:text-[17px] text-white/50 leading-relaxed max-w-xl mx-auto"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              You cracked the exam. Now help someone else do the same.
              Apply to become a TAKक्षक mentor — it takes 5 minutes.
            </motion.p>

            <motion.a
              href="#apply"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[14px] font-semibold shadow-lg shadow-indigo-500/25 hover:scale-[1.03] transition-all duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Apply now
              <ArrowRight size={15} />
            </motion.a>
          </div>
        </section>

        {/* ── PERKS ─────────────────────────────────────────────── */}
        <section className="relative z-10 py-14 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PERKS.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 space-y-3"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <h3
                  className="text-[15px] font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {title}
                </h3>
                <p
                  className="text-[13px] text-white/45 leading-relaxed"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── WHO WE'RE LOOKING FOR ─────────────────────────────── */}
        <section className="relative z-10 py-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Who can apply?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[14px] text-white/45"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Alumni and current students from India's premier institutions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {COLLEGES.map((c) => (
                <span
                  key={c}
                  className="px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[13px] text-white/60"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {c}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── APPLICATION FORM ──────────────────────────────────── */}
        <section id="apply" className="relative z-10 py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 md:p-10 space-y-8"
            >
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Mentor application
                </h2>
                <p
                  className="text-[13px] text-white/40"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Takes about 5 minutes. We review every application personally.
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-[13px]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* personal */}
                <div className="space-y-4">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400/70"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    About you
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full name" required>
                      <input type="text" name="full_name" required placeholder="Arjun Sharma"
                        value={formData.full_name} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="Email" required>
                      <input type="email" name="email" required placeholder="you@example.com"
                        value={formData.email} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="Phone">
                      <input type="tel" name="phone" placeholder="+91 98765 43210"
                        value={formData.phone} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="City of origin">
                      <input type="text" name="city_origin" placeholder="Delhi"
                        value={formData.city_origin} onChange={handleChange} className={inputCls} />
                    </Field>
                  </div>
                </div>

                {/* education */}
                <div className="space-y-4">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400/70"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Education
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="College / Institution" required>
                      <input type="text" name="college" required placeholder="IIT Bombay"
                        value={formData.college} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="Branch / Department" required>
                      <input type="text" name="branch" required placeholder="B.Tech CSE"
                        value={formData.branch} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="Graduation year">
                      <input type="number" name="grad_year" placeholder="2024"
                        min="2000" max="2030"
                        value={formData.grad_year} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="LinkedIn URL">
                      <input type="url" name="linkedin_url" placeholder="linkedin.com/in/yourname"
                        value={formData.linkedin_url} onChange={handleChange} className={inputCls} />
                    </Field>
                  </div>
                </div>

                {/* expertise */}
                <div className="space-y-4">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400/70"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    What you teach
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Exam focus">
                      <input type="text" name="exam_focus" placeholder="JEE, NEET, UPSC…"
                        value={formData.exam_focus} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="Subjects">
                      <input type="text" name="subjects" placeholder="Physics, Chemistry…"
                        value={formData.subjects} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="Languages">
                      <input type="text" name="languages" placeholder="Hindi, English…"
                        value={formData.languages} onChange={handleChange} className={inputCls} />
                    </Field>
                  </div>
                </div>

                {/* rates */}
                <div className="space-y-4">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400/70"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Session rates
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="30-min rate (₹)">
                      <input type="number" name="rate_30min_inr" placeholder="299"
                        value={formData.rate_30min_inr} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="60-min rate (₹)">
                      <input type="number" name="rate_60min_inr" placeholder="499"
                        value={formData.rate_60min_inr} onChange={handleChange} className={inputCls} />
                    </Field>
                  </div>
                </div>

                {/* bio */}
                <div className="space-y-4">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400/70"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Your story
                  </p>
                  <Field label="Short bio">
                    <textarea
                      name="bio"
                      rows={4}
                      placeholder="Tell students a bit about your journey — what you cracked, how you did it, and what you want to help them with."
                      value={formData.bio}
                      onChange={handleChange}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                  <Field label="Profile photo">
                    <label className="flex items-center gap-3 w-full rounded-xl border border-white/[0.07] border-dashed bg-white/[0.02] px-4 py-4 cursor-pointer hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all duration-200">
                      <Upload size={16} className="text-white/30 shrink-0" />
                      <span
                        className="text-[13px] text-white/35 truncate"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {formData.photo ? formData.photo.name : "Click to upload a photo"}
                      </span>
                      <input type="file" name="photo" accept="image/*" onChange={handleChange} className="hidden" />
                    </label>
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[15px] font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {submitting ? "Submitting…" : "Submit application"}
                </button>

                <p
                  className="text-center text-[12px] text-white/25"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  By applying you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-white/50 transition-colors">Terms of Service</Link>
                  . We'll never share your info.
                </p>
              </form>
            </motion.div>
          </div>
        </section>

        <div className="h-16" />
      </div>
    </>
  )
}

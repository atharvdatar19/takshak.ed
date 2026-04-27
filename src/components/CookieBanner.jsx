import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Cookie } from "lucide-react"
import { Link } from "react-router-dom"

const CONSENT_KEY = "takshak_cookie_consent"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) {
      // Delay slightly so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  function accept(type) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ type, date: new Date().toISOString() }))
    setVisible(false)
    // If analytics accepted, initialize GA (placeholder hook point)
    if (type === "all") {
      window.dispatchEvent(new CustomEvent("takshak:cookie-accept"))
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9999]"
          role="dialog"
          aria-label="Cookie consent"
          aria-modal="false"
        >
          <div className="rounded-2xl border border-white/[0.1] bg-[#0d1020]/90 backdrop-blur-2xl shadow-2xl shadow-black/60 p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Cookie size={15} className="text-indigo-400" />
                </div>
                <p className="text-[13px] font-black text-white">We use cookies</p>
              </div>
              <button onClick={() => accept("essential")} aria-label="Dismiss — essential only"
                className="text-slate-600 hover:text-slate-400 transition-colors p-0.5 shrink-0">
                <X size={15} />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              We use essential cookies to keep you logged in, and optional analytics cookies to improve Takshak. We never use ad-tracking cookies.{" "}
              <Link to="/cookies" className="text-indigo-400 hover:underline">Cookie Policy</Link>
              {" "}·{" "}
              <Link to="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>
            </p>

            {/* Details toggle */}
            <AnimatePresence>
              {showDetails && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4">
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 space-y-2.5">
                    {[
                      { name: "Essential",  desc: "Login sessions, security, core functionality. Always on.", on: true },
                      { name: "Functional", desc: "Theme preference, recently visited pages.",                on: true },
                      { name: "Analytics",  desc: "Anonymised usage stats via Google Analytics 4.",          on: false },
                    ].map(c => (
                      <div key={c.name} className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-bold text-white">{c.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{c.desc}</p>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                          c.on ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                               : "bg-slate-500/10 text-slate-500 border border-slate-500/15"
                        }`}>{c.on ? "Always on" : "Optional"}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button onClick={() => accept("all")}
                className="flex-1 rounded-xl bg-white text-[#05080f] text-[11px] font-black py-2.5 hover:bg-indigo-50 transition-colors">
                Accept All
              </button>
              <button onClick={() => accept("essential")}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-300 text-[11px] font-semibold py-2.5 hover:bg-white/[0.07] transition-colors">
                Essential Only
              </button>
              <button onClick={() => setShowDetails(v => !v)}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] text-slate-500 text-[11px] font-medium px-2.5 py-2.5 hover:text-white transition-colors whitespace-nowrap">
                {showDetails ? "Less" : "Details"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

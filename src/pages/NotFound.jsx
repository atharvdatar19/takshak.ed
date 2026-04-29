import { Link } from "react-router-dom"
import { ArrowRight, Zap } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05080f] flex flex-col items-center justify-center text-center px-5"
      style={{ fontFamily: "'Manrope','Inter',system-ui,sans-serif" }}>
      {/* Orb */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-md">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-8 shadow-2xl shadow-indigo-500/30">
          <Zap size={24} className="text-white" />
        </div>

        <p className="text-[14px] text-indigo-400 font-black uppercase tracking-widest mb-3">404 — Page Not Found</p>

        <h1 className="text-5xl font-black text-white tracking-tight mb-4">
          Lost in the{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">
            syllabus?
          </span>
        </h1>

        <p className="text-slate-400 text-base leading-relaxed mb-10">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#05080f] font-black text-[13px] px-6 py-3 hover:scale-[1.03] transition-transform">
            Go Home <ArrowRight size={14} />
          </Link>
          <Link to="/discover"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] text-white font-semibold text-[13px] px-6 py-3 hover:bg-white/[0.08] transition-colors">
            Explore Features
          </Link>
        </div>
      </div>
    </div>
  )
}

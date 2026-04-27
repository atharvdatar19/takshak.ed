import { Link } from "react-router-dom"
import { ArrowLeft, Zap } from "lucide-react"

export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-[#05080f] text-white" style={{ fontFamily: "'Manrope','Inter',system-ui,sans-serif" }}>
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.05] bg-[#05080f]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="text-[13px] font-black tracking-tight text-white">TAKक्षक</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-white transition-colors font-medium">
            <ArrowLeft size={12} /> Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-5 py-14 pb-24">
        <div className="mb-10">
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">{title}</h1>
          <p className="text-[12px] text-slate-500">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose-legal space-y-8 text-slate-300">
          {children}
        </div>
      </main>

      {/* Footer strip */}
      <footer className="border-t border-white/[0.05] px-5 py-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">© 2025 TAKक्षक. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-[11px] text-slate-600 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="text-[11px] text-slate-600 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="text-[11px] text-slate-600 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* Shared prose helpers used inside legal pages */
export function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-black text-white mb-3 mt-8 first:mt-0">{title}</h2>
      <div className="space-y-3 text-[13px] leading-relaxed text-slate-400">{children}</div>
    </section>
  )
}

export function P({ children }) {
  return <p className="text-[13px] leading-relaxed text-slate-400">{children}</p>
}

export function Ul({ items }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-400">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ContactBlock() {
  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 mt-6">
      <p className="text-[12px] font-bold text-indigo-300 mb-1">Contact Us</p>
      <p className="text-[12px] text-slate-400">For any questions regarding this policy, reach us at{" "}
        <a href="mailto:takshak.info@gmail.com" className="text-indigo-400 hover:underline">takshak.info@gmail.com</a>
      </p>
    </div>
  )
}

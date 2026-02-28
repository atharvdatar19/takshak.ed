import { Component, Suspense, lazy } from "react"
import { NavLink } from "react-router-dom"
import {
  Home,
  User,
  RefreshCw,
  MessageSquare,
  Users,
  MessageCircle,
  Compass,
  GraduationCap,
  Calendar,
  Bell,
  ShieldCheck,
  LogIn,
  Lock,
} from "lucide-react"
import ChatbotAssistant from "./chatbot/ChatbotAssistant"
import CommandPalette from "./CommandPalette"
import CursorTrail from "./CursorTrail"
import PageTransition from "./PageTransition"
import ThemeToggle from "./ThemeToggle"

const FloatingBackground = lazy(() => import("./3d/FloatingBackground"))

class SafeBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err) {
    console.warn("[3D Background] Failed to load:", err.message)
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/mentors", label: "Mentor Marketplace", icon: Users },
  { to: "/", label: "College Directory", icon: GraduationCap },
  { to: "/timeline", label: "Timeline", icon: Calendar },
  { to: "/alerts", label: "Alerts", icon: Bell },
]

const ACCOUNT_LINKS = [
  { to: "/admin", label: "Admin Control", icon: ShieldCheck },
]

export default function AppLayout({ children }) {
  return (
    <div className="relative flex min-h-screen bg-app">
      {/* 3D Background */}
      <SafeBoundary>
        <Suspense fallback={null}>
          <FloatingBackground />
        </Suspense>
      </SafeBoundary>

      {/* ── Sidebar ── */}
      <aside className="sidebar-glass sticky top-0 hidden h-screen w-72 flex-col overflow-y-auto md:flex" style={{ zIndex: 20 }}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-6">
          <img src="/logo.png" alt="MentorBhaiyaaa" className="h-12 w-auto rounded-xl" />
        </div>

        {/* Navigation Section */}
        <div className="px-4">
          <p className="mb-2 flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Compass size={12} /> Navigation
          </p>
          <nav className="space-y-1">
            {NAV_LINKS.map(link => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                      ? "nav-active rounded-xl"
                      : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="flex-1">{link.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Account Section */}
        <div className="mt-6 px-4">
          <p className="mb-2 flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <User size={12} /> Account
          </p>
          <nav className="space-y-1">
            {ACCOUNT_LINKS.map(link => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                      ? "nav-active rounded-xl"
                      : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="flex-1">{link.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Area */}
        <div className="mt-auto space-y-3 px-4 pb-6 pt-4">
          <ThemeToggle />
          <p className="px-2 text-[10px] text-slate-400">Press Ctrl+K for quick navigation</p>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl hover:shadow-indigo-300"
          >
            <LogIn size={16} /> Log In
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="perspective-scroll relative z-10 flex-1 overflow-y-auto p-5 md:p-8">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Global Overlays */}
      <CommandPalette />
      <CursorTrail />
      <ChatbotAssistant />
    </div>
  )
}

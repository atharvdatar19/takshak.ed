import { Component, Suspense, lazy } from "react"
import { NavLink } from "react-router-dom"
import {
  ArrowLeftRight,
  Bell,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Compass,
  DollarSign,
  GraduationCap,
  Heart,
  Home,
  LogIn,
  MessageSquare,
  ShieldCheck,
  Target,
  User,
  Users,
  Video,
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

const NAV_SECTIONS = [
  {
    title: "Navigation",
    icon: Compass,
    links: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/", label: "College Directory", icon: GraduationCap },
      { to: "/cutoff", label: "Cutoff Predictor", icon: Target },
      { to: "/applications", label: "Application Tracker", icon: ClipboardCheck },
      { to: "/scholarships", label: "Scholarships", icon: DollarSign },
      { to: "/timeline", label: "Timeline", icon: Calendar },
      { to: "/alerts", label: "Alerts", icon: Bell },
    ],
  },
  {
    title: "Tools",
    icon: BookOpen,
    links: [
      { to: "/planner", label: "Study Planner", icon: BookOpen },
      { to: "/documents", label: "Document Checklist", icon: ClipboardCheck },
      { to: "/compare", label: "College Compare", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Community",
    icon: Users,
    links: [
      { to: "/forum", label: "Doubt Forum", icon: MessageSquare },
      { to: "/sessions", label: "Mentor Sessions", icon: Video },
      { to: "/wellness", label: "Wellness Check-in", icon: Heart },
    ],
  },
  {
    title: "Account",
    icon: User,
    links: [
      { to: "/admin", label: "Admin Control", icon: ShieldCheck },
    ],
  },
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
        <div className="flex items-center gap-3 px-5 py-5">
          <img src="/logo.png" alt="MentorBhaiyaaa" className="h-10 w-auto rounded-xl" />
        </div>

        {/* Nav Sections */}
        <div className="flex-1 space-y-5 px-4">
          {NAV_SECTIONS.map(section => {
            const SIcon = section.icon
            return (
              <div key={section.title}>
                <p className="mb-1.5 flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <SIcon size={11} /> {section.title}
                </p>
                <nav className="space-y-0.5">
                  {section.links.map(link => {
                    const Icon = link.icon
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/"}
                        className={({ isActive }) =>
                          `group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 ${isActive
                            ? "nav-active"
                            : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                          }`
                        }
                      >
                        <Icon size={16} className="shrink-0" />
                        <span className="truncate">{link.label}</span>
                      </NavLink>
                    )
                  })}
                </nav>
              </div>
            )
          })}
        </div>

        {/* Bottom */}
        <div className="space-y-2 px-4 pb-5 pt-3">
          <ThemeToggle />
          <p className="px-2 text-[10px] text-slate-400">Ctrl+K quick nav</p>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl"
          >
            <LogIn size={15} /> Log In
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

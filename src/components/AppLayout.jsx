import { Component, Suspense, lazy, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
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
  Menu,
  MessageSquare,
  ShieldCheck,
  Target,
  User,
  Users,
  Video,
  X,
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
      { to: "/", label: "Dashboard", icon: Home },
      { to: "/colleges", label: "College Directory", icon: GraduationCap },
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

function SidebarContent({ onNavigate }) {
  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="/logo.png" alt="MentorBhaiyaaa" className="h-10 w-auto rounded-xl" />
      </div>

      {/* Nav Sections */}
      <div className="flex-1 space-y-5 overflow-y-auto px-4">
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
                      onClick={onNavigate}
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
        <p className="hidden px-2 text-[10px] text-slate-400 md:block">Ctrl+K quick nav</p>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl"
        >
          <LogIn size={15} /> Log In
        </button>
      </div>
    </>
  )
}

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="relative flex min-h-screen bg-app">
      {/* 3D Background */}
      <SafeBoundary>
        <Suspense fallback={null}>
          <FloatingBackground />
        </Suspense>
      </SafeBoundary>

      {/* ── Desktop Sidebar ── */}
      <aside className="sidebar-glass sticky top-0 hidden h-screen w-72 flex-col md:flex" style={{ zIndex: 20 }}>
        <SidebarContent onNavigate={() => { }} />
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-slate-200/60 bg-white/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <img src="/logo.png" alt="MentorBhaiyaaa" className="h-8 w-auto rounded-lg" />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl md:hidden"
            >
              {/* Close button */}
              <div className="flex justify-end px-4 pt-4">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="perspective-scroll relative z-10 flex-1 overflow-y-auto p-5 pt-20 md:p-8 md:pt-8">
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

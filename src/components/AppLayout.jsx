import { Component, Suspense, lazy, useState } from "react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Home,
  LayoutDashboard,
  Layers,
  Lightbulb,
  LogIn,
  Menu,
  MessageSquare,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Star,
  TrendingUp,
  User,
  Users,
  X,
  Clock,
  FileText,
  Calculator,
} from "lucide-react"
import ChatbotAssistant from "./chatbot/ChatbotAssistant"
import CommandPalette from "./CommandPalette"
import CursorTrail from "./CursorTrail"
import ThemeToggle from "./ThemeToggle"
import LeadCaptureModal from "./LeadCaptureModal"
import AnimatedPage from "./motion/AnimatedPage"
import { useScrollProgress } from "../hooks/useScrollProgress"

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
    title: "Home",
    icon: LayoutDashboard,
    links: [
      { to: "/", label: "Home", icon: LayoutDashboard },
      { to: "/colleges", label: "Colleges", icon: GraduationCap },
      { to: "/applications", label: "Opportunity Tracker", icon: ClipboardCheck },
    ],
  },
  {
    title: "Learning",
    icon: BookOpen,
    links: [
      { to: "/resources", label: "Resources", icon: BookOpen },
      { to: "/bridge", label: "Bridge Courses", icon: Layers },
      { to: "/mentors", label: "Mentors", icon: Star },
      { to: "/mentor/dashboard", label: "Mentor Dashboard", icon: GraduationCap },
      { to: "/defence", label: "Defence Aspirants", icon: Shield },
    ],
  },
  {
    title: "Tools & Prep",
    icon: TrendingUp,
    links: [
      { to: "/cutoff", label: "Rank Predictor", icon: TrendingUp },
      { to: "/skill-matcher", label: "AI Skill Matcher", icon: Lightbulb },
      { to: "/planner", label: "Study Planner", icon: BookOpen },
      { to: "/documents", label: "Document Checklist", icon: ClipboardCheck },
      { to: "/focus-room", label: "Focus Room", icon: Clock },
      { to: "/resume-builder", label: "Resume Builder", icon: FileText },
      { to: "/gpa-calculator", label: "GPA Calculator", icon: Calculator },
    ],
  },
  {
    title: "Community",
    icon: MessageSquare,
    links: [
      { to: "/pre-freshers", label: "Campus Hub", icon: Users },
      { to: "/marketplace", label: "Study Materials", icon: ShoppingBag },
      { to: "/forum", label: "Doubt Forum", icon: MessageSquare },
    ],
  },
]

function SidebarContent({ onNavigate }) {
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="/takshak_logo.jpg" alt="TAKSHAK" className="h-10 w-auto rounded-xl" />
        <span className="font-bold text-sm hidden md:block" style={{ color: 'var(--obsidian-on-surface)' }}>TAKSHAK</span>
      </div>

      {/* Nav Sections */}
      <div className="flex-1 space-y-5 overflow-y-auto px-4">
        {NAV_SECTIONS.map(section => {
          const SIcon = section.icon
          return (
            <div key={section.title}>
              <p className="mb-1.5 flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--obsidian-on-surface-variant)' }}>
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
                          : "hover:bg-white/5"
                        }`
                      }
                      style={({ isActive }) => (isActive ? {} : { color: 'var(--obsidian-on-surface-variant)' })}
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

        {/* Admin link — only visible to admins */}
        {isAdmin && (
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--obsidian-on-surface-variant)' }}>
              <ShieldCheck size={11} /> Admin
            </p>
            <nav>
              <NavLink
                to="/admin"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 ${isActive ? "nav-active" : "hover:bg-white/5"}`
                }
                style={{ color: 'var(--obsidian-on-surface-variant)' }}
              >
                <ShieldCheck size={16} className="shrink-0" />
                <span className="truncate">Admin Control</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {/* Bottom — Auth */}
      <div className="space-y-2 px-4 pb-5 pt-3">
        <ThemeToggle />
        <p className="hidden px-2 text-[10px] text-slate-400 md:block">Ctrl+K quick nav</p>

        {user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 rounded-xl bg-indigo-50 px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{profile?.full_name || "User"}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => { await signOut(); navigate("/login"); onNavigate() }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <LogIn size={15} className="rotate-180" /> Sign Out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { navigate("/signup"); onNavigate() }}
            className="btn-ripple flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl"
          >
            <LogIn size={15} /> Sign Up / Log In
          </button>
        )}
      </div>
    </>
  )
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollY, isScrolled } = useScrollProgress()

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
      <div
        className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 md:hidden"
        style={{
          background: isScrolled
            ? 'var(--bg-glass)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(8px)',
          WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(8px)',
          borderBottom: isScrolled
            ? '1px solid var(--border-glass)'
            : '1px solid transparent',
          boxShadow: isScrolled ? '0 1px 0 var(--shadow-glass)' : 'none',
          paddingTop: isScrolled ? '10px' : '12px',
          paddingBottom: isScrolled ? '10px' : '12px',
          transition: 'all 0.4s var(--ease-out-expo)',
        }}
      >
        <div className="flex items-center gap-2">
          <img src="/takshak_logo.jpg" alt="TAKSHAK" className="h-8 w-auto rounded-lg" />
          <span className="font-bold text-sm" style={{ color: 'var(--obsidian-on-surface)' }}>TAKSHAK</span>
        </div>
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
        <AnimatePresence mode="wait">
          <AnimatedPage key={location.pathname} routeKey={location.pathname}>
            {location.pathname !== "/" && (
              <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition focus:outline-none"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <Outlet />

            {/* ── Global Footer ── */}
            <footer className="mt-20 border-t border-slate-200/60 pt-8 pb-12">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-sm font-medium text-slate-500">
                  Made with ❤️ by <span className="font-bold text-indigo-600">TAKSHAK</span>
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                  TAKSHAK — Empowering Students since 2024
                </p>
              </div>
            </footer>
          </AnimatedPage>
        </AnimatePresence>
      </main>

      {/* Global Overlays */}
      <CommandPalette />
      <CursorTrail />
      <ChatbotAssistant />
      <LeadCaptureModal />
    </div>
  )
}

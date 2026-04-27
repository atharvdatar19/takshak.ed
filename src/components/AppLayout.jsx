import { Component, Suspense, lazy, useState, useEffect } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@auth/AuthContext"
import {
  Bell,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  MessageSquare,
  BookOpen,
  Users,
  ShieldCheck,
  LogOut,
} from "lucide-react"
import ChatbotAssistant from "./chatbot/ChatbotAssistant"
import CommandPalette from "./CommandPalette"
import CursorTrail from "./CursorTrail"
import ThemeToggle from "./ThemeToggle"
import LeadCaptureModal from "./LeadCaptureModal"
import AnimatedPage from "./motion/AnimatedPage"
import { useScrollProgress } from "@hooks/useScrollProgress"

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

// Primary nav — 5 items max
const PRIMARY_NAV = [
  { to: "/dashboard", label: "Home",      icon: LayoutDashboard, exact: true },
  { to: "/discover", label: "Discover",  icon: Compass },
  { to: "/mentors",  label: "Mentors",   icon: Users },
  { to: "/prepare",  label: "Prepare",   icon: BookOpen },
  { to: "/community",label: "Community", icon: MessageSquare },
]

function NavItem({ to, label, icon: Icon, exact, onClick }) {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all duration-200 ${
          isActive
            ? "nav-active"
            : "hover:bg-white/5"
        }`
      }
      style={({ isActive }) =>
        isActive ? {} : { color: "var(--obsidian-on-surface-variant)" }
      }
    >
      {({ isActive }) => (
        <>
          {/* Active accent bar */}
          {isActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
              style={{ background: "var(--obsidian-primary)" }}
            />
          )}
          <Icon size={17} className="shrink-0" />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}

function SidebarContent({ onNavigate }) {
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const isMentor = profile?.role === "mentor"

  const displayName = profile?.full_name || profile?.name || user?.displayName || "User"
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex h-full flex-col">
      {/* ── Brand ── */}
      <Link to="/" className="flex items-center gap-3 px-5 pb-4 pt-5 hover:opacity-80 transition-opacity">
        <img src="/takshak_logo.jpg" alt="TAKक्षक" className="h-9 w-auto rounded-xl" />
        <span className="font-display text-base font-bold tracking-tight" style={{ color: "var(--obsidian-on-surface)" }}>
          TAKक्षक
        </span>
      </Link>

      {/* ── Primary Nav ── */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {PRIMARY_NAV.map((item) => (
          <NavItem key={item.to} {...item} onClick={onNavigate} />
        ))}

        {/* Mentor Dashboard — only for mentors */}
        {isMentor && (
          <NavItem
            to="/mentor/dashboard"
            label="My Dashboard"
            icon={GraduationCap}
            onClick={onNavigate}
          />
        )}

        {/* Admin — only for admins */}
        {isAdmin && (
          <NavItem
            to="/admin"
            label="Admin Panel"
            icon={ShieldCheck}
            onClick={onNavigate}
          />
        )}
      </nav>

      {/* ── Bottom section ── */}
      <div className="border-t px-3 pb-5 pt-3 space-y-1" style={{ borderColor: "var(--obsidian-outline-variant)" }}>
        <ThemeToggle />

        {/* Alerts */}
        {user && (
          <NavLink
            to="/alerts"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all ${
                isActive ? "nav-active" : "hover:bg-white/5"
              }`
            }
            style={({ isActive }) => isActive ? {} : { color: "var(--obsidian-on-surface-variant)" }}
          >
            <Bell size={17} />
            <span>Notifications</span>
          </NavLink>
        )}

        {/* Auth */}
        {user ? (
          <div className="mt-2 space-y-2">
            {/* User card */}
            <div
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ background: "var(--accent-glow)" }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
              >
                {avatarLetter}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold" style={{ color: "var(--obsidian-on-surface)" }}>
                  {displayName}
                </p>
                <p className="truncate text-[10px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => { await signOut(); navigate("/login"); onNavigate?.() }}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold transition hover:bg-white/5"
              style={{ color: "var(--obsidian-on-surface-variant)", border: "1px solid var(--obsidian-outline-variant)" }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { navigate("/signup"); onNavigate?.() }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
          >
            <LogIn size={15} /> Sign Up Free
          </button>
        )}
      </div>
    </div>
  )
}

// Mobile bottom tab bar — 5 tabs, thumb zone
function MobileBottomBar() {
  const { user, profile } = useAuth()
  const location = useLocation()

  const tabs = PRIMARY_NAV.map((item) => ({
    ...item,
    isActive: item.exact
      ? location.pathname === item.to
      : location.pathname === item.to || location.pathname.startsWith(item.to + "/"),
  }))

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around md:hidden"
      style={{
        background: "var(--obsidian-surface)",
        borderTop: "1px solid var(--obsidian-outline-variant)",
        paddingBottom: "env(safe-area-inset-bottom)",
        height: "64px",
      }}
    >
      {tabs.map(({ to, label, icon: Icon, exact, isActive }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-all"
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-xl transition-all"
            style={{
              background: isActive ? "var(--accent-glow)" : "transparent",
              color: isActive ? "var(--obsidian-primary)" : "var(--obsidian-on-surface-variant)",
            }}
          >
            <Icon size={18} />
          </span>
          <span
            className="text-[10px] font-semibold"
            style={{ color: isActive ? "var(--obsidian-primary)" : "var(--obsidian-on-surface-variant)" }}
          >
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}

export default function AppLayout() {
  const location = useLocation()
  const { isScrolled } = useScrollProgress()
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    )
    observer.observe(document.documentElement, { attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative flex min-h-screen bg-app">
      {/* 3D Background — only in dark mode */}
      {isDark && (
        <SafeBoundary>
          <Suspense fallback={null}>
            <FloatingBackground />
          </Suspense>
        </SafeBoundary>
      )}

      {/* ── Desktop Sidebar ── */}
      <aside
        className="sidebar-glass sticky top-0 hidden h-screen w-60 flex-col md:flex"
        style={{ zIndex: 20 }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div
        className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 md:hidden"
        style={{
          height: "56px",
          background: isScrolled ? "var(--bg-glass)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "blur(8px)",
          WebkitBackdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "blur(8px)",
          borderBottom: isScrolled ? "1px solid var(--border-glass)" : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        <div className="flex items-center gap-2">
          <img src="/takshak_logo.jpg" alt="TAKक्षक" className="h-8 w-auto rounded-lg" />
          <span className="font-display text-base font-bold tracking-tight" style={{ color: "var(--obsidian-on-surface)" }}>
            TAKक्षक
          </span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="relative z-10 flex-1 overflow-y-auto p-5 pt-16 pb-20 md:p-8 md:pt-8 md:pb-8">
        <AnimatePresence mode="wait">
          <AnimatedPage key={location.pathname} routeKey={location.pathname}>
            <Outlet />

            {/* ── Global Footer ── */}
            <footer className="mt-20 border-t pt-8 pb-4" style={{ borderColor: "var(--obsidian-outline-variant)" }}>
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-medium" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                  Made with ❤️ by <span className="font-bold" style={{ color: "var(--obsidian-primary)" }}>TAKक्षक</span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                  Empowering Students Since 2024
                </p>
              </div>
            </footer>
          </AnimatedPage>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Tab Bar ── */}
      <MobileBottomBar />

      {/* Global Overlays */}
      <CommandPalette />
      <CursorTrail />
      <ChatbotAssistant />
      <LeadCaptureModal />
    </div>
  )
}

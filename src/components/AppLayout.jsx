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
} from "lucide-react"
import ChatbotAssistant from "./chatbot/ChatbotAssistant"
import CommandPalette from "./CommandPalette"
import CursorTrail from "./CursorTrail"
import LeadCaptureModal from "./LeadCaptureModal"
import { useScrollProgress } from "../hooks/useScrollProgress"

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

// Top nav links (subset for horizontal bar)
const TOP_NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/colleges", label: "Colleges" },
  { to: "/mentors", label: "Mentors" },
  { to: "/resources", label: "Resources" },
  { to: "/cutoff", label: "Predictor" },
  { to: "/documents", label: "Documents" },
]

function DrawerContent({ onNavigate }) {
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      {/* Nav Sections */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {NAV_SECTIONS.map(section => {
          const SIcon = section.icon
          return (
            <div key={section.title}>
              <p className="mb-2 flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60">
                <SIcon size={11} /> {section.title}
              </p>
              <nav className="space-y-1">
                {section.links.map(link => {
                  const Icon = link.icon
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/"}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `group flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all duration-400 ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50"
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

        {/* Admin link */}
        {isAdmin && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60">
              <ShieldCheck size={11} /> Admin
            </p>
            <nav>
              <NavLink
                to="/admin"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all duration-400 ${
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
                  }`
                }
              >
                <ShieldCheck size={16} className="shrink-0" />
                <span className="truncate">Admin Control</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {/* Bottom — Auth */}
      <div className="space-y-3 pt-6 border-t border-outline-variant/10">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg glass p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary text-xs font-bold">
                {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{profile?.full_name || "User"}</p>
                <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => { await signOut(); navigate("/login"); onNavigate() }}
              className="btn-ghost w-full justify-center py-2.5 text-[11px]"
            >
              <LogIn size={14} className="rotate-180" /> Sign Out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { navigate("/signup"); onNavigate() }}
            className="btn-primary w-full justify-center py-3"
          >
            <LogIn size={14} /> Sign Up / Log In
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
  const { scrollProgress, isScrolled } = useScrollProgress()
  const { user, profile } = useAuth()

  return (
    <div className="relative min-h-screen bg-background">
      {/* Noise overlay */}
      <div className="noise-overlay fixed inset-0 z-0 pointer-events-none" />

      {/* Atmospheric glows */}
      <div className="atmo-glow-primary fixed top-[-200px] right-[-200px] z-0" />
      <div className="atmo-glow-secondary fixed bottom-[-200px] left-[-200px] z-0" />

      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] z-[60]"
        style={{
          width: `${scrollProgress * 100}%`,
          background: "linear-gradient(to right, #ffb4a5, #dfc393)",
          transition: "width 100ms linear",
        }}
      />

      {/* ── Top Navigation Bar ── */}
      <header
        className="fixed top-0 w-full z-50 transition-all duration-500"
        style={{
          background: isScrolled
            ? "rgba(29, 16, 12, 0.6)"
            : "rgba(29, 16, 12, 0.3)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isScrolled
            ? "1px solid rgba(255, 180, 165, 0.1)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          {/* Left — Logo */}
          <NavLink to="/" className="font-headline font-black text-primary text-xl tracking-tight">
            TAKSHAK
          </NavLink>

          {/* Center — Nav links (md+) */}
          <nav className="hidden md:flex items-center gap-8">
            {TOP_NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-body transition-colors duration-500 ${
                    isActive
                      ? "text-primary font-semibold border-b-2 border-primary pb-1"
                      : "text-on-surface-variant font-light hover:text-secondary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right — Actions */}
          <div className="flex items-center gap-3">
            {/* User avatar */}
            {user && (
              <div className="hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary text-xs font-bold">
                {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full glass text-on-surface"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            {/* Drawer — right side */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-[100] flex w-72 flex-col glass pt-24 pb-8 px-6 overflow-y-auto md:hidden"
            >
              {/* Close button */}
              <div className="absolute top-6 right-6">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full glass text-on-surface-variant hover:text-on-surface transition-colors duration-400"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <DrawerContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="relative z-10 pt-20 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-5 md:p-8"
          >
            {location.pathname !== "/" && (
              <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-400 focus:outline-none"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <Outlet />

            {/* ── Global Footer ── */}
            <footer className="mt-20 pt-8 pb-12">
              <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
                <p className="text-sm font-medium text-on-surface-variant">
                  Made with ❤️ by <span className="font-headline font-bold text-primary italic">TAKSHAK</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-outline font-label font-bold">
                  TAKSHAK — Empowering Students since 2024
                </p>
              </div>
            </footer>
          </motion.div>
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

import { useState, useEffect } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard, Users, GraduationCap, CalendarDays,
    DollarSign, AlertTriangle, BookOpen, Building2, Clock,
    ShieldCheck, Menu, X, LogOut, Shield, Wifi, WifiOff,
    ChevronLeft, ChevronRight, Zap
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import supabase from "../supabaseClient"

const NAV_ITEMS = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "moderator", "content_editor", "finance_viewer"], end: true },
    { to: "/admin/users", label: "Users", icon: Users, roles: ["admin", "moderator"] },
    { to: "/admin/mentor-apps", label: "Mentor Apps", icon: GraduationCap, roles: ["admin", "moderator"] },
    { to: "/admin/sessions", label: "Sessions", icon: CalendarDays, roles: ["admin", "finance_viewer"] },
    { to: "/admin/payouts", label: "Payouts", icon: DollarSign, roles: ["admin", "finance_viewer"] },
    { to: "/admin/reports", label: "Reports", icon: AlertTriangle, roles: ["admin", "moderator"] },
    { to: "/admin/educators", label: "Educators", icon: BookOpen, roles: ["admin", "content_editor"] },
    { to: "/admin/colleges", label: "Colleges", icon: Building2, roles: ["admin", "content_editor"] },
    { to: "/admin/exams", label: "Exams", icon: Clock, roles: ["admin", "content_editor"] },
    { to: "/admin/team", label: "Team", icon: ShieldCheck, roles: ["admin"] },
]

export default function AdminShell() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isConnected, setIsConnected] = useState(!!supabase)
    const { user, role, signOut } = useAuth()
    const navigate = useNavigate()

    const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(role))

    // Monitor realtime connection
    useEffect(() => {
        if (!supabase) return
        setIsConnected(true)

        const channel = supabase.channel("admin-heartbeat")
            .subscribe((status) => {
                setIsConnected(status === "SUBSCRIBED")
            })

        return () => { supabase.removeChannel(channel) }
    }, [])

    const handleSignOut = async () => {
        await signOut?.()
        navigate("/")
    }

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-outline-variant/10">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,180,165,0.2)]">
                    <Zap size={16} className="text-on-primary" />
                </div>
                {sidebarOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                        <span className="text-sm font-headline font-black tracking-tight text-on-surface">TAKSHAK</span>
                        <span className="text-[9px] text-primary font-label font-bold ml-1.5 uppercase tracking-widest">Admin</span>
                    </motion.div>
                )}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-full hover:bg-surface-container-high/50 transition-all duration-400 text-on-surface-variant hidden lg:flex">
                    {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto">
                {visibleNav.map(item => {
                    const Icon = item.icon
                    return (
                        <NavLink
                            key={item.to} to={item.to} end={item.end}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-3 py-2.5 rounded-full text-[13px] font-medium transition-all duration-400 relative ${isActive
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-on-surface-variant hover:bg-surface-container-high/30 hover:text-on-surface"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div layoutId="admin-nav-active"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <Icon size={16} className="shrink-0" />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* User Footer */}
            <div className="border-t border-outline-variant/10 p-3">
                {sidebarOpen ? (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                            {(user?.email || "A")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-on-surface truncate">{user?.email || "admin"}</p>
                            <p className="text-[9px] text-primary font-label font-black uppercase tracking-[0.15em]">{role}</p>
                        </div>
                        <button onClick={handleSignOut} className="p-1.5 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-all duration-400">
                            <LogOut size={14} />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleSignOut} className="w-full p-2 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-all duration-400 flex justify-center">
                        <LogOut size={16} />
                    </button>
                )}
            </div>
        </>
    )

    return (
        <div className="flex min-h-screen bg-background text-on-surface">
            {/* Noise overlay */}
            <div className="noise-overlay fixed inset-0 z-0 pointer-events-none" />

            {/* Desktop Sidebar */}
            <aside className={`${sidebarOpen ? "w-60" : "w-[68px]"} transition-all duration-500 hidden lg:flex flex-col border-r border-outline-variant/10 glass shrink-0 sticky top-0 h-screen z-10`}>
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed left-0 top-0 bottom-0 w-60 z-50 flex flex-col border-r border-outline-variant/10 bg-surface-container lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto min-h-screen relative z-10">
                {/* Topbar */}
                <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 lg:px-6 border-b border-outline-variant/10 glass">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-full hover:bg-surface-container-high/50 text-on-surface-variant lg:hidden transition-all duration-400">
                            <Menu size={18} />
                        </button>
                        <button onClick={() => navigate("/")} className="text-[11px] text-on-surface-variant hover:text-primary transition-colors duration-400 flex items-center gap-1 font-label font-bold uppercase tracking-wider">
                            ← Back to App
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Connection Status */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-label font-black uppercase tracking-wider border ${isConnected
                                ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                                : "bg-error/10 text-error border-error/20"
                            }`}>
                            <span className="relative flex h-1.5 w-1.5">
                                {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />}
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isConnected ? "bg-tertiary" : "bg-error"}`} />
                            </span>
                            {isConnected ? "Live" : "Demo"}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 lg:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

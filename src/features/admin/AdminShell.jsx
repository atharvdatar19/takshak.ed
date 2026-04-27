import { useState, useEffect } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard, Users, GraduationCap, CalendarDays,
    DollarSign, AlertTriangle, BookOpen, Building2, Clock,
    ShieldCheck, Menu, X, LogOut, Shield, Wifi, WifiOff,
    ChevronLeft, ChevronRight
} from "lucide-react"
import { useAuth } from "@auth/AuthContext"
import supabase from "@database/supabaseClient"

const NAV_ITEMS = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/mentor-apps", label: "Mentor Apps", icon: GraduationCap },
    { to: "/admin/sessions", label: "Sessions", icon: CalendarDays },
    { to: "/admin/payouts", label: "Payouts", icon: DollarSign },
    { to: "/admin/reports", label: "Reports", icon: AlertTriangle },
    { to: "/admin/educators", label: "Educators", icon: BookOpen },
    { to: "/admin/colleges", label: "Colleges", icon: Building2 },
    { to: "/admin/exams", label: "Exams", icon: Clock },
    { to: "/admin/team", label: "Team", icon: ShieldCheck },
]

export default function AdminShell() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isConnected, setIsConnected] = useState(!!supabase)
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const visibleNav = NAV_ITEMS

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
            <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.04]">
                <img src="/takshak_logo.jpg" alt="TAKSHAK" className="w-8 h-8 rounded-xl object-cover shadow-lg shadow-indigo-500/20" />
                {sidebarOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                        <span className="text-sm font-black tracking-tight text-white">TAKSHAK</span>
                        <span className="text-[9px] text-indigo-400 font-bold ml-1.5 uppercase tracking-widest">Admin</span>
                    </motion.div>
                )}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-white/[0.04] transition text-slate-500 hidden lg:flex">
                    {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto scrollbar-thin">
                {visibleNav.map(item => {
                    const Icon = item.icon
                    return (
                        <NavLink
                            key={item.to} to={item.to} end={item.end}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative ${isActive
                                    ? "bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-300 shadow-sm shadow-indigo-500/5"
                                    : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div layoutId="admin-nav-active"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500"
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
            <div className="border-t border-white/[0.04] p-3">
                {sidebarOpen ? (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold ring-1 ring-indigo-500/20">
                            {(user?.email || "A")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-white truncate">{user?.email || "admin"}</p>
                            <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.15em]">Super Admin</p>
                        </div>
                        <button onClick={handleSignOut} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition">
                            <LogOut size={14} />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleSignOut} className="w-full p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition flex justify-center">
                        <LogOut size={16} />
                    </button>
                )}
            </div>
        </>
    )

    return (
        <div className="flex min-h-screen bg-[#07080f] text-slate-200">
            {/* Desktop Sidebar */}
            <aside className={`${sidebarOpen ? "w-60" : "w-[68px]"} transition-all duration-300 hidden lg:flex flex-col border-r border-white/[0.04] bg-[#0a0b14]/80 backdrop-blur-2xl shrink-0 sticky top-0 h-screen`}>
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 w-60 z-50 flex flex-col border-r border-white/[0.04] bg-[#0a0b14] lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto min-h-screen">
                {/* Topbar */}
                <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 lg:px-6 border-b border-white/[0.04] bg-[#07080f]/80 backdrop-blur-2xl">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-white/[0.04] text-slate-500 lg:hidden">
                            <Menu size={18} />
                        </button>
                        <button onClick={() => navigate("/")} className="text-[11px] text-slate-600 hover:text-indigo-400 transition flex items-center gap-1 font-medium">
                            ← Back to App
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Connection Status */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${isConnected
                                ? "bg-emerald-500/8 text-emerald-400 border-emerald-500/15"
                                : "bg-amber-500/8 text-amber-400 border-amber-500/15"
                            }`}>
                            <span className="relative flex h-1.5 w-1.5">
                                {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isConnected ? "bg-emerald-400" : "bg-amber-400"}`} />
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

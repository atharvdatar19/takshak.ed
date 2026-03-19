import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard, Users, GraduationCap, CalendarDays,
    DollarSign, AlertTriangle, BookOpen, Building2, Clock,
    Layers, ShieldCheck, Menu, X, LogOut, ChevronRight, Shield
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const NAV_ITEMS = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "moderator", "content_editor", "finance_viewer"], end: true },
    { to: "/admin/users", label: "Users", icon: Users, roles: ["admin", "moderator"] },
    { to: "/admin/mentor-apps", label: "Mentor Apps", icon: GraduationCap, roles: ["admin", "moderator"] },
    { to: "/admin/sessions", label: "Sessions", icon: CalendarDays, roles: ["admin", "finance_viewer"] },
    { to: "/admin/payouts", label: "Payouts", icon: DollarSign, roles: ["admin", "finance_viewer"] },
    { to: "/admin/reports", label: "Reports", icon: AlertTriangle, roles: ["admin", "moderator"] },
    { to: "/admin/educators", label: "Educator CMS", icon: BookOpen, roles: ["admin", "content_editor"] },
    { to: "/admin/colleges", label: "College CMS", icon: Building2, roles: ["admin", "content_editor"] },
    { to: "/admin/exams", label: "Exam Timeline", icon: Clock, roles: ["admin", "content_editor"] },
    { to: "/admin/bridge-courses", label: "Bridge Courses", icon: Layers, roles: ["admin", "content_editor"] },
    { to: "/admin/team", label: "Team Access", icon: ShieldCheck, roles: ["admin"] },
]

export default function AdminShell() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    // In production, fetch from DB. Demo: assume admin
    const userRole = "admin"

    const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(userRole))

    const handleSignOut = async () => {
        await signOut?.()
        navigate("/")
    }

    return (
        <div className="flex min-h-screen bg-[#0a0b14] text-slate-200">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "w-60" : "w-16"} transition-all duration-300 flex flex-col border-r border-[#1f1f35] bg-[#111120] shrink-0`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 h-16 border-b border-[#1f1f35]">
                    <Shield size={22} className="text-indigo-500 shrink-0" />
                    {sidebarOpen && <span className="text-sm font-black tracking-tight text-white">Admin Panel</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto p-1.5 rounded-lg hover:bg-[#1f1f35] transition text-slate-400">
                        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                    {visibleNav.map(item => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                key={item.to} to={item.to} end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${isActive
                                        ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                                        : "text-slate-400 hover:bg-[#1a1a30] hover:text-slate-200"
                                    }`
                                }
                            >
                                <Icon size={16} className="shrink-0" />
                                {sidebarOpen && <span>{item.label}</span>}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* User Footer */}
                <div className="border-t border-[#1f1f35] p-3">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                                {(user?.email || "A")[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{user?.email || "admin@netrax.in"}</p>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{userRole}</p>
                            </div>
                            <button onClick={handleSignOut} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition">
                                <LogOut size={14} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleSignOut} className="w-full p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition flex justify-center">
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Topbar */}
                <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-[#1f1f35] bg-[#0a0b14]/90 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate("/")} className="text-xs text-slate-500 hover:text-indigo-400 transition flex items-center gap-1">
                            ← Back to App
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Live
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

import { NavLink } from "react-router-dom"
import { APP_CONFIG } from "../lib/config"
import ChatbotAssistant from "./chatbot/ChatbotAssistant"

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/", label: "College Directory" },
  { to: "/timeline", label: "Timeline" },
  { to: "/alerts", label: "Alerts" },
  { to: "/mentors", label: "Mentor Marketplace" },
  { to: "/admin", label: "Admin Control" },
]

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="hidden w-72 flex-col border-r border-slate-800 bg-slate-950 p-6 text-slate-100 md:flex">
        <h1 className="text-xl font-semibold">{APP_CONFIG.brandName}</h1>
        <p className="mt-1 text-xs text-slate-400">{APP_CONFIG.productTagline}</p>

        <nav className="mt-10 space-y-2">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-5 md:p-8">{children}</main>
      <ChatbotAssistant />
    </div>
  )
}

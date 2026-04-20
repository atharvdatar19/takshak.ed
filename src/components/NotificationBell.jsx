import { Bell } from "lucide-react"

export default function NotificationBell({ unreadCount = 0 }) {
  return (
    <div className="relative inline-flex rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <Bell size={18} className="text-slate-700" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  )
}

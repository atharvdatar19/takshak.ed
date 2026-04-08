import { Bell } from "lucide-react"

export default function NotificationBell({ unreadCount = 0 }) {
  return (
    <div className="relative inline-flex rounded-xl border border-outline-variant/20 glass p-2 shadow-sm">
      <Bell size={18} className="text-on-surface" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-error/100 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  )
}

import { useState } from "react"
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  Settings,
  Users,
} from "lucide-react"
import PageHeader from "@components/PageHeader"
import AdminDashboard from "./AdminDashboard"
import CollegeManager from "./CollegeManager"
import ExamManager from "./ExamManager"
import MentorManager from "./MentorManager"
import BookingManager from "./BookingManager"
import UserManager from "./UserManager"
import NotificationBroadcaster from "./NotificationBroadcaster"
import ContentManager from "./ContentManager"
import SiteSettings from "./SiteSettings"

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "content", label: "Content", icon: FileText },
  { key: "colleges", label: "Colleges", icon: Building2 },
  { key: "exams", label: "Exams", icon: CalendarDays },
  { key: "mentors", label: "Mentors", icon: GraduationCap },
  { key: "bookings", label: "Bookings", icon: BookOpen },
  { key: "users", label: "Users", icon: Users },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings },
]

const TAB_COMPONENTS = {
  dashboard: AdminDashboard,
  content: ContentManager,
  colleges: CollegeManager,
  exams: ExamManager,
  mentors: MentorManager,
  bookings: BookingManager,
  users: UserManager,
  notifications: NotificationBroadcaster,
  settings: SiteSettings,
}

export default function AdminControl() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const ActiveComponent = TAB_COMPONENTS[activeTab]

  return (
    <div>
      <PageHeader
        title="Admin Control Center"
        description="Manage content, mentors, colleges, exams, bookings, users, and site settings from one place."
      />

      {/* ── Tab Navigation ── */}
      <nav className="mb-6 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* ── Active Tab Content ── */}
      <ActiveComponent />
    </div>
  )
}

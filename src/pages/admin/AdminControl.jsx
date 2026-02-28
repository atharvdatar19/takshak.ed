import { useState } from "react"
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  Users,
} from "lucide-react"
import PageHeader from "../../components/PageHeader"
import AdminDashboard from "./AdminDashboard"
import CollegeManager from "./CollegeManager"
import ExamManager from "./ExamManager"
import MentorManager from "./MentorManager"
import BookingManager from "./BookingManager"
import UserManager from "./UserManager"
import NotificationBroadcaster from "./NotificationBroadcaster"

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "colleges", label: "Colleges", icon: Building2 },
  { key: "exams", label: "Exams", icon: CalendarDays },
  { key: "mentors", label: "Mentors", icon: GraduationCap },
  { key: "bookings", label: "Bookings", icon: BookOpen },
  { key: "users", label: "Users", icon: Users },
  { key: "notifications", label: "Notifications", icon: Bell },
]

const TAB_COMPONENTS = {
  dashboard: AdminDashboard,
  colleges: CollegeManager,
  exams: ExamManager,
  mentors: MentorManager,
  bookings: BookingManager,
  users: UserManager,
  notifications: NotificationBroadcaster,
}

export default function AdminControl() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const ActiveComponent = TAB_COMPONENTS[activeTab]

  return (
    <div>
      <PageHeader
        title="Admin Control Center"
        description="Manage colleges, exams, mentors, bookings, users, and notifications from one place."
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

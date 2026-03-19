import { Component, Suspense, lazy } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./components/Toast"
import SplashScreen from "./components/SplashScreen"
import AppLayout from "./components/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"

// ── Lazy-loaded pages (code-splitting for smaller initial bundle) ──
const Alerts = lazy(() => import("./pages/Alerts"))
const ApplicationTracker = lazy(() => import("./pages/ApplicationTracker"))
const AuthPage = lazy(() => import("./pages/AuthPage"))
const CollegeCompare = lazy(() => import("./pages/CollegeCompare"))
const CollegeDirectory = lazy(() => import("./pages/CollegeDirectory"))
const CutoffPredictor = lazy(() => import("./pages/CutoffPredictor"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const DocumentChecklist = lazy(() => import("./pages/DocumentChecklist"))
const DoubtForum = lazy(() => import("./pages/DoubtForum"))
const MeetingScheduler = lazy(() => import("./pages/MeetingScheduler"))
const Mentors = lazy(() => import("./pages/Mentors"))
const MentorDetail = lazy(() => import("./pages/MentorDetail"))
const MentorDashboard = lazy(() => import("./pages/MentorDashboard"))
const ResourceHub = lazy(() => import("./pages/ResourceHub"))
const ScholarshipFinder = lazy(() => import("./pages/ScholarshipFinder"))
const StressCheckin = lazy(() => import("./pages/StressCheckin"))
const StudyPlanner = lazy(() => import("./pages/StudyPlanner"))
const Timeline = lazy(() => import("./pages/Timeline"))
const RankReality = lazy(() => import("./pages/RankReality"))
const PlanBAnalyzer = lazy(() => import("./pages/PlanBAnalyzer"))
const PreFreshers = lazy(() => import("./pages/PreFreshers"))
const Marketplace = lazy(() => import("./pages/Marketplace"))
const BridgeCourses = lazy(() => import("./pages/BridgeCourses"))
const SkillMatcher = lazy(() => import("./pages/SkillMatcher"))
const DefenceAspirants = lazy(() => import("./pages/DefenceAspirants"))
const AdminControl = lazy(() => import("./pages/admin/AdminControl"))

// ── New Admin Panel ──
const AdminShell = lazy(() => import("./admin/AdminShell"))
const AdminGuard = lazy(() => import("./admin/AdminGuard"))
const NewAdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"))
const AdminMentorApps = lazy(() => import("./admin/pages/AdminMentorApps"))
const AdminSessions = lazy(() => import("./admin/pages/AdminSessions"))
const AdminPayouts = lazy(() => import("./admin/pages/AdminPayouts"))
const AdminReports = lazy(() => import("./admin/pages/AdminReports"))
const AdminEducators = lazy(() => import("./admin/pages/AdminEducators"))
const AdminColleges = lazy(() => import("./admin/pages/AdminColleges"))
const AdminExams = lazy(() => import("./admin/pages/AdminExams"))
const AdminUsers = lazy(() => import("./admin/pages/AdminUsers"))
const AdminTeamAccess = lazy(() => import("./admin/pages/AdminTeamAccess"))

/* ── Loading fallback ── */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-400 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

/* ── Global Error Boundary ── */
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(err, info) {
    console.error("[NetraX] Page Error:", err, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] p-8">
          <div className="max-w-md text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Something went wrong</h2>
            <p className="text-sm text-slate-500">An unexpected error occurred. Please try refreshing the page.</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SplashScreen>
          <BrowserRouter>
            <AppErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ── Auth Pages (no layout) ── */}
                  <Route path="/login" element={<AuthPage defaultTab="login" />} />
                  <Route path="/signup" element={<AuthPage defaultTab="signup" />} />

                  {/* ── App Pages (with layout) ── */}
                  <Route element={<AppLayout />}>
                    {/* Dashboard IS home */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Navigate to="/" replace />} />

                    {/* Public routes */}
                    <Route path="/colleges" element={<CollegeDirectory />} />
                    <Route path="/cutoff" element={<CutoffPredictor />} />
                    <Route path="/resources" element={<ResourceHub />} />
                    <Route path="/rank-reality" element={<RankReality />} />
                    <Route path="/plan-b" element={<PlanBAnalyzer />} />
                    <Route path="/scholarships" element={<ScholarshipFinder />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/defence" element={<DefenceAspirants />} />
                    <Route path="/mentors" element={<Mentors />} />
                    <Route path="/mentors/:id" element={<MentorDetail />} />

                    {/* Student+ routes (require login) */}
                    <Route path="/planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
                    <Route path="/forum" element={<ProtectedRoute><DoubtForum /></ProtectedRoute>} />
                    <Route path="/wellness" element={<ProtectedRoute><StressCheckin /></ProtectedRoute>} />
                    <Route path="/applications" element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute><DocumentChecklist /></ProtectedRoute>} />
                    <Route path="/compare" element={<ProtectedRoute><CollegeCompare /></ProtectedRoute>} />
                    <Route path="/sessions" element={<ProtectedRoute><MeetingScheduler /></ProtectedRoute>} />
                    <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                    <Route path="/pre-freshers" element={<ProtectedRoute><PreFreshers /></ProtectedRoute>} />
                    <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                    <Route path="/bridge" element={<ProtectedRoute><BridgeCourses /></ProtectedRoute>} />
                    <Route path="/skill-matcher" element={<ProtectedRoute><SkillMatcher /></ProtectedRoute>} />
                    <Route path="/mentor/dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />

                    {/* Old Admin (legacy) */}
                    <Route path="/admin-legacy" element={<ProtectedRoute roles={["admin"]}><AdminControl /></ProtectedRoute>} />
                  </Route>

                  {/* ── New Admin Panel (separate layout) ── */}
                  <Route path="/admin" element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminGuard>
                        <AdminShell />
                      </AdminGuard>
                    </Suspense>
                  }>
                    <Route index element={<NewAdminDashboard />} />
                    <Route path="mentor-apps" element={<AdminMentorApps />} />
                    <Route path="sessions" element={<AdminSessions />} />
                    <Route path="payouts" element={<AdminPayouts />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="educators" element={<AdminEducators />} />
                    <Route path="colleges" element={<AdminColleges />} />
                    <Route path="exams" element={<AdminExams />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="team" element={<AdminTeamAccess />} />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </AppErrorBoundary>
          </BrowserRouter>
        </SplashScreen>
      </ToastProvider>
    </AuthProvider>
  )
}

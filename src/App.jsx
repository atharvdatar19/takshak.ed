import { Component, Suspense, lazy, useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Lenis from "lenis"
import { AuthProvider } from "@auth/AuthContext"
import { ToastProvider } from "@components/Toast"
import SplashScreen from "@components/SplashScreen"
import AppLayout from "@components/AppLayout"
import ProtectedRoute from "@components/ProtectedRoute"
import CookieBanner from "@components/CookieBanner"

// ── Landing & Legal ───────────────────────────────────────────
const LandingPage   = lazy(() => import("@pages/LandingPage"))
const EventsPage    = lazy(() => import("@pages/EventsPage"))
const BecomeMentor  = lazy(() => import("@pages/BecomeMentor"))
const PrivacyPolicy = lazy(() => import("@pages/PrivacyPolicy"))
const TermsOfService= lazy(() => import("@pages/TermsOfService"))
const CookiePolicy  = lazy(() => import("@pages/CookiePolicy"))
const NotFound      = lazy(() => import("@pages/NotFound"))

// ── Auth ──────────────────────────────────────────────────────
const AuthPage = lazy(() => import("@auth/AuthPage"))

// ── Tools / Dashboard ─────────────────────────────────────────
const Dashboard = lazy(() => import("@features/tools/Dashboard"))
const DiscoverHub = lazy(() => import("@features/tools/DiscoverHub"))
const PrepareHub = lazy(() => import("@features/tools/PrepareHub"))
const RankReality = lazy(() => import("@features/tools/RankReality"))
const PlanBAnalyzer = lazy(() => import("@features/tools/PlanBAnalyzer"))
const ApplicationTracker = lazy(() => import("@features/tools/ApplicationTracker"))
const Marketplace = lazy(() => import("@features/tools/Marketplace"))

// ── Colleges ──────────────────────────────────────────────────
const CollegeDirectory = lazy(() => import("@features/colleges/CollegeDirectory"))
const CollegeCompare = lazy(() => import("@features/colleges/CollegeCompare"))
const CutoffPredictor = lazy(() => import("@features/colleges/CutoffPredictor"))

// ── Mentors ───────────────────────────────────────────────────
const Mentors = lazy(() => import("@features/mentors/Mentors"))
const MentorDetail = lazy(() => import("@features/mentors/MentorDetail"))
const MentorDashboard = lazy(() => import("@features/mentors/MentorDashboard"))
const MentorMarketplace = lazy(() => import("@features/mentors/MentorMarketplace"))
const MeetingScheduler = lazy(() => import("@features/mentors/MeetingScheduler"))

// ── Resources ─────────────────────────────────────────────────
const ResourceHub = lazy(() => import("@features/resources/ResourceHub"))
const StudyPlanner = lazy(() => import("@features/resources/StudyPlanner"))
const Timeline = lazy(() => import("@features/resources/Timeline"))
const BridgeCourses = lazy(() => import("@features/resources/BridgeCourses"))
const DocumentChecklist = lazy(() => import("@features/resources/DocumentChecklist"))
const ScholarshipFinder = lazy(() => import("@features/resources/ScholarshipFinder"))
const Alerts = lazy(() => import("@features/resources/Alerts"))

// ── Community ─────────────────────────────────────────────────
const CommunityHub = lazy(() => import("@features/community/CommunityHub"))
const DoubtForum = lazy(() => import("@features/community/DoubtForum"))
const StressCheckin = lazy(() => import("@features/community/StressCheckin"))
const PreFreshers = lazy(() => import("@features/community/PreFreshers"))
const SkillMatcher = lazy(() => import("@features/community/SkillMatcher"))
const DefenceAspirants = lazy(() => import("@features/community/DefenceAspirants"))

// ── Admin ─────────────────────────────────────────────────────
const AdminControl = lazy(() => import("@features/admin/pages/AdminControl"))
const AdminShell = lazy(() => import("@features/admin/AdminShell"))
const AdminGuard = lazy(() => import("@features/admin/AdminGuard"))
const NewAdminDashboard = lazy(() => import("@features/admin/pages/AdminDashboard"))
const AdminMentorApps = lazy(() => import("@features/admin/pages/AdminMentorApps"))
const AdminSessions = lazy(() => import("@features/admin/pages/AdminSessions"))
const AdminPayouts = lazy(() => import("@features/admin/pages/AdminPayouts"))
const AdminReports = lazy(() => import("@features/admin/pages/AdminReports"))
const AdminEducators = lazy(() => import("@features/admin/pages/AdminEducators"))
const AdminColleges = lazy(() => import("@features/admin/pages/AdminColleges"))
const AdminExams = lazy(() => import("@features/admin/pages/AdminExams"))
const AdminUsers = lazy(() => import("@features/admin/pages/AdminUsers"))
const AdminTeamAccess = lazy(() => import("@features/admin/pages/AdminTeamAccess"))

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
    console.error("[TAKक्षक] Page Error:", err, info)
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

function useSmoothScroll() {
  useEffect(() => {
    // Only on desktop — skip touch/mobile devices
    if (!window.matchMedia("(pointer: fine)").matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])
}

export default function App() {
  useSmoothScroll()
  return (
    <AuthProvider>
      <ToastProvider>
        <SplashScreen>
          <BrowserRouter>
            <AppErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ── Landing (no layout) ── */}
                  <Route path="/" element={<LandingPage />} />

                  {/* ── Auth Pages (no layout) ── */}
                  <Route path="/login" element={<AuthPage defaultTab="login" />} />
                  <Route path="/signup" element={<AuthPage defaultTab="signup" />} />

                  {/* ── App Pages (with layout) ── */}
                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Hub pages */}
                    <Route path="/discover" element={<DiscoverHub />} />
                    <Route path="/prepare" element={<PrepareHub />} />
                    <Route path="/community" element={<CommunityHub />} />

                    {/* Public */}
                    <Route path="/colleges" element={<CollegeDirectory />} />
                    <Route path="/cutoff" element={<CutoffPredictor />} />
                    <Route path="/resources" element={<ResourceHub />} />
                    <Route path="/rank-reality" element={<RankReality />} />
                    <Route path="/plan-b" element={<PlanBAnalyzer />} />
                    <Route path="/scholarships" element={<ScholarshipFinder />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/defence" element={<DefenceAspirants />} />
                    <Route path="/mentors" element={<Mentors />} />
                    <Route path="/become-mentor" element={<ProtectedRoute><BecomeMentor /></ProtectedRoute>} />
                    <Route path="/mentors/:id" element={<MentorDetail />} />
                    <Route path="/events" element={<EventsPage />} />

                    {/* Authenticated */}
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
                    <Route path="/mentor-marketplace" element={<ProtectedRoute><MentorMarketplace /></ProtectedRoute>} />

                    {/* Admin legacy */}
                    <Route path="/admin-legacy" element={<ProtectedRoute roles={["admin"]}><AdminControl /></ProtectedRoute>} />
                  </Route>

                  {/* ── Admin Panel ── */}
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

                  {/* ── Legal Pages (no layout) ── */}
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms"   element={<TermsOfService />} />
                  <Route path="/cookies" element={<CookiePolicy />} />

                  {/* ── 404 ── */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AppErrorBoundary>
            <CookieBanner />
          </BrowserRouter>
        </SplashScreen>
      </ToastProvider>
    </AuthProvider>
  )
}

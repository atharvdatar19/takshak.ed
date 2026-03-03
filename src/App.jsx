import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./components/Toast"
import SplashScreen from "./components/SplashScreen"
import AppLayout from "./components/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"

// Pages
import Alerts from "./pages/Alerts"
import ApplicationTracker from "./pages/ApplicationTracker"
import AuthPage from "./pages/AuthPage"
import CollegeCompare from "./pages/CollegeCompare"
import CollegeDirectory from "./pages/CollegeDirectory"
import CutoffPredictor from "./pages/CutoffPredictor"
import Dashboard from "./pages/Dashboard"
import DocumentChecklist from "./pages/DocumentChecklist"
import DoubtForum from "./pages/DoubtForum"
import MeetingScheduler from "./pages/MeetingScheduler"
import MentorMarketplace from "./pages/MentorMarketplace"
import ScholarshipFinder from "./pages/ScholarshipFinder"
import StressCheckin from "./pages/StressCheckin"
import StudyPlanner from "./pages/StudyPlanner"
import Timeline from "./pages/Timeline"
import RankReality from "./pages/RankReality"
import PlanBAnalyzer from "./pages/PlanBAnalyzer"
import PreFreshers from "./pages/PreFreshers"
import Marketplace from "./pages/Marketplace"
import BridgeCourses from "./pages/BridgeCourses"
import AdminControl from "./pages/admin/AdminControl"

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SplashScreen>
          <BrowserRouter>
            <Routes>
              {/* ── Auth Pages (no layout) ── */}
              <Route path="/login" element={<AuthPage defaultTab="login" />} />
              <Route path="/signup" element={<AuthPage defaultTab="signup" />} />

              {/* ── App Pages (with layout) ── */}
              <Route element={<AppLayout />}>
                {/* Public routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/colleges" element={<CollegeDirectory />} />
                <Route path="/cutoff" element={<CutoffPredictor />} />
                <Route path="/rank-reality" element={<RankReality />} />
                <Route path="/plan-b" element={<PlanBAnalyzer />} />
                <Route path="/scholarships" element={<ScholarshipFinder />} />
                <Route path="/timeline" element={<Timeline />} />

                {/* Student+ routes (require login) */}
                <Route path="/planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
                <Route path="/forum" element={<ProtectedRoute><DoubtForum /></ProtectedRoute>} />
                <Route path="/wellness" element={<ProtectedRoute><StressCheckin /></ProtectedRoute>} />
                <Route path="/applications" element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute><DocumentChecklist /></ProtectedRoute>} />
                <Route path="/compare" element={<ProtectedRoute><CollegeCompare /></ProtectedRoute>} />
                <Route path="/sessions" element={<ProtectedRoute><MeetingScheduler /></ProtectedRoute>} />
                <Route path="/mentor-marketplace" element={<ProtectedRoute><MentorMarketplace /></ProtectedRoute>} />
                <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                <Route path="/pre-freshers" element={<ProtectedRoute><PreFreshers /></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                <Route path="/bridge" element={<ProtectedRoute><BridgeCourses /></ProtectedRoute>} />

                {/* Admin only */}
                <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminControl /></ProtectedRoute>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SplashScreen>
      </ToastProvider>
    </AuthProvider>
  )
}

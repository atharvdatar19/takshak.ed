import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./components/Toast"
import AppLayout from "./components/AppLayout"
import Alerts from "./pages/Alerts"
import ApplicationTracker from "./pages/ApplicationTracker"
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
import AdminControl from "./pages/admin/AdminControl"

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<CollegeDirectory />} />
              <Route path="/cutoff" element={<CutoffPredictor />} />
              <Route path="/applications" element={<ApplicationTracker />} />
              <Route path="/scholarships" element={<ScholarshipFinder />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/planner" element={<StudyPlanner />} />
              <Route path="/documents" element={<DocumentChecklist />} />
              <Route path="/compare" element={<CollegeCompare />} />
              <Route path="/forum" element={<DoubtForum />} />
              <Route path="/mentors" element={<MentorMarketplace />} />
              <Route path="/sessions" element={<MeetingScheduler />} />
              <Route path="/wellness" element={<StressCheckin />} />
              <Route path="/admin" element={<AdminControl />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

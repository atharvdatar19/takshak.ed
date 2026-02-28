import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./components/Toast"
import AppLayout from "./components/AppLayout"
import Alerts from "./pages/Alerts"
import CollegeDirectory from "./pages/CollegeDirectory"
import Dashboard from "./pages/Dashboard"
import Timeline from "./pages/Timeline"
import AdminControl from "./pages/admin/AdminControl"
import MentorMarketplace from "./pages/MentorMarketplace"

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<CollegeDirectory />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/admin" element={<AdminControl />} />
              <Route path="/mentors" element={<MentorMarketplace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

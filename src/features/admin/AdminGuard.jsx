import { Navigate } from "react-router-dom"
import { useAuth } from "@auth/AuthContext"

export const ADMIN_EMAILS = [
  "atharvd10166@gmail.com",
  "punyatirthasahoo@gmail.com",
  "takshak.info@gmail.com",
]

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#07080f]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!ADMIN_EMAILS.includes(user.email)) return <Navigate to="/" replace />

  return children
}

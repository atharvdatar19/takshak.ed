import { Navigate } from "react-router-dom"
import { useAuth } from "@auth/AuthContext"

const ADMIN_ROLES = ["admin", "moderator", "content_editor", "finance_viewer"]

export default function AdminGuard({ children, requiredRoles = ADMIN_ROLES }) {
    const { user, role, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0b14]">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) return <Navigate to="/login" replace />
    if (!requiredRoles.includes(role)) return <Navigate to="/" replace />

    return children
}

export { ADMIN_ROLES }

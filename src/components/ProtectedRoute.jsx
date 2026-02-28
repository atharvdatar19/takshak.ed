import { useAuth } from "../contexts/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

/**
 * ProtectedRoute — wraps pages that require authentication.
 * Redirects to /login if not authenticated.
 * Optionally checks for specific roles.
 */
export default function ProtectedRoute({ children, roles = [] }) {
    const { user, profile, loading } = useAuth()
    const location = useLocation()

    // Still loading auth state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            </div>
        )
    }

    // Not logged in → redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    // Check role if specified
    if (roles.length > 0) {
        const userRole = profile?.role || "student"
        // Admin can access everything
        if (userRole !== "admin" && !roles.includes(userRole)) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
                    <p className="text-slate-500 max-w-md">
                        This page requires {roles.join(" or ")} access.
                        Please contact support if you believe this is an error.
                    </p>
                </div>
            )
        }
    }

    return children
}

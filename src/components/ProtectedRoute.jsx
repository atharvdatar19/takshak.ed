import { useAuth } from "../contexts/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

/**
 * ProtectedRoute — wraps pages that require authentication.
 * Redirects to /login if not authenticated.
 * Optionally checks for specific roles.
 */
export default function ProtectedRoute({ children, roles = [] }) {
    const { user, role, loading } = useAuth()
    const location = useLocation()

    // Still loading auth state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-indigo-600" />
            </div>
        )
    }

    // Not logged in → show inline restriction instead of forced redirect
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-on-surface mb-2">Sign-In Required</h2>
                <p className="text-on-surface-variant max-w-md">
                    Please log in or sign up to access this feature.
                </p>
            </div>
        )
    }

    // Check role if specified — use the unified `role` from AuthContext (includes isAdmin override)
    if (roles.length > 0) {
        // Admin can access everything
        if (role !== "admin" && !roles.includes(role)) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Access Restricted</h2>
                    <p className="text-on-surface-variant max-w-md">
                        This page requires {roles.join(" or ")} access.
                        Please contact support if you believe this is an error.
                    </p>
                </div>
            )
        }
    }

    return children
}

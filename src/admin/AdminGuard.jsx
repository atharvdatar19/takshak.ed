import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { supabase, isDemoMode } from "../supabaseClient"

const ADMIN_ROLES = ["admin", "moderator", "content_editor", "finance_viewer"]

export default function AdminGuard({ children, requiredRoles = ADMIN_ROLES }) {
    const { user } = useAuth()
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) { setLoading(false); return }

        if (isDemoMode || !supabase) {
            // In demo mode, treat every logged-in user as admin
            setRole("admin")
            setLoading(false)
            return
        }

        supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
                setRole(data?.role || "student")
                setLoading(false)
            })
            .catch(() => { setRole("student"); setLoading(false) })
    }, [user])

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

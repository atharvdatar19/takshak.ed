import { createContext, useContext, useEffect, useMemo, useState } from "react"
import supabase from "../supabaseClient"
import { signOut as authSignOut } from "../services/auth"

const ADMIN_EMAILS = ["mentorbhaiyaaa.notifications@gmail.com"]

const AuthContext = createContext({
    user: null,
    profile: null,
    isAdmin: false,
    isMentor: false,
    role: "guest",
    loading: true,
    signOut: () => { },
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!supabase) {
            setLoading(false)
            return
        }

        async function loadProfile(authUser) {
            if (!authUser) {
                setUser(null)
                setProfile(null)
                setLoading(false)
                return
            }

            setUser(authUser)

            const { data } = await supabase
                .from("users")
                .select("*")
                .eq("id", authUser.id)
                .single()

            setProfile(data || null)
            setLoading(false)
        }

        supabase.auth.getUser().then(({ data }) => loadProfile(data?.user || null))

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            loadProfile(session?.user || null)
        })

        return () => listener?.subscription?.unsubscribe()
    }, [])

    const isAdmin = useMemo(
        () => Boolean(user?.email && ADMIN_EMAILS.includes(user.email)),
        [user],
    )

    const role = useMemo(() => {
        if (isAdmin) return "admin"
        return profile?.role || "student"
    }, [profile, isAdmin])

    const isMentor = useMemo(() => role === "mentor" || role === "admin", [role])

    async function handleSignOut() {
        await authSignOut()
        setUser(null)
        setProfile(null)
    }

    const value = useMemo(
        () => ({ user, profile, isAdmin, isMentor, role, loading, signOut: handleSignOut }),
        [user, profile, isAdmin, isMentor, role, loading],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}

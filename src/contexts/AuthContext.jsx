import { createContext, useContext, useEffect, useMemo, useState } from "react"
import supabase from "../supabaseClient"

const ADMIN_EMAILS = ["mentorbhaiyaaa.notifications@gmail.com"]

const AuthContext = createContext({
    user: null,
    profile: null,
    isAdmin: false,
    loading: true,
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

    const value = useMemo(
        () => ({ user, profile, isAdmin, loading }),
        [user, profile, isAdmin, loading],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}

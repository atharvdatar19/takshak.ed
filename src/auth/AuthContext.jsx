import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db, isFirebaseConfigured } from "@auth/firebase"
import { ADMIN_EMAILS } from "@/config/admins"

const AuthContext = createContext({
    user: null,
    profile: null,
    isAdmin: false,
    isMentor: false,
    role: "guest",
    loading: true,
    signOut: () => {},
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Demo mode — no Firebase configured
        if (!isFirebaseConfigured) {
            const loadDemoUser = () => {
                const stored = localStorage.getItem("demo_user")
                if (stored) {
                    try {
                        const u = JSON.parse(stored)
                        setUser(u)
                        setProfile({ role: u.role || "student", full_name: u.full_name || u.displayName })
                    } catch {
                        setUser(null)
                        setProfile(null)
                    }
                } else {
                    setUser(null)
                    setProfile(null)
                }
                setLoading(false)
            }
            loadDemoUser()
            window.addEventListener("demo-auth-change", loadDemoUser)
            return () => window.removeEventListener("demo-auth-change", loadDemoUser)
        }

        // Firebase auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null)
                setProfile(null)
                setLoading(false)
                return
            }

            setUser(firebaseUser)

            try {
                // Load profile from Firestore
                const snap = await getDoc(doc(db, "users", firebaseUser.uid))
                setProfile(snap.exists() ? snap.data() : null)
            } catch (err) {
                console.error("Profile load error:", err)
                setProfile(null)
            } finally {
                setLoading(false)
            }
        })

        return () => unsubscribe()
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
        const { signOut } = await import("./auth")
        await signOut()
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

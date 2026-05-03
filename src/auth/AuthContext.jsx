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
            console.log("4. onAuthStateChanged fired, user:", firebaseUser?.email)
            if (!firebaseUser) {
                setUser(null)
                setProfile(null)
                setLoading(false)
                return
            }

            setUser(firebaseUser)
            setLoading(false) // ← ALWAYS called here, unconditionally

            try {
                // profile fetch — failure here is non-fatal
                const snap = await getDoc(doc(db, "users", firebaseUser.uid))
                setProfile(snap.exists() ? snap.data() : null)
            } catch (err) {
                console.warn("Profile fetch failed, continuing without it:", err.message)
                setProfile(null)
            }
        })

        return () => unsubscribe()
    }, [])

    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (user) {
            user.getIdTokenResult().then((token) => {
                // Check Firebase Custom Claims first, fallback to hardcoded emails if claims aren't deployed yet
                setIsAdmin(!!token.claims.admin || ADMIN_EMAILS.includes(user.email))
            })
        } else {
            setIsAdmin(false)
        }
    }, [user])

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

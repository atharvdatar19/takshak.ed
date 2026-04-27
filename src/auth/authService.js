import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    setPersistence,
    browserLocalPersistence
} from "firebase/auth"
import { auth, isFirebaseConfigured, db } from "@auth/firebase"
import { setDoc, doc, getDoc } from "firebase/firestore"

/**
 * Firebase Auth Service — wraps Firebase methods with Demo Mode fallback.
 */

function mockAuthSuccess(email, fullName = "User", role = "student") {
    const mockUser = { 
        id: `demo-${Date.now()}`, 
        email, 
        displayName: fullName, 
        role 
    }
    localStorage.setItem("demo_user", JSON.stringify(mockUser))
    window.dispatchEvent(new Event("demo-auth-change"))
    return { data: { user: mockUser }, error: null }
}

export async function signUpWithEmail({ email, password, fullName, stream, state, role = "student" }) {
    if (!isFirebaseConfigured) {
        await new Promise(r => setTimeout(r, 1000))
        return mockAuthSuccess(email, fullName, role)
    }

    try {
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Set display name
        await updateProfile(user, { displayName: fullName })

        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email,
            displayName: fullName,
            role,
            stream: stream || null,
            state: state || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        return { 
            data: { user: { ...user, displayName: fullName, role } }, 
            error: null 
        }
    } catch (error) {
        const errorMessage = mapFirebaseError(error)
        return { data: null, error: { message: errorMessage } }
    }
}

export async function signInWithEmail(email, password) {
    if (!isFirebaseConfigured) {
        await new Promise(r => setTimeout(r, 1000))
        return mockAuthSuccess(email)
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const profile = userDoc.data() || {}

        return { 
            data: { user: { ...user, role: profile.role || "student" } }, 
            error: null 
        }
    } catch (error) {
        const errorMessage = mapFirebaseError(error)
        return { data: null, error: { message: errorMessage } }
    }
}

export async function signInWithGoogle() {
    if (!isFirebaseConfigured) {
        await new Promise(r => setTimeout(r, 1000))
        return mockAuthSuccess("google_demo@example.com", "Google Demo User")
    }

    try {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: "select_account" })
        
        const userCredential = await signInWithPopup(auth, provider)
        const user = userCredential.user

        // Check if user profile exists, create if not
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                email: user.email,
                displayName: user.displayName || "User",
                role: "student",
                photoURL: user.photoURL || null,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }

        const profile = userDoc.data() || { role: "student" }

        return { 
            data: { user: { ...user, role: profile.role || "student" } }, 
            error: null 
        }
    } catch (error) {
        const errorMessage = mapFirebaseError(error)
        return { data: null, error: { message: errorMessage } }
    }
}

export async function signOut() {
    if (!isFirebaseConfigured) {
        localStorage.removeItem("demo_user")
        window.dispatchEvent(new Event("demo-auth-change"))
        return
    }

    try {
        await firebaseSignOut(auth)
    } catch (error) {
        console.error("[TAKSHAK] Sign out error:", error)
    }
}

export async function resetPassword(email) {
    if (!isFirebaseConfigured) {
        await new Promise(r => setTimeout(r, 1000))
        return { data: "success", error: null }
    }

    try {
        await sendPasswordResetEmail(auth, email, {
            url: `${window.location.origin}/login`,
        })
        return { data: "success", error: null }
    } catch (error) {
        const errorMessage = mapFirebaseError(error)
        return { data: null, error: { message: errorMessage } }
    }
}

// Phone OTP — Firebase requires RecaptchaVerifier; not yet wired up
export async function signInWithOtp(_phone) {
    return { data: null, error: { message: "Phone OTP is not supported yet." } }
}

export async function verifyOtp(_phone, _token) {
    return { data: null, error: { message: "Phone OTP is not supported yet." } }
}

// Helper function to map Firebase errors to user-friendly messages
function mapFirebaseError(error) {
    const errorCode = error.code || ""
    
    const errorMessages = {
        "auth/email-already-in-use": "Email already registered. Try logging in instead.",
        "auth/invalid-email": "Invalid email address.",
        "auth/weak-password": "Password should be at least 6 characters.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/too-many-requests": "Too many failed attempts. Please try again later.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/popup-closed-by-user": "Authentication cancelled.",
        "auth/network-request-failed": "Network error. Please check your connection.",
    }

    return errorMessages[errorCode] || error.message || "Authentication failed. Please try again."
}

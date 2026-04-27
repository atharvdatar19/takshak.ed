// Auth entry-point — delegates entirely to Firebase auth service
export {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    signInWithOtp,
    verifyOtp,
} from "./authService"

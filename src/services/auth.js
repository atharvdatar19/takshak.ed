import supabase, { isDemoMode } from "../supabaseClient"

/**
 * Auth service — wraps Supabase auth methods with Demo Mode fallback.
 */

function mockAuthSuccess(email, fullName = "User", role = "student") {
    const mockUser = { id: `demo-${Date.now()}`, email, full_name: fullName, role }
    localStorage.setItem("demo_user", JSON.stringify(mockUser))
    // Dispatch a custom event so context can catch it
    window.dispatchEvent(new Event("demo-auth-change"))
    return { data: { user: mockUser }, error: null }
}

export async function signUpWithEmail({ email, password, fullName, stream, state, role = "student" }) {
    if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1000)) // simulate network
        return mockAuthSuccess(email, fullName, role)
    }

    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: fullName, role } },
    })

    if (authError) return { data: null, error: authError }

    return { data: authData, error: null }
}

export async function signInWithEmail(email, password) {
    if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1000))
        return mockAuthSuccess(email)
    }
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
}

export async function signInWithGoogle() {
    if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1000))
        return mockAuthSuccess("google_demo@example.com", "Google Demo User")
    }
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google", options: { redirectTo: window.location.origin },
    })
    return { data, error }
}

export async function signOut() {
    if (isDemoMode) {
        localStorage.removeItem("demo_user")
        window.dispatchEvent(new Event("demo-auth-change"))
        return
    }
    if (!supabase) return
    await supabase.auth.signOut()
}

export async function resetPassword(email) {
    if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1000))
        return { data: "success", error: null }
    }
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
    })
    return { data, error }
}

export async function signInWithOtp(phone) {
    if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1000))
        return { data: "success", error: null }
    }
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }
    // Clean phone number (assume +91 is added by UI or handle it explicitly here)
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`
    const { data, error } = await supabase.auth.signInWithOtp({ phone: formattedPhone })
    return { data, error }
}

export async function verifyOtp(phone, token) {
    if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1000))
        return mockAuthSuccess(phone + "@demo.com", "Demo User")
    }
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`
    const { data, error } = await supabase.auth.verifyOtp({ phone: formattedPhone, token, type: 'sms' })
    return { data, error }
}

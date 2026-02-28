import supabase from "../supabaseClient"

/**
 * Auth service — wraps Supabase auth methods.
 * All functions return { data, error } pattern.
 */

export async function signUpWithEmail({ email, password, fullName, stream, state, role = "student" }) {
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName, role },
        },
    })

    if (authError) return { data: null, error: authError }

    // 2. Insert into users table
    if (authData?.user) {
        const { error: profileError } = await supabase.from("users").upsert({
            id: authData.user.id,
            email,
            full_name: fullName,
            stream: stream || null,
            state: state || null,
            role,
            is_premium: false,
        }, { onConflict: "id" })

        if (profileError) console.warn("Profile insert error:", profileError.message)
    }

    return { data: authData, error: null }
}

export async function signInWithEmail(email, password) {
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
}

export async function signInWithGoogle() {
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin,
        },
    })
    return { data, error }
}

export async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
}

export async function resetPassword(email) {
    if (!supabase) return { data: null, error: { message: "Supabase not configured" } }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
    })
    return { data, error }
}

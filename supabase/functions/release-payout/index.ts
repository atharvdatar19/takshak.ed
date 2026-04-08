// ═══════════════════════════════════════════════
// Edge Function: release-payout
// Deploy to: Supabase Edge Functions
// Trigger: Admin clicks "Release Payout" in admin panel
// ═══════════════════════════════════════════════
//
// INPUT: { session_id }
//
// LOGIC:
// 1. Verify caller has role = 'admin' in JWT
// 2. Fetch session + transaction
// 3. Calculate mentor amount: agreed_rate_inr * 0.80
// 4. Insert payout record into transactions with type='payout'
// 5. Write to admin_audit_log: action='release_payout', target_id=session_id
//
// Phase 4: Call Razorpay Linked Account payout API for automated payouts
// ═══════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    )

    try {
        // Verify admin
        const authHeader = req.headers.get("Authorization")
        const { data: { user } } = await supabase.auth.getUser(authHeader?.replace("Bearer ", ""))

        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single()

        if (profile?.role !== "admin") {
            return new Response(JSON.stringify({ error: "Admin only" }), { status: 403 })
        }

        const { session_id } = await req.json()

        // Fetch session
        const { data: session } = await supabase
            .from("sessions")
            .select("*, mentors(user_id)")
            .eq("id", session_id)
            .single()

        if (!session || session.status !== "completed") {
            return new Response(JSON.stringify({ error: "Session not eligible for payout" }), { status: 400 })
        }

        const mentorAmount = session.agreed_rate_inr * 0.80
        const platformFee = session.agreed_rate_inr * 0.20

        // Insert payout transaction
        await supabase.from("transactions").insert({
            type: "payout",
            payee_id: session.mentors?.user_id,
            session_id: session.id,
            amount_inr: mentorAmount,
            platform_fee_inr: platformFee,
            idempotency_key: `payout_${session.id}_${Date.now()}`,
            status: "captured",
            notes: "Manual payout by admin",
        })

        // Write audit log
        await supabase.from("admin_audit_log").insert({
            admin_id: user.id,
            action: "release_payout",
            target_table: "sessions",
            target_id: session.id,
            notes: `Released ₹${mentorAmount} to mentor`,
        })

        return new Response(JSON.stringify({ success: true, amount: mentorAmount }), { status: 200 })
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})

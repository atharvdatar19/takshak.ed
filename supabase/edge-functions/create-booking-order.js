// ═══════════════════════════════════════════════
// Edge Function: create-booking-order
// Deploy to: Supabase Edge Functions
// Trigger: POST from frontend when student clicks "Confirm Booking"
// ═══════════════════════════════════════════════
//
// INPUT: { slot_id, mentor_id, duration_minutes, topic }
//
// LOGIC:
// 1. Verify auth.uid() is authenticated
// 2. Fetch slot from mentor_availability — confirm is_booked=false AND is_locked=false
// 3. Soft-lock the slot: UPDATE mentor_availability SET is_locked=true, locked_at=now() WHERE id=slot_id
// 4. Fetch mentor's rate_30min_inr or rate_60min_inr based on duration — NEVER trust amount from client
// 5. Create Razorpay order via Razorpay API with amount_inr * 100 (paise)
// 6. Insert into sessions with status='pending_payment', agreed_rate_inr from DB
// 7. Return { razorpay_order_id, session_id, amount_inr } to frontend
//
// ENV VARS: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
// ═══════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL"),
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
        )

        // Get auth user from JWT
        const authHeader = req.headers.get("Authorization")
        const { data: { user }, error: authErr } = await supabase.auth.getUser(authHeader?.replace("Bearer ", ""))
        if (authErr || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

        const { slot_id, mentor_id, duration_minutes, topic } = await req.json()

        // 1. Check slot availability
        const { data: slot } = await supabase
            .from("mentor_availability")
            .select("*")
            .eq("id", slot_id)
            .single()

        if (!slot || slot.is_booked || slot.is_locked) {
            return new Response(JSON.stringify({ error: "Slot not available" }), { status: 409 })
        }

        // 2. Soft-lock the slot
        await supabase
            .from("mentor_availability")
            .update({ is_locked: true, locked_at: new Date().toISOString() })
            .eq("id", slot_id)

        // 3. Get mentor rate from DB (NEVER trust client amount)
        const { data: mentor } = await supabase
            .from("mentors")
            .select("rate_30min_inr, rate_60min_inr")
            .eq("id", mentor_id)
            .single()

        const rate = duration_minutes === 30 ? mentor.rate_30min_inr : mentor.rate_60min_inr

        // 4. Create Razorpay order
        const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(`${Deno.env.get("RAZORPAY_KEY_ID")}:${Deno.env.get("RAZORPAY_KEY_SECRET")}`)
            },
            body: JSON.stringify({
                amount: Math.round(rate * 100), // paise
                currency: "INR",
                receipt: `session_${Date.now()}`,
            })
        })
        const order = await razorpayRes.json()

        // 5. Insert session
        const { data: session } = await supabase
            .from("sessions")
            .insert({
                student_id: user.id,
                mentor_id,
                availability_slot_id: slot_id,
                duration_minutes,
                agreed_rate_inr: rate,
                topic,
                status: "pending_payment",
            })
            .select()
            .single()

        return new Response(JSON.stringify({
            razorpay_order_id: order.id,
            session_id: session.id,
            amount_inr: rate,
        }), { status: 200 })

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})

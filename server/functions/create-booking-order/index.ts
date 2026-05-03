// ═══════════════════════════════════════════════
// Edge Function: create-booking-order
// ═══════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Ratelimit } from "https://esm.sh/@upstash/ratelimit@0.4.0"
import { Redis } from "https://esm.sh/@upstash/redis@1.22.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://takshak.vercel.app',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting setup
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "1 h"),
});

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        )

        // FIX-13: Assert Service Fee
        const serviceFeePercentStr = Deno.env.get("SERVICE_FEE_PERCENT");
        if (!serviceFeePercentStr) {
            throw new Error("CRITICAL_CONFIG_MISSING: SERVICE_FEE_PERCENT must be defined in environment.");
        }
        const serviceFeeMultiplier = 1 + parseFloat(serviceFeePercentStr);

        // Get auth user from JWT
        const authHeader = req.headers.get("Authorization")
        const { data: { user }, error: authErr } = await supabase.auth.getUser(authHeader?.replace("Bearer ", ""))
        if (authErr || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders })

        // FIX-8: Rate Limiting
        const { success } = await ratelimit.limit(user.id);
        if (!success) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: corsHeaders });
        }

        const { slot_id, mentor_id, duration_minutes, topic } = await req.json()

        // 1. FIX-2: Atomic lock on the slot (no unsafe SELECT)
        // This ensures no race condition during the "check-then-set" phase.
        const { data: updatedSlot, error: lockErr } = await supabase
            .from("mentor_availability")
            .update({ is_locked: true, locked_at: new Date().toISOString() })
            .eq("id", slot_id)
            .eq("is_locked", false)
            .eq("is_booked", false)
            .select()
            .single();

        if (lockErr || !updatedSlot) {
            return new Response(JSON.stringify({ error: "Slot no longer available or already locked." }), { status: 409, headers: corsHeaders });
        }

        // 2. Get mentor rate from DB (NEVER trust client amount)
        const { data: mentor } = await supabase
            .from("mentors")
            .select("rate_30min_inr, rate_60min_inr")
            .eq("id", mentor_id)
            .single()

        const rate = duration_minutes === 30 ? mentor.rate_30min_inr : mentor.rate_60min_inr

        // 3. Create Razorpay order
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

        // 4. FIX-2: Insert session (Database unique constraint on availability_slot_id is the safety net)
        const { data: session, error: sessionErr } = await supabase
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

        if (sessionErr) {
            // Handle unique constraint violation (FIX-2)
            if (sessionErr.code === "23505") {
                return new Response(JSON.stringify({ error: "This slot is already being booked by another user." }), { status: 409, headers: corsHeaders });
            }
            throw sessionErr;
        }

        // 5. Insert pending transaction to link order_id with session_id
        await supabase
            .from("transactions")
            .insert({
                type: "session_payment",
                payer_id: user.id,
                payee_id: mentor_id,
                session_id: session.id,
                amount_inr: Math.round(rate * serviceFeeMultiplier), 
                razorpay_order_id: order.id,
                idempotency_key: `order_init_${order.id}`,
                status: "pending"
            })

        return new Response(JSON.stringify({
            razorpay_order_id: order.id,
            session_id: session.id,
            amount_inr: rate,
        }), { status: 200, headers: corsHeaders })

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
    }
})

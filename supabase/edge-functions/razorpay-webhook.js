// ═══════════════════════════════════════════════
// Edge Function: razorpay-webhook
// Deploy to: Supabase Edge Functions
// Trigger: Razorpay calls this after payment success/failure
// ═══════════════════════════════════════════════
//
// LOGIC:
// 1. Read X-Razorpay-Signature header
// 2. Verify HMAC-SHA256: hmac(webhook_secret, raw_body) === signature
// 3. Check idempotency_key in transactions table — if exists, return 200
// 4. On payment.captured:
//    - Update sessions → status='confirmed'
//    - Release slot lock: is_locked=false, is_booked=true
//    - Insert into transactions with idempotency_key = razorpay_payment_id
//    - Generate meet link: meet.jit.si/{session_id}
//    - Update sessions.meet_link
//    - Send confirmation email (Resend API)
// 5. On payment.failed:
//    - Update session status='cancelled'
//    - Release slot lock
//
// ENV VARS: RAZORPAY_WEBHOOK_SECRET, RESEND_API_KEY
// ═══════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts"

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    )

    try {
        const rawBody = await req.text()
        const signature = req.headers.get("X-Razorpay-Signature")
        const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")

        // 1. Verify signature
        const encoder = new TextEncoder()
        const key = await crypto.subtle.importKey(
            "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
        )
        const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody))
        const expectedSig = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("")

        if (expectedSig !== signature) {
            return new Response("Invalid signature", { status: 400 })
        }

        const event = JSON.parse(rawBody)
        const paymentEntity = event.payload?.payment?.entity

        if (!paymentEntity) return new Response("OK", { status: 200 })

        const orderId = paymentEntity.order_id
        const paymentId = paymentEntity.id
        const idempotencyKey = paymentId

        // 2. Check idempotency
        const { data: existing } = await supabase
            .from("transactions")
            .select("id")
            .eq("idempotency_key", idempotencyKey)
            .single()

        if (existing) return new Response("Already processed", { status: 200 })

        // 3. Find session by razorpay_order_id
        // (In practice, store order_id in session or a lookup table at creation time)

        if (event.event === "payment.captured") {
            // Update session to confirmed
            // Insert transaction
            // Generate meet link
            // Send emails
            console.log("Payment captured:", paymentId)
        }

        if (event.event === "payment.failed") {
            // Update session to cancelled
            // Release slot lock
            console.log("Payment failed:", paymentId)
        }

        return new Response("OK", { status: 200 })
    } catch (err) {
        console.error("Webhook error:", err)
        return new Response("Error", { status: 500 })
    }
})

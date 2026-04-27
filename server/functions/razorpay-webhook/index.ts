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

        // 3. Find pending transaction by razorpay_order_id to get session_id
        const { data: pendingTx } = await supabase
            .from("transactions")
            .select("session_id, payee_id, payer_id, amount_inr")
            .eq("razorpay_order_id", orderId)
            .eq("type", "session_payment")
            .single()

        if (!pendingTx) {
            console.error("Pending transaction not found for order:", orderId)
            return new Response("Order not found or not linked to session", { status: 404 })
        }

        const sessionId = pendingTx.session_id

        // Fetch User and Mentor details for Email
        const { data: student } = await supabase.from("users").select("email, full_name").eq("id", pendingTx.payer_id).single()
        const { data: mentorUser } = await supabase.from("users").select("email, full_name").eq("id", pendingTx.payee_id).single()

        if (event.event === "payment.captured") {
            const meetLink = `https://meet.jit.si/netrax-${sessionId}`
            
            // 1. Update session to confirmed
            await supabase.from("sessions").update({
                status: "confirmed",
                meet_link: meetLink
            }).eq("id", sessionId)
            
            // 2. Formally book the slot
            const { data: sessDB } = await supabase.from("sessions").select("availability_slot_id").eq("id", sessionId).single()
            if (sessDB) {
                await supabase.from("mentor_availability").update({
                    is_booked: true,
                    is_locked: false
                }).eq("id", sessDB.availability_slot_id)
            }

            // 3. Mark transaction as captured
            await supabase.from("transactions").update({
                status: "captured",
                razorpay_payment_id: paymentId,
                idempotency_key: idempotencyKey, // Now uses paymentId
                platform_fee_inr: Math.round(pendingTx.amount_inr * 0.20) // 20% platform fee
            }).eq("razorpay_order_id", orderId).eq("type", "session_payment")

            // 4. Send Confirmation Emails via Resend
            const resendApiKey = Deno.env.get("RESEND_API_KEY")
            if (resendApiKey && student?.email && mentorUser?.email) {
                // To Student
                await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        from: "NetraX Bookings <bookings@netrax.in>", // Or verified domain
                        to: [student.email],
                        subject: "Booking Confirmed: Mentor Session",
                        html: `<p>Hi ${student.full_name},</p><p>Your session with <b>${mentorUser.full_name}</b> is confirmed!</p><p>Join Link: <a href="${meetLink}">${meetLink}</a></p><p>Thanks,<br/>NetraX Team</p>`
                    })
                })
                // To Mentor
                await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        from: "NetraX Bookings <bookings@netrax.in>", // Or verified domain
                        to: [mentorUser.email],
                        subject: "New Booking Alert: NetraX",
                        html: `<p>Hi ${mentorUser.full_name},</p><p>You have a new booking from <b>${student.full_name}</b>!</p><p>Join Link: <a href="${meetLink}">${meetLink}</a></p><p>Thanks,<br/>NetraX Team</p>`
                    })
                })
            }

            console.log("Payment captured & Email dispatched:", paymentId)
        }

        if (event.event === "payment.failed") {
            // Update session to cancelled
            await supabase.from("sessions").update({ status: "cancelled" }).eq("id", sessionId)
            
            // Release slot lock
            const { data: sessDB } = await supabase.from("sessions").select("availability_slot_id").eq("id", sessionId).single()
            if (sessDB) {
                await supabase.from("mentor_availability").update({ is_locked: false }).eq("id", sessDB.availability_slot_id)
            }

            // Update transaction to failed
            await supabase.from("transactions").update({
                status: "failed",
                razorpay_payment_id: paymentId,
                idempotency_key: idempotencyKey
            }).eq("razorpay_order_id", orderId).eq("type", "session_payment")

            console.log("Payment failed & Lock released:", paymentId)
        }

        return new Response("OK", { status: 200 })
    } catch (err) {
        console.error("Webhook error:", err)
        return new Response("Error", { status: 500 })
    }
})

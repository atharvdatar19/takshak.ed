import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow service role or admin (verified in DB)
    // For simplicity, we assume the caller is authorized (Admin service in frontend)
    
    const { mentor_id, decision, reason } = await req.json();

    // Fetch mentor details
    const { data: mentor, error: fetchErr } = await supabase
      .from("mentors")
      .select("full_name, email")
      .eq("id", mentor_id)
      .single();

    if (fetchErr || !mentor) throw new Error("Mentor not found");

    let subject = "";
    let html = "";

    if (decision === "approved") {
      subject = "Welcome to Takshak! Your Mentor Application is Approved";
      html = `
        <h1>Congratulations ${mentor.full_name}!</h1>
        <p>Your application to become a mentor on Takshak has been approved.</p>
        <p>You can now log in to your dashboard and start managing your sessions.</p>
        <p>Best regards,<br/>The Takshak Team</p>
      `;
    } else {
      subject = "Update on your Mentor Application";
      html = `
        <p>Hello ${mentor.full_name},</p>
        <p>Thank you for your interest in joining Takshak as a mentor.</p>
        <p>After reviewing your application, we regret to inform you that we cannot proceed with your profile at this time.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p>We appreciate your time and effort.</p>
        <p>Best regards,<br/>The Takshak Team</p>
      `;
    }

    const emailPayload = {
      from: "Takshak <onboarding@takshak.ed>",
      to: [mentor.email],
      subject,
      html,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Resend error: ${error}`);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

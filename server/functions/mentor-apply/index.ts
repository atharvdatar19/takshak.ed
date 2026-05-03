import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAILS = ["takshak.notifications@gmail.com", "atharvd10166@gmail.com", "punyatirthasahoo@gmail.com"]; // keep in sync with src/config/admins.js

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(authHeader?.replace("Bearer ", ""));
    if (authErr || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const formData = await req.formData();
    const full_name = formData.get("full_name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const phone = formData.get("phone")?.toString() ?? "";
    const college = formData.get("college")?.toString() ?? "";
    const branch = formData.get("branch")?.toString() ?? "";
    const grad_year = parseInt(formData.get("grad_year")?.toString() ?? "0");
    const city_origin = formData.get("city_origin")?.toString() ?? "";
    const languages = (formData.get("languages")?.toString() ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const exam_focus = (formData.get("exam_focus")?.toString() ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const subjects = (formData.get("subjects")?.toString() ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const bio = formData.get("bio")?.toString() ?? "";
    const rate_30min_inr = parseInt(formData.get("rate_30min_inr")?.toString() ?? "0");
    const rate_60min_inr = parseInt(formData.get("rate_60min_inr")?.toString() ?? "0");
    const linkedin_url = formData.get("linkedin_url")?.toString() ?? "";
    const photoFile = formData.get("photo") as File | null;

    // Upload photo if provided
    let photo_url = null;
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const filePath = `mentor_photos/${crypto.randomUUID()}.${fileExt}`;
      const arrayBuffer = await photoFile.arrayBuffer();
      const { error: uploadErr } = await supabase.storage.from("public").upload(filePath, new Uint8Array(arrayBuffer), {
        contentType: photoFile.type,
        upsert: false,
      });
      if (!uploadErr) {
        const { data } = supabase.storage.from("public").getPublicUrl(filePath);
        photo_url = data?.publicUrl;
      }
    }

    // Insert mentor row (unverified)
    const { data: mentor, error: insertErr } = await supabase.from("mentors").insert({
      full_name,
      email,
      phone,
      college,
      branch,
      grad_year,
      city_origin,
      languages,
      exam_focus,
      subjects,
      bio,
      rate_30min_inr,
      rate_60min_inr,
      linkedin_url,
      photo_url,
      is_verified: false,
      user_id: user.id,
    }).select().single();
    if (insertErr) throw insertErr;

    // Send admin notification email via Resend
    const adminEmailPayload = {
      from: "Takshak <onboarding@takshak.ed>",
      to: ADMIN_EMAILS,
      subject: "New Mentor Application Received",
      html: `<p>A new mentor application has been submitted by <strong>${full_name}</strong> (${email}). Review in the admin panel.</p>`,
    };
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminEmailPayload),
    });

    return new Response(JSON.stringify({ success: true, mentor_id: mentor.id }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

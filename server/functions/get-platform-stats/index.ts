// ═══════════════════════════════════════════════
// Edge Function: get-platform-stats
// ═══════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://takshak.vercel.app',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        )

        // Select from the materialized view (FIX-4)
        const { data, error } = await supabase
            .from("mv_platform_stats")
            .select("*")
            .single();

        if (error) throw error;

        // Add Cache-Control for 1 hour (server-side caching)
        return new Response(JSON.stringify(data), { 
            status: 200, 
            headers: { 
                ...corsHeaders, 
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=3600" 
            } 
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
})

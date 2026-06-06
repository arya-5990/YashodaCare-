import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import jwt from "npm:jsonwebtoken";
import { corsHeaders } from "../_shared/cors.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fallback-jwt-secret-key-123456";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return new Response(JSON.stringify({ error: "Refresh token is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Lookup session in user_sessions table
    const { data: session, error: sessionError } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("refreshToken", refreshToken)
      .maybeSingle();

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: "Invalid refresh token." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Check expiry
    const expiry = new Date(session.refreshTokenExpiresAt).getTime();
    if (Date.now() > expiry) {
      // Delete expired session
      await supabase.from("user_sessions").delete().eq("id", session.id);
      
      return new Response(JSON.stringify({ error: "Refresh token expired. Please login again." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Rotate tokens (generate new access token & new refresh token)
    const newAccessToken = jwt.sign({ sub: session.userId }, JWT_SECRET, { expiresIn: "1h" });
    const newRefreshToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    // Update session record
    const { error: updateError } = await supabase
      .from("user_sessions")
      .update({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
      })
      .eq("id", session.id);

    if (updateError) {
      throw new Error(`Failed to refresh session: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

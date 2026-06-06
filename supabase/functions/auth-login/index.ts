import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import jwt from "npm:jsonwebtoken";
import bcrypt from "npm:bcryptjs";
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

    const { phone, password } = await req.json();

    if (!phone || !password) {
      return new Response(JSON.stringify({ error: "Phone and password are required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Lookup user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid phone number or password." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verify bcrypt password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid phone number or password." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Generate custom Access & Refresh Tokens
    const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "1h" });
    
    // Generate random 32-character refresh token
    const refreshToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    // Save session in user_sessions table
    const { error: sessionError } = await supabase
      .from("user_sessions")
      .insert({
        userId: user.id,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
      });

    if (sessionError) {
      throw new Error(`Failed to establish session: ${sessionError.message}`);
    }

    // Strip password from returned user info
    const { password: _, ...safeUser } = user;

    return new Response(
      JSON.stringify({
        accessToken,
        refreshToken,
        user: safeUser,
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

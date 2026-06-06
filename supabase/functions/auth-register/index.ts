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

    const { name, phone, email, password, address, pincode, referral } = await req.json();

    if (!name || !phone || !email || !password || !address || !pincode) {
      return new Response(JSON.stringify({ error: "Please fill all required fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Check if account with phone number already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (existingUser) {
      return new Response(JSON.stringify({ error: "An account with this phone number already exists." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Generate numeric User ID sequence (1000, 1001, etc.)
    const { data: allUsers } = await supabase
      .from("users")
      .select("id");

    let nextUserId = 1000;
    if (allUsers && allUsers.length > 0) {
      const ids = allUsers.map(u => parseInt(u.id)).filter(id => !isNaN(id));
      if (ids.length > 0) {
        nextUserId = Math.max(...ids) + 1;
      }
    }

    const newUserIdStr = nextUserId.toString();

    // Create new user in users table
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        id: newUserIdStr,
        name,
        phone,
        email,
        password: hashedPassword,
        address,
        pincode,
        referral: referral || "nill",
      })
      .select("*")
      .single();

    if (insertError || !newUser) {
      throw new Error(`Failed to create user record: ${insertError?.message}`);
    }

    // Generate custom Access & Refresh Tokens
    const accessToken = jwt.sign({ sub: newUser.id }, JWT_SECRET, { expiresIn: "1h" });
    
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
        userId: newUser.id,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
      });

    if (sessionError) {
      throw new Error(`Failed to establish session: ${sessionError.message}`);
    }

    // Strip password from returned user info
    const { password: _, ...safeUser } = newUser;

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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import bcrypt from "npm:bcryptjs";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, otp, newPassword } = await req.json();

    if (!userId || !otp || !newPassword) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch OTP record
    const { data: record, error: fetchError } = await supabase
      .from("forgotpass")
      .select("*")
      .eq("userId", userId)
      .maybeSingle();

    if (fetchError || !record) {
      return new Response(JSON.stringify({ error: "OTP expired or not found. Request a new one." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Check 10-minute expiry
    const createdAt = new Date(record.createdAt).getTime();
    if (Date.now() - createdAt > 10 * 60 * 1000) {
      await supabase.from("forgotpass").delete().eq("userId", userId);
      return new Response(JSON.stringify({ error: "OTP has expired. Please request a new one." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verify OTP
    if (record.otp !== otp) {
      return new Response(JSON.stringify({ error: "Incorrect OTP. Please try again." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Hash and update user password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", userId);

    if (updateError) {
      throw new Error(`Failed to update password: ${updateError.message}`);
    }

    // Clean up OTP document and active user sessions (forced log out for security)
    await supabase.from("forgotpass").delete().eq("userId", userId);
    await supabase.from("user_sessions").delete().eq("userId", userId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import nodemailer from "npm:nodemailer";
import { corsHeaders } from "../_shared/cors.ts";

const GMAIL_USER = "smilesathiofficial@gmail.com";
const GMAIL_APP_PASS = "nwfm egwe urbf nzgv";

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASS },
});

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { phone } = await req.json();

    if (!phone) {
      return new Response(JSON.stringify({ error: "Phone number is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Look up user by phone number
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "No account found with this phone number." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const email = user.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "No email linked to this account. Contact support." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Generate 4-digit OTP
    const otp = String(Math.floor(1000 + Math.random() * 9000));

    // Upsert into forgotpass table
    const { error: upsertError } = await supabase
      .from("forgotpass")
      .upsert({
        userId: user.id,
        email: email,
        otp: otp,
        createdAt: new Date().toISOString(),
      });

    if (upsertError) {
      throw new Error(`Failed to generate OTP records: ${upsertError.message}`);
    }

    // Send OTP email via nodemailer
    await mailTransporter.sendMail({
      from: `"SmileSathi" <${GMAIL_USER}>`,
      to: email,
      subject: "Your SmileSathi Password Reset OTP",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e2e8f0;background:#fff">
          <h2 style="color:#0A1929;margin-bottom:8px">Password Reset</h2>
          <p style="color:#64748B;margin-bottom:24px">Use the OTP below to reset your SmileSathi account password. It is valid for <strong>10 minutes</strong>.</p>
          <div style="background:#F0FFF4;border:2px solid #74B72E;border-radius:8px;padding:20px;text-align:center">
            <span style="font-size:40px;font-weight:900;letter-spacing:16px;color:#0A1929">${otp}</span>
          </div>
          <p style="color:#94A3B8;font-size:13px;margin-top:24px">If you did not request this, please ignore this email. Do not share this OTP with anyone.</p>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
          <p style="color:#CBD5E1;font-size:12px">SmileSathi &mdash; Aapki Smile Ka Lifeline Partner</p>
        </div>
      `,
    });

    // Mask the email for response
    const [localPart, domain] = email.split("@");
    const maskedEmail = localPart[0] + "***@" + domain;

    return new Response(
      JSON.stringify({
        success: true,
        maskedEmail,
        userId: user.id,
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

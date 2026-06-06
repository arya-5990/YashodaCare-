import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { corsHeaders } from "../_shared/cors.ts";

const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID") || "124822350bc0969073fc7e0363c3228421";
const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY") || "cfsk_ma_prod_fe66b5dfad0c6588807dfc0a44610cc1_33cb972d";
const CASHFREE_ENV = Deno.env.get("CASHFREE_ENV") || "production";
const CASHFREE_API_VERSION = "2022-09-01";
const CASHFREE_BASE_URL = CASHFREE_ENV === "production"
  ? "https://api.cashfree.com/pg"
  : "https://sandbox.cashfree.com/pg";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, planId } = await req.json();

    if (!userId || !planId) {
      return new Response(JSON.stringify({ error: "Missing userId or planId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch plan details from plans table
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .maybeSingle();

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: "Plan not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const amount = Number(plan.discountedPrice || plan.discounted_price || 0);
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid plan amount" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch user details for Cashfree customer info
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    const userData = user || {};
    const customerEmail = userData.email || "no-email@yashodacare.in";
    const customerPhone = userData.phone || "9999999999";
    const customerName = userData.name || "Member";

    const orderId = `CF_${Date.now()}_${userId.slice(0, 8)}`;

    // Log pending transaction in transactions table
    const { error: insertTxError } = await supabase
      .from("transactions")
      .insert({
        id: orderId,
        userId: userId,
        planId: planId,
        amount: amount,
        status: "PENDING",
      });

    if (insertTxError) {
      throw new Error(`Failed to create transaction record: ${insertTxError.message}`);
    }

    // Dynamic notify URL pointing back to our Supabase webhook function
    const notifyUrl = `${supabaseUrl}/functions/v1/payment-webhook`;

    // Construct Cashfree order payload
    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: userId,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_name: customerName,
      },
      order_meta: {
        return_url: "https://www.smilesathi.in/profile",
        notify_url: notifyUrl,
      },
      notes: {
        planId,
        planTitle: plan.title || "Membership Plan",
      },
    };

    const cfRes = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": CASHFREE_API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const cfData = await cfRes.json();
    const paymentSessionId = cfData.payment_session_id;

    if (!paymentSessionId) {
      console.error("Cashfree response missing payment_session_id:", cfData);
      return new Response(JSON.stringify({ error: "Failed to initialize payment session" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({
        orderId,
        paymentSessionId,
        env: CASHFREE_ENV,
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

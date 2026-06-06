import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import crypto from "node:crypto";
import { corsHeaders } from "../_shared/cors.ts";

const CASHFREE_WEBHOOK_SECRET = Deno.env.get("CASHFREE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get raw body text for signature validation
    const rawBody = await req.text();
    
    // Handle empty body (like Cashfree test pings)
    if (!rawBody || rawBody.trim() === "") {
      console.log("Empty body received, likely a test ping. Returning 200 OK.");
      return new Response("OK (Test Ping)", { status: 200 });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.warn("Invalid JSON body received, returning 200 OK for compatibility:", parseError);
      return new Response("OK (Invalid JSON)", { status: 200 });
    }

    // Verify webhook signature if secret is configured
    if (CASHFREE_WEBHOOK_SECRET) {
      const signature = req.headers.get("x-webhook-signature");
      const timestamp = req.headers.get("x-webhook-timestamp") || "";
      if (!signature) {
        console.error("Missing x-webhook-signature header");
        return new Response("Missing signature", { status: 400 });
      }

      const signedPayload = timestamp + rawBody;
      const expected = crypto
        .createHmac("sha256", CASHFREE_WEBHOOK_SECRET)
        .update(signedPayload)
        .digest("base64");

      if (expected !== signature) {
        console.error("Invalid Cashfree webhook signature");
        console.error("Expected signature:", expected);
        console.error("Received signature:", signature);
        return new Response("Invalid signature", { status: 400 });
      }
    } else {
      console.warn("CASHFREE_WEBHOOK_SECRET not configured – skipping signature verification");
    }

    const event = body?.event || body?.type || "";
    const order = body?.data?.order || {};
    const payment = body?.data?.payment || {};

    const orderId = order.order_id || body?.orderId;
    const orderStatus = (order.order_status || payment.payment_status || "").toUpperCase();
    const paymentId = payment.payment_id || payment.cf_payment_id || body?.referenceId;

    console.log(`Cashfree Webhook received for Order: ${orderId}, Status: ${orderStatus}, Event: ${event}`);

    if (!orderId) {
      console.log("No order_id found in webhook body. Returning 200 OK to satisfy test pings.", body);
      return new Response("OK (Test/Ping)", { status: 200 });
    }

    const isSuccess =
      orderStatus === "PAID" ||
      orderStatus === "SUCCESS" ||
      orderStatus === "COMPLETED" ||
      event === "payment.captured" ||
      event === "PAYMENT_SUCCESS_WEBHOOK";

    // Retrieve active transaction from database
    const { data: transaction, error: fetchTxError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (fetchTxError || !transaction) {
      console.warn("Transaction not found for Cashfree order:", orderId);
      return new Response("OK", { status: 200 });
    }

    // If transaction is already processed, do nothing
    if (transaction.status === "SUCCESS" || transaction.status === "FAILED") {
      return new Response("OK", { status: 200 });
    }

    const newStatus = isSuccess ? "SUCCESS" : "FAILED";

    // Update transactions table status
    const { error: updateTxError } = await supabase
      .from("transactions")
      .update({
        status: newStatus,
      })
      .eq("id", orderId);

    if (updateTxError) {
      throw new Error(`Failed to update transaction status: ${updateTxError.message}`);
    }

    // Grant plan benefits on success
    if (isSuccess) {
      const resolvedUserId = transaction.userId;
      const resolvedPlanId = transaction.planId;

      if (resolvedUserId && resolvedPlanId) {
        // Fetch plan title
        const { data: plan } = await supabase
          .from("plans")
          .select("title")
          .eq("id", resolvedPlanId)
          .maybeSingle();

        const planTitle = plan?.title || "Premium Plan";

        // Update user record
        const { error: updateUserError } = await supabase
          .from("users")
          .update({
            planId: resolvedPlanId,
            planTitle: planTitle,
            planPurchasedAt: new Date().toISOString(),
          })
          .eq("id", resolvedUserId);

        if (updateUserError) {
          console.error("Failed to update user plan details:", updateUserError);
        }

        // Insert into purchases table
        const { error: insertPurchaseError } = await supabase
          .from("purchases")
          .insert({
            id: orderId,
            userId: resolvedUserId,
            planId: resolvedPlanId,
            status: "SUCCESS",
            amount: transaction.amount,
            usedBenefits: [],
            lastUpdated: new Date().toISOString(),
          });

        if (insertPurchaseError) {
          console.error("Failed to insert purchase record:", insertPurchaseError);
        }
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("cashfreeWebhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

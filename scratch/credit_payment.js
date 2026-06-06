import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env variables manually from .env file
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value.trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function creditPayment() {
  console.log("Manually crediting pending transaction...");

  const targetOrderId = "CF_1780738410794_1000";
  const userId = "1000";
  const planId = "1004";
  const planTitle = "test";
  const amount = 1;

  // 1. Update transactions
  const { error: txError } = await supabase
    .from('transactions')
    .update({ status: 'SUCCESS' })
    .eq('id', targetOrderId);

  if (txError) {
    console.error("Error updating transaction:", txError);
    return;
  }
  console.log("Transaction status updated to SUCCESS.");

  // 2. Update user plan
  const { error: userError } = await supabase
    .from('users')
    .update({
      planId: planId,
      planTitle: planTitle,
      planPurchasedAt: new Date().toISOString()
    })
    .eq('id', userId);

  if (userError) {
    console.error("Error updating user:", userError);
    return;
  }
  console.log("User plan updated successfully.");

  // 3. Insert purchase record
  const { error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      id: targetOrderId,
      userId: userId,
      planId: planId,
      status: 'SUCCESS',
      amount: amount,
      usedBenefits: [],
      lastUpdated: new Date().toISOString()
    });

  if (purchaseError) {
    console.error("Error inserting purchase record:", purchaseError);
    return;
  }
  console.log("Purchase record created successfully.");
  console.log("Payment manually credited successfully!");
}

creditPayment().catch(err => {
  console.error(err);
});

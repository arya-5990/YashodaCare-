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

async function testInsert() {
  console.log("Testing insert into transactions...");
  
  const testId = `TEST_${Date.now()}`;
  
  // 1. Try to update a transaction with paymentId and paidAt (to see if they exist)
  const { error: updateError } = await supabase
    .from('transactions')
    .update({
      paymentId: 'test_payment_id',
      paidAt: new Date().toISOString()
    })
    .eq('id', 'non_existent');
    
  if (updateError) {
    console.log("Transaction update failed (expected if columns missing):", updateError.message);
  } else {
    console.log("Transaction update succeeded! Columns paymentId and paidAt exist!");
  }

  // 2. Try inserting a purchase record (simulate webhook insertion)
  const { error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      id: testId,
      userId: '1000',
      planId: '1004',
      status: 'SUCCESS',
      amount: 1,
      usedBenefits: [],
      lastUpdated: new Date().toISOString()
    });

  if (purchaseError) {
    console.log("Purchase insert failed:", purchaseError.message, purchaseError.details);
  } else {
    console.log("Purchase insert succeeded!");
    
    // Clean up
    await supabase.from('purchases').delete().eq('id', testId);
  }
}

testInsert().catch(err => {
  console.error("Test failed:", err);
});

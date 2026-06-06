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

async function check() {
  console.log("Checking Supabase Database...");

  // 1. Check transactions
  const { data: txs, error: txsError } = await supabase
    .from('transactions')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(10);

  if (txsError) {
    console.error("Error fetching transactions:", txsError);
  } else {
    console.log("\n--- RECENT TRANSACTIONS ---");
    console.table(txs.map(t => ({
      id: t.id,
      userId: t.userId,
      planId: t.planId,
      amount: t.amount,
      status: t.status,
      createdAt: t.createdAt
    })));
  }

  // 2. Check purchases
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(10);

  if (purchasesError) {
    console.error("Error fetching purchases:", purchasesError);
  } else {
    console.log("\n--- RECENT PURCHASES ---");
    console.table(purchases.map(p => ({
      id: p.id,
      userId: p.userId,
      planId: p.planId,
      amount: p.amount,
      status: p.status,
      createdAt: p.createdAt
    })));
  }

  // 3. Check users with active plans
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name, email, planId, planTitle, planPurchasedAt')
    .not('planId', 'is', null)
    .limit(10);

  if (usersError) {
    console.error("Error fetching users:", usersError);
  } else {
    console.log("\n--- USERS WITH ACTIVE PLANS ---");
    console.table(users);
  }
}

check().catch(err => {
  console.error("Check failed:", err);
});

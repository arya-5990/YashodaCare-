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

async function checkSchema() {
  console.log("Checking schemas of transactions, purchases...");

  // We can select one row from each to inspect the keys
  const { data: tx, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (txError) {
    console.error("Error checking transactions:", txError);
  } else {
    console.log("Transactions columns:", tx ? Object.keys(tx) : "No rows");
    console.log("Sample Transaction:", tx);
  }

  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (purchaseError) {
    console.error("Error checking purchases:", purchaseError);
  } else {
    console.log("Purchases columns:", purchase ? Object.keys(purchase) : "No rows");
    console.log("Sample Purchase:", purchase);
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (userError) {
    console.error("Error checking users:", userError);
  } else {
    console.log("Users columns:", user ? Object.keys(user) : "No rows");
    console.log("Sample User:", user);
  }
}

checkSchema().catch(err => {
  console.error("Check failed:", err);
});

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

async function checkPurchaseColumns() {
  console.log("Checking purchases table schema by trying to update non-existent row...");
  
  const { error } = await supabase
    .from('purchases')
    .update({
      paymentId: 'test_pay_id',
      provider: 'test_provider'
    })
    .eq('id', 'non_existent');

  if (error) {
    console.log("Error (expected if columns do not exist):", error.message);
  } else {
    console.log("Columns paymentId and provider exist in purchases table!");
  }
}

checkPurchaseColumns().catch(err => {
  console.error(err);
});

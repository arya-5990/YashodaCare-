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

async function testUserInsert() {
  console.log("Testing user insert with planId = '1000'...");
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: 'test_user_fk',
      name: 'Test FK User',
      email: 'testfk@example.com',
      password: 'password',
      planId: '1000'
    });

  if (error) {
    console.error("Insert failed (likely foreign key constraint):", error.message);
  } else {
    console.log("Insert succeeded! No foreign key constraint on planId.");
    // Clean up
    await supabase.from('users').delete().eq('id', 'test_user_fk');
  }
}

testUserInsert().catch(err => {
  console.error(err);
});

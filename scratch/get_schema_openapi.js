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

async function fetchSchema() {
  const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`;
  console.log("Fetching OpenAPI spec from:", `${supabaseUrl}/rest/v1/`);
  
  const res = await fetch(url);
  const data = await res.json();

  console.log("Response:", data);
  
  console.log("\n--- TABLE DEFINITIONS ---");
  const definitions = data.definitions || data.components?.schemas || {};
  
  for (const tableName of Object.keys(definitions)) {
    console.log(`\nTable: ${tableName}`);
    const properties = definitions[tableName].properties || {};
    const columns = Object.keys(properties).map(col => {
      return {
        column: col,
        type: properties[col].type,
        format: properties[col].format || '',
        description: properties[col].description || ''
      };
    });
    console.table(columns);
  }
}

fetchSchema().catch(err => {
  console.error("Failed to fetch OpenAPI spec:", err);
});

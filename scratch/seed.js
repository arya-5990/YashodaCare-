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

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Starting database seed...");

  // 1. Seed card_details
  const { data: cardDetail } = await supabase
    .from('card_details')
    .select('id')
    .eq('id', 'main')
    .maybeSingle();

  if (!cardDetail) {
    console.log("Seeding 'card_details'...");
    await supabase.from('card_details').insert({
      id: 'main',
      promoTitle: 'Get your own Premium Member Card',
      promoDescription: 'Every active plan comes with a personalised SmileSathi membership card. Carry it to any partnered clinic for seamless verification, priority support, and cashless benefits as per your plan.',
      promoImage: '/card.jpeg',
      line1: 'Instant recognition at SmileSathi partnered clinics.',
      line2: 'Unique member ID mapped to your active dental plan.',
      line3: 'Faster check-ins and smoother billing experience.'
    });
  } else {
    console.log("'card_details' already has a 'main' entry.");
  }

  // 2. Seed site_texts
  const { data: siteTexts } = await supabase
    .from('site_texts')
    .select('id')
    .limit(1);

  if (!siteTexts || siteTexts.length === 0) {
    console.log("Seeding 'site_texts'...");
    await supabase.from('site_texts').insert({
      section: "India's Most Trusted Dental Partner",
      label: "Experience premium, clinical-grade dental care. Join the SmileSathi membership plan for just ₹999.",
      content: "Join SmileSathi"
    });
  } else {
    console.log("'site_texts' already has entries.");
  }

  // 3. Seed plans
  const { data: plans } = await supabase
    .from('plans')
    .select('id')
    .limit(1);

  if (!plans || plans.length === 0) {
    console.log("Seeding default 'plans'...");
    await supabase.from('plans').insert([
      {
        id: 'essential',
        title: 'Premium Dental Plan',
        planType: 'individual',
        description: "Annual coverage for your routine dental needs — no per-visit fees, no hidden charges.",
        actualPrice: 3999,
        discountedPrice: 999,
        duration: 365,
        isBestseller: true,
        includes: [
          'Unlimited OPD visits — walk in anytime',
          '1 professional teeth cleaning',
          '5 digital X-rays included',
          '1 filling or extraction covered',
          '10–15% off on all other treatments'
        ],
        note: 'Valid For a Single Individual For 1 Year only'
      },
      {
        id: 'family',
        title: 'Family Dental Plan',
        planType: 'family',
        description: "Comprehensive protection for your entire household (up to 4 members).",
        actualPrice: 7999,
        discountedPrice: 2999,
        duration: 365,
        isBestseller: false,
        includes: [
          'Unlimited OPD visits for all 4 members',
          '4 professional teeth cleanings (1 per member)',
          'Unlimited digital X-rays',
          '2 fillings or extractions covered',
          '15-20% off on advanced treatments'
        ],
        note: 'Valid For 4 Family Members For 1 Year'
      }
    ]);
  } else {
    console.log("'plans' table already has entries.");
  }

  // 4. Seed doctors
  const { data: doctors } = await supabase
    .from('doctors')
    .select('id')
    .limit(1);

  if (!doctors || doctors.length === 0) {
    console.log("Seeding default 'doctors'...");
    await supabase.from('doctors').insert([
      {
        name: "Dr. Aditya Sharma",
        speciality: "Dental Surgeon",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
        description: "Advanced certification in specialized clinical protocols.",
        IsGoldMedalist: true
      },
      {
        name: "Dr. Priya Malhotra",
        speciality: "Periodontist",
        image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Advanced certification in specialized clinical protocols.",
        IsGoldMedalist: false
      },
      {
        name: "Dr. Rohan Varma",
        speciality: "Orthodontist",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
        description: "Advanced certification in specialized clinical protocols.",
        IsGoldMedalist: true
      }
    ]);
  } else {
    console.log("'doctors' table already has entries.");
  }

  // 5. Seed clinic images
  const { data: clinicImages } = await supabase
    .from('clinic_images')
    .select('id')
    .limit(1);

  if (!clinicImages || clinicImages.length === 0) {
    console.log("Seeding default 'clinic_images'...");
    await supabase.from('clinic_images').insert([
      { imageUrl: "https://quintessencedental.com/wp-content/uploads/2025/07/Dental-Clinic-Interior-Design-jpg.webp" },
      { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBKEpubnWEFWfvbDUW8Ut55CwYBeEPxKfM_A&s" },
      { imageUrl: "https://bestdentaldeals.in/wp-content/uploads/2025/11/Economy-Setup-scaled-1.webp" }
    ]);
  } else {
    console.log("'clinic_images' table already has entries.");
  }

  console.log("Database seed completed successfully!");
}

seed().catch(err => {
  console.error("Seed failed:", err);
});

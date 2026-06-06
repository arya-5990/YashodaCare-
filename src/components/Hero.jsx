import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';
import heroImg from '../assets/hero_image.png';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

// Fallback defaults
const DEFAULTS = {
  section: "India's Most Trusted Dental Partner",
  label: "Experience premium, clinical-grade dental care. Join the SmileSathi membership plan for just ₹999.",
  content: "Join SmileSathi",
};

export default function Hero() {
  const [heroData, setHeroData] = useState(DEFAULTS);

  useEffect(() => {
    const fetchHeroText = async () => {
      try {
        const { data: dbSiteTexts, error } = await supabase
          .from('site_texts')
          .select('*')
          .limit(1);

        if (dbSiteTexts && !error && dbSiteTexts.length > 0) {
          const data = dbSiteTexts[0];
          setHeroData({
            section: data.section || DEFAULTS.section,
            label:   data.label   || DEFAULTS.label,
            content: data.content || DEFAULTS.content,
          });
        }
      } catch (err) {
        console.error('Hero siteTexts fetch error:', err);
      }
    };
    fetchHeroText();
  }, []);

  // Split section into two lines for the styled heading
  // e.g. "India's Most Trusted Dental Partner" → ["India's Most Trusted", "Dental Partner"]
  const words = heroData.section.split(' ');
  const half = Math.ceil(words.length / 2);
  const headingLine1 = words.slice(0, half).join(' ');
  const headingLine2 = words.slice(half).join(' ');

  return (
    <section id="home" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 min-h-screen flex items-center bg-surface bg-bokeh-teal overflow-hidden">
      
      {/* Background Bokeh Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-bokeh-teal opacity-60 mix-blend-multiply" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 w-full grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center relative z-10">
        
        {/* Left Side: Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2A8EDD] bg-white text-[#2A8EDD] font-medium text-sm mb-6">
            <Sparkles size={16} />
            <span className="italic">Aapki Smile Ka Lifetime Partner</span>
          </div>

          <h1 className="text-display-lg text-primary mb-6 leading-[1.05]">
            {headingLine1} <br />
            <span className="text-tertiary">{headingLine2}</span>
          </h1>

          <p className="text-title-lg text-surface-tint mb-12 max-w-lg font-normal leading-relaxed">
            {heroData.label}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-8">
            <Link
              to="/plans"
              className="btn-primary rounded-full px-8 py-4 shadow-ambient font-bold border border-[--color-brand-blue] text-white hover:bg-[--color-brand-blue] w-full sm:w-auto"
            >
              {heroData.content} <ShieldCheck className="ml-2 w-5 h-5 text-[--color-accent-joy]" />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Right Side: Hero Image (Desktop / Large screens) */}
      <motion.div
         initial={{ opacity: 0, y: 50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
         className="hidden lg:block absolute -bottom-12 right-[-5%] xl:right-[-15%] h-[85vh] max-h-[900px] w-auto z-10 pointer-events-none"
      >
        <img 
          src={heroImg} 
          alt="Radiant Smile" 
          className="h-full w-auto object-contain object-right-bottom drop-shadow-2xl transform transition-transform duration-700 hover:scale-[1.02] pointer-events-auto origin-bottom-right"
        />
      </motion.div>
    </section>
  );
}

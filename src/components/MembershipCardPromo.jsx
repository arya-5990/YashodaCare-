import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

const FALLBACK_CONTENT = {
  promoTitle: 'Get your own Premium Member Card',
  promoDescription:
    'Every active plan comes with a personalised SmileSathi membership card. Carry it to any partnered clinic for seamless verification, priority support, and cashless benefits as per your plan.',
  line1: 'Instant recognition at SmileSathi partnered clinics.',
  line2: 'Unique member ID mapped to your active dental plan.',
  line3: 'Faster check-ins and smoother billing experience.',
  promoImage: '/card.jpeg',
};

export default function MembershipCardPromo() {
  const [content, setContent] = useState(FALLBACK_CONTENT);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const { data: dbCardDetails, error } = await supabase
          .from('card_details')
          .select('*')
          .eq('id', 'main')
          .single();

        if (dbCardDetails && !error) {
          setContent({
            promoTitle: dbCardDetails.promoTitle || FALLBACK_CONTENT.promoTitle,
            promoDescription: dbCardDetails.promoDescription || FALLBACK_CONTENT.promoDescription,
            line1: dbCardDetails.line1 || FALLBACK_CONTENT.line1,
            line2: dbCardDetails.line2 || FALLBACK_CONTENT.line2,
            line3: dbCardDetails.line3 || FALLBACK_CONTENT.line3,
            promoImage: dbCardDetails.promoImage || FALLBACK_CONTENT.promoImage,
          });
        }
      } catch (err) {
        console.error('Error fetching card details:', err);
      }
    };

    fetchCardDetails();
  }, []);

  const titleWords = content.promoTitle.split(' ');
  const highlightCount = Math.min(3, titleWords.length);
  const mainTitle = titleWords.slice(0, titleWords.length - highlightCount).join(' ');
  const highlightTitle = titleWords.slice(-highlightCount).join(' ');

  return (
    <section className="py-20 md:py-28 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-xl"
          >
            <span className="text-label-md tracking-[0.2em] font-black uppercase text-tertiary">Your SmileSathi ID</span>
            <h2 className="text-display-lg text-primary">
              {mainTitle}
              {highlightTitle && (
                <>
                  <br />
                  <span className="text-tertiary">{highlightTitle}</span>
                </>
              )}
            </h2>
            <p className="text-body-md text-surface-tint leading-relaxed">
              {content.promoDescription}
            </p>

            <ul className="space-y-3 text-body-md text-surface-tint">
              <li className="flex items-start gap-2">
                <ShieldCheck size={18} className="mt-1 text-tertiary" />
                <span>{content.line1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CreditCard size={18} className="mt-1 text-[--color-brand-blue]" />
                <span>{content.line2}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={18} className="mt-1 text-[--color-accent-joy]" />
                <span>{content.line3}</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                to="/plans"
                className="btn-primary rounded-2xl px-8 py-4 text-label-md font-black uppercase tracking-widest shadow-ambient w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Buy Dental Plan
                <ShieldCheck size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Card image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-sm md:max-w-md">
              <div className="absolute -inset-6 bg-gradient-to-tr from-[--color-brand-blue]/10 via-[--color-tertiary]/10 to-[--color-accent-joy]/5 rounded-[2.5rem] blur-2xl" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-surface-container-lowest border border-white/40">
                <img
                  src={content.promoImage}
                  alt="SmileSathi membership card"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

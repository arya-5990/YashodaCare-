import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function HomePricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'plans'));
        if (!querySnapshot.empty) {
          const plansData = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          }));
          // Sort by price or provided order if available
          setPlans(plansData.sort((a, b) => (a.discountedPrice || 0) - (b.discountedPrice || 0)));
        } else {
          // Fallback static data if Firestore is empty
          setPlans([
            {
              id: 'essential',
              title: 'Basic',
              planType: 'individual',
              description: 'Fundamental care for proactive individuals.',
              discountedPrice: 29,
              isPopular: false,
              includes: ['2 Preventive Cleanings / Yr', 'Digital X-Rays Covered', '50% Basic Fillings']
            },
            {
              id: 'family',
              title: 'Family',
              planType: 'family',
              description: 'Comprehensive protection for the entire household.',
              discountedPrice: 74,
              isPopular: true,
              includes: ['Unlimited Preventive Care', '80% Major Restorative', 'Orthodontic Support Included', 'Priority 24/7 Concierge']
            },
            {
              id: 'premium',
              title: 'Premium',
              planType: 'family',
              description: 'Maximized limits for complex dental journeys.',
              discountedPrice: 129,
              isPopular: false,
              includes: ['$5,000 Annual Maximum', 'Cosmetic Procedures Covered', 'No Waiting Periods']
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-tertiary" size={40} />
      </div>
    );
  }

  return (
    <section id="home-plans" className="pt-24 md:pt-32 pb-12 md:pb-16 bg-surface">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* Header with Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-display-lg text-primary mb-6">
              Structured for Certainty.
            </h2>
            <p className="text-body-md text-surface-tint">
              Compare our tiered plans designed to balance premium clinical access with financial predictability.
            </p>
          </div>

          {/* Pricing Toggle */}
          {/* <div className="bg-surface-container-low p-1.5 rounded-full inline-flex items-center outline-ghost">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-label-md font-bold transition-all ${!isYearly ? 'bg-surface-container-lowest text-primary shadow-ambient' : 'text-surface-tint hover:bg-surface-container'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-label-md font-bold transition-all ${isYearly ? 'bg-surface-container-lowest text-primary shadow-ambient' : 'text-surface-tint hover:bg-surface-container'}`}
            >
              Yearly (Save 15%)
            </button>
          </div> */}
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 items-stretch">
          {plans.map((plan, idx) => {
            const isHighlighted = idx === 1;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex flex-col p-10 rounded-[2.5rem] h-full transition-transform hover:scale-[1.02] ${
                  isHighlighted 
                    ? 'bg-primary text-on-primary shadow-2xl z-10 border-none' 
                    : 'bg-surface-container-lowest text-primary outline-ghost shadow-ambient'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#a3e635] text-primary text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg">
                    Most Preferred
                  </div>
                )}

                <div className="mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6 inline-block ${
                    isHighlighted ? 'bg-white/10 text-tertiary-fixed border border-white/10' : 'bg-surface-container text-surface-tint outline-ghost'
                  }`}>
                    {plan.planType?.toLowerCase() === 'family' ? 'Multi-User' : 'Essential'}
                  </span>
                  <h3 className="text-display-lg text-4xl mb-3 font-display font-medium tracking-tight">
                    {plan.title}
                  </h3>
                  <p className={`text-body-md ${isHighlighted ? 'text-white/70' : 'text-surface-tint'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 flex flex-col items-start gap-1">
                  {plan.actualPrice && plan.actualPrice > plan.discountedPrice && (
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl font-display font-semibold line-through decoration-[3px] ${isHighlighted ? 'text-white/90 decoration-white/60' : 'text-primary/80 decoration-primary/40'}`}>
                        ₹{plan.actualPrice}
                      </span>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        isHighlighted ? 'bg-[#a3e635] text-primary shadow-lg' : 'bg-tertiary/10 text-tertiary'
                      }`}>
                        Save {Math.round(((plan.actualPrice - plan.discountedPrice) / plan.actualPrice) * 100)}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-display-lg text-5xl font-display font-medium tracking-tighter">
                      ₹{plan.discountedPrice}
                    </span>
                    <span className={`text-title-lg ${isHighlighted ? 'text-white/60' : 'opacity-60'}`}>
                      {plan.title?.toLowerCase().includes('trial') ? '/ 6 month' : '/ yr'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-12 flex-1">
                  {(plan.includes || []).map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-0.5 ${isHighlighted ? 'bg-[#a3e635]' : 'bg-tertiary'}`}>
                        <Check size={14} className={isHighlighted ? 'text-primary' : 'text-white'} strokeWidth={3} />
                      </div>
                      <span className={`text-label-md font-medium ${isHighlighted ? 'text-white/90' : ''}`}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-3 text-center">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest ${
                    isHighlighted ? 'text-[#a3e635] drop-shadow-md' : 'text-error/90'
                  } animate-pulse`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Offer Expiring Soon
                  </span>
                </div>

                <button
                  onClick={() => navigate('/plans')}
                  className={`w-full py-4 rounded-[1rem] text-sm font-bold transition-all ${
                    isHighlighted 
                      ? 'bg-[#a3e635] text-primary hover:brightness-110 shadow-lg' 
                      : 'bg-transparent border-2 border-primary/20 text-primary hover:border-primary shadow-sm'
                  }`}
                >
                  {isHighlighted ? `Choose ${plan.title}` : `Select ${plan.title}`}
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

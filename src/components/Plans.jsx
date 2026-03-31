import { motion } from 'framer-motion';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

export default function PlanSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate('/auth', { state: { message: 'Please log in to register your plan' } });
      return;
    }

    setCheckoutLoading(plan.id);

    try {
      const response = await fetch('https://us-central1-ydcplans.cloudfunctions.net/createPhonePePaymentHttp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.user_id,
          planId: plan.id,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Payment API returned an error');
        }
      }

      if (!response.ok) {
        const message = data?.message || data?.error || 'Payment API returned an error';
        throw new Error(message);
      }
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Payment Gateway failed to configure payload.");
      }
    } catch (err) {
      console.error("Payment API Error:", err);
      alert("Unable to reach secure payment server. Please ensure Firebase Functions are deployed.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'plans'));
        if (!querySnapshot.empty) {
          const plansData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPlans(plansData);
        } else {
          setPlans([{
            id: 'default-plan',
            title: 'Premium Dental Plan',
            description: "Annual coverage for your entire family's routine dental needs — no per-visit fees, no hidden charges.",
            discountedPrice: 999,
            actualPrice: 3999,
            isPopular: true,
            includes: [
              'Unlimited OPD visits — walk in anytime',
              '1 professional teeth cleaning',
              '5 digital X-rays included',
              '1 filling or extraction covered',
              '10–15% off on all other treatments'
            ],
            note: 'Valid For a Single Individual For 1 Year only '
          }]);
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setPlans([{
          id: 'error-fallback',
          title: 'Premium Dental Plan',
          description: "Annual coverage for your entire family's routine dental needs — no per-visit fees, no hidden charges.",
          discountedPrice: 999,
          actualPrice: 3999,
          isPopular: true,
          includes: [
            'Unlimited OPD visits — walk in anytime',
            '1 professional teeth cleaning',
            '5 digital X-rays included',
            '1 filling or extraction covered',
            '10–15% off on all other treatments'
          ],
          note: 'Valid For a Single Individual For 1 Year only '
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <section id="plan" className="py-20 md:py-32 bg-surface flex justify-center items-center min-h-[500px]">
        <Loader2 size={36} className="animate-spin text-tertiary" />
      </section>
    );
  }

  return (
    <section id="plan" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10 space-y-16">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="flex flex-col lg:flex-row gap-4"
          >
            {/* Left Box — Plan Name & Price */}
            <div className="flex-1 bg-surface-container-lowest rounded-[var(--radius-xl)] p-10 md:p-14 shadow-ambient relative outline-ghost">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 inline-block bg-surface-container text-surface-tint outline-ghost">
                    {plan.planType?.toLowerCase() === 'family' ? 'Multi-User' : 'Essential'}
                  </span>
                  <h3 className="text-display-md text-primary mb-2 text-3xl md:text-5xl font-display font-medium">
                    {plan.title}
                  </h3>
                  <p className="text-body-md text-surface-tint max-w-sm">
                    {plan.description}
                  </p>
                </div>
                {plan.isPopular && (
                  <div className="trust-shield">
                    <Sparkles size={16} className="text-tertiary" />
                    <span className="text-label-md text-primary font-bold">Recommended</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-display-lg text-primary">₹{plan.discountedPrice}</span>
                  <span className="text-title-lg text-surface-tint">
                    {plan.title?.toLowerCase().includes('trial') ? '/ 6 month' : '/ yr'}
                  </span>
                </div>
                {plan.actualPrice && (
                  <p className="text-body-md text-surface-tint mt-2">
                    Standard value <span className="line-through decoration-outline-variant">₹{plan.actualPrice}</span>
                  </p>
                )}
              </div>

              <div className="mt-12 pt-8">
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={checkoutLoading === plan.id}
                  className="btn-primary w-full disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  {checkoutLoading === plan.id ? (
                    <><Loader2 size={18} className="animate-spin text-on-primary" /> Securing Transaction...</>
                  ) : (
                    'Secure My Membership'
                  )}
                </button>
              </div>
            </div>

            {/* Right Box — Features & Clarification */}
            <div className="flex-1 bg-surface-container-low rounded-[var(--radius-xl)] p-10 md:p-14 outline-ghost flex flex-col justify-between">
              <div>
                <p className="text-label-md uppercase tracking-[0.1em] text-primary/60 mb-8 font-semibold">
                  Clinical Benefits
                </p>
                
                <ul className="space-y-6">
                  {(plan.includes || []).map((feat, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 w-6 h-6 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                        <Check size={14} className="text-tertiary-container" strokeWidth={3} />
                      </div>
                      <span className="text-body-md text-on-surface font-medium pt-0.5">{feat}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {plan.note && (
                <div className="mt-12 px-6 py-4 bg-surface rounded-[var(--radius-md)] outline-ghost">
                  <p className="text-label-md text-surface-tint italic">
                    {plan.note}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

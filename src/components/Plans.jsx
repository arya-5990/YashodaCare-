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
      // Mandate login for subscriptions
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
        // Non-JSON error body
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
          // Ensure they are displayed consistently, optionally you could sort by a 'order' field if you add one later
          setPlans(plansData);
        } else {
          // Fallback if the database collection is completely empty, to preserve layout
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
      <section id="plan" className="py-20 md:py-32 bg-white flex justify-center items-center min-h-[500px]">
        <Loader2 size={36} className="animate-spin text-teal-800" />
      </section>
    );
  }

  return (
    <section id="plan" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle background shape */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-50 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10 space-y-12">

        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="grid lg:grid-cols-[1fr_1.2fr] gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50"
          >
            {/* Left — price & CTA */}
            <div className="bg-teal-900 text-white p-8 md:py-16 md:px-14 flex flex-col justify-center gap-10 relative overflow-hidden">
              {/* Soft decorative glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-700 rounded-full blur-3xl opacity-30 pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-8">
                <div>
                  {plan.isPopular && (
                    <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[12px] font-semibold tracking-wide text-teal-50 mb-6 border border-white/5">
                      <Sparkles size={13} />
                      Most Popular
                    </div>
                  )}

                  <h3 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
                    {plan.title}
                  </h3>
                  <p className="text-teal-100 text-base md:text-[17px] leading-relaxed max-w-sm">
                    {plan.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl md:text-8xl font-bold tracking-tight">₹{plan.discountedPrice}</span>
                    <span className="text-teal-200/80 text-xl font-medium">/ year</span>
                  </div>
                  {plan.actualPrice && (
                    <p className="text-teal-300 text-[15px] mt-3 font-medium">
                      Normally <span className="line-through decoration-teal-400">₹{plan.actualPrice}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 relative z-10 mt-4">
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={checkoutLoading === plan.id}
                  className="w-full flex items-center justify-center gap-2 bg-white font-bold py-4 md:py-4.5 rounded-xl hover:bg-warm-50 active:scale-[0.98] transition-all shadow-xl shadow-teal-950/20 text-[16px] disabled:opacity-80 disabled:cursor-not-allowed"
                  style={{ color: '#0A363A' }}
                >
                  {checkoutLoading === plan.id ? (
                    <><Loader2 size={18} className="animate-spin text-teal-800" /> Connecting to PhonePe...</>
                  ) : (
                    'Subscribe Securely'
                  )}
                </button>
                <a
                  href="tel:+918109424356"
                  className="block text-center text-sm text-teal-300 hover:text-white transition-colors py-2"
                >
                  or call +91 81094 24356
                </a>
              </div>
            </div>

            {/* Right — features */}
            <div className="bg-warm-50 p-8 md:p-14 flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-800/60 mb-8">
                What's included
              </p>

              <ul className="space-y-6">
                {(plan.includes || []).map((feat, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="flex items-start gap-3.5"
                  >
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-teal-800" strokeWidth={3} />
                    </div>
                    <span className="text-gray-800 text-[16px] leading-snug font-medium pt-0.5">{feat}</span>
                  </motion.li>
                ))}
              </ul>

              {plan.note && (
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <p className="text-[13px] font-medium text-gray-400 leading-relaxed italic">
                    * {plan.note}
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

import { motion } from 'framer-motion';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

export default function PlanSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [autoCheckoutDone, setAutoCheckoutDone] = useState(false);

  // Load Razorpay SDK dynamically
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById('razorpay-sdk')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate('/auth', { state: { message: 'Please log in to register your plan' } });
      return;
    }

    setCheckoutLoading(plan.id);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load payment SDK. Please check your connection.');

      // 2. Create order on backend
      const orderRes = await fetch('https://us-central1-ydcplans.cloudfunctions.net/createRazorpayOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.user_id, planId: plan.id }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData?.error || 'Could not create payment order');

      // 3. Open Razorpay modal
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'SmileSathi',
          description: plan.title || 'Membership Plan',
          order_id: orderData.orderId,
          prefill: {
            name: user.displayName || '',
            email: user.email || '',
          },
          theme: { color: '#74B72E' },
          handler: async (response) => {
            try {
              // 4. Verify payment signature on backend
              const verifyRes = await fetch('https://us-central1-ydcplans.cloudfunctions.net/verifyRazorpayPayment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userId: user.user_id,
                  planId: plan.id,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData?.error || 'Payment verification failed');

              resolve();
              navigate('/profile', { state: { paymentSuccess: true } });
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        });
        rzp.open();
      });

    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        console.error('Payment Error:', err);
        alert(err.message || 'Payment failed. Please try again.');
      }
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
          console.log('Plans from Firestore:', plansData.map(p => ({ title: p.title, isBestseller: p.isBestseller })));
          // Sort: bestseller in the middle, rest sorted by price
          const bestsellers = plansData.filter(p => p.isBestseller === true);
          const others = plansData.filter(p => p.isBestseller !== true).sort((a, b) => (a.discountedPrice || 0) - (b.discountedPrice || 0));
          const sorted = others.length >= 2
            ? [others[0], ...bestsellers, ...others.slice(1)]
            : [...others, ...bestsellers];
          setPlans(sorted);
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

  // Auto-trigger checkout when navigated from home with a selected plan
  useEffect(() => {
    if (loading || autoCheckoutDone || !user) return;

    const state = location.state;
    if (!state?.startCheckout || !state.planId) return;

    const selectedPlan = plans.find(p => p.id === state.planId);
    if (!selectedPlan) return;

    setAutoCheckoutDone(true);

    // Clear navigation state so back/refresh doesn't retrigger
    navigate(location.pathname, { replace: true });

    handleSubscribe(selectedPlan);
  }, [loading, autoCheckoutDone, user, location, plans, navigate]);

  if (loading) {
    return (
      <section id="plan" className="py-20 md:py-32 bg-surface flex justify-center items-center min-h-[500px]">
        <Loader2 size={36} className="animate-spin text-tertiary" />
      </section>
    );
  }

  return (
    <section id="plan" className="py-12 md:py-16 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, idx) => {
            const isHighlighted = plan.isBestseller === true;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex flex-col p-10 rounded-[2.5rem] h-full transition-transform hover:scale-[1.02] ${
                  isHighlighted
                    ? 'premium-metal-bg text-primary shadow-2xl z-10 border-none'
                    : 'bg-surface-container-lowest text-primary outline-ghost shadow-ambient'
                }`}
              >
                {/* Best Seller Badge */}
                {isHighlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg">
                    Best Seller
                  </div>
                )}

                {/* Plan Type Tag */}
                <div className="mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6 inline-block ${
                    isHighlighted ? 'bg-white/30 text-primary border border-primary/20' : 'bg-surface-container text-surface-tint outline-ghost'
                  }`}>
                    {plan.planType?.toLowerCase() === 'family' ? 'Multi-User' : 'Essential'}
                  </span>
                  <h3 className="text-display-lg text-4xl mb-3 font-display font-medium tracking-tight">
                    {plan.title}
                  </h3>
                  <p className={`text-body-md ${isHighlighted ? 'text-primary/80 font-medium' : 'text-surface-tint'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-8 flex flex-col items-start gap-1">
                  {plan.actualPrice && plan.actualPrice > plan.discountedPrice && (
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl font-display font-semibold line-through decoration-[3px] ${isHighlighted ? 'text-primary/70 decoration-primary/50' : 'text-primary/80 decoration-primary/40'}`}>
                        ₹{plan.actualPrice}
                      </span>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        isHighlighted ? 'bg-primary text-white shadow-lg' : 'bg-tertiary/10 text-tertiary'
                      }`}>
                        Save {Math.round(((plan.actualPrice - plan.discountedPrice) / plan.actualPrice) * 100)}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-display-lg text-5xl font-display font-medium tracking-tighter">
                      ₹{plan.discountedPrice}
                    </span>
                    <span className={`text-title-lg ${isHighlighted ? 'text-primary/70' : 'opacity-60'}`}>
                      {plan.title?.toLowerCase().includes('trial') ? '/ 6 months' : '/ year'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-12 flex-1">
                  {(plan.includes || []).map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-0.5 ${isHighlighted ? 'bg-primary' : 'bg-tertiary'}`}>
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </div>
                      <span className={`text-label-md font-medium ${isHighlighted ? 'text-primary/90' : ''}`}>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Offer expiry notice */}
                <div className="mb-3 text-center">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest ${
                    isHighlighted ? 'text-primary drop-shadow-md' : 'text-error/90'
                  } animate-pulse`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Offer Expiring Soon
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={checkoutLoading === plan.id}
                  className={`w-full py-4 rounded-[1rem] text-sm font-bold transition-all disabled:opacity-80 disabled:cursor-not-allowed ${
                    isHighlighted
                      ? 'bg-primary text-white hover:bg-primary-container shadow-lg'
                      : 'bg-transparent border-2 border-primary/20 text-primary hover:border-primary shadow-sm'
                  }`}
                >
                  {checkoutLoading === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Securing...
                    </span>
                  ) : (
                    isHighlighted ? `Choose ${plan.title}` : `Select ${plan.title}`
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

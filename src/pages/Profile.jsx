import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import {
  Loader2, LogOut, Check, Edit2, UserCircle, Star, Sparkles,
  AlertCircle, ShieldCheck, X, Calendar, Clock, CreditCard,
  BookOpen, ChevronRight, Zap, TrendingUp, BadgeCheck
} from 'lucide-react';

// ─── Expiry Date Algorithm ────────────────────────────────────────────────────
// Parses any duration representation into total DAYS.
// Handles: 365 (days), "365 days", "12 months", "1 year", "6 Months", 12 (months if <60)
// Rule for bare numbers: >= 60  → treat as DAYS (e.g. 365 days)
//                         < 60  → treat as MONTHS (e.g. 12 months)
function parseDurationDays(durationValue) {
  if (durationValue === null || durationValue === undefined || durationValue === '') return 365;

  const raw = String(durationValue).toLowerCase().trim();
  const numMatch = raw.match(/(\d+(\.\d+)?)/);
  if (!numMatch) return 365;
  const num = parseFloat(numMatch[1]);

  if (raw.includes('year'))  return Math.round(num * 365);
  if (raw.includes('month')) return Math.round(num * 30);
  if (raw.includes('day'))   return Math.round(num);

  // In Supabase, the duration column is an integer storing the count of days.
  // We treat all bare numbers as days directly.
  return Math.round(num);
}

// Human-readable duration label for display
function formatDurationLabel(days) {
  if (days === 1) return '1 day';
  if (days % 365 === 0) return `${days / 365} year${days / 365 !== 1 ? 's' : ''}`;
  if (days % 30 === 0)  return `${days / 30} month${days / 30 !== 1 ? 's' : ''}`;
  return `${days} days`;
}

function calcExpiry(purchasedOn, durationDays) {
  const start = new Date(purchasedOn);
  const expiry = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
  return expiry;
}

function coverageProgress(purchasedOn, expiryDate) {
  const now = Date.now();
  const start = new Date(purchasedOn).getTime();
  const end = expiryDate.getTime();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
}

function daysUntilExpiry(expiryDate) {
  const diff = expiryDate.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ─── Plan Details Modal ───────────────────────────────────────────────────────
function PlanDetailModal({ plan, onClose }) {
  const expiryDate = calcExpiry(plan.purchasedOn, plan.durationDays);
  const progress = coverageProgress(plan.purchasedOn, expiryDate);
  const daysLeft = daysUntilExpiry(expiryDate);
  const isExpired = daysLeft === 0;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Drawer */}
      <motion.div
        key="drawer"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[92dvh] overflow-y-auto bg-surface-container-lowest rounded-t-[2rem] shadow-2xl"
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 rounded-full bg-surface-container-high" />
        </div>

        <div className="px-6 md:px-10 pb-12 pt-4 max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  isExpired
                    ? 'bg-error-container text-error'
                    : 'bg-tertiary-fixed text-tertiary-fixed-variant'
                }`}>
                  {isExpired ? 'Expired' : plan.status}
                </span>
                <span className="text-xs font-bold text-surface-tint uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full outline-ghost">
                  #{plan.id}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight">{plan.title}</h2>
              {plan.description && (
                <p className="text-body-md text-surface-tint mt-2 max-w-lg">{plan.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              <X size={18} className="text-primary" />
            </button>
          </div>

          {/* Coverage Timeline Bar */}
          <div className="bg-surface-container rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-md font-bold text-primary uppercase tracking-widest">Coverage Timeline</span>
              <span className={`text-label-md font-black ${isExpired ? 'text-error' : daysLeft <= 30 ? 'text-yellow-600' : 'text-tertiary'}`}>
                {isExpired ? 'Expired' : `${daysLeft} days left`}
              </span>
            </div>
            <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  isExpired ? 'bg-error' : progress > 75 ? 'bg-yellow-500' : 'bg-tertiary'
                }`}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-surface-tint">{new Date(plan.purchasedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="text-xs text-surface-tint">{expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Key Dates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-container rounded-xl p-5 flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={14} className="text-primary/50" />
                <span className="text-xs font-bold uppercase tracking-widest text-surface-tint">Purchased</span>
              </div>
              <p className="text-label-lg font-black text-primary">
                {new Date(plan.purchasedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className={`rounded-xl p-5 flex flex-col gap-1 ${isExpired ? 'bg-error-container' : 'bg-surface-container'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className={isExpired ? 'text-error/70' : 'text-primary/50'} />
                <span className={`text-xs font-bold uppercase tracking-widest ${isExpired ? 'text-error/70' : 'text-surface-tint'}`}>Expires</span>
              </div>
              <p className={`text-label-lg font-black ${isExpired ? 'text-error' : 'text-primary'}`}>
                {expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-surface-container rounded-xl p-5 flex flex-col gap-1 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={14} className="text-primary/50" />
                <span className="text-xs font-bold uppercase tracking-widest text-surface-tint">Amount Paid</span>
              </div>
              <p className="text-label-lg font-black text-primary">₹{plan.price?.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Duration badge */}
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={14} className="text-tertiary" />
            <span className="text-label-md font-bold text-surface-tint">
              Plan Duration: <span className="text-primary">{formatDurationLabel(plan.durationDays)}</span>
            </span>
          </div>

          {/* Plan Benefits */}
          {plan.includes && plan.includes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-primary" />
                <h3 className="text-label-md font-black text-primary uppercase tracking-widest">Clinical Benefits Included</h3>
              </div>
              <ul className="space-y-3">
                {plan.includes.map((benefit, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                    className="flex items-start gap-3 bg-surface-container rounded-xl px-5 py-4"
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                      <Check size={12} className="text-tertiary-container" strokeWidth={3} />
                    </div>
                    <span className="text-body-md text-on-surface font-medium">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Zero Risk Guarantee note */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-5 rounded-xl bg-gradient-to-br from-[#EEF9F1] to-[#E2F5E9] border border-[#74B72E]/30 flex items-start gap-3"
          >
            <Zap size={18} className="text-[#74B72E] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-[#0A1929] font-bold mb-1 text-sm">Zero Risk Carry-Forward</h4>
              <p className="text-surface-tint text-sm font-medium leading-relaxed">
                If unused this year, your benefits automatically <span className="text-primary font-bold">carry forward</span> with a complimentary <span className="text-primary font-bold">6-month extension!</span>
              </p>
            </div>
          </motion.div>

          {/* Note */}
          {plan.note && (
            <div className="mt-4 px-5 py-4 bg-surface-container rounded-xl outline-ghost">
              <p className="text-label-md text-surface-tint italic">{plan.note}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="btn-tertiary flex-1"
            >
              Close
            </button>
            <a href="tel:+918109424356" className="btn-primary flex-[2] text-center">
              <BadgeCheck size={16} className="mr-2" />
              Contact Concierge
            </a>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Profile Component ───────────────────────────────────────────────────
export default function Profile() {
  const { user, setUser, logoutUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  
  const [userPlans, setUserPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) { navigate('/auth'); return; }

    const fetchData = async () => {
      if (!user?.user_id) return;
      try {
        // Fetch user administrative details
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.user_id.toString())
          .single();

        if (userData && !userError) {
          setForm({
            name: userData.name || '',
            phone: userData.phone || '',
            email: userData.email || '',
            address: userData.address || '',
          });
        }

        // Fetch plans collection → full plan data map by planId
        const { data: plansData, error: plansError } = await supabase
          .from('plans')
          .select('*');

        const planDataMap = {};
        if (plansData && !plansError) {
          plansData.forEach(p => {
            planDataMap[p.id] = {
              id: p.id,
              title: p.title,
              description: p.description,
              discountedPrice: p.discountedPrice,
              actualPrice: p.actualPrice,
              duration: p.duration,
              note: p.note,
              planType: p.planType,
              isBestseller: p.isBestseller,
              includes: p.includes || [],
            };
          });
        }

        // Fetch purchases (userId as string or integer checks)
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('purchases')
          .select('*')
          .eq('userId', user.user_id.toString());

        let allPurchases = purchasesData || [];
        if (!purchasesError && !isNaN(Number(user.user_id))) {
          const { data: numericPurchases } = await supabase
            .from('purchases')
            .select('*')
            .eq('userId', Number(user.user_id));
          if (numericPurchases) {
            numericPurchases.forEach(p => {
              if (!allPurchases.find(x => x.id === p.id)) {
                allPurchases.push(p);
              }
            });
          }
        }

        if (allPurchases.length > 0) {
          const plansList = allPurchases
            .filter(pData => {
              return Boolean(planDataMap[pData.planId] || planDataMap[String(pData.planId)]);
            })
            .map(pData => {
              const planInfo = planDataMap[pData.planId] || planDataMap[String(pData.planId)];

              // Resolve title
              const title = pData.planTitle || planInfo.title || 'Membership Plan';
              // Resolve duration
              const durationDays = parseDurationDays(
                planInfo.duration ?? pData.duration ?? 365
              );

              return {
                id: pData.planId || 'UNKNOWN',
                title,
                description: planInfo.description || '',
                status: pData.status === 'SUCCESS' ? 'Active' : (pData.status || 'Active'),
                purchasedOn: pData.createdAt || new Date().toISOString(),
                price: pData.amount || planInfo.discountedPrice || 999,
                durationDays,
                includes: planInfo.includes || [],
                note: planInfo.note || '',
                planType: planInfo.planType || '',
              };
            });
          setUserPlans(plansList);

        } else if (userData && (userData.planId || userData.plan_id)) {
          const activePlanId = userData.planId || userData.plan_id;
          const planInfo = planDataMap[activePlanId] || planDataMap[String(activePlanId)];
          
          if (planInfo) {
            const durationDays = parseDurationDays(planInfo.duration);
            setUserPlans([{
              id: activePlanId,
              title: userData.planTitle || userData.plan_title || planInfo.title || 'Membership Plan',
              description: planInfo.description || '',
              status: 'Active',
              purchasedOn: userData.planPurchasedAt || userData.plan_purchased_at || userData.createdAt || new Date().toISOString(),
              price: planInfo.discountedPrice || 999,
              durationDays,
              includes: planInfo.includes || [],
              note: planInfo.note || '',
              planType: planInfo.planType || '',
            }]);
          } else {
             setUserPlans([]);
          }
        } else {
          setUserPlans([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load clinical record.');
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) fetchData();
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      if (!form.name || !form.phone || !form.email || !form.address)
        throw new Error('Verification requires all fields.');
      
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
        })
        .eq('id', user.user_id.toString());

      if (updateError) throw updateError;
      
      setUser(prev => ({ ...prev, name: form.name, phone: form.phone }));
      setSuccess('Clinical records updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Verification system failure. Retry.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logoutUser(); navigate('/'); };

  if (authLoading || loading) {
    return (
      <div className="min-h-dvh pt-32 pb-24 bg-surface flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-dvh pt-32 md:pt-40 pb-24 bg-surface px-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-surface-container-low rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />

      {/* Plan Detail Modal */}
      {selectedPlan && (
        <PlanDetailModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">

        {/* SIDEBAR */}
        <aside className="w-full md:w-80 shrink-0 md:sticky md:top-36 space-y-8">
          <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-8 shadow-ambient outline-ghost relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="flex items-center gap-5 mb-12 relative z-10">
              <div className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center text-headline-md shadow-ambient">
                {form.name.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-title-lg text-primary truncate leading-tight">{form.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck size={12} className="text-tertiary" />
                  <p className="text-label-md text-surface-tint uppercase tracking-wider font-bold">Verified Patient</p>
                </div>
              </div>
            </div>

            <nav className="space-y-3 relative z-10">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[var(--radius-md)] transition-all ${activeTab === 'profile' ? 'bg-surface-container text-primary shadow-sm outline-ghost' : 'text-surface-tint hover:bg-surface-container-low'}`}
              >
                <UserCircle size={20} className={activeTab === 'profile' ? 'text-primary' : 'text-primary-fixed-dim'} />
                <span className="text-label-md font-bold uppercase tracking-widest">Clinical Data</span>
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[var(--radius-md)] transition-all ${activeTab === 'plans' ? 'bg-surface-container text-primary shadow-sm outline-ghost' : 'text-surface-tint hover:bg-surface-container-low'}`}
              >
                <Star size={20} className={activeTab === 'plans' ? 'text-primary' : 'text-primary-fixed-dim'} />
                <span className="text-label-md font-bold uppercase tracking-widest">Memberships</span>
                {userPlans.length > 0 && <span className="ml-auto w-2 h-2 bg-tertiary rounded-full animate-pulse" />}
              </button>
            </nav>

            <div className="mt-12 pt-8 border-t outline-ghost border-transparent border-dashed">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-[var(--radius-md)] text-label-md font-bold text-error uppercase tracking-widest hover:bg-error-container transition-all">
                <LogOut size={18} />Terminate Session
              </button>
            </div>
          </div>

          <div className="bg-tertiary-container rounded-[var(--radius-xl)] p-8 outline-ghost hidden md:block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
            <h4 className="relative z-10 text-label-md text-tertiary-fixed font-bold uppercase tracking-widest mb-4">Concierge Support</h4>
            <p className="relative z-10 text-body-md text-tertiary-fixed/80 mb-6 italic leading-relaxed">
              "Dedicated priority line for verified members. Reach our clinical team instantly."
            </p>
            <a href="tel:+918109424356" className="relative z-10 text-title-lg text-white font-bold hover:text-tertiary-fixed transition-colors">81094 24356</a>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-ambient p-10 md:p-16 outline-ghost relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-20">
                  <div>
                    <h1 className="text-display-lg text-primary mb-4 leading-none">Clinical Record</h1>
                    <p className="text-body-md text-surface-tint">Verified administrative and medical identification.</p>
                  </div>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn-tertiary shadow-sm bg-surface-container text-primary outline-ghost hover:shadow-ambient">
                      <Edit2 size={16} className="mr-2" />Update Registry
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave} className="space-y-12 relative z-10">
                  <div className="space-y-2">
                    <label className="text-label-md text-primary/50 uppercase tracking-widest font-bold">Individual Identity</label>
                    <input name="name" value={form.name} onChange={handleChange} disabled={!isEditing} className="w-full bg-surface-container-low border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-6 py-5 outline-none transition-all text-title-lg text-primary disabled:opacity-80 disabled:cursor-not-allowed font-medium" placeholder="Verified Full Name" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-label-md text-primary/50 uppercase tracking-widest font-bold">Secure Contact Phone</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} disabled={!isEditing} className="w-full bg-surface-container-low border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-6 py-5 outline-none transition-all text-title-lg text-primary disabled:opacity-80 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-label-md text-primary/50 uppercase tracking-widest font-bold">Encrypted Email Address</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing} className="w-full bg-surface-container-low border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-6 py-5 outline-none transition-all text-title-lg text-primary disabled:opacity-80 font-medium" placeholder="medical-id@smilesathi.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-label-md text-primary/50 uppercase tracking-widest font-bold">Registered Clinical Site / Address</label>
                    <textarea name="address" value={form.address} onChange={handleChange} disabled={!isEditing} rows={4} className="w-full bg-surface-container-low border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-6 py-5 outline-none transition-all text-title-lg text-primary disabled:opacity-80 resize-none font-medium" />
                  </div>

                  {(error || success) && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-[var(--radius-md)] flex items-center gap-4 ${error ? 'bg-error-container text-error' : 'bg-tertiary-fixed text-tertiary-container'}`}>
                      {error ? <AlertCircle size={20} /> : <Check size={20} />}
                      <span className="text-label-md font-bold tracking-wide">{error || success}</span>
                    </motion.div>
                  )}

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t outline-ghost border-transparent">
                      <button type="button" onClick={() => { setIsEditing(false); setError(''); }} className="btn-tertiary sm:flex-1">Discard Changes</button>
                      <button type="submit" disabled={saving} className="btn-primary sm:flex-[2] disabled:opacity-80">
                        {saving ? <Loader2 size={24} className="animate-spin text-on-primary" /> : 'Authorize Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {activeTab === 'plans' && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-ambient p-10 md:p-16 outline-ghost"
              >
                <div className="mb-20">
                  <h2 className="text-display-lg text-primary mb-4 leading-none">Memberships</h2>
                  <p className="text-body-md text-surface-tint">Active clinical coverage and financial precision plans.</p>
                </div>

                {userPlans.length > 0 ? (
                  <div className="space-y-10">
                    {userPlans.map((plan, i) => {
                      const expiryDate = calcExpiry(plan.purchasedOn, plan.durationDays);
                      const daysLeft = daysUntilExpiry(expiryDate);
                      const progress = coverageProgress(plan.purchasedOn, expiryDate);
                      const isExpired = daysLeft === 0;

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="bg-surface-container-low rounded-[var(--radius-xl)] p-8 md:p-10 outline-ghost transition-shadow hover:shadow-ambient group"
                        >
                          {/* Top row */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <div className="trust-shield bg-surface-container-lowest">
                                  <Sparkles size={16} className="text-tertiary" />
                                  <span className="text-label-md text-primary font-bold">Clinical Priority</span>
                                </div>
                                <span className={`text-label-md font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isExpired ? 'bg-error-container text-error' : 'bg-tertiary-fixed text-tertiary-fixed-variant'}`}>
                                  {isExpired ? 'Expired' : plan.status}
                                </span>
                              </div>
                              <h3 className="text-3xl md:text-5xl font-black text-primary leading-tight mb-2">{plan.title}</h3>
                              <p className="text-label-md text-surface-tint font-bold tracking-[0.1em] uppercase">
                                Activated: {new Date(plan.purchasedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>

                            {/* Registry Token */}
                            <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                              <p className="text-headline-md text-primary leading-none">Registry Token</p>
                              <p className="text-title-lg text-surface-tint font-bold opacity-60">#{plan.id}</p>
                            </div>
                          </div>

                          {/* Mini progress */}
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs font-bold uppercase tracking-widest text-surface-tint">Coverage Used</span>
                              <span className={`text-xs font-black ${isExpired ? 'text-error' : daysLeft <= 30 ? 'text-yellow-600' : 'text-tertiary'}`}>
                                {isExpired ? 'Expired' : `${daysLeft}d left → ${expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 }}
                                className={`h-full rounded-full ${isExpired ? 'bg-error' : progress > 75 ? 'bg-yellow-500' : 'bg-tertiary'}`}
                              />
                            </div>
                          </div>

                          {/* View Details Button */}
                          <button
                            onClick={() => setSelectedPlan(plan)}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container text-primary font-bold text-label-md outline-ghost hover:bg-primary hover:text-on-primary transition-all group-hover:shadow-sm"
                          >
                            <BookOpen size={16} />
                            View Details
                            <ChevronRight size={14} className="ml-auto" />
                          </button>
                        </motion.div>
                      );
                    })}

                    <div className="mt-12 p-8 bg-surface-container-high rounded-[var(--radius-md)] flex items-start gap-4 italic opacity-80">
                      <AlertCircle size={20} className="text-primary mt-1 shrink-0" />
                      <p className="text-body-md text-primary">
                        Your clinical coverage is active and verified by SmileSathi Administrative Systems.
                        Bring your digital identity for priority concierge service at all clinics.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24 bg-surface rounded-[var(--radius-xl)] outline-ghost border-dashed border-2 border-surface-container-high">
                    <div className="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-8 shadow-ambient outline-ghost">
                      <Star size={32} className="text-primary-fixed-dim" />
                    </div>
                    <h3 className="text-headline-md text-primary mb-4">No Active Coverage</h3>
                    <p className="text-body-md text-surface-tint max-w-sm mx-auto mb-12">
                      Secure your dental health with architectural reliability. Explore our precision care plans.
                    </p>
                    <Link to="/plans" className="btn-primary">Explore Precision Care</Link>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

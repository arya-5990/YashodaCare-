import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogOut, Check, Edit2, UserCircle, Star, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user, setUser, logoutUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [userPlans, setUserPlans] = useState([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      if (!user?.user_id) return;
      try {
        const userRef = doc(db, 'users', user.user_id.toString());
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setForm({
            name: data.name || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || ''
          });
        }
        
        // Scan the purchases collection for active plans
        const purchasesRef = collection(db, 'purchases');
        const queries = [getDocs(query(purchasesRef, where('userId', '==', user.user_id.toString())))];
        if (!isNaN(Number(user.user_id))) {
          queries.push(getDocs(query(purchasesRef, where('userId', '==', Number(user.user_id)))));
        }
        
        const snaps = await Promise.all(queries);
        const allDocs = snaps.flatMap(s => s.docs).reduce((acc, doc) => {
          if(!acc.find(d => d.id === doc.id)) acc.push(doc);
          return acc;
        }, []);

        if (allDocs.length > 0) {
          const plansList = allDocs.map(d => {
            const pData = d.data();
            let title = pData.planTitle || 'Premium Dental Plan';
            if (!pData.planTitle && pData.planId === "1002") title = 'Family Dental Plan';
            
            return {
              id: pData.planId || 'UNKNOWN',
              title: title,
              status: pData.status === 'SUCCESS' ? 'Active' : pData.status,
              purchasedOn: pData.createdAt?.toDate ? pData.createdAt.toDate().toISOString() : (pData.createdAt || new Date().toISOString()),
              price: pData.amount || 999
            };
          });
          setUserPlans(plansList);
        } else if (userSnap.exists() && userSnap.data().plan_id) {
          // Fallback to legacy user doc info if no purchases found
          const data = userSnap.data();
          setUserPlans([{
            id: data.plan_id,
            title: data.plan_title || 'Premium Dental Plan',
            status: 'Active',
            purchasedOn: data.plan_purchased_at || data.createdAt || new Date().toISOString(),
            price: data.plan_price || 999
          }]);
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

    if (user && !authLoading) {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!form.name || !form.phone || !form.email || !form.address) {
        throw new Error('Verification requires all fields.');
      }

      const userRef = doc(db, 'users', user.user_id.toString());
      await updateDoc(userRef, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        updatedAt: new Date().toISOString()
      });

      setUser((prev) => ({ ...prev, name: form.name, phone: form.phone }));
      
      const stored = localStorage.getItem('auth_token');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('auth_token', JSON.stringify({ ...parsed, name: form.name, phone: form.phone }));
      }

      setSuccess('Clinical records updated successfully.');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Verification system failure. Retry.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-dvh pt-32 pb-24 bg-surface flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-dvh pt-32 md:pt-40 pb-24 bg-surface px-5 relative overflow-hidden">
      {/* Background Layering */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-surface-container-low rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        
        {/* SIDEBAR NAVIGATION - Sticky Editorial Component */}
        <aside className="w-full md:w-80 shrink-0 md:sticky md:top-36 space-y-8">
          <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-8 shadow-ambient outline-ghost relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3" />
            
            {/* User Identity Segment */}
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
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[var(--radius-md)] transition-all ${
                  activeTab === 'profile' 
                    ? 'bg-surface-container text-primary shadow-sm outline-ghost' 
                    : 'text-surface-tint hover:bg-surface-container-low'
                }`}
              >
                <UserCircle size={20} className={activeTab === 'profile' ? 'text-primary' : 'text-primary-fixed-dim'} />
                <span className="text-label-md font-bold uppercase tracking-widest">Clinical Data</span>
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[var(--radius-md)] transition-all ${
                  activeTab === 'plans' 
                    ? 'bg-surface-container text-primary shadow-sm outline-ghost' 
                    : 'text-surface-tint hover:bg-surface-container-low'
                }`}
              >
                <Star size={20} className={activeTab === 'plans' ? 'text-primary' : 'text-primary-fixed-dim'} />
                <span className="text-label-md font-bold uppercase tracking-widest">Memberships</span>
                {userPlans.length > 0 && (
                   <span className="ml-auto w-2 h-2 bg-tertiary rounded-full animate-pulse" />
                )}
              </button>
            </nav>

            <div className="mt-12 pt-8 border-t outline-ghost border-transparent border-dashed">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-[var(--radius-md)] text-label-md font-bold text-error uppercase tracking-widest hover:bg-error-container transition-all"
              >
                <LogOut size={18} />
                Terminate Session
              </button>
            </div>
          </div>
          
          {/* Support Highlight Card */}
          <div className="bg-tertiary-container rounded-[var(--radius-xl)] p-8 outline-ghost hidden md:block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
            <h4 className="relative z-10 text-label-md text-tertiary-fixed font-bold uppercase tracking-widest mb-4">Concierge Support</h4>
            <p className="relative z-10 text-body-md text-tertiary-fixed/80 mb-6 italic leading-relaxed">
              "Dedicated priority line for verified members. Reach our clinical team instantly."
            </p>
            <a href="tel:+918109424356" className="relative z-10 text-title-lg text-white font-bold hover:text-tertiary-fixed transition-colors">81094 24356</a>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-ambient p-10 md:p-16 shadow-ambient outline-ghost relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-20">
                  <div>
                    <h1 className="text-display-lg text-primary mb-4 leading-none">Clinical Record</h1>
                    <p className="text-body-md text-surface-tint">Verified administrative and medical identification.</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-tertiary shadow-sm bg-surface-container text-primary outline-ghost hover:shadow-ambient"
                    >
                      <Edit2 size={16} className="mr-2" />
                      Update Registry
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave} className="space-y-12 relative z-10">
                  <div className="space-y-2">
                    <label className="text-label-md text-primary/50 uppercase tracking-widest font-bold">Individual Identity</label>
                    <input 
                      name="name" value={form.name} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-surface-container-low border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-6 py-5 outline-none transition-all text-title-lg text-primary disabled:opacity-80 disabled:cursor-not-allowed font-medium"
                      placeholder="Verified Full Name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-label-md text-primary/50 uppercase tracking-widest font-bold">Secure Contact Phone</label>
                      <input 
                        type="tel" name="phone" value={form.phone} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-surface-container-low border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-6 py-5 outline-none transition-all text-title-lg text-primary disabled:opacity-80 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-label-md text-primary/50 uppercase tracking-widest font-bold">Encrypted Email Address</label>
                      <input 
                        type="email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-surface-container-low border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-6 py-5 outline-none transition-all text-title-lg text-primary disabled:opacity-80 font-medium"
                        placeholder="medical-id@smilesathi.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-label-md text-primary/50 uppercase tracking-widest font-bold">Registered Clinical Site / Address</label>
                    <textarea 
                      name="address" value={form.address} onChange={handleChange} disabled={!isEditing} rows={4}
                      className="w-full bg-surface-container-low border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-6 py-5 outline-none transition-all text-title-lg text-primary disabled:opacity-80 resize-none font-medium"
                    />
                  </div>

                  {(error || success) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-[var(--radius-md)] flex items-center gap-4 ${error ? 'bg-error-container text-error' : 'bg-tertiary-fixed text-tertiary-container'}`}
                    >
                      {error ? <AlertCircle size={20} /> : <Check size={20} />}
                      <span className="text-label-md font-bold tracking-wide">{error || success}</span>
                    </motion.div>
                  )}

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t outline-ghost border-transparent">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setError(''); }}
                        className="btn-tertiary sm:flex-1"
                      >
                        Discard Changes
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary sm:flex-[2] disabled:opacity-80"
                      >
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
                    {userPlans.map((plan, i) => (
                      <div key={i} className="bg-surface-container-low rounded-[var(--radius-xl)] p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 outline-ghost transition-transform hover:scale-[1.01] hover:shadow-ambient">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="trust-shield bg-surface-container-lowest">
                              <Sparkles size={16} className="text-tertiary" />
                              <span className="text-label-md text-primary font-bold">Clinical Priority</span>
                            </div>
                            <span className="text-label-md font-bold text-tertiary-fixed-variant uppercase tracking-widest bg-tertiary-fixed px-3 py-1 rounded-full">{plan.status}</span>
                          </div>
                          <h3 className="text-display-lg text-primary text-3xl md:text-5xl mb-3">{plan.title}</h3>
                          <p className="text-label-md text-surface-tint font-bold tracking-[0.1em] uppercase">
                            Activation Epoch: {new Date(plan.purchasedOn).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-start lg:items-end gap-3 text-left lg:text-right">
                          <p className="text-headline-md text-primary leading-none">Registry Token</p>
                          <p className="text-title-lg text-surface-tint font-bold opacity-60">#{plan.id}</p>
                        </div>
                      </div>
                    ))}
                    
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
                    <Link 
                      to="/plans" 
                      className="btn-primary"
                    >
                      Explore Precision Care
                    </Link>
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

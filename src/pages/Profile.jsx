import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogOut, Check, Edit2, UserCircle, Star, Sparkles, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, setUser, logoutUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  // Profile Form States
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
  
  // Plasm State
  const [userPlans, setUserPlans] = useState([]);

  useEffect(() => {
    // If auth is loaded and no user, boot them
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    // Fetch full user details and plans if logged in
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
          
          // Check if they have purchased a plan in the database
          if (data.plan_id) {
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
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile details.');
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
        throw new Error('All fields are required.');
      }

      const userRef = doc(db, 'users', user.user_id.toString());
      await updateDoc(userRef, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        updatedAt: new Date().toISOString()
      });

      // Update local Context state
      setUser((prev) => ({ ...prev, name: form.name, phone: form.phone }));
      
      // Update local storage so session persists new data
      const stored = localStorage.getItem('auth_token');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('auth_token', JSON.stringify({ ...parsed, name: form.name, phone: form.phone }));
      }

      setSuccess('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update profile. Please try again.');
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
      <div className="min-h-dvh pt-24 pb-16 bg-warm-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-teal-800" />
      </div>
    );
  }

  return (
    <main className="min-h-dvh pt-28 md:pt-36 pb-16 bg-warm-50 px-5 relative">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-72 shrink-0 md:sticky md:top-32">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-teal-900/5 border border-gray-100">
            
            {/* User Mini Profile */}
            <div className="flex items-center gap-4 mb-8 px-2">
              <div className="w-14 h-14 bg-teal-800 text-white rounded-full flex items-center justify-center font-display font-bold text-2xl uppercase shadow-md shadow-teal-900/20 shrink-0">
                {form.name.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-teal-950 truncate text-[16px]">{form.name}</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5 tracking-wide uppercase">Patient Account</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-medium transition-all text-sm ${
                  activeTab === 'profile' 
                    ? 'bg-teal-50 text-teal-800 shadow-sm shadow-teal-900/5' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <UserCircle size={18} className={activeTab === 'profile' ? 'text-teal-700' : 'text-gray-400'} />
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-medium transition-all text-sm ${
                  activeTab === 'plans' 
                    ? 'bg-teal-50 text-teal-800 shadow-sm shadow-teal-900/5' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star size={18} className={activeTab === 'plans' ? 'text-teal-700' : 'text-gray-400'} />
                My Subscriptions
                {userPlans.length > 0 && (
                   <span className="ml-auto bg-coral text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                     {userPlans.length}
                   </span>
                )}
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-100 px-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            
            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-teal-900/5 p-8 md:p-12 border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
                  <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-teal-950 mb-1">Personal Details</h1>
                    <p className="text-sm text-gray-500">View and update your contact information</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 bg-teal-50 px-5 py-2.5 rounded-full hover:bg-teal-100 transition-colors self-start sm:self-auto"
                    >
                      <Edit2 size={14} />
                      Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave} className="space-y-6 relative z-10">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Full Name</label>
                    <input 
                      name="name" value={form.name} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-xl px-4 py-3.5 outline-none transition-all text-[15px] font-medium text-gray-800 disabled:opacity-75 disabled:bg-gray-50/50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                      <input 
                        type="tel" name="phone" value={form.phone} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-xl px-4 py-3.5 outline-none transition-all text-[15px] font-medium text-gray-800 disabled:opacity-75 disabled:bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Email Address</label>
                      <input 
                        type="email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-xl px-4 py-3.5 outline-none transition-all text-[15px] font-medium text-gray-800 disabled:opacity-75 disabled:bg-gray-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Residential Address</label>
                    <textarea 
                      name="address" value={form.address} onChange={handleChange} disabled={!isEditing} rows={3}
                      className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-xl px-4 py-3.5 outline-none transition-all text-[15px] font-medium text-gray-800 disabled:opacity-75 disabled:bg-gray-50/50 resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg font-medium border border-red-100 flex items-center gap-2">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-emerald-50 text-emerald-700 text-[13px] px-4 py-3 rounded-lg font-medium border border-emerald-100 flex items-center gap-2">
                      <Check size={16} /> {success}
                    </div>
                  )}

                  {isEditing && (
                    <div className="flex gap-3 pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setError(''); }}
                        className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all text-[15px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-[2] bg-teal-800 text-white font-bold flex justify-center items-center py-3.5 rounded-xl hover:bg-teal-900 active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20 disabled:opacity-70 disabled:pointer-events-none text-[15px]"
                        style={{ color: '#ffffff' }}
                      >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {/* TAB: PLANS */}
            {activeTab === 'plans' && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-teal-900/5 p-8 md:p-12 border border-gray-100"
              >
                <div className="mb-10">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-teal-950 mb-1">My Subscriptions</h2>
                  <p className="text-sm text-gray-500">Manage your active dental health plans</p>
                </div>

                {userPlans.length > 0 ? (
                  <div className="space-y-6">
                    {userPlans.map((plan, i) => (
                      <div key={i} className="border border-teal-100 bg-teal-50/30 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <Sparkles size={16} className="text-coral" />
                            <h3 className="font-display text-xl font-bold text-teal-950">{plan.title}</h3>
                          </div>
                          <p className="text-[13px] text-gray-500 font-medium tracking-wide">
                            Activated on: {new Date(plan.purchasedOn).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {plan.status}
                          </span>
                          <p className="text-[13px] text-teal-800 font-semibold font-mono">ID: {plan.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                      <Star size={24} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No Active Plans Found</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                      You are not currently subscribed to any Yashoda Care+ dental health plans.
                    </p>
                    <Link 
                      to="/plans" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-teal-800 text-white font-semibold rounded-xl hover:bg-teal-900 transition-colors shadow-lg shadow-teal-900/20 text-sm"
                      style={{ color: '#ffffff' }}
                    >
                      Explore Memberships
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

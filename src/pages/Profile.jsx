import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogOut, Check, Edit2 } from 'lucide-react';

export default function Profile() {
  const { user, setUser, logoutUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
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

  useEffect(() => {
    // If auth is loaded and no user, boot them
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    // Fetch full user details if logged in
    const fetchProfile = async () => {
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
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchProfile();
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
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-teal-900/5 p-8 md:p-10 border border-gray-100 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-800 text-white rounded-full flex items-center justify-center font-display font-bold text-2xl uppercase shadow-md shadow-teal-900/20">
                {form.name.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-teal-950">
                  {form.name.split(' ')[0]}'s Profile
                </h1>
                <p className="text-sm text-gray-500">Manage your patient details</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-colors"
              >
                <Edit2 size={14} />
                Edit
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-5 relative z-10">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input 
                name="name" value={form.name} onChange={handleChange} disabled={!isEditing}
                className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-4 py-3 outline-none transition-all text-[15px] text-gray-800 disabled:opacity-70 disabled:bg-gray-50"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                <input 
                  type="tel" name="phone" value={form.phone} onChange={handleChange} disabled={!isEditing}
                  className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-4 py-3 outline-none transition-all text-[15px] font-medium text-gray-800 disabled:opacity-70 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                <input 
                  type="email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing}
                  className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-4 py-3 outline-none transition-all text-[15px] text-gray-800 disabled:opacity-70 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Residential Address</label>
              <textarea 
                name="address" value={form.address} onChange={handleChange} disabled={!isEditing} rows={2}
                className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-4 py-3 outline-none transition-all text-[15px] text-gray-800 disabled:opacity-70 disabled:bg-gray-50 resize-none"
              />
            </div>

            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 text-red-600 text-[13px] px-4 py-3 rounded-lg font-medium border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 text-emerald-700 text-[13px] px-4 py-3 rounded-lg font-medium border border-emerald-100 flex items-center gap-2">
                <Check size={16} />
                {success}
              </div>
            )}

            {/* Actions */}
            {isEditing ? (
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] bg-teal-800 text-white font-semibold flex justify-center items-center py-3.5 rounded-xl hover:bg-teal-900 active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20 disabled:opacity-70 disabled:pointer-events-none"
                  style={{ color: '#ffffff' }}
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 font-semibold py-3.5 rounded-xl hover:bg-red-100 active:scale-[0.98] transition-all"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </main>
  );
}

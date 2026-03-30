import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, doc, setDoc, query, where, getDocs, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginUser, user, loading: authLoading } = useAuth();

  // Redirect if logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/plans');
    }
  }, [user, authLoading, navigate]);

  // Form states
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  });

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // --- MANUAL LOGIN ---
        if (!form.phone || !form.password) throw new Error('Please fill all fields');
        
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', form.phone));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('Invalid phone number or password.');
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // 1. Cross-check bcrypt manually hashed password
        const isMatch = bcrypt.compareSync(form.password, userData.password);
        if (!isMatch) {
          throw new Error('Invalid phone number or password.');
        }

        // 2. Set Context and DB Token
        await loginUser({
          user_id: userData.user_id, 
          name: userData.name, 
          phone: userData.phone
        });
        
        navigate('/plans');
      } else {
        // --- MANUAL REGISTRATION ---
        if (!form.name || !form.phone || !form.email || !form.password || !form.address) {
          throw new Error('Please fill all fields');
        }
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (form.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const usersRef = collection(db, 'users');

        // 1. Prevent duplicate phone registration
        const checkQ = query(usersRef, where('phone', '==', form.phone));
        const dupCheck = await getDocs(checkQ);
        if (!dupCheck.empty) {
          throw new Error('An account with this phone number already exists.');
        }

        // 2. Hash Password Securely with bcrypt
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(form.password, salt);

        // 3. Auto Increment logic using Firestore transaction
        const counterRef = doc(db, '_metadata', 'userIdCounter');
        let newUserId;
        
        await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          if (!counterDoc.exists()) {
            transaction.set(counterRef, { currentId: 1000 });
            newUserId = 1000;
          } else {
            newUserId = counterDoc.data().currentId + 1;
            transaction.update(counterRef, { currentId: newUserId });
          }
        });

        // 4. Store user data exactly as requested into `users` collection
        const userDocRef = doc(usersRef, newUserId.toString());
        await setDoc(userDocRef, {
          user_id: newUserId,
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          password: hashedPassword,
          createdAt: new Date().toISOString()
        });

        // 5. Store session and token
        await loginUser({
          user_id: newUserId, 
          name: form.name, 
          phone: form.phone
        });

        navigate('/plans');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh pt-24 pb-16 bg-warm-50 flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-teal-900/5 p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-teal-950 mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-gray-500">
            {isLogin 
              ? 'Enter your details to access your Yashoda Care+ portal.' 
              : 'Join Yashoda Care+ for seamless health management.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <input 
                      name="name" value={form.name} onChange={handleChange}
                      className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-4 py-2.5 outline-none transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                    <input 
                      type="email" name="email" value={form.email} onChange={handleChange}
                      className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-4 py-2.5 outline-none transition-all text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Residential Address</label>
                    <input 
                      name="address" value={form.address} onChange={handleChange}
                      className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-4 py-2.5 outline-none transition-all text-sm"
                      placeholder="123 AB Road, Indore"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
            <input 
              type="tel" name="phone" value={form.phone} onChange={handleChange}
              className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-4 py-2.5 outline-none transition-all text-sm font-medium"
              placeholder="8109424356"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg pl-4 pr-10 py-2.5 outline-none transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-700 transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                      className="w-full bg-warm-50 border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg pl-4 pr-10 py-2.5 outline-none transition-all text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-700 transition-colors"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs px-4 py-3 rounded-lg font-medium border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-800 text-white font-semibold flex justify-center items-center py-3 rounded-lg mt-2 hover:bg-teal-900 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
            style={{ color: '#ffffff' }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? 'Log In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setForm({ name: '', phone: '', email: '', password: '', confirmPassword: '', address: '' });
              }}
              className="text-teal-700 font-semibold hover:text-teal-900 transition-colors"
            >
              {isLogin ? 'Register now' : 'Log in here'}
            </button>
          </p>
        </div>

      </div>
    </main>
  );
}

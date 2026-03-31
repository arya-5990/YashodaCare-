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

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/plans');
    }
  }, [user, authLoading, navigate]);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    pincode: '',
    referral: ''
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
        if (!form.phone || !form.password) throw new Error('Please fill all fields');
        
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', form.phone));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('Invalid phone number or password.');
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        const isMatch = bcrypt.compareSync(form.password, userData.password);
        if (!isMatch) {
          throw new Error('Invalid phone number or password.');
        }

        await loginUser({
          user_id: userData.user_id, 
          name: userData.name, 
          phone: userData.phone
        });
        
        navigate('/plans');
      } else {
        if (!form.name || !form.phone || !form.email || !form.password || !form.address || !form.pincode) {
          throw new Error('Please fill all fields');
        }
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (form.password.length < 6) {
          throw new Error('Minimum 6 digit password required');
        }

        const usersRef = collection(db, 'users');

        const checkQ = query(usersRef, where('phone', '==', form.phone));
        const dupCheck = await getDocs(checkQ);
        if (!dupCheck.empty) {
          throw new Error('An account with this phone number already exists.');
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(form.password, salt);

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

        const userDocRef = doc(usersRef, newUserId.toString());
        await setDoc(userDocRef, {
          user_id: newUserId,
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          pincode: form.pincode,
          password: hashedPassword,
          referral: form.referral || '',
          createdAt: new Date().toISOString()
        });

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
    <main className="min-h-dvh pt-32 pb-24 bg-surface flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-ambient p-10 outline-ghost">
        
        <div className="text-center mb-10">
          <h1 className="text-headline-md text-primary mb-3">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-body-md text-surface-tint">
            {isLogin 
              ? 'Enter your details to access your SmileSathi portal.' 
              : 'Join SmileSathi for seamless health management.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-5">
                  <div>
                    <label className="text-label-md text-primary mb-2 block">Full Name</label>
                    <input 
                      name="name" value={form.name} onChange={handleChange}
                      className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-label-md text-primary mb-2 block">Email Address</label>
                    <input 
                      type="email" name="email" value={form.email} onChange={handleChange}
                      className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-label-md text-primary mb-2 block">Residential Address</label>
                    <input 
                      name="address" value={form.address} onChange={handleChange}
                      className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md"
                      placeholder="123 AB Road, Indore"
                    />
                  </div>
                  <div>
                    <label className="text-label-md text-primary mb-2 block">Pincode</label>
                    <input 
                      name="pincode" type="text" inputMode="numeric" value={form.pincode} onChange={handleChange}
                      className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md"
                      placeholder="452001"
                      maxLength={6}
                    />
                  </div>
                  <div>
                    <label className="text-label-md text-primary mb-2 block">Referral Code (Optional)</label>
                    <input 
                      name="referral" value={form.referral} onChange={handleChange}
                      className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md uppercase"
                      placeholder="REF123"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-label-md text-primary mb-2 block">Phone Number</label>
            <input 
              type="tel" name="phone" value={form.phone} onChange={handleChange}
              className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md font-medium"
              placeholder="8109424356"
            />
          </div>

          <div>
            <label className="text-label-md text-primary mb-2 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] pl-4 pr-12 py-3 outline-none transition-all text-body-md"
                placeholder="••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-fixed-dim hover:text-primary transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                <div className="pt-1">
                  <label className="text-label-md text-primary mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                      className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] pl-4 pr-12 py-3 outline-none transition-all text-body-md"
                      placeholder="••••••"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-fixed-dim hover:text-primary transition-colors"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="bg-error-container text-error text-label-md px-4 py-3 rounded-[var(--radius-md)] font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-4 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin text-on-primary" /> : (isLogin ? 'Log In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-10 pt-8 border-none flex justify-center">
          <p className="text-body-md text-surface-tint">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setForm({ name: '', phone: '', email: '', password: '', confirmPassword: '', address: '', pincode: '', referral: '' });
              }}
              className="text-primary font-semibold hover:underline transition-colors ml-1"
            >
              {isLogin ? 'Register now' : 'Log in here'}
            </button>
          </p>
        </div>

      </div>
    </main>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, doc, setDoc, query, where, getDocs, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, Eye, EyeOff, KeyRound, Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'https://us-central1-ydcplans.cloudfunctions.net';

// ─── Forgot Password Modal ────────────────────────────────────────────────────
// step: 'phone' → 'otp' → 'reset' → 'done'
function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (!phone.trim()) return setError('Please enter your phone number.');
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BASE_URL}/sendForgotPasswordOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');
      setMaskedEmail(data.maskedEmail);
      setUserId(data.userId);
      setStep('otp');
      setResendTimer(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
    setError('');
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpStr = otp.join('');
    if (otpStr.length < 4) return setError('Please enter the 4-digit OTP.');
    // Move to reset step (actual verification happens on reset)
    setStep('reset');
    setError('');
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return setError('Please fill all fields.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    if (newPassword.length < 6) return setError('Minimum 6 character password required.');
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BASE_URL}/resetPasswordWithOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: otp.join(''), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed.');
      setStep('done');
    } catch (err) {
      setError(err.message);
      // If OTP error, go back to OTP step
      if (err.message.toLowerCase().includes('otp')) setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const stepContent = {
    phone: {
      icon: <KeyRound size={28} className="text-primary" />,
      title: 'Forgot Password?',
      subtitle: "Enter your registered phone number and we'll send an OTP to your email.",
    },
    otp: {
      icon: <Mail size={28} className="text-primary" />,
      title: 'Check your email',
      subtitle: `We sent a 4-digit OTP to ${maskedEmail}`,
    },
    reset: {
      icon: <ShieldAlert size={28} className="text-primary" />,
      title: 'Set New Password',
      subtitle: 'Choose a strong password for your account.',
    },
    done: {
      icon: <CheckCircle2 size={32} className="text-tertiary" />,
      title: 'Password Reset!',
      subtitle: 'Your password has been changed successfully. You can now log in.',
    },
  };

  const current = stepContent[step];

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

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-5 pointer-events-none"
      >
        <div className="w-full max-w-md bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-2xl p-8 pointer-events-auto outline-ghost">

          {/* Back button (not on done) */}
          {step !== 'done' && (
            <button
              onClick={() => {
                if (step === 'phone') onClose();
                else if (step === 'otp') setStep('phone');
                else if (step === 'reset') setStep('otp');
                setError('');
              }}
              className="flex items-center gap-2 text-surface-tint hover:text-primary transition-colors mb-6 text-label-md font-bold"
            >
              <ArrowLeft size={16} />
              {step === 'phone' ? 'Cancel' : 'Back'}
            </button>
          )}

          {/* Step header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 outline-ghost">
              {current.icon}
            </div>
            <h2 className="text-headline-md text-primary mb-2">{current.title}</h2>
            <p className="text-body-md text-surface-tint">{current.subtitle}</p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {['phone', 'otp', 'reset', 'done'].map((s, i) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-primary' :
                ['phone','otp','reset','done'].indexOf(s) < ['phone','otp','reset','done'].indexOf(step)
                  ? 'w-4 bg-tertiary' : 'w-4 bg-surface-container-high'
              }`} />
            ))}
          </div>

          {/* ── STEP: PHONE ── */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="text-label-md text-primary mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                  className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md font-medium"
                  placeholder="8109424356"
                />
              </div>
              {error && <p className="text-error text-label-md bg-error-container px-4 py-3 rounded-xl">{error}</p>}
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="btn-primary w-full mt-2 disabled:opacity-80"
              >
                {loading ? <Loader2 size={18} className="animate-spin text-on-primary" /> : 'Send OTP'}
              </button>
            </div>
          )}

          {/* ── STEP: OTP ── */}
          {step === 'otp' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, idx)}
                    onKeyDown={e => handleOtpKeyDown(e, idx)}
                    className="w-14 h-14 text-center text-2xl font-black bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-primary"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {error && <p className="text-error text-label-md bg-error-container px-4 py-3 rounded-xl text-center">{error}</p>}

              <button
                onClick={handleVerifyOTP}
                disabled={otp.join('').length < 4}
                className="btn-primary w-full disabled:opacity-50"
              >
                Verify OTP
              </button>

              <p className="text-center text-body-md text-surface-tint">
                {resendTimer > 0 ? (
                  <span>Resend OTP in <strong className="text-primary">{resendTimer}s</strong></span>
                ) : (
                  <button
                    onClick={() => { setStep('phone'); setOtp(['','','','']); setError(''); }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>
          )}

          {/* ── STEP: RESET ── */}
          {step === 'reset' && (
            <div className="space-y-4">
              <div>
                <label className="text-label-md text-primary mb-2 block">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(''); }}
                    className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] pl-4 pr-12 py-3 outline-none transition-all text-body-md"
                    placeholder="••••••"
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-fixed-dim hover:text-primary" tabIndex="-1">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-label-md text-primary mb-2 block">Confirm New Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                  className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md"
                  placeholder="••••••"
                  minLength={6}
                />
              </div>
              {error && <p className="text-error text-label-md bg-error-container px-4 py-3 rounded-xl">{error}</p>}
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="btn-primary w-full mt-2 disabled:opacity-80"
              >
                {loading ? <Loader2 size={18} className="animate-spin text-on-primary" /> : 'Reset Password'}
              </button>
            </div>
          )}

          {/* ── STEP: DONE ── */}
          {step === 'done' && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 rounded-full bg-tertiary-fixed/20 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 size={40} className="text-tertiary" />
              </motion.div>
              <button onClick={onClose} className="btn-primary w-full mt-4">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Auth Component ──────────────────────────────────────────────────────
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const { loginUser, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) navigate('/plans');
  }, [user, authLoading, navigate]);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', password: '',
    confirmPassword: '', address: '', pincode: '', referral: ''
  });

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      if (isLogin) {
        if (!form.phone || !form.password) throw new Error('Please fill all fields');
        const q = query(collection(db, 'users'), where('phone', '==', form.phone));
        const snap = await getDocs(q);
        if (snap.empty) throw new Error('Invalid phone number or password.');
        const userData = snap.docs[0].data();
        if (!bcrypt.compareSync(form.password, userData.password)) throw new Error('Invalid phone number or password.');
        await loginUser({ user_id: userData.user_id, name: userData.name, phone: userData.phone });
        navigate('/plans');
      } else {
        if (!form.name || !form.phone || !form.email || !form.password || !form.address || !form.pincode)
          throw new Error('Please fill all fields');
        if (form.password !== form.confirmPassword) throw new Error('Passwords do not match');
        if (form.password.length < 6) throw new Error('Minimum 6 digit password required');

        const usersRef = collection(db, 'users');
        const dupCheck = await getDocs(query(usersRef, where('phone', '==', form.phone)));
        if (!dupCheck.empty) throw new Error('An account with this phone number already exists.');

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(form.password, salt);

        const counterRef = doc(db, '_metadata', 'userIdCounter');
        let newUserId;
        await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          if (!counterDoc.exists()) { transaction.set(counterRef, { currentId: 1000 }); newUserId = 1000; }
          else { newUserId = counterDoc.data().currentId + 1; transaction.update(counterRef, { currentId: newUserId }); }
        });

        await setDoc(doc(usersRef, newUserId.toString()), {
          user_id: newUserId, name: form.name, phone: form.phone, email: form.email,
          address: form.address, pincode: form.pincode, password: hashedPassword,
          referral: form.referral || '', createdAt: new Date().toISOString()
        });

        await loginUser({ user_id: newUserId, name: form.name, phone: form.phone });
        navigate('/plans');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh pt-32 pb-24 bg-surface flex items-center justify-center px-5">
      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="w-full max-w-md bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-ambient p-10 outline-ghost">

        <div className="text-center mb-10">
          <h1 className="text-headline-md text-primary mb-3">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-body-md text-surface-tint">
            {isLogin ? 'Enter your details to access your SmileSathi portal.' : 'Join SmileSathi for seamless health management.'}
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
                    <input name="name" value={form.name} onChange={handleChange} className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-label-md text-primary mb-2 block">Email Address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="text-label-md text-primary mb-2 block">Residential Address</label>
                    <input name="address" value={form.address} onChange={handleChange} className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md" placeholder="123 AB Road, Indore" />
                  </div>
                  <div>
                    <label className="text-label-md text-primary mb-2 block">Pincode</label>
                    <input name="pincode" type="text" inputMode="numeric" value={form.pincode} onChange={handleChange} className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md" placeholder="452001" maxLength={6} />
                  </div>
                  <div>
                    <label className="text-label-md text-primary mb-2 block">Referral Code (Optional)</label>
                    <input name="referral" value={form.referral} onChange={handleChange} className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md uppercase" placeholder="REF123" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-label-md text-primary mb-2 block">Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] px-4 py-3 outline-none transition-all text-body-md font-medium" placeholder="8109424356" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-label-md text-primary">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-label-md text-primary/60 hover:text-primary transition-colors font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] pl-4 pr-12 py-3 outline-none transition-all text-body-md" placeholder="••••••" minLength={6} />
              <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-fixed-dim hover:text-primary transition-colors" tabIndex="-1">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-1">
                  <label className="text-label-md text-primary mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full bg-surface-container-high text-on-surface border-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary rounded-[var(--radius-md)] pl-4 pr-12 py-3 outline-none transition-all text-body-md" placeholder="••••••" minLength={6} />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-fixed-dim hover:text-primary transition-colors" tabIndex="-1">
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

          <button type="submit" disabled={loading} className="btn-primary w-full mt-4 disabled:opacity-80 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={18} className="animate-spin text-on-primary" /> : (isLogin ? 'Log In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-10 pt-8 border-none flex justify-center">
          <p className="text-body-md text-surface-tint">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setForm({ name: '', phone: '', email: '', password: '', confirmPassword: '', address: '', pincode: '', referral: '' }); }}
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

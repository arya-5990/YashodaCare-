import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Plans', href: '/plans' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const location = useLocation();
  const { user, logoutUser } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-display font-bold text-sm group-hover:bg-teal-700 transition-colors">Y</span>
          <span className="font-semibold text-teal-900 tracking-tight hidden sm:inline">Yashoda Care+</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map(l => (
            <Link
              key={l.href}
              to={l.href}
              className={`text-[13px] font-medium transition-colors tracking-wide ${
                location.pathname === l.href ? 'text-teal-800' : 'text-gray-500 hover:text-teal-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-gray-100 text-teal-950 pl-1.5 pr-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors shadow-sm"
            >
              <div className="w-7 h-7 bg-teal-800 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                {user.name?.charAt(0) || 'U'}
              </div>
              <span className="text-[13px] font-semibold tracking-wide">
                Profile
              </span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-[13px] font-semibold bg-teal-800 px-5 py-2.5 rounded-full hover:bg-teal-900 active:scale-[0.97] transition-all shadow-sm shadow-teal-900/10"
              style={{ color: '#ffffff' }}
            >
              Log in
            </Link>
          )}
        </nav>

        <button
          onClick={() => setOpen(p => !p)}
          className="md:hidden p-2 -mr-2 text-teal-900"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/15 md:hidden"
              onClick={close}
            />
            <motion.nav
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-dvh w-64 bg-white shadow-2xl md:hidden flex flex-col pt-20 px-6 pb-8"
            >
              {LINKS.map(l => (
                <Link
                  key={l.href}
                  to={l.href}
                  className={`py-3.5 text-base font-medium border-b border-gray-50 transition-colors ${
                    location.pathname === l.href ? 'text-teal-800' : 'text-gray-700 hover:text-teal-800'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <Link
                  to="/profile"
                  onClick={close}
                  className="mt-6 flex items-center justify-center gap-3 w-full bg-gray-100 text-teal-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  <div className="w-6 h-6 bg-teal-800 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="mt-6 text-center bg-teal-800 py-3 rounded-xl font-semibold hover:bg-teal-900 transition-colors"
                  style={{ color: '#ffffff' }}
                >
                  Log in
                </Link>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

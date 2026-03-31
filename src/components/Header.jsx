import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Network', href: '/#doctors' },
  { label: 'Plans', href: '/plans' },
  { label: 'Resources', href: '/#testimonials' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isHomePage = location.pathname === '/';
  const darkText = !isHomePage || scrolled;
  const showBackground = scrolled;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 w-full ${
        showBackground ? 'bg-white/80 backdrop-blur-xl py-4 shadow-ambient' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className={`text-2xl font-black tracking-tighter transition-transform group-hover:scale-105 ${darkText ? 'text-primary' : 'text-white'}`}>
            Smile<span className="text-tertiary">Sathi</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {LINKS.map(l => (
            <Link
              key={l.label}
              to={l.href}
              className={`text-label-md font-bold transition-all hover:text-tertiary ${
                location.pathname === l.href 
                  ? (darkText ? 'text-primary' : 'text-white') 
                  : (darkText ? 'text-surface-tint' : 'text-white/80')
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Tools */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            to={user ? "/profile" : "/auth"}
            className="px-8 py-3 bg-primary text-on-primary rounded-xl text-label-md font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg"
          >
            {user ? "My Account" : "Member Login"}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 transition-colors ${darkText ? 'text-primary' : 'text-white'}`}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t outline-ghost overflow-hidden"
          >
            <div className="p-8 space-y-6 flex flex-col">
              {LINKS.map(l => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="text-headline-md text-primary"
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-6 flex flex-col gap-4">
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="w-full py-4 bg-primary text-on-primary text-center rounded-xl font-bold"
                >
                  Member Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

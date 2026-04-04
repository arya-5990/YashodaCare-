import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Plans', href: '/plans' },
  { label: 'Products', href: '/products' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 w-full bg-white shadow-ambient ${
        scrolled ? 'py-4' : 'py-5'
      }`}
      style={{ borderBottom: '2px solid #D4AF37' }} // Golden/Bronze Accent
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center group py-2">
          <img src="/logo.png" alt="SmileSathi" className="h-10 md:h-12 w-auto origin-left transform scale-[1.7] md:scale-[2.2] -translate-y-1 md:-translate-y-1.5 transition-transform duration-300 group-hover:scale-[1.8] md:group-hover:scale-[2.3]" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {LINKS.map(l => (
            <Link
              key={l.label}
              to={l.href}
              className={`text-label-md font-bold transition-all hover:text-tertiary ${
                location.pathname === l.href 
                  ? 'text-primary' 
                  : 'text-surface-tint hover:text-primary'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Tools */}
        <div className="hidden lg:flex items-center gap-8">
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full premium-metal-border bg-surface-container hover:bg-surface-container-high transition-colors shadow-sm"
            >
              <div className="w-8 h-8 rounded-full premium-metal-bg flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="text-label-md font-bold text-primary">
                {user.displayName?.split(' ')[0] || "Premium Member"}
              </span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="btn-primary rounded-full px-8 py-3 text-label-md font-bold uppercase tracking-widest shadow-lg"
            >
              Member Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 transition-colors text-primary"
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
                  to={user ? "/profile" : "/auth"}
                  onClick={() => setOpen(false)}
                  className={user ? "w-full py-4 premium-metal-border rounded-full text-center font-bold text-primary" : "btn-primary w-full py-4 rounded-full text-center font-bold"}
                >
                  {user ? "My Dashboard" : "Member Login"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Plan', href: '#plan' },
  { label: 'Why Us', href: '#why' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-1.5 group">
          <span className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-display font-bold text-sm group-hover:bg-teal-700 transition-colors">Y</span>
          <span className="font-semibold text-teal-900 tracking-tight hidden sm:inline">Yashoda Dental</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-gray-500 hover:text-teal-800 transition-colors uppercase tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#plan"
            className="text-sm font-semibold text-white bg-teal-800 px-5 py-2.5 rounded-full hover:bg-teal-900 active:scale-[0.97] transition-all"
          >
            Get the Plan
          </a>
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
                <a
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="py-3.5 text-base font-medium text-gray-700 border-b border-gray-50 hover:text-teal-800 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#plan"
                onClick={close}
                className="mt-6 text-center bg-teal-800 text-white py-3 rounded-xl font-semibold hover:bg-teal-900 transition-colors"
              >
                Get the Plan
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

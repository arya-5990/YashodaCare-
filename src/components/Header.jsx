import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary">
          <span className="text-accent text-3xl leading-none">+</span>
          <span>Yashoda Care</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <a href="#home" className="hover:text-primary transition-colors">Home</a>
          <a href="#plans" className="hover:text-primary transition-colors">Our Plans</a>
          <a href="#about" className="hover:text-primary transition-colors">About Us</a>
          
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <User size={16} />
            <span>Your Account</span>
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-6 px-6 flex flex-col gap-4 border-t border-slate-100"
        >
          <a href="#home" className="text-lg font-medium text-slate-700 py-2 border-b border-slate-50" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#plans" className="text-lg font-medium text-slate-700 py-2 border-b border-slate-50" onClick={() => setMobileMenuOpen(false)}>Our Plans</a>
          <a href="#about" className="text-lg font-medium text-slate-700 py-2 border-b border-slate-50" onClick={() => setMobileMenuOpen(false)}>About Us</a>
          <button className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl mt-4 w-full">
            <User size={18} />
            <span>Your Account</span>
          </button>
        </motion.div>
      )}
    </header>
  );
}

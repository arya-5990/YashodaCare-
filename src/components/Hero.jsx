import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import heroImg from '../assets/hero_image.png';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center bg-warm-50 overflow-hidden">

      {/* Background image — fills right side on desktop, full on mobile */}
      <div className="absolute inset-0 md:left-[45%]">
        <img
          src={heroImg}
          alt="Inside the Yashoda Dental clinic"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-50 via-warm-50/95 md:via-warm-50/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 w-full py-28 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg"
        >
          {/* Kicker */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-teal-800" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              Indore's trusted dental clinic
            </span>
          </div>

          <h1 className="font-display text-[2.75rem] md:text-[3.5rem] lg:text-6xl leading-[1.1] font-bold text-teal-950 mb-6">
            10,000+<br />
            <span className="text-teal-700">Healthy Smiles</span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-md">
            Join our Premium Dental Plan at just <strong className="text-teal-900">₹999/year</strong> and 
            get free checkups, cleanings, X-rays, and real savings on every 
            treatment — no fine print.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#plan"
              className="inline-flex items-center gap-2 bg-teal-800 text-white font-semibold px-8 py-4 rounded-full hover:bg-teal-900 active:scale-[0.97] transition-all shadow-lg shadow-teal-800/15"
            >
              Get Your Dental Plan
            </a>
            <a
              href="tel:+919876543210"
              className="text-sm font-medium text-teal-800 underline underline-offset-4 decoration-teal-200 hover:decoration-teal-800 transition-colors"
            >
              or call us →
            </a>
          </div>

          {/* Trust line */}
          <div className="mt-10 flex items-center gap-2 text-sm text-gray-400">
            <div className="flex">
              {[0,1,2,3,4].map(i => (
                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.449a1 1 0 00-1.176 0l-3.37 2.449c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/>
                </svg>
              ))}
            </div>
            <span>Trusted by <strong className="text-gray-600">1,000+ patients</strong> in Indore</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1 text-gray-400"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.div>
    </section>
  );
}

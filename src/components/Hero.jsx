import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import heroImg from '../assets/hero_image.png';

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 min-h-screen flex items-center bg-primary overflow-hidden">
      
      {/* Background Image Layer with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2000" 
          alt="Professional Dental Environment" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 w-full grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center relative z-10">
        
        {/* Left Side: Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >

          <h1 className="text-display-lg text-on-primary mb-4 leading-[1.05]">
            Apki Smile Ka<br />
            <span className="text-tertiary italic">Lifetime</span> Partner 😊
          </h1>

          <p className="text-title-lg text-surface-tint mb-12 max-w-lg font-normal opacity-80 leading-relaxed">
            India ka sabse trusted dental membership plan – <span className="text-tertiary font-bold">₹999</span> mein
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-8">
            <Link
              to="/plans"
              className="px-8 py-4 rounded-full bg-white text-blue-900 font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center w-full sm:w-auto min-w-[200px]"
            >
              Join SmileSathi @ ₹999 <ShieldCheck className="ml-2 w-5 h-5" />
            </Link>
            {/* <Link
              to="/auth"
              className="px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-colors flex items-center justify-center w-full sm:w-auto min-w-[200px]"
            >
              Find a Dentist
            </Link> */}
          </div>
        </motion.div>

      </div>

      {/* Right Side: Hero Image (Absolutely anchored to bottom right) */}
      <motion.div
         initial={{ opacity: 0, y: 50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.1 }}
         className="hidden lg:block absolute bottom-0 right-[-8%] xl:right-[-15%] 2xl:right-[-20%] h-[85vh] max-h-[1000px] w-auto z-10 pointer-events-none"
      >
        <img 
          src={heroImg} 
          alt="SmileSathi Hero Presentation" 
          className="h-full w-auto object-contain object-right-bottom drop-shadow-[0_45px_45px_rgba(0,0,0,0.6)] transform transition-transform duration-700 hover:scale-[1.03] pointer-events-auto origin-bottom-right"
        />
      </motion.div>
    </section>
  );
}

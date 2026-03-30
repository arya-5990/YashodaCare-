import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImg from '../assets/hero_image.png';

export default function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 min-h-[92vh] flex items-center bg-warm-50">

      <div className="max-w-7xl mx-auto px-5 md:px-8 w-full grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl xl:pr-10"
        >
          {/* Kicker */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-teal-800" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-700">
              Indore's trusted healthcare & wellness clinic
            </span>
          </div>

          <h1 className="font-display text-[2.5rem] md:text-5xl lg:text-[3.5rem] leading-[1.15] font-bold text-teal-950 mb-7">
            10,000+<br />
            <span className="text-teal-700">Healthy Smiles</span>
          </h1>

          <p className="text-gray-600 text-[15px] md:text-lg leading-relaxed mb-9">
            Join our Premium Dental Plan at just <strong className="text-teal-900 font-semibold">₹999/year</strong> and 
            get free checkups, cleanings, X-rays, and real savings on every 
            treatment — no fine print.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-12">
            <Link
              to="/plans"
              className="inline-flex items-center justify-center bg-teal-800 text-white font-medium px-8 py-3.5 rounded-full hover:bg-teal-900 active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20"
              style={{ color: '#ffffff' }}
            >
              Explore Memberships
            </Link>
            <a
              href="tel:+918109424356"
              className="text-sm font-medium text-teal-800 hover:text-teal-950 transition-colors flex items-center gap-2"
            >
              or call +91 81094 24356 &rarr;
            </a>
          </div>

          {/* Trust line */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {[0,1,2,3,4].map(i => (
                <svg key={i} className="w-[18px] h-[18px] text-[#FBBF24]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.449a1 1 0 00-1.176 0l-3.37 2.449c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/>
                </svg>
              ))}
            </div>
            <span className="text-[13px] text-gray-500">
              Trusted by <span className="font-semibold text-gray-700">1,000+ patients</span> in Indore
            </span>
          </div>
        </motion.div>

        {/* Right Side: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative w-full h-[400px] lg:h-[550px]"
        >
          {/* Image container with subtle styling */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-teal-900/10">
            <img
              src={heroImg}
              alt="Inside the Yashoda Dental clinic"
              className="w-full h-full object-cover object-[center_30%]"
            />
          </div>
          {/* Subtle decorative dot pattern or shape behind image could go here */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-teal-100 rounded-full -z-10 blur-xl opacity-60 pointer-events-none" />
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-coral/10 rounded-full -z-10 blur-xl pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}

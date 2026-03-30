import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="relative py-24 md:py-32 bg-teal-900 overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-800 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-800 rounded-full translate-x-1/3 translate-y-1/3 opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative z-10 max-w-2xl mx-auto px-5 md:px-8 text-center"
      >
        <p className="text-teal-300 text-xs font-semibold uppercase tracking-widest mb-4">
          Your smile, our priority
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
          A healthier smile starts with one appointment.
        </h2>
        <p className="text-teal-200/80 leading-relaxed mb-10 max-w-lg mx-auto">
          Whether you need a routine checkup or want to explore our care plans, 
          we're here. Book a visit — no commitment, no pressure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/918109424356?text=Hi%2C%20I'd%20like%20to%20book%20an%20appointment"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-teal-900 font-bold px-8 py-4 rounded-full hover:bg-warm-100 active:scale-[0.97] transition-all shadow-lg"
          >
            Book Now
          </a>
          <Link
            to="/plans"
            className="text-sm font-medium text-teal-300 underline underline-offset-4 decoration-teal-600 hover:text-white hover:decoration-white transition-colors"
          >
            Explore Memberships
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

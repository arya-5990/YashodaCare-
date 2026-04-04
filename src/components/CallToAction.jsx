import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="py-24 md:py-40 bg-primary overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,var(--color-tertiary),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-[2.5rem] md:text-[4rem] font-bold text-on-primary leading-[1.1] mb-8 tracking-tight">
            Ready for a Better Dental Experience?
          </h2>
          <p className="text-title-lg text-surface-tint opacity-80 mb-12 max-w-2xl mx-auto">
            Join over 2 million members who trust SmileSathi for affordable dental care and healthy smiles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/plans"
              className="px-10 py-5 bg-white text-primary rounded-2xl text-label-md font-black uppercase tracking-widest hover:bg-surface-container transition-all shadow-xl w-full sm:w-auto"
            >
              Start Your Plan
            </Link>
            <a
              href="tel:918109424356"
              className="px-10 py-5 border border-white/20 text-on-primary rounded-2xl text-label-md font-black uppercase tracking-widest hover:bg-white/5 transition-all w-full sm:w-auto flex items-center justify-center"
            >
              Talk to an Expert
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

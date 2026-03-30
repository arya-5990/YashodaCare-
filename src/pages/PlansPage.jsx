import { motion } from 'framer-motion';
import PlanSection from '../components/Plans';

export default function PlansPage() {
  return (
    <main className="pt-28 md:pt-36 bg-white min-h-[90vh]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-coral mb-3">
            Health & Wellness
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-teal-950 leading-tight max-w-2xl mx-auto">
            Plans built for your long-term health.
          </h1>
          <p className="text-gray-500 leading-relaxed mt-6 text-[15px] md:text-lg max-w-xl mx-auto">
            At Yashoda Care+, we believe proactive care shouldn't come with unexpected bills. Explore our premium memberships.
          </p>
        </motion.div>
      </div>

      <div className="-mt-10 md:-mt-16">
        {/* We reuse the PlanSection component but it handles its own internal structure. */}
        <PlanSection />
      </div>
    </main>
  );
}

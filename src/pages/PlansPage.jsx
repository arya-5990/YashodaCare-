import { motion } from 'framer-motion';
import PlanSection from '../components/Plans';

export default function PlansPage() {
  return (
    <main className="pt-32 md:pt-40 bg-surface min-h-[90vh]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10 text-center mb-16 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-label-md tracking-[0.15em] uppercase text-tertiary mb-3">
            Health & Wellness
          </p>
          <h1 className="text-display-lg text-primary max-w-2xl mx-auto">
            Plans built for your <br />
            <span className="text-surface-tint">long-term health.</span>
          </h1>
          <p className="text-body-md text-surface-tint leading-relaxed mt-6 max-w-xl mx-auto">
            At SmileSathi, we believe proactive care shouldn't come with unexpected bills. Explore our premium memberships.
          </p>
        </motion.div>
      </div>

      <div className="-mt-4 md:-mt-8">
        <PlanSection />
      </div>
    </main>
  );
}

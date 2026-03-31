import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Users } from 'lucide-react';

export default function TrustShield() {
  return (
    <section className="py-24 md:py-32 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Context & Imagery */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-8 outline-ghost">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-display-lg text-primary mb-6">
                The Trust Shield™<br />Architecture.
              </h2>
              <p className="text-body-md text-surface-tint max-w-md leading-relaxed">
                Our proprietary verification system ensures that every provider in our network meets elite standards for clinical precision and patient care.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[var(--radius-xl)] overflow-hidden shadow-ambient outline-ghost aspect-video"
            >
              <img 
                src="https://images.unsplash.com/photo-1513412301072-520e5e098be9?auto=format&fit=crop&q=80&w=1200" 
                alt="Modern Clinical Setup"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
            </motion.div>
          </div>

          {/* Right Column: Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            
            {/* Top Wide Card: Instant Claims */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="sm:col-span-2 bg-primary rounded-[var(--radius-xl)] p-10 flex flex-col justify-between shadow-ambient relative overflow-hidden h-[320px]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/10 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-tertiary mb-8 outline-ghost border-white/5">
                <Zap size={28} strokeWidth={3} className="fill-tertiary" />
              </div>
              <div>
                <h3 className="text-headline-md text-on-primary mb-4">Instant Claims</h3>
                <p className="text-body-md text-surface-tint max-w-xs leading-relaxed">
                  FinTech-driven processing means claims are approved in hours, not weeks.
                </p>
              </div>
            </motion.div>

            {/* Bottom Left: Nationwide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-tertiary rounded-[var(--radius-xl)] p-10 flex flex-col justify-between shadow-ambient h-[360px]"
            >
              <Globe size={40} className="text-primary" />
              <div>
                <h3 className="text-headline-md text-primary mb-4 font-black">Nationwide</h3>
                <p className="text-body-md text-primary/70 leading-relaxed font-medium">
                  Access over 12,000 providers across the India.
                </p>
              </div>
            </motion.div>

            {/* Bottom Right: Family First */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-surface-container-low rounded-[var(--radius-xl)] p-10 flex flex-col justify-between outline-ghost shadow-ambient h-[360px]"
            >
              <Users size={40} className="text-primary" />
              <div>
                <h3 className="text-headline-md text-primary mb-4">Family First</h3>
                <p className="text-body-md text-surface-tint leading-relaxed">
                  Customized tiers for every family structure.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}

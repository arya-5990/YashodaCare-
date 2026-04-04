import { motion } from 'framer-motion';

export default function About() {
  return (
    <main className="pt-32 md:pt-40 bg-surface min-h-[90vh]">
      <div className="max-w-4xl mx-auto px-5 md:px-8 relative z-10 space-y-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-label-md tracking-[0.15em] uppercase text-tertiary mb-3">
            The Visionary
          </p>
          <h1 className="text-display-lg text-primary mb-12">
            Founder
          </h1>
          
          <div className="bg-white p-8 md:p-14 rounded-[var(--radius-xl)] shadow-ambient outline-ghost text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-bokeh-teal opacity-20 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
            
            <p className="text-body-lg text-surface-tint leading-loose mb-10 relative z-10 text-lg md:text-xl font-medium">
              India doesn’t suffer from a shortage of experts; it suffers from a shortage of access. Rural reach, affordability, fragmented workflow, and time constraints are the real problems. <strong className="text-primary font-bold">Doctor Desk</strong> is my vision to bridge this gap—connecting users with verified professionals and scheduling tools on one trusted platform, at a cost every Indian can afford.
            </p>
            
            <div className="relative z-10 pt-8 border-t border-surface-container flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full premium-metal-border shadow-[0_10px_40px_-10px_rgba(245,130,32,0.4)] overflow-hidden shrink-0 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-surface-container">
                  <img src="/founder.webp" alt="Dr. Ankit Chourasiya" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="text-title-lg text-primary font-black text-2xl md:text-3xl">Dr. Ankit Chourasiya</h3>
                <p className="text-label-md font-bold text-tertiary tracking-widest uppercase mt-2">Founder and CEO, DoctorDesk</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

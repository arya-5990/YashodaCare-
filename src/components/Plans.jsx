import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

const FEATURES = [
  'Unlimited OPD visits — walk in anytime',
  '1 professional teeth cleaning',
  '5 digital X-rays included',
  '1 filling or extraction covered',
  '10–15% off on all other treatments',
];

export default function PlanSection() {
  return (
    <section id="plan" className="py-20 md:py-28 bg-white relative overflow-hidden">

      {/* Subtle background shape */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-50 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">

        {/* Plan card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="grid lg:grid-cols-[1fr_1.2fr] gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50"
        >
          {/* Left — price & CTA */}
          <div className="bg-teal-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-700 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide text-teal-50 mb-7 border border-white/5">
                <Sparkles size={12} />
                Most Popular
              </div>

              <h3 className="font-display text-2xl md:text-4xl font-bold mb-3">
                Premium Dental Plan
              </h3>
              <p className="text-teal-100 text-[15px] leading-relaxed mb-9 max-w-sm">
                Annual coverage for your entire family's routine dental needs — 
                no per-visit fees, no hidden charges.
              </p>

              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl md:text-7xl font-bold tracking-tight">₹999</span>
                  <span className="text-teal-200/80 text-lg font-medium">/ year</span>
                </div>
                <p className="text-teal-300 text-[13px] mt-2 font-medium">Less than ₹3 per day</p>
              </div>
            </div>

            <div className="space-y-3.5 relative z-10">
              <a
                href="https://wa.me/918109424356?text=Hi%2C%20I%20want%20to%20subscribe%20to%20the%20Premium%20Dental%20Plan"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-white font-bold py-4 rounded-xl hover:bg-warm-50 active:scale-[0.98] transition-all shadow-xl shadow-teal-950/20"
                style={{ color: '#0A363A' }}
              >
                Subscribe Now
              </a>
              <a
                href="tel:+918109424356"
                className="block text-center text-sm text-teal-300 hover:text-white transition-colors py-2"
              >
                or call +91 81094 24356
              </a>
            </div>
          </div>

          {/* Right — features */}
          <div className="bg-warm-50 p-8 md:p-12 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
              What's included
            </p>

            <ul className="space-y-5">
              {FEATURES.map((feat, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-teal-800" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-[15px] leading-snug font-medium">{feat}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400 leading-relaxed">
                Plan covers one individual. Family plans available on request.
                Valid at our Indore clinic only. Renews annually.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

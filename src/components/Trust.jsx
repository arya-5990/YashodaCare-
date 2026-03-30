import { motion } from 'framer-motion';
import { Stethoscope, MonitorSmartphone, Heart, MapPin } from 'lucide-react';
import doctorImg from '../assets/doctor.png';

const POINTS = [
  {
    icon: Stethoscope,
    title: '15+ years of experience',
    desc: 'Our lead dentist has practiced since 2010 — not a fresh graduate learning on your teeth.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Digital-first diagnosis',
    desc: 'Intraoral cameras, digital X-rays, and on-screen explanations so you see what we see.',
  },
  {
    icon: Heart,
    title: 'Patient-first, always',
    desc: "We never push unnecessary procedures. If you don't need it, we won't recommend it.",
  },
  {
    icon: MapPin,
    title: 'Central Indore location',
    desc: 'On AB Road, easy to reach from Vijay Nagar, Palasia, and Sapna Sangeeta.',
  },
];

export default function WhyUs() {
  return (
    <section id="why" className="py-20 md:py-28 bg-teal-50/50">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <div className="grid md:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45 }}
            className="relative order-2 md:order-1"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={doctorImg}
                alt="Dr. Yashoda checking a patient's dental health"
                className="w-full aspect-[4/5] object-cover object-top hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-5 -right-3 md:-right-6 bg-white rounded-xl shadow-lg border border-gray-100 px-5 py-4 text-center">
              <p className="text-2xl font-bold text-teal-800">10K+</p>
              <p className="text-[11px] text-gray-400 font-medium">Patients treated</p>
            </div>
          </motion.div>

          {/* Text side */}
          <div className="order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-teal-700 mb-3">
                Why choose us
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-teal-950 leading-snug mb-4">
                We treat people, not just teeth.
              </h2>
              <p className="text-gray-500 leading-relaxed mb-10 max-w-md">
                A dental visit shouldn't feel like an assembly line. We take our time, 
                explain everything honestly, and make sure you're comfortable before any work begins.
              </p>
            </motion.div>

            <div className="space-y-6">
              {POINTS.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 mt-1 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-950 text-sm mb-0.5">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

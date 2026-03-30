import { motion } from 'framer-motion';
import clinicImg from '../assets/clinic.png';

export default function ClinicExperience() {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
            Our Space
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-teal-950 leading-snug mb-4">
            Modern care in a space that puts you at ease.
          </h2>
          <p className="text-gray-500 leading-relaxed text-sm">
            No cramped waiting rooms, no outdated equipment. Our clinic was 
            designed to feel calm and professional from the moment you walk in.
          </p>
        </motion.div>

        {/* Full-width image with rounded corners */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden group"
        >
          <img
            src={clinicImg}
            alt="Inside the Yashoda Dental clinic — modern dental chair and equipment"
            className="w-full aspect-[16/7] object-cover group-hover:scale-[1.015] transition-transform duration-1000"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 to-transparent" />

          {/* Bottom stats */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-wrap gap-8 md:gap-16">
            {[
              { num: '2016', label: 'Established' },
              { num: '10K+', label: 'Patients' },
              { num: '15+', label: 'Years experience' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-white text-2xl md:text-3xl font-bold">{num}</p>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

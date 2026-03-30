import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

export default function Trust() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start">
          
          {/* Left: Sticky Founder Image */}
          <div className="lg:sticky lg:top-32 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-teal-900/10 aspect-[4/5] md:aspect-[3/4]"
            >
              <img 
                src="/founder.webp" 
                alt="Dr. Ankit Chourasiya" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-teal-950/90 via-teal-950/40 to-transparent pt-32 pb-8 px-8">
                <p className="text-teal-200 font-semibold text-sm mb-1 uppercase tracking-wider">Founder / Lead Dentist</p>
                <h3 className="text-white font-display text-2xl font-bold">Dr. Ankit Chourasiya</h3>
              </div>
            </motion.div>
          </div>

          {/* Right: Narrative Content */}
          <div className="space-y-16">
            
            {/* Part 1: Intro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold text-teal-950 leading-[1.15] mb-8">
                Making quality oral care accessible across India.
              </h2>
              <div className="space-y-5 text-gray-600 leading-relaxed text-[15px] md:text-[17px]">
                <p>
                  I am <strong className="text-teal-900 font-semibold">Dr. Ankit Chourasiya</strong>, a dental professional with 5+ years of clinical experience, dedicated to making quality oral healthcare accessible and affordable across India.
                </p>
                <p>
                  At Yashoda Care+, we are supported by a highly experienced team with 10+ years of expertise across multiple dental specialties, ensuring comprehensive and advanced care under one roof.
                </p>
              </div>
            </motion.div>

            {/* Part 2: Scale and Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-warm-50 border border-warm-100 rounded-2xl p-8 mb-8">
                <p className="text-sm font-semibold tracking-widest uppercase text-teal-700 mb-6">Our Growing Network</p>
                
                <div className="grid sm:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Current Presence</p>
                    <p className="font-display text-3xl font-bold text-teal-950">30+ Cities</p>
                    <p className="text-teal-700 font-medium">75+ Clinics</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Vision Ahead</p>
                    <p className="font-display text-3xl font-bold text-teal-950">100+ Cities</p>
                    <p className="text-coral font-medium">300+ Clinics</p>
                  </div>
                </div>

                <p className="text-gray-600 text-[15px] leading-relaxed italic">
                  "Our goal is to build one of India's largest and most trusted dental care networks, ensuring that no individual is deprived of quality treatment due to cost or accessibility."
                </p>
              </div>
            </motion.div>

            {/* Part 3: The Plan & Shift */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold text-teal-950 mb-4">
                The ₹999 Plan – A Turning Point
              </h3>
              <p className="text-gray-600 text-[15px] md:text-[17px] leading-relaxed mb-8">
                We have introduced our flagship ₹999 Dental Plan, designed to revolutionize how India approaches oral health. This is not just a plan — it's a preventive healthcare movement.
              </p>

              <div className="grid gap-3 mb-10">
                {[
                  'Encourages early diagnosis & regular checkups',
                  'Prevents severe pain and dental emergencies',
                  'Reduces future high-cost treatments',
                  'Promotes awareness among families and youth'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-teal-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* The Mindset Shift Box */}
              <div className="bg-teal-900 rounded-2xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-teal-900/10">
                <div className="flex-1">
                  <p className="text-teal-200 text-sm font-medium mb-1">A massive shift from</p>
                  <p className="text-white font-display text-xl">"Treatment after pain"</p>
                </div>
                <ArrowRight className="hidden sm:block text-teal-500 opacity-50 shrink-0" size={24} />
                <div className="hidden sm:block h-8 w-px bg-teal-800 shrink-0" />
                <div className="flex-1">
                  <p className="text-teal-200 text-sm font-medium mb-1">Towards</p>
                  <p className="text-teal-300 font-display text-xl font-semibold">"Prevention before problems"</p>
                </div>
              </div>
            </motion.div>

            {/* Part 4: Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="border-t border-gray-100 pt-12"
            >
              <div className="flex items-start gap-4">
                <ShieldCheck className="text-teal-700 shrink-0 mt-1" size={28} />
                <div>
                  <h4 className="font-display text-xl font-bold text-teal-950 mb-3">Our Mission</h4>
                  <p className="text-gray-600 text-[15px] md:text-[17px] leading-relaxed mb-6">
                    To provide affordable, accessible, and high-quality dental care to every Indian, helping them live a stress-free, pain-free life.
                  </p>
                  <p className="text-teal-900 font-medium text-lg leading-snug">
                    With strong clinical expertise, a growing nationwide presence, and a clear vision for the future, we are building not just clinics — <br className="hidden sm:block" />
                    <span className="font-bold underline decoration-2 underline-offset-4 decoration-coral/40">we are building a healthier India.</span>
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}

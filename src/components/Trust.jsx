import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Trust() {
  return (
    <section id="about" className="py-24 md:py-32 bg-surface-container-low relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        <div className="grid lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 items-start">
          
          {/* Left: Sticky Founder Image */}
          <div className="lg:sticky lg:top-32 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[var(--radius-xl)] overflow-hidden shadow-ambient aspect-[4/5] md:aspect-[3/4]"
            >
              <img 
                src="/founder.webp" 
                alt="Dr. Ankit Chourasiya" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary via-primary/60 to-transparent pt-32 pb-8 px-8">
                <p className="text-tertiary-fixed font-semibold text-label-md mb-2 tracking-[0.1em] uppercase">Founder / Lead Dentist</p>
                <h3 className="text-on-primary text-title-lg mb-1">Dr. Ankit Chourasiya</h3>
              </div>
            </motion.div>
          </div>

          {/* Right: Narrative Content */}
          <div className="space-y-20">
            
            {/* Part 1: Intro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-display-lg text-primary mb-10">
                Clinical excellence,<br />
                <span className="text-surface-tint">accessible anywhere.</span>
              </h2>
              <div className="space-y-6 text-body-md text-surface-tint">
                <p>
                  I am <strong className="text-primary font-semibold">Dr. Ankit Chourasiya</strong>, a dental professional with 5+ years of clinical experience, dedicated to making quality oral healthcare accessible and affordable across India.
                </p>
                <p>
                  At SmileSathi, we are supported by a highly experienced team with 10+ years of expertise across multiple dental specialties, ensuring comprehensive and advanced care under one roof.
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
              <div className="bg-surface-container-lowest outline-ghost rounded-[var(--radius-xl)] p-10 md:p-14 shadow-ambient">
                <p className="text-label-md tracking-[0.15em] uppercase text-tertiary mb-10">Our Growing Network</p>
                
                <div className="grid sm:grid-cols-2 gap-10 mb-10">
                  <div>
                    <p className="text-label-md text-surface-tint mb-2">Current Presence</p>
                    <p className="text-display-lg text-primary mb-1">30+</p>
                    <p className="text-title-lg text-primary">Cities</p>
                  </div>
                  <div>
                    <p className="text-label-md text-surface-tint mb-2">Vision Ahead</p>
                    <p className="text-display-lg text-primary mb-1">100+</p>
                    <p className="text-title-lg text-tertiary">Cities</p>
                  </div>
                </div>

                <p className="text-body-md text-surface-tint italic">
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
              <h3 className="text-headline-md text-primary mb-6">
                The ₹999 Advantage
              </h3>
              <p className="text-body-md text-surface-tint mb-10">
                We have introduced our flagship ₹999 Dental Plan, designed to revolutionize how India approaches oral health. This is not just a plan — it's a preventive healthcare movement.
              </p>

              <div className="grid gap-5 mb-14">
                {[
                  'Encourages early diagnosis & regular checkups',
                  'Prevents severe pain and dental emergencies',
                  'Reduces future high-cost treatments',
                  'Promotes awareness among families and youth'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 size={20} className="text-tertiary shrink-0 mt-0.5" />
                    <span className="text-body-md text-on-surface font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* The Mindset Shift Box */}
              <div className="bg-primary rounded-[var(--radius-xl)] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 shadow-ambient">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-label-md text-surface-tint mb-2">A massive shift from</p>
                  <p className="text-title-lg text-surface-container-high font-normal">"Treatment after pain"</p>
                </div>
                <ArrowRight className="hidden sm:block text-tertiary opacity-80 shrink-0" size={28} />
                <div className="hidden sm:block h-12 w-px bg-surface-tint/50 shrink-0" />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-label-md text-surface-tint mb-2">Towards</p>
                  <p className="text-title-lg text-tertiary-fixed">"Prevention before problems"</p>
                </div>
              </div>
            </motion.div>

            {/* Part 4: Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-6 bg-surface-container-lowest rounded-[var(--radius-xl)] p-10 outline-ghost shadow-ambient">
                <div className="w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-tertiary-container" size={28} />
                </div>
                <div>
                  <h4 className="text-headline-md text-primary mb-4">Our Mission</h4>
                  <p className="text-body-md text-surface-tint mb-6">
                    To provide affordable, accessible, and high-quality dental care to every Indian, helping them live a stress-free, pain-free life.
                  </p>
                  <p className="text-body-md text-on-surface font-medium">
                    With strong clinical expertise, a growing nationwide presence, and a clear vision for the future, we are building not just clinics — <br className="hidden sm:block mt-2" />
                    <span className="text-tertiary font-bold tracking-wide">we are building a healthier India.</span>
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

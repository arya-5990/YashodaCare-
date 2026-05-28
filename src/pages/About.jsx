import { motion } from 'framer-motion';
import { Sparkles, Network, Shield } from 'lucide-react';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="pt-32 md:pt-40 bg-surface min-h-[90vh]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-20"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
            <span className="text-label-md tracking-[0.2em] font-black uppercase text-tertiary mb-4 block">
              About SmileSathi India
            </span>
            <h1 className="text-display-lg text-primary mb-6 leading-tight">
              Smart Smiles. Better Health.<br />
              <span className="text-brand-blue bg-clip-text">Powered by AI.</span>
            </h1>
            <p className="text-body-lg text-surface-tint leading-relaxed text-lg md:text-xl font-medium">
              SmileSathi India is an innovative oral healthcare platform focused on making dental awareness, AI-powered screening, and quality dental care more accessible across India.
            </p>
          </motion.div>

          {/* Cards Section */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8">
            {/* AI Platform Card */}
            <div className="bg-white p-8 rounded-[var(--radius-xl)] shadow-ambient outline-ghost hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl -translate-y-5 translate-x-5 transition-transform duration-500 group-hover:scale-125"></div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-title-lg text-primary mb-4 font-bold">AI Screening</h3>
                <p className="text-body-md text-surface-tint leading-relaxed">
                  Our platform provides AI-based instant dental screening, appointment booking systems, patient management solutions, and digital support for dental clinics while helping patients connect with quality dental professionals.
                </p>
              </div>
            </div>

            {/* Network Card */}
            <div className="bg-white p-8 rounded-[var(--radius-xl)] shadow-ambient outline-ghost hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-full blur-2xl -translate-y-5 translate-x-5 transition-transform duration-500 group-hover:scale-125"></div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary mb-6">
                  <Network size={24} />
                </div>
                <h3 className="text-title-lg text-primary mb-4 font-bold">Trusted Network</h3>
                <p className="text-body-md text-surface-tint leading-relaxed">
                  We are building a strong network of trusted dental clinics, corporates, schools, colleges, aviation institutes, and healthcare partners to promote preventive oral healthcare through technology and community outreach.
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-8 rounded-[var(--radius-xl)] shadow-ambient outline-ghost hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-joy/5 rounded-full blur-2xl -translate-y-5 translate-x-5 transition-transform duration-500 group-hover:scale-125"></div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent-joy/10 flex items-center justify-center text-accent-joy mb-6">
                  <Shield size={24} />
                </div>
                <h3 className="text-title-lg text-primary mb-4 font-bold">Our Mission</h3>
                <p className="text-body-md text-surface-tint leading-relaxed">
                  Our mission is to create a healthier and more confident India by combining modern technology, awareness programs, and accessible dental care under one ecosystem.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Founder Section */}
          <motion.div variants={itemVariants} className="pt-8 border-t border-surface-container">
            <div className="text-center mb-12">
              <p className="text-label-md tracking-[0.15em] uppercase text-tertiary mb-3">
                The Visionary
              </p>
              <h2 className="text-display-lg text-primary">
                Meet Our Founder
              </h2>
            </div>
            
            <div className="bg-white p-8 md:p-14 rounded-[var(--radius-xl)] shadow-ambient outline-ghost text-left relative overflow-hidden max-w-4xl mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-bokeh-teal opacity-20 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
              
              <p className="text-body-lg text-surface-tint leading-loose mb-10 relative z-10 text-lg md:text-xl font-medium">
                During my clinical journey, I saw a common reality across India: people often ignore dental health due to lack of awareness and the fear of high treatment costs, seeking help only when the condition becomes severe. That gap moved me to start <strong className="text-primary font-bold">Smile Sathi</strong> from zero, without external backing, driven purely by purpose and determination.
                Working at the grassroots level—listening to patients, understanding their struggles, and learning from their stories—I set out to build a platform that makes dental care affordable, preventive, and accessible. Smile Sathi is not just a dental plan; it is a movement to ensure every individual treats oral health as an essential part of overall well-being, not a luxury. My vision is simple: empower people to care for their smiles without fear, hesitation, or financial burden.
              </p>
              
              <div className="relative z-10 pt-8 border-t border-surface-container flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-8">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full premium-metal-border shadow-[0_10px_40px_-10px_rgba(245,130,32,0.4)] overflow-hidden shrink-0 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-surface-container">
                    <img src="/founder.webp" alt="Dr. Ankit Chourasiya" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <h3 className="text-title-lg text-primary font-black text-2xl md:text-3xl">Dr. Ankit Chourasiya</h3>
                  <p className="text-label-md font-bold text-tertiary tracking-widest uppercase mt-2">Chief Dentist | Founder & CEO – Smile Sathi, Indore</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}


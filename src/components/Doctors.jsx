import { motion } from 'framer-motion';
import { useRef } from 'react';
import { User, Heart, Sparkles, Activity, ShieldPlus, BadgeCheck, Stethoscope, ChevronLeft, ChevronRight, Award } from 'lucide-react';

const DOCTORS = [
  {
    role: "Dental Surgeon",
    specialty: "Clinical Precision",
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    isMedalist: true,
  },
  {
    role: "Periodontist",
    specialty: "Gum Specialist",
    img: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    role: "Orthodontist",
    specialty: "Braces & Aligners",
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
    isMedalist: true,
  },
  {
    role: "Prosthodontist",
    specialty: "Crowns & Implants",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
  },
  {
    role: "Oral Surgeon",
    specialty: "Maxillofacial",
    img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800",
  },
  {
    role: "Endodontist",
    specialty: "Root Canal Specialist",
    img: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=800",
  },
];

export default function DoctorsSection() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Approximate card width + gap
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="doctors" className="pt-12 md:pt-16 pb-24 md:pb-32 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <span className="text-label-md tracking-[0.2em] font-black uppercase text-tertiary mb-6 block">Clinical Experts</span>
            <h2 className="text-display-lg text-primary mb-6">
              Expert Multi-Specialty Dental Team
            </h2>
            <p className="text-body-md text-surface-tint leading-relaxed max-w-xl">
              Our clinic is supported by an experienced panel of specialists, ensuring comprehensive and advanced dental care through architectural clinical reliability.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 pb-2">
            <button onClick={() => scroll('left')} className="w-14 h-14 rounded-full border-2 border-surface-container flex items-center justify-center text-surface-tint hover:bg-primary hover:text-white transition-all hover:border-transparent cursor-pointer">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll('right')} className="w-14 h-14 rounded-full border-2 border-surface-container flex items-center justify-center text-surface-tint hover:bg-primary hover:text-white transition-all hover:border-transparent cursor-pointer">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DOCTORS.map((doc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="w-[85vw] sm:w-[280px] lg:w-[320px] snap-center shrink-0 group relative bg-surface-container-low rounded-[var(--radius-xl)] p-4 outline-ghost overflow-hidden"
            >
              <div className="relative aspect-[4/5] rounded-[calc(var(--radius-xl)-8px)] overflow-hidden mb-6">
                <img 
                  src={doc.img} 
                  alt={doc.role}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} className="text-tertiary" />
                  <span className="text-label-md text-surface-tint font-bold uppercase tracking-wider">{doc.specialty}</span>
                </div>
                <h3 className="text-title-lg text-primary mb-1">{doc.role}</h3>
                <p className="text-body-md text-surface-tint opacity-70 italic leading-relaxed">
                  Advanced certification in specialized clinical protocols.
                </p>
                {doc.isMedalist && (
                  <div className="mt-4 inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <Award size={14} strokeWidth={2.5} /> Gold Medalist
                  </div>
                )}
              </div>

              <div className="absolute top-8 right-8 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-ambient opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <BadgeCheck size={20} className="text-primary" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { User, Heart, Sparkles, Activity, ShieldPlus, BadgeCheck, Stethoscope, ChevronLeft, ChevronRight, Award, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const FALLBACK_DOCTORS = [
  {
    role: "Dental Surgeon",
    specialty: "Clinical Precision",
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    isMedalist: true,
    description: "Advanced certification in specialized clinical protocols."
  },
  {
    role: "Periodontist",
    specialty: "Gum Specialist",
    img: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Advanced certification in specialized clinical protocols."
  },
  {
    role: "Orthodontist",
    specialty: "Braces & Aligners",
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
    isMedalist: true,
    description: "Advanced certification in specialized clinical protocols."
  },
  {
    role: "Prosthodontist",
    specialty: "Crowns & Implants",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
    description: "Advanced certification in specialized clinical protocols."
  },
  {
    role: "Oral Surgeon",
    specialty: "Maxillofacial",
    img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800",
    description: "Advanced certification in specialized clinical protocols."
  },
  {
    role: "Endodontist",
    specialty: "Root Canal Specialist",
    img: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=800",
    description: "Advanced certification in specialized clinical protocols."
  },
];

let adShownThisSession = false;

export default function DoctorsSection() {
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const [showAd, setShowAd] = useState(false);
  const [doctors, setDoctors] = useState(FALLBACK_DOCTORS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const docRef = doc(db, "assets", "doctor");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.doctors && Array.isArray(data.doctors)) {
            // Map the firestore structure to our UI structure
            const mappedDoctors = data.doctors.map(d => ({
              role: d.name, // Doctor's name as primary title
              specialty: d.speciality, // Role/specialty as sub-label
              img: d.image,
              isMedalist: d.IsGoldMedalist,
              description: d.description || "Advanced certification in specialized clinical protocols."
            }));
            setDoctors(mappedDoctors);
          }
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!user && !adShownThisSession) {
      const timer = setTimeout(() => {
        setShowAd(true);
        adShownThisSession = true;
      }, 25000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Approximate card width + gap
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="doctors" className="pt-12 md:pt-16 pb-24 md:pb-32 bg-surface overflow-hidden relative">
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
          {doctors.map((doc, idx) => (
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
                  {doc.description}
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

      {/* Advertisement Modal Trigger */}
      <AnimatePresence>
        {showAd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-primary/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-[max(var(--radius-xl),24px)] shadow-2xl max-w-[420px] w-full relative outline-ghost flex flex-col overflow-hidden"
            >
              <button 
                onClick={() => setShowAd(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/30 text-white transition-colors z-20"
              >
                <X size={16} strokeWidth={3} />
              </button>
              
              <div className="bg-[#0A1929] pt-10 pb-8 px-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-bokeh-teal opacity-50 pointer-events-none mix-blend-screen"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#EEF9F1] to-[#E2F5E9] rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(116,183,46,0.2)] border border-[#74B72E]/20">
                    <Sparkles size={28} className="text-[#74B72E] animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black mb-3 text-white tracking-tight leading-tight">
                    Unlock Premium <br />
                    <span className="text-[#2A8EDD]">Dental Care</span>
                  </h3>
                  <p className="text-white/80 leading-relaxed text-[15px] font-medium max-w-[300px]">
                    Get priority access to our multi-specialty team and save thousands on clinical treatments.
                  </p>
                </div>
              </div>
              
              <div className="px-8 py-10 text-center bg-surface flex flex-col items-center">
                <div className="mb-8 flex flex-col items-center w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-black text-slate-400 line-through decoration-[--color-accent-joy] decoration-[3px]">
                      ₹3999
                    </span>
                    <span className="text-[13px] font-black text-[#0A1929] bg-[#74B72E] px-3 py-1 rounded-full shadow-ambient">
                      SAVE ₹3000!
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-[4rem] leading-none font-black text-primary tracking-tighter">₹999</span>
                    <span className="text-xl text-surface-tint font-bold">/ year</span>
                  </div>
                  <p className="text-sm text-[#74B72E] font-bold mt-4 flex items-center justify-center gap-1.5 flex-wrap">
                    <Sparkles size={14} /> Limited time introductory offer!
                  </p>
                </div>
                
                <Link 
                  to="/plans"
                  className="btn-primary w-full py-4 rounded-full text-lg shadow-ambient block hover:-translate-y-1 transition-transform"
                >
                  Secure My Membership
                </Link>
                <button 
                  onClick={() => setShowAd(false)}
                  className="mt-6 text-sm font-bold text-surface-tint hover:text-primary transition-colors underline underline-offset-4 decoration-2 decoration-surface-tint/30"
                >
                  No thanks, maybe later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}

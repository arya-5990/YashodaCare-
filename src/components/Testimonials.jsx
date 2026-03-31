import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    name: "Aditya Sharma",
    role: "Individual Premium Dental Plan",
    content: "The ₹999 individual premium dental plan is an absolute steal. Finally, a dental experience that feels like professional healthcare rather than a transaction.",
  },
  {
    name: "Priya Malhotra",
    role: "Family Dental Plan",
    content: "I got the Family Dental Plan for all four of us. Transparent pricing combined with expert clinical oversight. SmileSathi sets a benchmark.",
  },
  {
    name: "Rohan Varma",
    role: "Family Dental Plan",
    content: "The free consultations and priority booking for my entire family have been fantastic. My kids actually look forward to their dentist visits now.",
  },
  {
    name: "Shruti Desai",
    role: "Individual Premium Dental Plan",
    content: "The premium plan streamlines the clinical process. Getting access to a vast network of verified dentists at such a low cost is incredible.",
  },
  {
    name: "Siddharth Rao",
    role: "Family Dental Plan",
    content: "The free X-rays and zero consultation fees included in the family plan have made preventive care for our household so much easier.",
  },
  {
    name: "Meera Reddy",
    role: "Individual Premium Dental Plan",
    content: "This plan has been a game-changer for me. The clinics are top-notch, highly ethical, and the staff is incredibly patient and professional.",
  },
  {
    name: "Kabir Singh",
    role: "Individual Premium Dental Plan",
    content: "At just ₹999, the premium plan offers incredible value. The free scaling and polishing essentially pay for the membership itself on day one.",
  },
  {
    name: "Neha Gupta",
    role: "Individual Premium Dental Plan",
    content: "I saved significantly on my aligner treatments. The exclusive discounts offered through the premium plan make it the best investment for my smile.",
  },
  {
    name: "Vikram Mehta",
    role: "Family Dental Plan",
    content: "Managing appointments for 5 people used to be a nightmare. The SmileSathi app and Family Dental Plan have made everything seamless.",
  },
  {
    name: "Sneha Patel",
    role: "Individual Premium Dental Plan",
    content: "No hidden charges, no surprise fees at the clinic. What they promise on the ₹999 premium plan is exactly what you get. Highly recommended.",
  },
];

export default function Testimonials() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 432 : 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-surface overflow-hidden">
      <style>{"\
        .hide-scroll::-webkit-scrollbar { display: none; }\
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }\
      "}</style>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <span className="text-label-md tracking-[0.2em] font-black uppercase text-tertiary mb-6 block">Evidence of Excellence</span>
            <h2 className="text-display-lg text-primary mb-6">
              Verified Patient Experience
            </h2>
            <p className="text-body-md text-surface-tint leading-relaxed max-w-xl">
              Real outcomes from our clinical network, demonstrating high-trust architectural reliability across 30+ cities.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center lg:items-end gap-6">
            <div className="flex items-center gap-1.5 bg-primary/5 px-5 py-2.5 rounded-full outline-ghost">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-tertiary fill-tertiary" />)}
              </div>
              <span className="text-label-md text-primary font-bold">4.9/5 RATING</span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full border-2 border-primary/10 flex items-center justify-center text-primary group hover:border-tertiary hover:text-tertiary transition-colors focus:outline-none"
                aria-label="Previous review"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full border-2 border-primary/10 flex items-center justify-center text-primary group hover:border-tertiary hover:text-tertiary transition-colors focus:outline-none"
                aria-label="Next review"
              >
                <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory hide-scroll scroll-smooth w-full"
        >
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex-none w-[85vw] md:w-[400px] snap-center bg-surface-container-lowest rounded-[var(--radius-xl)] p-10 outline-ghost shadow-ambient relative group transition-transform hover:-translate-y-2 duration-500"
            >
              <Quote size={40} className="text-tertiary/10 absolute top-8 right-8 transition-transform group-hover:scale-125" />
              
              <div className="flex gap-0.5 mb-8">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-tertiary fill-tertiary" />)}
              </div>

              <p className="text-headline-md text-primary/80 mb-10 leading-relaxed text-lg lg:text-xl min-h-[120px]">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4 border-t outline-ghost border-transparent pt-8 mt-auto">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center font-bold text-title-lg text-primary uppercase shadow-ambient flex-shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-title-lg text-primary font-bold mb-0.5">{review.name}</h4>
                  <p className="text-label-md text-surface-tint uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

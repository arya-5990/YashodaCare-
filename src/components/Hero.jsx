import { motion } from 'framer-motion';
import { ArrowRight, CalendarHeart } from 'lucide-react';
import heroImage from '../assets/hero_image.png';

export default function Hero() {
  return (
    <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden relative bg-gradient-to-br from-slate-50 to-emerald-50/30">
      
      {/* Decorative Blob */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl opacity-60 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl opacity-60 mix-blend-multiply pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-primary w-fit text-sm font-semibold tracking-wide border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Boutique Dental & Wellness
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-800 leading-[1.15] tracking-tight">
            Expert Care for Your <span className="text-primary italic font-serif opacity-90">Smile</span> & Vitality.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-[500px]">
            Experience world-class personalized dentistry and tailored wellness plans designed to elevate your health and confidence in a premium, stress-free environment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button className="flex justify-center items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-1 transition-all duration-300">
              <CalendarHeart size={20} />
              <span>Book Consultation</span>
            </button>
            <button className="flex justify-center items-center gap-2 bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-full font-semibold hover:border-accent hover:text-accent transform hover:-translate-y-1 transition-all duration-300">
              <span>Explore Plans</span>
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Patient" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800">500+ Happy Patients</span>
              <span className="text-xs text-slate-500 font-medium">Rated 4.9/5 by our community</span>
            </div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="relative lg:ml-10"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-[2.5rem] transform rotate-3 scale-105 z-0"></div>
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={heroImage} 
              alt="Yashoda Care+ Doctor and Patient" 
              className="w-full h-auto object-cover aspect-[4/5] md:aspect-square object-top"
            />
            {/* Floating Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4"
            >
              <div className="bg-secondary/20 p-3 rounded-full text-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Premium Financing</p>
                <p className="text-xs text-slate-500 font-medium z-10">0% Interest Plans Available</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

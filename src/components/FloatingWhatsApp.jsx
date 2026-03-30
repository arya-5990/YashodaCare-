import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <motion.a 
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-[#25D366] text-white p-4 lg:p-5 rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-2xl hover:scale-110 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse Effect */}
      <span className="absolute w-full h-full rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:animate-none"></span>
      
      <MessageCircle size={32} className="relative z-10 fill-current" />
    </motion.a>
  );
}

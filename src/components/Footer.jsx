import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);


export default function Footer() {
  return (
    <footer className="bg-[#0a4247] text-slate-300 pt-20 pb-10 border-t-[8px] border-accent">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-primary/20 pb-16">
        
        {/* Brand */}
        <div className="md:col-span-1">
          <a href="#" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white mb-6">
            <span className="text-accent text-3xl leading-none">+</span>
            <span>Yashoda Care</span>
          </a>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-sm">
            Elevating your health and smile through premium, personalized dental and wellness solutions since 2010.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-secondary transition-colors text-white">
              <FacebookIcon />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-secondary transition-colors text-white">
              <InstagramIcon />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-secondary transition-colors text-white">
              <TwitterIcon />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="#home" className="hover:text-accent transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-accent transition-colors">About Us</a></li>
            <li><a href="#plans" className="hover:text-accent transition-colors">Our Plans</a></li>
            <li><a href="#services" className="hover:text-accent transition-colors">Services</a></li>
            <li><a href="#team" className="hover:text-accent transition-colors">Our Specialists</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Our Services</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-accent transition-colors">Cosmetic Dentistry</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Orthodontics</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Wellness Screening</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Dietary Consulting</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Preventive Care</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="bg-primary p-2 flex-shrink-0 rounded-lg text-white">
                <MapPin size={18} />
              </div>
              <span className="leading-snug text-sm">
                42 Elite Complex, AB Road,<br />
                Indore, Madhya Pradesh 452001
              </span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-primary p-2 flex-shrink-0 rounded-lg text-white">
                <Phone size={18} />
              </div>
              <span className="text-sm">+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-primary p-2 flex-shrink-0 rounded-lg text-white">
                <Mail size={18} />
              </div>
              <span className="text-sm">hello@yashodacare.in</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
        <p>&copy; {new Date().getFullYear()} Yashoda Care+. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

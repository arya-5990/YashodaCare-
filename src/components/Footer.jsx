import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
);

export default function ContactFooter() {
  return (
    <footer id="contact" className="bg-teal-950 text-gray-300">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10 md:gap-8 mb-12">

          {/* Brand + description */}
          <div>
            <a href="/" className="flex items-center gap-1.5 mb-2">
              <span className="w-7 h-7 rounded-md bg-teal-800 text-white flex items-center justify-center font-display font-bold text-xs">Y</span>
              <span className="font-semibold text-white tracking-tight">Yashoda Dental Care</span>
            </a>
            <p className="text-[13px] text-teal-300/80 font-medium mb-3">Led by Dr. Ankit Chourasiya</p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-5">
              A premium dental network built on honest care, transparent pricing, and long-term relationships with every patient.
            </p>
            <a
              href="https://www.instagram.com/ydcindore__/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-coral transition-colors"
            >
              <InstagramIcon />
              @yashodadental_Indore
            </a>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5">Get in Touch</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-coral mt-1 shrink-0" />
                <span className="leading-relaxed">First Floor, Plot No. 17,<br/>Above New Globas Medical,<br/>Opposite Satish Kirana, Gori Nagar,<br/>Sukhliya, Indore, MP – 452010</span>
              </li>
              <li className="flex items-center gap-2.5 mt-2">
                <Phone size={15} className="text-coral shrink-0" />
                <a href="tel:+918109424356" className="hover:text-white transition-colors">+91 81094-24356</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-coral shrink-0" />
                <a href="mailto:doctordeskofficial@gmail.com" className="hover:text-white transition-colors">doctordeskofficial@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5">Clinic Hours</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="text-coral shrink-0" />
                <div>
                  <p className="text-gray-300">Mon – Sat</p>
                  <p className="text-gray-500 text-xs">10:00 AM – 8:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="text-gray-600 shrink-0" />
                <div>
                  <p className="text-gray-400">Sunday</p>
                  <p className="text-gray-500 text-xs">By appointment only</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Yashoda Dental Clinic. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

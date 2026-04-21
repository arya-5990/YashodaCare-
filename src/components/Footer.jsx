import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Stethoscope } from 'lucide-react';

const Instagram = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  const sections = [
    {
      title: 'Company',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Member Login', href: '/auth' },
      ],
    },
  ];

  return (
    <footer className="relative bg-primary text-white pt-24 pb-12 overflow-hidden border-t-0">
      {/* Subtle Blue Light Spill / Bokeh from top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[--color-brand-blue] to-transparent opacity-50"></div>
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[--color-brand-blue] opacity-20 blur-[100px] rounded-[100%] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 mb-20">

          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-black tracking-tighter text-white">
                Smile<span className="text-tertiary">Sathi</span>
              </span>
            </Link>
            <p className="text-label-md text-primary-fixed-dim leading-relaxed font-light italic opacity-80 max-w-sm">
              Aapki Smile Ka Lifetime Partner
            </p>
            <p className="text-label-md text-primary-fixed-dim max-w-xs leading-relaxed mt-4">
              Premium clinical-grade dental care accessible and simple.
            </p>

            <div className="flex gap-4">
              <a href="https://www.instagram.com/smilesathiofficial_/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center text-primary-fixed-dim hover:text-white transition-all hover:border-[--color-brand-blue]">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h4 className="text-label-md font-black text-white uppercase tracking-widest opacity-90">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-label-md text-primary-fixed-dim">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Stethoscope size={14} className="text-[#a3e635]" />
                </span>
                <span className="font-semibold text-white/90">Dr. Ankit Chourasiya</span>
              </li>
              <li>
                <a href="tel:918109424356" className="flex items-center gap-3 text-label-md text-primary-fixed-dim hover:text-white transition-colors">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-[--color-accent-joy]" />
                  </span>
                  +91 81094-24356
                </a>
              </li>
              <li>
                <a href="mailto:smilesathiofficial@gmail.com" className="flex text-label-md text-primary-fixed-dim hover:text-white transition-colors gap-3 items-center">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-[--color-brand-blue]" />
                  </span>
                  <span className="break-all">smilesathiofficial@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-label-md text-primary-fixed-dim leading-relaxed">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-tertiary" />
                </span>
                <span>
                  First Floor, Plot No. 17,<br />
                  Above New Globas Medical,<br />
                  Opposite Satish Kirana, Gori Nagar,<br />
                  New Gouri Nagar, Sukhliya,<br />
                  Indore, Madhya Pradesh – 452010
                </span>
              </li>
            </ul>
          </div>

          {sections.map(section => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-label-md font-black text-white uppercase tracking-widest opacity-90">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-label-md text-primary-fixed-dim hover:text-[--color-brand-blue] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between">
          <p className="text-label-md text-primary-fixed-dim opacity-70">
            © {year} SmileSathi. All rights reserved.
          </p>
          <p className="text-label-md text-primary-fixed-dim opacity-70 mt-4 md:mt-0 flex items-center flex-wrap gap-1.5 justify-center md:justify-end">
            Made with <span className="text-[--color-accent-joy] animate-pulse">❤</span> by
            <a
              href="https://www.antilabs.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[--color-brand-blue] transition-colors font-semibold ml-0.5"
            >
              AntiLabs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

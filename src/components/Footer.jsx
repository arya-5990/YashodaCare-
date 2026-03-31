import { Link } from 'react-router-dom';

const Twitter = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Instagram = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Linkedin = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
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
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Portals',
      links: [
        { label: 'Member Login', href: '/auth' },
        { label: 'Provider Portal', href: '/portal' },
        { label: 'Broker Portal', href: '/portal' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Accessibility', href: '/accessibility' },
      ],
    },
  ];

  return (
    <footer className="bg-surface pt-24 pb-12 overflow-hidden border-t outline-ghost border-transparent">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-8 mb-20">
          
          <div className="col-span-2 lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-2xl font-black text-primary tracking-tighter">SmileSathi</span>
            </Link>
            <p className="text-label-md text-surface-tint max-w-xs leading-relaxed">
              © {year} SmileSathi. All rights reserved. Apki smile ka lifetime partner.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" className="w-10 h-10 rounded-full border border-surface-container-high flex items-center justify-center text-primary transition-all">
                <Twitter size={18} />
              </a>
              <a href="https://www.instagram.com/smilesathiofficial_/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-surface-container-high flex items-center justify-center text-primary transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" className="w-10 h-10 rounded-full border border-surface-container-high flex items-center justify-center text-primary transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {sections.map(section => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-label-md font-black text-primary uppercase tracking-widest">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-label-md text-surface-tint hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

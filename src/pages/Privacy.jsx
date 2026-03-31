import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <main className="min-h-dvh pt-32 md:pt-40 pb-24 bg-surface px-5 relative overflow-hidden">
      {/* Background Depth Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-surface-container-low rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-3 text-label-md text-primary font-bold uppercase tracking-widest mb-12 transition-all hover:gap-4">
          <ArrowLeft size={18} />
          Back to Retrieval
        </Link>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-10 md:p-20 shadow-ambient outline-ghost relative overflow-hidden"
        >
          {/* Internal Header Layering */}
          <div className="mb-20 pb-12 border-none flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <h1 className="text-display-lg text-primary mb-6 leading-none">Privacy<br /><span className="text-surface-tint">Protocol</span></h1>
              <p className="text-label-md text-surface-tint tracking-[0.1em] uppercase font-bold">Document Version: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="p-8 bg-surface-container-low rounded-full outline-ghost shadow-ambient shrink-0">
              <ShieldCheck size={48} className="text-tertiary" />
            </div>
          </div>

          {/* Editorial Content Mapping */}
          <div className="space-y-16 text-body-md text-surface-tint leading-relaxed max-w-none">
            <div className="space-y-6">
              <p className="text-title-lg text-primary font-normal leading-relaxed">
                Your privacy is critically important to us. SmileSathi ("SmileSathi", "we", "us", or "our") respects your privacy regarding any data harvested via our digital systems and physical clinical site.
              </p>
              <p>
                The following protocols outline our commitment to architectural reliability in data handling across smilesathi.com and the associated clinical network.
              </p>
            </div>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">01</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Data Harvest Parameters</h3>
              </div>
              <p>
                We only collect information about you if we have a reason to do so—for example, to provide our Dental Health Plan, to communicate with you, or to make our clinic experience better.
              </p>
              <div className="bg-surface-container-low p-8 rounded-[var(--radius-md)] outline-ghost space-y-6">
                <ul className="space-y-6">
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Personal Identifiers:</strong>
                      <p className="mt-1 opacity-80">Full legal name, authenticated phone number, and residential clinical site for logistics.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-tertiary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Medical History:</strong>
                      <p className="mt-1 opacity-80">Basic dental health data and diagnostic imagery collected explicitly during clinical epoch.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Security Credentials:</strong>
                      <p className="mt-1 opacity-80">Encrypted hash signatures for SmileSathi profile access. No plain-text storage is permitted.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">02</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Operational Utilization</h3>
              </div>
              <p>
                Data is utilized to architect a seamless patient experience:
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-surface-container-high rounded-[var(--radius-md)] outline-ghost">
                  <p className="text-label-md text-primary font-bold uppercase tracking-widest mb-4">Clinical Logic</p>
                  <p className="text-body-md opacity-80">Scheduling, medical record integrity, and diagnostic safety protocols.</p>
                </div>
                <div className="p-8 bg-surface-container-high rounded-[var(--radius-md)] outline-ghost">
                  <p className="text-label-md text-primary font-bold uppercase tracking-widest mb-4">Financial Flow</p>
                  <p className="text-body-md opacity-80">Membership activation, fraud prevention, and subscription management.</p>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">03</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Integrity Assurance</h3>
              </div>
              <p className="text-title-lg text-primary italic">
                "We do not commoditize private medical or personal information."
              </p>
              <p>
                Authorized access is restricted to essential clinical staff and certified independent contractors under strict confidentiality agreements. Regulatory disclosure is only executed under verified legal mandates.
              </p>
            </section>

            <div className="mt-20 pt-12 border-t outline-ghost border-transparent border-dashed">
              <div className="bg-primary rounded-[var(--radius-xl)] p-10 md:p-14 shadow-ambient relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-on-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />
                
                <h4 className="text-headline-md text-on-primary font-bold uppercase tracking-widest mb-8">Clinical Privacy Desk</h4>
                <p className="text-body-md text-surface-tint mb-10 max-w-lg italic">
                  For formal data deletion requests or protocol inquiries, contact our Data Protection Officer immediately.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-on-primary/10 rounded-full flex items-center justify-center text-surface-tint">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-label-md text-on-primary/40 uppercase tracking-widest font-bold">Email</p>
                      <a href="mailto:doctordeskofficial@gmail.com" className="text-title-lg text-on-primary hover:underline">doctordeskofficial@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-on-primary/10 rounded-full flex items-center justify-center text-surface-tint">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-label-md text-on-primary/40 uppercase tracking-widest font-bold">Concierge Line</p>
                      <a href="tel:+918109424356" className="text-title-lg text-on-primary hover:underline">81094 24356</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

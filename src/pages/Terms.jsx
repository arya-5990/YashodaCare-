import { motion } from 'framer-motion';
import { ArrowLeft, Gavel, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
              <h1 className="text-display-lg text-primary mb-6 leading-none">Terms of<br /><span className="text-surface-tint">Engagement</span></h1>
              <p className="text-label-md text-surface-tint tracking-[0.1em] uppercase font-bold">Document Version: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="p-8 bg-surface-container-low rounded-full outline-ghost shadow-ambient shrink-0">
              <Gavel size={48} className="text-tertiary" />
            </div>
          </div>

          {/* Editorial Content Mapping */}
          <div className="space-y-16 text-body-md text-surface-tint leading-relaxed max-w-none">
            <div className="space-y-6">
              <p className="text-title-lg text-primary font-normal leading-relaxed">
                Welcome to SmileSathi ("SmileSathi"). These Terms of Engagement govern your interaction with our digital platform and physical clinical sites.
              </p>
              <p>
                By accessing our clinical systems or activating a membership, you provide explicit consent to be bound by these architectural reliability standards.
              </p>
            </div>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">01</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">The ₹999 Clinical Protocol</h3>
              </div>
              <div className="bg-surface-container-low p-8 rounded-[var(--radius-md)] outline-ghost space-y-6">
                <ul className="space-y-6">
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Temporal Validity:</strong>
                      <p className="mt-1 opacity-80">Exactly 365 days from the activation epoch. No grace periods are recognized.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-tertiary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Identity Integrity:</strong>
                      <p className="mt-1 opacity-80">Memberships are cryptographically bound to a single verified individual. Transfer functions are disabled.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Coverage Logic:</strong>
                      <p className="mt-1 opacity-80">Specific preventive protocols as defined in the membership registry. Major surgical interventions require separate authorization.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">02</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Financial Integrity</h3>
              </div>
              <p className="text-title-lg text-primary italic">
                "All membership activations are final. Zero-refund policy applies."
              </p>
              <p>
                Once a membership is authorized via our clinical gateway, the transaction is non-reversible. We do not provide partial reversals for unutilized temporal segments.
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">03</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Clinical Authority</h3>
              </div>
              <p>
                SmileSathi reserves absolute authority to refuse specific procedures if our clinical staff determines them to be medically unviable or structurally unsafe for the patient's current health state.
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">04</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Jurisdictional Framework</h3>
              </div>
              <p>
                These terms are governed by the laws of the Republic of India. Any systemic disputes shall be resolved within the exclusive jurisdiction of the judicial systems in Indore, Madhya Pradesh.
              </p>
            </section>

            <div className="mt-20 pt-12 border-t outline-ghost border-transparent border-dashed">
              <div className="bg-primary rounded-[var(--radius-xl)] p-10 md:p-14 shadow-ambient relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-on-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />
                
                <h4 className="text-headline-md text-on-primary font-bold uppercase tracking-widest mb-8">Clinical HQ Disclosure</h4>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-on-primary/10 rounded-full flex items-center justify-center text-surface-tint shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-label-md text-on-primary/40 uppercase tracking-widest font-bold">Registered Site</p>
                      <p className="text-title-lg text-on-primary leading-relaxed">
                        Plot No. 17, First Floor, Above New Globas Medical,<br />
                        Gori Nagar, Sukhliya, Indore, MP – 452010
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-10">
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
          </div>
        </motion.div>
      </div>
    </main>
  );
}

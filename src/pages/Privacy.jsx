import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Mail, Phone } from 'lucide-react';
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
                Privacy Policy – SmileSathi Indore
              </p>
              <p>
                SmileSathi Indore ("we", "our", "us") is committed to protecting your privacy and ensuring the security of your personal information. This policy explains what we collect, how we use it, and the safeguards we maintain.
              </p>
            </div>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">01</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Information We Collect</h3>
              </div>
              <p>
                We may collect the following information when you purchase or use SmileSathi services:
              </p>
              <div className="bg-surface-container-low p-8 rounded-[var(--radius-md)] outline-ghost space-y-6">
                <ul className="space-y-6">
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Contact Details</strong>
                      <p className="mt-1 opacity-80">Name, phone number, and email address.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-tertiary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Address &amp; Location</strong>
                      <p className="mt-1 opacity-80">Residential address and relevant location details for communication and service delivery.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Basic Medical / Dental History</strong>
                      <p className="mt-1 opacity-80">Only if required for treatment planning and clinical care.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <span className="w-2 h-2 rounded-full bg-tertiary mt-2 shrink-0" />
                    <div>
                      <strong className="text-on-surface font-bold">Payment Details</strong>
                      <p className="mt-1 opacity-80">Processed securely via trusted third-party payment gateways. We do not store full card or UPI details on our systems.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">02</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">How We Use Your Information</h3>
              </div>
              <p>Your information is used only for legitimate service-related purposes, including:</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-surface-container-high rounded-[var(--radius-md)] outline-ghost">
                  <p className="text-label-md text-primary font-bold uppercase tracking-widest mb-4">Membership &amp; Treatment</p>
                  <p className="text-body-md opacity-80">Providing SmileSathi membership services, booking appointments, and coordinating dental treatments.</p>
                </div>
                <div className="p-8 bg-surface-container-high rounded-[var(--radius-md)] outline-ghost">
                  <p className="text-label-md text-primary font-bold uppercase tracking-widest mb-4">Communication &amp; Experience</p>
                  <p className="text-body-md opacity-80">Sending reminders, offers, and updates, and improving our services and overall customer experience.</p>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">03</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Data Protection</h3>
              </div>
              <p>
                We take appropriate technical and organizational measures to protect your personal data and ensure it is handled securely:
              </p>
              <ul className="space-y-4 list-disc list-inside">
                <li>Secure storage of personal information with restricted access.</li>
                <li>No unauthorized sharing of sensitive medical or personal data.</li>
                <li>Use of trusted third-party tools for payment processing and communication.</li>
              </ul>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">04</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Sharing of Information</h3>
              </div>
              <p>
                We may share your information only when necessary for providing services and processing payments:
              </p>
              <ul className="space-y-4 list-disc list-inside">
                <li>With partner clinics solely for treatment and clinical coordination.</li>
                <li>With payment gateways for secure transaction processing.</li>
              </ul>
              <p className="mt-4 font-semibold text-primary">
                We do not sell, rent, or misuse your personal data.
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">05</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Consent</h3>
              </div>
              <p>
                By purchasing or using SmileSathi services, you consent to the collection, use, and processing of your information in accordance with this Privacy Policy.
              </p>
            </section>

            <div className="mt-20 pt-12 border-t outline-ghost border-transparent border-dashed">
              <div className="bg-primary rounded-[var(--radius-xl)] p-10 md:p-14 shadow-ambient relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-on-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />
                
                <h4 className="text-headline-md text-on-primary font-bold uppercase tracking-widest mb-8">Privacy &amp; Data Queries</h4>
                <p className="text-body-md text-surface-tint mb-10 max-w-lg italic">
                  For any questions about this Privacy Policy or to request updates or corrections to your information, please contact us:
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-on-primary/10 rounded-full flex items-center justify-center text-surface-tint">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-label-md text-on-primary/40 uppercase tracking-widest font-bold">Email</p>
                      <a href="mailto:smilesathiofficial@gmail.com" className="text-title-lg text-on-primary hover:underline">smilesathiofficial@gmail.com</a>
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

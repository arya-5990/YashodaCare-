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
                Terms &amp; Conditions – SmileSathi Indore
              </p>
              <p>
                These Terms &amp; Conditions govern the SmileSathi dental membership plans and related services offered at SmileSathi Indore. By purchasing or using SmileSathi services, you agree to be bound by these terms.
              </p>
            </div>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">01</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Membership Plans</h3>
              </div>
              <p>
                SmileSathi offers dental membership plans, including but not limited to plans priced at ₹999 and other premium options. Benefits and inclusions may vary depending on the selected plan, as communicated at the time of purchase.
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">02</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Non-Refundable Clause</h3>
              </div>
              <p className="text-title-lg text-primary italic">
                All membership plans are strictly non-refundable.
              </p>
              <p>
                Once a membership is purchased, no cancellation, refund, or transfer is permitted under any circumstances, including partial usage or non-usage of benefits.
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">03</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Validity &amp; Usage</h3>
              </div>
              <ul className="space-y-4 list-disc list-inside">
                <li>Membership is valid only for the specified duration mentioned at the time of purchase.</li>
                <li>Benefits can be availed solely during the active validity period of the membership.</li>
              </ul>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">04</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Applicable Clinics</h3>
              </div>
              <ul className="space-y-4 list-disc list-inside">
                <li>SmileSathi services and benefits are applicable only at selected and authorized partner clinics.</li>
                <li>The company reserves the right to modify, update, or change the list of partner clinics at its sole discretion at any time.</li>
              </ul>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">05</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Membership Card Delivery</h3>
              </div>
              <ul className="space-y-4 list-disc list-inside">
                <li>A physical membership card will typically be delivered within 7–10 working days from the date of purchase.</li>
                <li>Until physical delivery, digital confirmation or receipt may be used as valid proof of membership.</li>
              </ul>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">06</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Treatment Terms</h3>
              </div>
              <ul className="space-y-4 list-disc list-inside">
                <li>All treatments are subject to clinical examination and diagnosis by the treating dentist.</li>
                <li>Certain procedures may involve additional charges beyond what is covered under the membership benefits.</li>
                <li>The final decision regarding treatment suitability and protocol lies solely with the treating dentist.</li>
              </ul>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">07</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Appointment Policy</h3>
              </div>
              <ul className="space-y-4 list-disc list-inside">
                <li>Prior appointment is mandatory or strongly recommended before visiting partner clinics.</li>
                <li>All services are subject to the availability of doctors, chairs, and clinic schedules.</li>
              </ul>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">08</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Misuse &amp; Termination</h3>
              </div>
              <p>
                Any misuse, fraud, misrepresentation, or unauthorized sharing of membership benefits will lead to immediate termination of membership without any refund, compensation, or reinstatement.
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">09</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Limitation of Liability</h3>
              </div>
              <p>
                SmileSathi primarily acts as a facilitator connecting patients with partner clinics. The company shall not be held liable for:
              </p>
              <ul className="space-y-4 list-disc list-inside">
                <li>Medical outcomes or results of treatment.</li>
                <li>Treatment complications or side effects.</li>
                <li>Any negligence, errors, or omissions by partner clinics or treating professionals.</li>
              </ul>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">10</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Modification of Terms</h3>
              </div>
              <p>
                The company reserves the right to modify, amend, or update these Terms &amp; Conditions at any time without prior notice. The latest version will be deemed applicable to all existing and new memberships.
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-md text-primary/30 font-bold tracking-widest">11</span>
                <h3 className="text-headline-md text-primary font-bold uppercase tracking-widest">Governing Law &amp; Jurisdiction</h3>
              </div>
              <p>
                These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. All disputes shall be subject to the exclusive jurisdiction of the courts at Indore, Madhya Pradesh, including the Hon’ble Madhya Pradesh High Court as applicable.
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
                        Dr. Ankit Chaurasiya<br />
                        123, KingsPark Colony, GPO, Indore – 452001
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
          </div>
        </motion.div>
      </div>
    </main>
  );
}

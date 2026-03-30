import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <main className="min-h-dvh pt-24 md:pt-32 pb-16 bg-warm-50 px-5">
      <div className="max-w-3xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-teal-900/5 border border-gray-100"
        >
          <div className="mb-10 pb-8 border-b border-gray-100">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-teal-950 mb-4">Terms and Conditions</h1>
            <p className="text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="prose prose-teal prose-headings:font-display prose-headings:text-teal-950 leading-loose text-gray-700">
            <p>
              Welcome to Yashoda Dental Care ("Yashoda Care+"). These Terms and Conditions govern your use of our website and the purchase of our dental health plans. By accessing our platform or purchasing a plan, you agree to be bound by these terms.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">1. The ₹999 Dental Health Plan</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li><strong>Validity:</strong> The ₹999 Dental Plan is valid for one (1) year from the exact date of successful activation/purchase.</li>
              <li><strong>Scope of Coverage:</strong> The plan includes the specific preventive care, consultations, and discounted treatments explicitly stated on our Plans page at the time of purchase. It does not cover major surgical or aesthetic procedures unless specifically listed.</li>
              <li><strong>Non-Transferable:</strong> The plan is strictly bound to the registered patient and cannot be transferred, shared, or gifted retroactively to another individual.</li>
              <li><strong>Identification:</strong> Patients must present their registered phone number and a valid ID at the clinic to avail of the plan's benefits.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">2. Payments, Refunds, and Cancellations</h3>
            <p>
              All payments made towards the purchase of the ₹999 Dental Health Plan are <strong>final and strictly non-refundable</strong> once the plan is activated, regardless of whether the patient utilizes the services during the validity period. We do not offer prorated refunds for mid-year cancellations.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">3. Medical Disclaimer</h3>
            <p>
              The information provided on this website is for educational and booking purposes and does not substitute for professional medical advice, diagnosis, or treatment. Yashoda Dental Care reserves the right to refuse certain treatments to a patient if our medical professionals deem the procedure clinically unsafe or unviable for their specific health condition.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">4. Appointments and Etiquette</h3>
            <p>
              Availability of doctors and appointment slots is subject to clinic schedules. We request patients to arrive 10 minutes prior to their scheduled time. Repeated no-shows without prior cancellation notice may result in temporary suspension of plan booking privileges.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">5. Modifications to Terms</h3>
            <p>
              Dr. Ankit Chourasiya and Yashoda Dental Care reserve the right to modify, alter, or update these terms at any time. Any changes will become effective immediately upon being posted on this webpage.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">6. Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Indore, Madhya Pradesh.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-100 bg-gray-50 p-6 rounded-2xl">
              <p className="font-semibold text-teal-950 mb-2">Contact Us</p>
              <p className="text-sm">For any questions regarding these Terms, please contact us at:</p>
              <ul className="text-sm mt-3 space-y-1">
                <li><strong>Email:</strong> doctordeskofficial@gmail.com</li>
                <li><strong>Phone:</strong> +91 81094-24356</li>
                <li><strong>Address:</strong> First Floor, Plot No. 17, Above New Globas Medical, Opposite Satish Kirana, Gori Nagar, Sukhliya, Indore, MP – 452010</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
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
          <div className="mb-10 pb-8 border-b border-gray-100 flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-teal-950 mb-4">Privacy Policy</h1>
              <p className="text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="p-4 bg-teal-50 rounded-full shrink-0">
              <ShieldCheck size={32} className="text-teal-700" />
            </div>
          </div>

          <div className="prose prose-teal prose-headings:font-display prose-headings:text-teal-950 leading-loose text-gray-700">
            <p>
              Your privacy is critically important to us. Yashoda Dental Care ("Yashoda Care+", "we", "us", or "our") respects your privacy regarding any information we may collect while operating our website and clinical services physically located in Indore.
            </p>
            <p className="mt-4">
              This Privacy Policy applies to the data collected via our website (yashodacare.in or similar domains) and the Yashoda Care+ platform.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h3>
            <p>
              We only collect information about you if we have a reason to do so—for example, to provide our Dental Health Plan, to communicate with you, or to make our clinic experience better.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4 mb-6">
              <li><strong>Personal Identifiers:</strong> Name, age, email address, phone number, and residential address provided during registration.</li>
              <li><strong>Medical History:</strong> Basic dental health data, past treatments, and diagnostic imagery collected explicitly during appointments to provide safe and effective care.</li>
              <li><strong>Account Credentials:</strong> Securely hashed passwords used to access your Yashoda Care+ profile. We do not store plain-text passwords.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">2. How We Use the Information</h3>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4 mb-6">
              <li>Verify your identity and activate your ₹999 Dental Health Plan.</li>
              <li>Schedule clinic appointments and send timely SMS/WhatsApp reminders.</li>
              <li>Maintain an accurate digital medical record for continuous safely optimized treatments.</li>
              <li>Prevent fraudulent activity, spam, and unpermitted transfer of plans.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">3. Data Sharing and Protection</h3>
            <p>
              <strong>We do not sell our users' private personal or medical information.</strong> 
            </p>
            <p className="mt-4">
              We share information about you in the limited circumstances spelled out below and with appropriate safeguards on your privacy:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4 mb-6">
              <li><strong>Our Employees and Independent Contractors:</strong> Who need to know the information to process it on our behalf or to provide dental services.</li>
              <li><strong>Legal and Regulatory Requirements:</strong> We may disclose information in response to a court order or other governmental request.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">4. Security Standards</h3>
            <p>
              While no online service is 100% secure, we work very hard to protect information about you against unauthorized access, use, alteration, or destruction, and take reasonable measures to do so. Your data is stored on secure, encrypted cloud databases (such as Google Firebase Firestore).
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">5. Accessing and Updating Information</h3>
            <p>
              If you have registered an account on our website, you may access, correct, or delete your personal information by logging into the `/profile` section of Yashoda Care+. Alternatively, you can request manual corrections by contacting our clinic via email.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-100 bg-teal-50/50 p-6 rounded-2xl">
              <p className="font-semibold text-teal-950 mb-2">Privacy Questions Issues?</p>
              <p className="text-sm">If you have questions about our Privacy Policy or if you want to request data deletion, please contact our Data Protection Officer at:</p>
              <ul className="text-sm mt-3 space-y-1">
                <li><strong>Email:</strong> doctordeskofficial@gmail.com</li>
                <li><strong>Phone:</strong> +91 81094-24356</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

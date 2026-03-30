import { motion } from 'framer-motion';
import { Check, ShieldCheck, HeartPulse } from 'lucide-react';

export default function Plans() {
  const plans = [
    {
      title: "The Dental Wellness Plan",
      price: "₹9,999",
      period: "/year",
      icon: <ShieldCheck size={32} className="text-secondary" />,
      features: [
        "2 Comprehensive Checkups/year",
        "Professional Scale & Polish",
        "Priority Appointment Booking",
        "20% off on all Advanced Procedures"
      ],
      color: "border-secondary",
      bg: "bg-secondary/5",
      buttonColor: "bg-secondary hover:bg-secondary/90",
      accentText: "text-secondary"
    },
    {
      title: "The Balanced Diet Plan",
      price: "₹6,499",
      period: "/6 months",
      icon: <HeartPulse size={32} className="text-accent" />,
      features: [
        "Personalized Meal Planning",
        "Bi-Weekly Progress Check-ins",
        "Detailed Body Composition Analysis",
        "Direct Support via WhatsApp"
      ],
      color: "border-accent",
      bg: "bg-accent/5",
      buttonColor: "bg-accent hover:bg-accent/90",
      accentText: "text-accent"
    }
  ];

  return (
    <section id="plans" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-6 font-serif">
            Invest in Your <span className="text-primary italic">Well-being</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Unlock a proactive approach to your health. Our tailored plans provide continuous care, ensuring you always feel your absolute best.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`rounded-3xl border-2 ${plan.color} ${plan.bg} p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-20 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                {plan.icon}
              </div>
              
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-100">
                {plan.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.title}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className={`text-4xl lg:text-5xl font-extrabold ${plan.accentText}`}>{plan.price}</span>
                <span className="text-slate-500 font-medium text-lg">{plan.period}</span>
              </div>
              
              <div className="space-y-4 mb-10 min-h-[160px]">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 bg-white rounded-full p-1 shadow-sm ${plan.accentText}`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-3 mt-auto">
                <button className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all ${plan.buttonColor}`}>
                  Subscribe Now
                </button>
                <button className={`w-full py-3 rounded-xl font-bold text-slate-600 hover:text-slate-900 border-2 border-transparent hover:border-slate-200 transition-colors`}>
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

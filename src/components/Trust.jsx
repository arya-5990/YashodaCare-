import { motion } from 'framer-motion';
import { Award, Microscope, CreditCard } from 'lucide-react';

export default function Trust() {
  const cards = [
    {
      icon: <Award size={36} className="text-white" />,
      title: "Certified Experts",
      description: "Our dedicated team of specialized doctors ensures you receive care backed by decades of collective experience.",
      bgClass: "bg-primary",
      iconBgClass: "bg-white/20"
    },
    {
      icon: <Microscope size={36} className="text-white" />,
      title: "Modern Tech",
      description: "We utilize cutting-edge medical and wellness technology for precise diagnosis and comfortable treatments.",
      bgClass: "bg-secondary",
      iconBgClass: "bg-white/20"
    },
    {
      icon: <CreditCard size={36} className="text-white" />,
      title: "Transparent Pricing",
      description: "No hidden fees, no surprises. We believe in complete transparency across all our treatment plans.",
      bgClass: "bg-accent",
      iconBgClass: "bg-white/20"
    }
  ];

  return (
    <section id="trust" className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 font-serif mb-4">
            Why Choose Yashoda<span className="text-primary italic">Care+</span>
          </h2>
          <p className="text-slate-600 font-medium text-lg max-w-2xl mx-auto">
            Experience redefining dental & wellness standards with a flawless fusion of empathy, expertise, and transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              className={`${card.bgClass} rounded-3xl p-8 lg:p-10 text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-500"></div>
              
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${card.iconBgClass} mb-8 shadow-sm backdrop-blur-sm relative z-10`}>
                {card.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 lg:mb-6 font-serif tracking-wide relative z-10">{card.title}</h3>
              <p className="text-white/80 font-medium leading-relaxed relative z-10 text-lg">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

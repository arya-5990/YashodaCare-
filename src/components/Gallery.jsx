import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const FALLBACK_IMAGES = [
  "https://quintessencedental.com/wp-content/uploads/2025/07/Dental-Clinic-Interior-Design-jpg.webp",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBKEpubnWEFWfvbDUW8Ut55CwYBeEPxKfM_A&s",
  "https://bestdentaldeals.in/wp-content/uploads/2025/11/Economy-Setup-scaled-1.webp",
  "https://smiledentalandimplantcentre.com/wp-content/uploads/2022/12/dental-clinic.jpeg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-qbB3M9saSwzBIIzCfLj-UUwUNBUx4l0RDw&s",
  "https://media.istockphoto.com/id/1349328691/photo/young-happy-woman-during-dental-procedure-at-dentists-office.jpg?s=612x612&w=0&k=20&c=H0WBvMhyspSX10Xq65AFhF4DoMLzg8wOpqjjupwTWDE="
];

export default function Gallery() {
  const [images, setImages] = useState(FALLBACK_IMAGES);

  useEffect(() => {
    const fetchClinicImages = async () => {
      try {
        const docRef = doc(db, "assets", "clinic");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.images && Array.isArray(data.images)) {
            setImages(data.images);
          }
        }
      } catch (error) {
        console.error("Error fetching clinic images:", error);
      }
    };

    fetchClinicImages();
  }, []);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-label-md tracking-[0.2em] font-black uppercase text-tertiary mb-6 block">Visual Portfolio</span>
          <h2 className="text-display-lg text-primary mb-6">
            Clinical Precision in Motion
          </h2>
          <p className="text-body-md text-surface-tint leading-relaxed italic">
            "Experience the intersection of architectural reliability and leading-edge dental technology."
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative rounded-[var(--radius-xl)] bg-surface-container-lowest p-2 outline-ghost shadow-ambient break-inside-avoid overflow-hidden group"
            >
              <div className="rounded-[calc(var(--radius-xl)-8px)] overflow-hidden">
                <img 
                  src={img} 
                  alt="Clinical environment" 
                  className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

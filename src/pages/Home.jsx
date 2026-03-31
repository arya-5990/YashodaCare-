import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import HomePricing from '../components/HomePricing';
import DoctorsSection from '../components/Doctors';
import GallerySection from '../components/Gallery';
import TestimonialsSection from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <HomePricing />
      <DoctorsSection />
      <GallerySection />
      <TestimonialsSection />
      <CallToAction />
    </main>
  );
}

import Hero from '../components/Hero';
import HomePricing from '../components/HomePricing';
import MembershipCardPromo from '../components/MembershipCardPromo';
import DoctorsSection from '../components/Doctors';
import GallerySection from '../components/Gallery';
import TestimonialsSection from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

export default function Home() {
  return (
    <main>
      <Hero />
      <HomePricing />
      <MembershipCardPromo />
      <DoctorsSection />
      <GallerySection />
      <TestimonialsSection />
      <CallToAction />
    </main>
  );
}

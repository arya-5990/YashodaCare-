import Hero from '../components/Hero';
import HomePricing from '../components/HomePricing';
import MembershipCardPromo from '../components/MembershipCardPromo';
import DoctorsSection from '../components/Doctors';
import GallerySection from '../components/Gallery';
import TestimonialsSection from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

// TODO: Remove or comment out this import once the outstanding Firebase bill is paid.
import BlockedBanner from '../components/BlockedBanner';

export default function Home() {
  return (
    <main>
      {/* 
        BLOCK SCREEN: This component covers the entire landing page.
        To restore the website and remove the block screen after the bill is paid, 
        simply comment out or delete the line below:
      */}
      <BlockedBanner />
      
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


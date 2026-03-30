import Navbar from './components/Header';
import Hero from './components/Hero';
import PlanSection from './components/Plans';
import WhyUs from './components/Trust';
import ClinicExperience from './components/ClinicExperience';
import CallToAction from './components/CallToAction';
import ContactFooter from './components/Footer';
import WhatsAppButton from './components/FloatingWhatsApp';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PlanSection />
        <WhyUs />
        <ClinicExperience />
        <CallToAction />
      </main>
      <ContactFooter />
      <WhatsAppButton />
    </>
  );
}

export default App;

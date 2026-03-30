import Hero from '../components/Hero';
import WhyUs from '../components/Trust';
import ClinicExperience from '../components/ClinicExperience';
import CallToAction from '../components/CallToAction';

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyUs />
      <ClinicExperience />
      <CallToAction />
    </main>
  );
}

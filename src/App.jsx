import Header from './components/Header';
import Hero from './components/Hero';
import Trust from './components/Trust';
import Plans from './components/Plans';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent/20 selection:text-primary">
      <Header />
      <main>
        <Hero />
        <Trust />
        <Plans />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default App;

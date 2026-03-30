import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Header';
import ContactFooter from './components/Footer';
import WhatsAppButton from './components/FloatingWhatsApp';

import Home from './pages/Home';
import PlansPage from './pages/PlansPage';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <ContactFooter />
        <WhatsAppButton />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

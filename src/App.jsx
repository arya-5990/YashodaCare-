import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Header';
import ContactFooter from './components/Footer';
import FloatingQR from './components/FloatingWhatsApp';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import PlansPage from './pages/PlansPage';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Products from './pages/Products';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
        </Routes>
        <ContactFooter />
        <FloatingQR />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

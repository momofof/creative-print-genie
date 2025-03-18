
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Create from './pages/Create';
import FAQ from './pages/FAQ';
import Cart from './pages/Cart';
import GettingStarted from './pages/GettingStarted';
import Pricing from './pages/Pricing';
import Customize from './pages/Customize';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/Profile';
import Contact from './pages/support/Contact';
import HelpCenter from './pages/support/HelpCenter';
import ProLanding from './pages/ProLanding';
import Pro from './pages/Pro';
import Dashboard from './pages/supplier/Dashboard';
import ProductForm from './pages/supplier/ProductForm';
import Register from './pages/supplier/Register';
import CustomDesign from './pages/services/CustomDesign';
import TechnicalSupport from './pages/services/TechnicalSupport';
import { initStorage } from './integrations/supabase/storage';

function App() {
  useEffect(() => {
    // Initialiser le stockage Supabase au démarrage
    initStorage().catch(error => 
      console.error("Erreur lors de l'initialisation du stockage:", error)
    );
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/detail/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/create" element={<Create />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/customize/:productId" element={<Customize />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/pro" element={<ProLanding />} />
        <Route path="/supplier" element={<Pro />} />
        <Route path="/supplier/dashboard" element={<Dashboard />} />
        <Route path="/supplier/product/new" element={<ProductForm />} />
        <Route path="/supplier/product/:productId/edit" element={<ProductForm />} />
        <Route path="/supplier/register" element={<Register />} />
        <Route path="/services/custom-design" element={<CustomDesign />} />
        <Route path="/services/technical-support" element={<TechnicalSupport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster position="top-right" />
    </Router>
  );
}

export default App;

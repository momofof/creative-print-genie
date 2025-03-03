
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Pro from "@/pages/Pro";
import ProLanding from "@/pages/ProLanding";
import Pricing from "@/pages/Pricing";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import FAQ from "@/pages/FAQ";
import GettingStarted from "@/pages/GettingStarted";
import Create from "@/pages/Create";
import HelpCenter from "@/pages/support/HelpCenter";
import Contact from "@/pages/support/Contact";
import CustomDesign from "@/pages/services/CustomDesign";
import TechnicalSupport from "@/pages/services/TechnicalSupport";
import NotFound from "@/pages/NotFound";
import Customize from "./pages/Customize";
import SupplierRegister from "./pages/supplier/Register";
import { supabase } from "@/integrations/supabase/client";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        // Store the current path to redirect after login
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    // Still loading
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/pro-landing" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:categoryId" element={<Products />} />
        <Route path="/products/detail/:productId" element={<ProductDetail />} />
        <Route path="/customize/:productId?" element={<Customize />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/pro" element={<ProtectedRoute><Pro /></ProtectedRoute>} />
        <Route path="/pro-landing" element={<ProLanding />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/create" element={<Create />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/custom-design" element={<CustomDesign />} />
        <Route path="/technical-support" element={<TechnicalSupport />} />
        <Route path="/supplier/register" element={<SupplierRegister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

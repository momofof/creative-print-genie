
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
import { toast } from "sonner";

// Protected route component for supplier-only access
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      // Check if user is logged in
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        // Not logged in at all - store current path and redirect to login
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // User is logged in, now check if they are a supplier
      try {
        const { data: supplierData, error } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (error || !supplierData) {
          // User is logged in but not a supplier
          toast.error("Accès réservé aux fournisseurs");
          setIsAuthenticated(false);
        } else if (supplierData.status !== 'approved') {
          // Supplier account exists but not approved
          toast.error("Votre compte fournisseur est en attente d'approbation");
          setIsAuthenticated(false);
        } else {
          // User is a valid, approved supplier
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur de vérification du statut fournisseur:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoading) {
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

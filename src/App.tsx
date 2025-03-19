
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Customize from "@/pages/Customize";
import Profile from "@/pages/Profile";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Auth from "@/pages/auth/Auth";

// Supplier pages
import Register from "@/pages/supplier/Register";
import Dashboard from "@/pages/supplier/Dashboard";
import ProductForm from "@/pages/supplier/ProductForm";

// Service pages
import CustomDesign from "@/pages/services/CustomDesign";
import TechnicalSupport from "@/pages/services/TechnicalSupport";

// Support pages
import Contact from "@/pages/support/Contact";
import HelpCenter from "@/pages/support/HelpCenter";

// Pro/Supplier pages
import Pro from "@/pages/Pro";
import ProLanding from "@/pages/ProLanding";
import FAQ from "@/pages/FAQ";
import GettingStarted from "@/pages/GettingStarted";
import Create from "@/pages/Create";
import Pricing from "@/pages/Pricing";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/customize/:productId" element={<Customize />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Supplier pages */}
        <Route path="/supplier/register" element={<Register />} />
        <Route path="/supplier/dashboard" element={<Dashboard />} />
        <Route path="/supplier/product/new" element={<ProductForm />} />
        <Route path="/supplier/product/:productId" element={<ProductForm />} />
        
        {/* Service pages */}
        <Route path="/custom-design" element={<CustomDesign />} />
        <Route path="/support" element={<TechnicalSupport />} />
        
        {/* Support pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<HelpCenter />} />
        
        {/* Pro pages */}
        <Route path="/pro" element={<Pro />} />
        <Route path="/pro-landing" element={<ProLanding />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/create" element={<Create />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

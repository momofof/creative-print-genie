
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Pro from "@/pages/Pro";
import ProLanding from "@/pages/ProLanding";
import Customize from "@/pages/Customize";
import Profile from "@/pages/Profile";
import Cart from "@/pages/Cart";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/support/Contact";
import HelpCenter from "@/pages/support/HelpCenter";
import NotFound from "@/pages/NotFound";
import CustomDesign from "@/pages/services/CustomDesign";
import TechnicalSupport from "@/pages/services/TechnicalSupport";
import GettingStarted from "@/pages/GettingStarted";
import Create from "@/pages/Create";
import Pricing from "@/pages/Pricing";
import SupplierProductDetail from "@/pages/supplier/ProductDetail";
import ProductForm from "@/pages/supplier/ProductForm";
import SupplierRegister from "@/pages/supplier/Register";
import SupplierDashboard from "@/pages/supplier/Dashboard";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:categoryId" element={<Products />} />
        <Route path="/products/:categoryId/:subcategoryId" element={<Products />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/pro" element={<Pro />} />
        <Route path="/supplier/product/:productId" element={<SupplierProductDetail />} />
        <Route path="/supplier/product/:productId/edit" element={<SupplierProductDetail />} />
        <Route path="/supplier/product/new" element={<ProductForm />} />
        <Route path="/supplier/register" element={<SupplierRegister />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/pro-landing" element={<ProLanding />} />
        <Route path="/customize/:productId" element={<Customize />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/services/custom-design" element={<CustomDesign />} />
        <Route path="/services/technical-support" element={<TechnicalSupport />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/create" element={<Create />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;

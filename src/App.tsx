
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Customize from "./pages/Customize";
import Create from "./pages/Create";
import AuthStateWrapper from "./components/home/AuthStateWrapper";
import SupplierDashboard from "./pages/supplier/Dashboard";
import HelpCenter from "./pages/support/HelpCenter";
import Contact from "./pages/support/Contact";
import CustomDesign from "./pages/services/CustomDesign";
import TechnicalSupport from "./pages/services/TechnicalSupport";
import GettingStarted from "./pages/GettingStarted";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import "./App.css";
import Register from "./pages/supplier/Register";
import SupplierProductForm from "./pages/supplier/ProductForm";

function App() {
  return (
    <Router>
      <AuthStateWrapper>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/customize/:id" element={<Customize />} />
          <Route path="/create" element={<Create />} />
          
          {/* Supplier routes */}
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier/register" element={<Register />} />
          <Route path="/supplier/product/new" element={<SupplierProductForm />} />
          <Route path="/supplier/product/:id/edit" element={<SupplierProductForm />} />
          
          {/* Redirect both /pro and /supplier to supplier dashboard for backward compatibility */}
          <Route path="/pro" element={<Navigate to="/supplier/dashboard" replace />} />
          <Route path="/supplier" element={<Navigate to="/supplier/dashboard" replace />} />
          
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services/custom-design" element={<CustomDesign />} />
          <Route path="/services/technical-support" element={<TechnicalSupport />} />
          <Route path="/getting-started" element={<GettingStarted />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthStateWrapper>
    </Router>
  );
}

export default App;

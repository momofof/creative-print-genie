
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Customize from "./pages/Customize";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import SupplierDashboard from "./pages/supplier/Dashboard";
import ProductForm from "./pages/supplier/ProductForm";
import SupplierRegister from "./pages/supplier/Register";

function App() {
  return (
    <main>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:categoryId" element={<Products />} />
        <Route path="/products/:categoryId/:subcategoryId" element={<Products />} />
        <Route path="/products/detail/:productId" element={<ProductDetail />} />
        <Route path="/customize/:productId" element={<Customize />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier/product/new" element={<ProductForm />} />
        <Route path="/supplier/product/:productId/edit" element={<ProductForm />} />
        <Route path="/supplier/register" element={<SupplierRegister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;

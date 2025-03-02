import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Pro from "@/pages/Pro";
import Pricing from "@/pages/Pricing";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import FAQ from "@/pages/FAQ";
import GettingStarted from "@/pages/GettingStarted";
import Create from "@/pages/Create";
import HelpCenter from "@/pages/HelpCenter";
import Contact from "@/pages/Contact";
import CustomDesign from "@/pages/CustomDesign";
import TechnicalSupport from "@/pages/TechnicalSupport";
import NotFound from "@/pages/NotFound";

import Customize from "./pages/Customize";

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
        <Route path="/pro" element={<Pro />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

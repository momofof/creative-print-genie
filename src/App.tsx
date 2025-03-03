import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Pro from "./pages/Pro";

// Ajoutez ici l'import des nouvelles pages fournisseur
import SupplierDashboard from "./pages/supplier/Dashboard";
import SupplierRegister from "./pages/supplier/Register";
import ProductForm from "./pages/supplier/ProductForm";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="dark:bg-zinc-900">
          <Suspense fallback={<div>Loading...</div>}>
            {/*  */}
          </Suspense>
        </div>
      
      <div className="flex min-h-screen flex-col">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Routes fournisseur */}
          <Route path="/pro" element={<Pro />} />
          <Route path="/supplier/register" element={<SupplierRegister />} />
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier/product/new" element={<ProductForm />} />
          <Route path="/supplier/product/:productId/edit" element={<ProductForm />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
      </div>
    </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

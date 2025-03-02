
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
import Profile from "./pages/Profile";
import Pro from "./pages/Pro";

// Import supplier pages
import SupplierDashboard from "./pages/supplier/Dashboard";
import SupplierRegister from "./pages/supplier/Register";
import ProductForm from "./pages/supplier/ProductForm";

// Import from auth folder for auth pages
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";

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


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Pricing from "./pages/Pricing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import HowItWorks from "./pages/HowItWorks";
import GettingStarted from "./pages/GettingStarted";
import FAQ from "./pages/FAQ";
import Creators from "./pages/solutions/Creators";
import Business from "./pages/solutions/Business";
import Tutorials from "./pages/learn/Tutorials";
import Blog from "./pages/learn/Blog";
import CustomDesign from "./pages/services/CustomDesign";
import TechnicalSupport from "./pages/services/TechnicalSupport";
import HelpCenter from "./pages/support/HelpCenter";
import Contact from "./pages/support/Contact";
import Create from "./pages/Create";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/getting-started" element={<GettingStarted />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/business" element={<Business />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/custom-design" element={<CustomDesign />} />
          <Route path="/support" element={<TechnicalSupport />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create" element={<Create />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import Pricing from "@/pages/Pricing";
import GettingStarted from "@/pages/GettingStarted";
import HowItWorks from "@/pages/HowItWorks";
import FAQ from "@/pages/FAQ";
import Creators from "@/pages/Creators";
import Business from "@/pages/Business";
import Tutorials from "@/pages/Tutorials";
import Blog from "@/pages/Blog";
import CustomDesign from "@/pages/CustomDesign";
import TechnicalSupport from "@/pages/TechnicalSupport";
import HelpCenter from "@/pages/HelpCenter";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import Create from "@/pages/Create";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:categoryId" element={<Products />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<Create />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

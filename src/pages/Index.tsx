
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import CategoryPills from "@/components/home/CategoryPills";
import ProductOrderForm from "@/components/home/ProductOrderForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <CategoryPills />
      <ProductOrderForm />
    </div>
  );
};

export default Index;

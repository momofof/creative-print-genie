
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import CategoryPills from "@/components/home/CategoryPills";
import ProductOrderForm from "@/components/home/ProductOrderForm";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";

const Index = () => {
  return (
    <AuthStateWrapper>
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <CategoryPills />
        <ProductOrderForm />
      </div>
    </AuthStateWrapper>
  );
};

export default Index;

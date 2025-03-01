
import Navigation from "@/components/Navigation";
import PromoBanner from "@/components/home/PromoBanner";
import HeroSection from "@/components/home/HeroSection";
import CategoryPills from "@/components/home/CategoryPills";
import ProductCategories from "@/components/home/ProductCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturesSection from "@/components/home/FeaturesSection";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";

const Index = () => {
  return (
    <AuthStateWrapper>
      <div className="min-h-screen bg-white">
        <PromoBanner />
        <Navigation />
        <HeroSection />
        <CategoryPills />
        <ProductCategories />
        <FeaturedProducts />
        <FeaturesSection />
      </div>
    </AuthStateWrapper>
  );
};

export default Index;

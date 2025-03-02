
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import CategoryPills from "@/components/home/CategoryPills";
import ProductCategories from "@/components/home/ProductCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturesSection from "@/components/home/FeaturesSection";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <AuthStateWrapper>
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <CategoryPills />
        <ProductCategories />
        <FeaturedProducts />
        <FeaturesSection />
        <Footer />
      </div>
    </AuthStateWrapper>
  );
};

export default Index;

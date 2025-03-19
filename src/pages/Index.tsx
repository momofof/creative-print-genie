
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import CategoryPills from "@/components/home/CategoryPills";
import ProductOrderForm from "@/components/home/ProductOrderForm";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { allProducts } from "@/data/productData";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <AuthStateWrapper>
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <CategoryPills />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Commandez vos produits personnalisés</h2>
            <p className="mt-2 text-gray-600">Remplissez le formulaire ci-dessous pour passer votre commande</p>
          </div>
          
          <ProductOrderForm products={allProducts} />
          
          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-4">Vous préférez parcourir notre catalogue ?</p>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/products')}
              className="px-6"
            >
              Voir tous nos produits
            </Button>
          </div>
        </div>
      </div>
    </AuthStateWrapper>
  );
};

export default Index;

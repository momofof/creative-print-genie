
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import ProductOrderForm from "@/components/home/ProductOrderForm";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useProductsWithVariants } from "@/hooks/useProductsWithVariants";
import { useState } from "react";
import SupplierSection from "@/components/home/SupplierSection";

const Index = () => {
  const navigate = useNavigate();
  const { products, isLoading, error } = useProductsWithVariants();
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
  
  // Handler for product selection
  const handleProductSelect = (productId: string | undefined) => {
    setSelectedProductId(productId);
    console.log("Product selected:", productId);
  };
  
  return (
    <AuthStateWrapper>
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Commandez vos produits personnalisés</h2>
            <p className="mt-2 text-gray-600">Remplissez le formulaire ci-dessous pour passer votre commande</p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
              </div>
              <p className="mt-2 text-gray-600">Chargement des produits...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-500 mb-4">Une erreur est survenue lors du chargement des produits.</p>
              <p className="text-sm text-gray-500">Veuillez réessayer plus tard ou contacter le support.</p>
            </div>
          ) : products.length > 0 ? (
            <ProductOrderForm 
              products={products} 
              onProductSelect={handleProductSelect}
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-4">Aucun produit disponible actuellement.</p>
              <p className="text-sm text-gray-500">Veuillez revenir plus tard ou contacter le support.</p>
            </div>
          )}
        </div>
        
        {/* Supplier Section - rendu seulement si un produit est sélectionné */}
        {selectedProductId && (
          <SupplierSection productId={selectedProductId} />
        )}
        
        <div className="container mx-auto px-4 py-8">
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
        
        <Footer />
      </div>
    </AuthStateWrapper>
  );
};

export default Index;

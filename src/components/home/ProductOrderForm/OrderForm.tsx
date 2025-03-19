
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

// Import components
import SearchableDropdown from "./SearchableDropdown";
import QuantitySelector from "./QuantitySelector";
import VariantSelector from "./VariantSelector";
import ProductIllustration from "./ProductIllustration";
import { useOrderSubmission } from "./hooks/useOrderSubmission";

// Import utility functions
import { 
  getQuantityOptions, 
  getAvailableVariants, 
  getVariantOptions, 
  getVariantDisplayName,
  getFeatureIllustration
} from "./utils";

const OrderForm = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [openIllustration, setOpenIllustration] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const { handleSubmit, isSubmitting } = useOrderSubmission({
    selectedProduct,
    selectedQuantity,
    variants,
    userId,
    onOrderSuccess: () => {
      // Reset form
      setSelectedProduct(undefined);
      setSelectedQuantity(null);
      setVariants({});
    }
  });

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Update available variants when product category changes
  useEffect(() => {
    if (selectedProduct) {
      const variantTypes = getAvailableVariants(selectedProduct.category);
      setAvailableVariants(variantTypes);
      
      // Reset variant selections when product changes
      setVariants({});
    } else {
      setAvailableVariants([]);
    }
  }, [selectedProduct]);

  // Automatically open the illustration sheet on mobile when variants are selected
  useEffect(() => {
    if (isMobile && selectedProduct && Object.keys(variants).length > 0) {
      setOpenIllustration(true);
    }
  }, [variants, selectedProduct, isMobile]);

  const handleVariantChange = (variantType: string, value: string) => {
    setVariants(prev => ({ ...prev, [variantType]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-4xl mx-auto my-6 md:my-10">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Commander vos produits</h2>
      
      {/* Mobile preview illustration */}
      {isMobile && selectedProduct && Object.keys(variants).length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center">
            <img 
              src={getFeatureIllustration(selectedProduct, variants)} 
              alt="Aperçu produit" 
              className="max-h-40 object-contain mb-3" 
            />
            <div className="text-center">
              <h3 className="font-medium text-gray-800">{selectedProduct.name}</h3>
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {Object.entries(variants).map(([type, value]) => (
                  <span key={type} className="text-xs bg-white px-2 py-1 rounded-full border">
                    {getVariantDisplayName(type)}: {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Product Form Column */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 md:space-y-6">
              <SearchableDropdown
                label="Sélectionnez un produit"
                placeholder="Choisir un produit..."
                products={[]}  // We'll pass products through a hook in index.tsx
                selectedProduct={selectedProduct}
                onSelect={setSelectedProduct}
              />
              
              {selectedProduct && (
                <>
                  <QuantitySelector
                    quantityOptions={getQuantityOptions(selectedProduct.category)}
                    selectedQuantity={selectedQuantity}
                    setSelectedQuantity={setSelectedQuantity}
                  />
                  
                  {/* Variant selectors */}
                  {availableVariants.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Options spécifiques</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {availableVariants.map((variantType) => (
                          <VariantSelector
                            key={variantType}
                            variantType={variantType}
                            displayName={getVariantDisplayName(variantType)}
                            options={getVariantOptions(selectedProduct.category, variantType)}
                            selectedValue={variants[variantType] || ""}
                            onChange={(value) => handleVariantChange(variantType, value)}
                            productCategory={selectedProduct.category}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="mt-6 md:mt-8">
              <button
                type="submit"
                disabled={!selectedProduct || !selectedQuantity || isSubmitting}
                className={cn(
                  "w-full bg-accent text-white py-3 px-6 rounded-md font-medium transition-colors",
                  (!selectedProduct || !selectedQuantity || isSubmitting) ? 
                    "opacity-50 cursor-not-allowed" : 
                    "hover:bg-accent/90"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </span>
                ) : "Commander"}
              </button>
            </div>
          </form>
        </div>

        {/* Illustration Column - Hidden on mobile, replaced with sheet/drawer */}
        {isMobile ? (
          <div className="md:hidden">
            <button
              className="w-full mt-4 py-2.5 px-4 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium flex items-center justify-center"
              onClick={() => setOpenIllustration(true)}
            >
              <span>Voir l'aperçu du produit</span>
            </button>
          </div>
        ) : (
          <ProductIllustration
            selectedProduct={selectedProduct}
            variants={variants}
            openIllustration={openIllustration}
            setOpenIllustration={setOpenIllustration}
          />
        )}
      </div>

      {/* Mobile illustration sheet */}
      {isMobile && (
        <ProductIllustration
          selectedProduct={selectedProduct}
          variants={variants}
          openIllustration={openIllustration}
          setOpenIllustration={setOpenIllustration}
        />
      )}
    </div>
  );
};

export default OrderForm;

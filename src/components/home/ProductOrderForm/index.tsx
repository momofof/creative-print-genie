
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { allProducts } from "@/data/productData";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our components
import SearchableDropdown from "./SearchableDropdown";
import QuantitySelector from "./QuantitySelector";
import VariantSelector from "./VariantSelector";
import ProductIllustration from "./ProductIllustration";

// Import utility functions
import { 
  getQuantityOptions, 
  getAvailableVariants, 
  getVariantOptions, 
  getVariantDisplayName 
} from "./utils";

const ProductOrderForm = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [openIllustration, setOpenIllustration] = useState(false);
  const isMobile = useIsMobile();
  
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

  const handleVariantChange = (variantType: string, value: string) => {
    setVariants(prev => ({ ...prev, [variantType]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedQuantity) {
      toast.error("Veuillez sélectionner un produit et une quantité");
      return;
    }
    
    // Here you would typically process the order with the variants
    console.log("Order submitted:", {
      product: selectedProduct,
      quantity: selectedQuantity,
      variants: variants
    });
    
    // Show success message
    toast.success(`Commande de ${selectedQuantity} ${selectedProduct.name} envoyée avec succès !`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-4xl mx-auto my-6 md:my-10">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Commander vos produits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Product Form Column */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 md:space-y-6">
              <SearchableDropdown
                label="Sélectionnez un produit"
                placeholder="Choisir un produit..."
                products={allProducts}
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
                disabled={!selectedProduct || !selectedQuantity}
                className={cn(
                  "w-full bg-accent text-white py-3 px-6 rounded-md font-medium transition-colors",
                  (!selectedProduct || !selectedQuantity) ? 
                    "opacity-50 cursor-not-allowed" : 
                    "hover:bg-accent/90"
                )}
              >
                Commander
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
    </div>
  );
};

export default ProductOrderForm;

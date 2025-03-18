
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProductData, useProductVariants } from "@/hooks/useProductData";

// Import our components
import SearchableDropdown from "./SearchableDropdown";
import QuantitySelector from "./QuantitySelector";
import VariantSelector from "./VariantSelector";
import ProductIllustration from "./ProductIllustration";

// Import utility functions
import { getVariantDisplayName } from "./utils";

const ProductOrderForm = () => {
  const { products, isLoadingProducts } = useProductData();
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [openIllustration, setOpenIllustration] = useState(false);
  
  // Extract the category_id from the selected product for the variants hook
  const categoryId = selectedProduct?.category;
  const { 
    variantTypes, 
    variantOptions,
    quantityOptions,
    isLoading: isLoadingVariants 
  } = useProductVariants(categoryId);

  // Reset variant selections when product changes
  useEffect(() => {
    setVariants({});
    setSelectedQuantity(null);
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
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Commander vos produits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Form Column */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <SearchableDropdown
                label="Sélectionnez un produit"
                placeholder="Choisir un produit..."
                products={products || []}
                selectedProduct={selectedProduct}
                onSelect={setSelectedProduct}
                isLoading={isLoadingProducts}
              />
              
              {selectedProduct && (
                <>
                  <QuantitySelector
                    quantityOptions={quantityOptions}
                    selectedQuantity={selectedQuantity}
                    setSelectedQuantity={setSelectedQuantity}
                  />
                  
                  {/* Variant selectors */}
                  {variantTypes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Options spécifiques</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {variantTypes.map((variantType) => (
                          <VariantSelector
                            key={variantType.id}
                            variantType={variantType.name}
                            displayName={getVariantDisplayName(variantType.name) || variantType.display_name}
                            options={variantOptions[variantType.name]?.map(opt => opt.value) || []}
                            selectedValue={variants[variantType.name] || ""}
                            onChange={(value) => handleVariantChange(variantType.name, value)}
                            productCategory={selectedProduct.category}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isLoadingVariants && (
                    <div className="py-4 text-center text-gray-500">
                      Chargement des options...
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="mt-8">
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

        {/* Illustration Column */}
        <ProductIllustration
          selectedProduct={selectedProduct}
          variants={variants}
          openIllustration={openIllustration}
          setOpenIllustration={setOpenIllustration}
        />
      </div>
    </div>
  );
};

export default ProductOrderForm;

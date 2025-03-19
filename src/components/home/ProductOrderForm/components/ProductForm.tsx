
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Import components
import SearchableDropdown from "../SearchableDropdown";
import QuantitySelector from "../QuantitySelector";
import VariantSelector from "../VariantSelector";

// Import utility functions
import { 
  getQuantityOptions, 
  getAvailableVariants, 
  getVariantOptions, 
  getVariantDisplayName 
} from "../utils";

interface ProductFormProps {
  products: Product[];
  selectedProduct: Product | undefined;
  setSelectedProduct: (product: Product | undefined) => void;
  selectedQuantity: number | null;
  setSelectedQuantity: (quantity: number | null) => void;
  variants: Record<string, string>;
  setVariants: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  availableVariants: string[];
  setAvailableVariants: React.Dispatch<React.SetStateAction<string[]>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

const ProductForm = ({
  products,
  selectedProduct,
  setSelectedProduct,
  selectedQuantity,
  setSelectedQuantity,
  variants,
  setVariants,
  availableVariants,
  setAvailableVariants,
  handleSubmit,
  isSubmitting
}: ProductFormProps) => {
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
  }, [selectedProduct, setAvailableVariants, setVariants]);

  const handleVariantChange = (variantType: string, value: string) => {
    setVariants(prev => ({ ...prev, [variantType]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 md:space-y-6">
        <SearchableDropdown
          label="Sélectionnez un produit"
          placeholder="Choisir un produit..."
          products={products} 
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
  );
};

export default ProductForm;

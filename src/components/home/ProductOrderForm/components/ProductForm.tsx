
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
  getVariantDisplayName,
  parseVariants,
  extractVariantOptionsFromProduct
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
  const [productVariantOptions, setProductVariantOptions] = useState<Record<string, string[]>>({});
  
  // Update available variants when product changes
  useEffect(() => {
    if (selectedProduct) {
      console.log("Selected product:", selectedProduct);
      
      // Get available variant types for the product category
      let variantTypes: string[] = [];
      
      // Essayer d'abord la subcategory si elle existe
      if (selectedProduct.subcategory) {
        variantTypes = getAvailableVariants(selectedProduct.subcategory);
      }
      
      // Si aucune variante trouvée avec la subcategory, essayer la category
      if (variantTypes.length === 0) {
        variantTypes = getAvailableVariants(selectedProduct.category);
      }
      
      console.log("Variant types for category:", variantTypes);
      setAvailableVariants(variantTypes);
      
      // Extract variant options from product data if available
      const productOptions = extractVariantOptionsFromProduct(selectedProduct);
      console.log("Extracted product variant options:", productOptions);
      setProductVariantOptions(productOptions);
      
      // Reset variant selections when product changes
      setVariants({});
    } else {
      setAvailableVariants([]);
      setProductVariantOptions({});
    }
  }, [selectedProduct, setAvailableVariants, setVariants]);

  const handleVariantChange = (variantType: string, value: string) => {
    setVariants(prev => ({ ...prev, [variantType]: value }));
  };
  
  // Get variant options prioritizing product-specific options if available
  const getOptionsForVariant = (variantType: string): string[] => {
    if (selectedProduct) {
      // Si des options spécifiques au produit existent pour cette variante, les utiliser
      if (productVariantOptions[variantType] && productVariantOptions[variantType].length > 0) {
        return productVariantOptions[variantType];
      }
      
      // Sinon, utiliser les options génériques basées sur la catégorie/sous-catégorie
      if (selectedProduct.subcategory) {
        const subcategoryOptions = getVariantOptions(selectedProduct.subcategory, variantType);
        if (subcategoryOptions.length > 0) {
          return subcategoryOptions;
        }
      }
      
      return getVariantOptions(selectedProduct.category, variantType);
    }
    
    return [];
  };

  // Calcul du prix total
  const calculateTotalPrice = () => {
    if (!selectedProduct || !selectedQuantity) return 0;
    return selectedProduct.price * selectedQuantity;
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
              quantityOptions={getQuantityOptions(selectedProduct.subcategory || selectedProduct.category)}
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
                      options={getOptionsForVariant(variantType)}
                      selectedValue={variants[variantType] || ""}
                      onChange={(value) => handleVariantChange(variantType, value)}
                      productCategory={selectedProduct.subcategory || selectedProduct.category}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Affichage du prix */}
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Prix unitaire:</span>
                <span className="font-semibold">{selectedProduct.price.toLocaleString('fr-FR')} €</span>
              </div>
              
              {selectedQuantity && selectedQuantity > 0 && (
                <>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700 font-medium">Quantité:</span>
                    <span>{selectedQuantity}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                    <span className="text-gray-800 font-medium">Total:</span>
                    <span className="text-lg font-bold text-accent">{calculateTotalPrice().toLocaleString('fr-FR')} €</span>
                  </div>
                </>
              )}
            </div>
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

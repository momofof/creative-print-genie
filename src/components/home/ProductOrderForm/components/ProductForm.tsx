
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

// Import components
import SearchableDropdown from "../SearchableDropdown";
import QuantitySelector from "../QuantitySelector";
import ProductFormVariants from "./ProductFormVariants";
import ProductFormPrice from "./ProductFormPrice";
import ProductFormSubmitButton from "./ProductFormSubmitButton";
import ProductDescription from "./ProductDescription";

// Import utility functions
import { 
  getQuantityOptions, 
  getAvailableVariants,
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
  editMode?: boolean;
  productSelectionDisabled?: boolean;
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
  isSubmitting,
  editMode = false,
  productSelectionDisabled = false
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
      const fetchProductVariantOptions = async () => {
        const options = await extractVariantOptionsFromProduct(selectedProduct);
        console.log("Extracted product variant options:", options);
        setProductVariantOptions(options);
      };
      
      fetchProductVariantOptions();
      
      // Only reset variant selections when product changes if not in edit mode
      if (!editMode) {
        setVariants({});
      }
    } else {
      setAvailableVariants([]);
      setProductVariantOptions({});
    }
  }, [selectedProduct, setAvailableVariants, setVariants, editMode]);

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
          disabled={productSelectionDisabled}
        />
        
        {selectedProduct && (
          <>
            {/* Nouvelle section pour la description du produit */}
            <ProductDescription product={selectedProduct} />
            
            <QuantitySelector
              quantityOptions={getQuantityOptions(selectedProduct.subcategory || selectedProduct.category)}
              selectedQuantity={selectedQuantity}
              setSelectedQuantity={setSelectedQuantity}
            />
            
            {/* Variant selectors */}
            {availableVariants.length > 0 && (
              <ProductFormVariants
                selectedProduct={selectedProduct}
                variants={variants}
                availableVariants={availableVariants}
                onVariantChange={handleVariantChange}
                productVariantOptions={productVariantOptions}
              />
            )}

            {/* Product price */}
            <ProductFormPrice 
              selectedProduct={selectedProduct}
              selectedQuantity={selectedQuantity}
            />
          </>
        )}
      </div>
      
      <div className="mt-6 md:mt-8">
        <ProductFormSubmitButton
          isSubmitting={isSubmitting}
          disabled={!selectedProduct || !selectedQuantity}
          editMode={editMode}
        />
      </div>
    </form>
  );
};

export default ProductForm;

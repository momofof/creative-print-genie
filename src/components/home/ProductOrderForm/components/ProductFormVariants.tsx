
import { Product } from "@/types/product";
import VariantSelector from "../VariantSelector";
import { getVariantDisplayName, getVariantOptions } from "../utils";

interface ProductFormVariantsProps {
  selectedProduct: Product;
  variants: Record<string, string>;
  availableVariants: string[];
  onVariantChange: (variantType: string, value: string) => void;
  productVariantOptions: Record<string, string[]>;
}

const ProductFormVariants = ({
  selectedProduct,
  variants,
  availableVariants,
  onVariantChange,
  productVariantOptions
}: ProductFormVariantsProps) => {
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

  if (availableVariants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">
        Options spécifiques
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {availableVariants.map((variantType) => (
          <VariantSelector
            key={variantType}
            variantType={variantType}
            displayName={getVariantDisplayName(variantType)}
            options={getOptionsForVariant(variantType)}
            selectedValue={variants[variantType] || ""}
            onChange={(value) => onVariantChange(variantType, value)}
            productCategory={selectedProduct.subcategory || selectedProduct.category}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductFormVariants;

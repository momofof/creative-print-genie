
import { useMemo } from "react";
import { Product } from "@/types/product";
import VariantSelector from "../VariantSelector";
import { getVariantDisplayName } from "../utils/variantDisplay";

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
  productVariantOptions,
}: ProductFormVariantsProps) => {
  const sortedVariants = useMemo(() => {
    return availableVariants
      .filter(variantType => 
        productVariantOptions[variantType] && 
        productVariantOptions[variantType].length > 0
      )
      .sort((a, b) => {
        // Order by priority: color, size, format, others
        const order: Record<string, number> = {
          color: 1,
          size: 2,
          format: 3,
          quantite: 4,
          poids: 5,
          types_impression: 6,
          type_de_materiaux: 7,
          details_impression: 8,
          orientation_impression: 9,
          echantillon: 10,
          bat: 11
        };
        
        const orderA = order[a] || 99;
        const orderB = order[b] || 99;
        
        return orderA - orderB;
      });
  }, [availableVariants, productVariantOptions]);
  
  // If no variant options available, don't render anything
  if (sortedVariants.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="pt-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Options produit</h3>
        <div className="space-y-4">
          {sortedVariants.map((variantType) => (
            <VariantSelector
              key={variantType}
              variantType={variantType}
              displayName={getVariantDisplayName(variantType)}
              options={productVariantOptions[variantType] || []}
              selectedValue={variants[variantType] || ""}
              onChange={(value) => onVariantChange(variantType, value)}
              productCategory={selectedProduct.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFormVariants;

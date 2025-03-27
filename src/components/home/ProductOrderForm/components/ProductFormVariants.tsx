
import { Product } from "@/types/product";
import VariantSelector from "../VariantSelector";
import { getVariantDisplayName } from "../utils/variantDisplay";
import { getVariantOptions } from "../utils/variantConfig";

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

  // Group variants by type for better organization
  const groupVariants = () => {
    const groups = {
      appearance: ['color', 'size', 'print_design', 'design', 'paper_type', 'finish', 'face_a_imprimer'],
      format: ['quantite', 'format', 'type_de_materiaux', 'poids'],
      impression: ['details_impression', 'orientation_impression', 'types_impression'],
      extras: ['echantillon', 'bat']
    };
    
    // Sort the available variants into groups
    const groupedVariants: Record<string, string[]> = {
      appearance: [],
      format: [],
      impression: [],
      extras: [],
      other: [] // For any variants that don't fit in the above groups
    };
    
    availableVariants.forEach(variant => {
      let placed = false;
      for (const [group, variants] of Object.entries(groups)) {
        if (variants.includes(variant)) {
          groupedVariants[group].push(variant);
          placed = true;
          break;
        }
      }
      if (!placed) {
        groupedVariants["other"].push(variant);
      }
    });
    
    return groupedVariants;
  };
  
  const groupedVariants = groupVariants();

  if (availableVariants.length === 0) {
    return null;
  }

  // Translate group names to French
  const groupDisplayNames: Record<string, string> = {
    appearance: "Apparence",
    format: "Format et dimensions",
    impression: "Options d'impression",
    extras: "Suppléments",
    other: "Autres options"
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800">
        Options spécifiques
      </h3>
      
      {Object.entries(groupedVariants).map(([group, groupVariants]) => {
        if (groupVariants.length === 0) return null;
        
        return (
          <div key={group} className="space-y-4">
            <h4 className="text-md font-medium text-gray-700">{groupDisplayNames[group]}</h4>
            <div className="grid grid-cols-1 gap-4">
              {groupVariants.map((variantType) => (
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
      })}
    </div>
  );
};

export default ProductFormVariants;

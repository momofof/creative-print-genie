
import { Product } from "@/types/product";
import VariantSelector from "../VariantSelector";
import { getVariantDisplayName } from "../utils/variantDisplay";
import { getVariantOptions } from "../utils/variantConfig";
import { useVariantParser } from "@/pages/supplier/hooks/useVariantParser";
import { useEffect } from "react";

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
  const { standardizeToArray } = useVariantParser();

  // Ajout de logs pour le débogage
  useEffect(() => {
    console.log("ProductFormVariants - Product:", selectedProduct);
    console.log("ProductFormVariants - Available Variants:", availableVariants);
    console.log("ProductFormVariants - Product Variant Options:", productVariantOptions);
  }, [selectedProduct, availableVariants, productVariantOptions]);

  // Get variant options prioritizing product-specific options if available
  const getOptionsForVariant = (variantType: string): string[] => {
    if (!selectedProduct) return [];
    
    // Si des options spécifiques au produit existent pour cette variante, les utiliser
    if (productVariantOptions[variantType] && productVariantOptions[variantType].length > 0) {
      console.log(`Utilisation des options spécifiques pour ${variantType}:`, productVariantOptions[variantType]);
      return productVariantOptions[variantType];
    }
    
    // Vérifions si les options sont sous forme de chaîne formatée ou d'un tableau
    const optionsField = `${variantType}_options` as keyof Product;
    
    if (selectedProduct[optionsField]) {
      const options = selectedProduct[optionsField];
      console.log(`Options depuis le produit pour ${variantType}:`, options);
      
      // Si c'est une chaîne au format [option1, option2], parsons-la
      if (typeof options === 'string' && options.includes('[')) {
        const parsedOptions = standardizeToArray(options);
        console.log(`Options parsées pour ${variantType}:`, parsedOptions);
        if (parsedOptions.length > 0) {
          return parsedOptions;
        }
      }
      
      // Si c'est déjà un tableau
      if (Array.isArray(options)) {
        console.log(`Options tableau pour ${variantType}:`, options);
        return options;
      }
    }
    
    // Vérifier si la valeur elle-même est au format "[valeur1, valeur2]"
    const valueField = variantType as keyof Product;
    if (selectedProduct[valueField] && typeof selectedProduct[valueField] === 'string') {
      const value = selectedProduct[valueField] as string;
      if (value.includes('[')) {
        const parsedFromValue = standardizeToArray(value);
        console.log(`Options parsées depuis la valeur ${variantType}:`, parsedFromValue);
        if (parsedFromValue.length > 0) {
          return parsedFromValue;
        }
      }
    }
    
    // Sinon, utiliser les options génériques basées sur la catégorie/sous-catégorie
    if (selectedProduct.subcategory) {
      const subcategoryOptions = getVariantOptions(selectedProduct.subcategory, variantType);
      if (subcategoryOptions.length > 0) {
        console.log(`Options de sous-catégorie pour ${variantType}:`, subcategoryOptions);
        return subcategoryOptions;
      }
    }
    
    const categoryOptions = getVariantOptions(selectedProduct.category, variantType);
    console.log(`Options de catégorie pour ${variantType}:`, categoryOptions);
    return categoryOptions;
  };

  // Group variants by type for better organization
  const groupVariants = () => {
    const groups = {
      appearance: ['color', 'size'],
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
              {groupVariants.map((variantType) => {
                const options = getOptionsForVariant(variantType);
                console.log(`Affichage du sélecteur pour ${variantType} avec options:`, options);
                
                if (!options || options.length === 0) {
                  console.log(`Pas d'options pour ${variantType}, skip`);
                  return null;
                }
                
                return (
                  <VariantSelector
                    key={variantType}
                    variantType={variantType}
                    displayName={getVariantDisplayName(variantType)}
                    options={options}
                    selectedValue={variants[variantType] || ""}
                    onChange={(value) => onVariantChange(variantType, value)}
                    productCategory={selectedProduct.subcategory || selectedProduct.category}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductFormVariants;

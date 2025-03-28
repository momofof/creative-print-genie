
import { Product } from "@/types/product";
import { parseVariantListString } from "./variantDisplay";

// Get available variants from a product category or subcategory
export const getAvailableVariants = (categoryOrSubcategory: string): string[] => {
  // Map of categories/subcategories to their available variant types
  const categoryVariantsMap: Record<string, string[]> = {
    // Textile categories
    'T-shirts': ['color', 'size'],
    'Polos': ['color', 'size'],
    'Sweats': ['color', 'size'],
    'Vestes': ['color', 'size'],
    'Casquettes': ['color', 'size'],
    
    // Papeterie categories
    'Flyers': ['format', 'quantite', 'types_impression', 'poids'],
    'Affiches': ['format', 'quantite', 'types_impression', 'poids'],
    'Dépliants': ['format', 'quantite', 'types_impression', 'poids', 'details_impression'],
    'Cartes de visite': ['format', 'quantite', 'types_impression', 'details_impression'],
    'Papier entête': ['format', 'quantite', 'types_impression'],
    
    // Generic categories
    'Textile': ['color', 'size', 'types_impression', 'echantillon', 'bat'],
    'Papeterie': ['format', 'quantite', 'types_impression', 'poids', 'echantillon', 'bat', 'details_impression', 'orientation_impression'],
    'Packaging': ['format', 'quantite', 'type_de_materiaux', 'echantillon', 'bat'],
    'Signalétique': ['format', 'quantite', 'type_de_materiaux', 'support', 'echantillon', 'bat'],
    'Goodies': ['color', 'format', 'quantite', 'echantillon', 'bat'],
    
    // Default for any other category
    'default': ['color', 'size', 'format', 'quantite', 'bat', 'poids', 'echantillon', 'types_impression', 
                'type_de_materiaux', 'details_impression', 'orientation_impression']
  };
  
  return categoryVariantsMap[categoryOrSubcategory] || categoryVariantsMap['default'];
};

// Get quantity options based on product category
export const getQuantityOptions = (categoryOrSubcategory: string): number[] => {
  // Map of categories to their quantity options
  const quantityOptionsMap: Record<string, number[]> = {
    // Papeterie (printing) has larger quantities
    'Flyers': [50, 100, 250, 500, 1000, 2500, 5000],
    'Affiches': [10, 25, 50, 100, 250, 500],
    'Dépliants': [50, 100, 250, 500, 1000, 2500],
    'Cartes de visite': [100, 250, 500, 1000, 2000],
    'Papier entête': [50, 100, 250, 500, 1000],
    'Papeterie': [50, 100, 250, 500, 1000, 2500],
    
    // Textile usually ordered in smaller quantities
    'T-shirts': [1, 5, 10, 25, 50, 100, 250],
    'Polos': [1, 5, 10, 25, 50, 100],
    'Sweats': [1, 5, 10, 25, 50, 100],
    'Vestes': [1, 5, 10, 25, 50],
    'Casquettes': [1, 5, 10, 25, 50, 100],
    'Textile': [1, 5, 10, 25, 50, 100, 250],
    
    // Default quantity options
    'default': [1, 2, 5, 10, 25, 50, 100]
  };
  
  return quantityOptionsMap[categoryOrSubcategory] || quantityOptionsMap['default'];
};

// Helper function to handle variant fields that might have different formats
const processVariantField = (value: any): string[] => {
  if (!value) return [];
  
  // If it's already an array, return it
  if (Array.isArray(value)) return value;
  
  // Handle the special object format from the database
  if (typeof value === 'object' && value !== null) {
    // Handle the case with _type and value properties
    // @ts-ignore - Handle special object format from database
    if (value._type === 'undefined' && value.value === 'undefined') {
      return [];
    }
    // Try to stringify and parse
    try {
      return parseVariantListString(JSON.stringify(value));
    } catch (e) {
      return [];
    }
  }
  
  // For string values, use the parseVariantListString function
  return parseVariantListString(value);
};

// Extract variant options from product data
export const extractVariantOptionsFromProduct = async (product: Product): Promise<Record<string, string[]>> => {
  const result: Record<string, string[]> = {};
  
  // Champs de variantes disponibles dans le produit
  const variantFields = [
    "size", "color", "format", "quantite", "bat", "poids",
    "echantillon", "types_impression", "type_de_materiaux",
    "details_impression", "orientation_impression"
  ];
  
  variantFields.forEach(field => {
    // Pour chaque champ, on vérifie si le produit a une valeur et on la traite comme une liste
    const fieldValue = (product as any)[field];
    if (fieldValue) {
      // Convertir la valeur en tableau
      const parsedValues = processVariantField(fieldValue);
      if (parsedValues.length > 0) {
        result[field] = parsedValues;
      }
    }
  });
  
  // Vérifier également les variantes du produit si elles existent
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      variantFields.forEach(field => {
        const variantValue = (variant as any)[field];
        if (variantValue) {
          // Convertir la valeur en tableau
          const parsedValues = processVariantField(variantValue);
          if (parsedValues.length > 0) {
            // Ajouter les valeurs uniques au résultat
            result[field] = Array.from(new Set([
              ...(result[field] || []),
              ...parsedValues
            ]));
          }
        }
      });
    });
  }
  
  console.log("Extracted product variant options:", result);
  return result;
};


import { Product } from "@/types/product";

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
    'Textile': ['color', 'size'],
    'Papeterie': ['format', 'quantite', 'types_impression', 'poids'],
    'Packaging': ['format', 'quantite', 'type_de_materiaux'],
    'Signalétique': ['format', 'quantite', 'type_de_materiaux', 'support'],
    'Goodies': ['color', 'format', 'quantite'],
    
    // Default for any other category
    'default': ['color', 'size', 'format', 'quantite']
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

// Extract variant options from product data
export const extractVariantOptionsFromProduct = async (product: Product): Promise<Record<string, string[]>> => {
  const result: Record<string, string[]> = {};
  
  // Check for variant fields in the product
  const variantFields = [
    "size", "color", "format", "quantite", "bat", "poids",
    "echantillon", "types_impression", "type_de_materiaux",
    "details_impression", "orientation_impression"
  ];
  
  variantFields.forEach(field => {
    // If the product has a value for this field, add it as an option
    if ((product as any)[field]) {
      const value = (product as any)[field];
      if (value) {
        result[field] = [value];
      }
    }
  });
  
  return result;
};


import { Product } from "@/types/product";

// Get available variants from a product category or subcategory
export const getAvailableVariants = (categoryOrSubcategory: string): string[] => {
  // Convert to lowercase for case-insensitive matching
  const category = categoryOrSubcategory.toLowerCase();
  
  // Map of categories/subcategories to their available variant types
  const categoryVariantsMap: Record<string, string[]> = {
    // Textile categories
    't-shirts': ['color', 'size'],
    'polos': ['color', 'size'],
    'sweats': ['color', 'size'],
    'vestes': ['color', 'size'],
    'casquettes': ['color', 'size'],
    
    // Papeterie categories
    'flyers': ['format', 'quantite', 'types_impression', 'poids'],
    'affiches': ['format', 'quantite', 'types_impression', 'poids'],
    'dépliants': ['format', 'quantite', 'types_impression', 'poids', 'details_impression'],
    'cartes de visite': ['format', 'quantite', 'types_impression', 'details_impression'],
    'papier entête': ['format', 'quantite', 'types_impression'],
    
    // Bijoux categories
    'bijoux': ['color', 'size', 'type_de_materiaux'],
    'colliers': ['color', 'size', 'type_de_materiaux'],
    'bracelets': ['color', 'size', 'type_de_materiaux'],
    'boucles d\'oreilles': ['color', 'size', 'type_de_materiaux'],
    'pendentifs': ['color', 'size', 'type_de_materiaux'],
    
    // Generic categories
    'textile': ['color', 'size'],
    'papeterie': ['format', 'quantite', 'types_impression', 'poids'],
    'packaging': ['format', 'quantite', 'type_de_materiaux'],
    'signalétique': ['format', 'quantite', 'type_de_materiaux', 'support'],
    'goodies': ['color', 'format', 'quantite'],
    
    // Default for any other category
    'default': ['color', 'size', 'format', 'quantite']
  };
  
  return categoryVariantsMap[category] || categoryVariantsMap['default'];
};

// Get quantity options based on product category
export const getQuantityOptions = (categoryOrSubcategory: string): number[] => {
  // Convert to lowercase for case-insensitive matching
  const category = categoryOrSubcategory.toLowerCase();
  
  // Map of categories to their quantity options
  const quantityOptionsMap: Record<string, number[]> = {
    // Papeterie (printing) has larger quantities
    'flyers': [50, 100, 250, 500, 1000, 2500, 5000],
    'affiches': [10, 25, 50, 100, 250, 500],
    'dépliants': [50, 100, 250, 500, 1000, 2500],
    'cartes de visite': [100, 250, 500, 1000, 2000],
    'papier entête': [50, 100, 250, 500, 1000],
    'papeterie': [50, 100, 250, 500, 1000, 2500],
    
    // Textile usually ordered in smaller quantities
    't-shirts': [1, 5, 10, 25, 50, 100, 250],
    'polos': [1, 5, 10, 25, 50, 100],
    'sweats': [1, 5, 10, 25, 50, 100],
    'vestes': [1, 5, 10, 25, 50],
    'casquettes': [1, 5, 10, 25, 50, 100],
    'textile': [1, 5, 10, 25, 50, 100, 250],
    
    // Bijoux usually ordered in very small quantities
    'bijoux': [1, 2, 5, 10, 25, 50],
    'colliers': [1, 2, 5, 10, 25, 50],
    'bracelets': [1, 2, 5, 10, 25, 50],
    'boucles d\'oreilles': [1, 2, 5, 10, 25, 50],
    'pendentifs': [1, 2, 5, 10, 25, 50],
    
    // Default quantity options
    'default': [1, 2, 5, 10, 25, 50, 100]
  };
  
  return quantityOptionsMap[category] || quantityOptionsMap['default'];
};

// Extract variant options from product data
export const extractVariantOptionsFromProduct = async (product: Product): Promise<Record<string, string[]>> => {
  const result: Record<string, string[]> = {};
  
  // Check for variant fields in the product itself first
  const variantFields = [
    "size", "color", "format", "quantite", "bat", "poids",
    "echantillon", "types_impression", "type_de_materiaux",
    "details_impression", "orientation_impression"
  ];
  
  // First collect all unique values from the variants
  if (product.variants && product.variants.length > 0) {
    for (const field of variantFields) {
      const uniqueValues = new Set<string>();
      
      // Check each variant for this field
      product.variants.forEach(variant => {
        const value = (variant as any)[field];
        if (value) {
          uniqueValues.add(value);
        }
      });
      
      // If we found values, add them to the result
      if (uniqueValues.size > 0) {
        result[field] = Array.from(uniqueValues);
      }
    }
  }
  
  // If no variants or no values found in variants, check the product itself
  for (const field of variantFields) {
    if (!result[field] || result[field].length === 0) {
      const value = (product as any)[field];
      if (value) {
        result[field] = [value];
      }
    }
  }
  
  return result;
};

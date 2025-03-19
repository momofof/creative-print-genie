
// Define display names for each variant type
const variantDisplayNames: Record<string, string> = {
  "color": "Couleur",
  "size": "Taille",
  "print_design": "Design d'impression",
  "design": "Design",
  "paper_type": "Type de papier",
  "finish": "Finition",
  // Add French translations for common variants
  "couleur": "Couleur",
  "taille": "Taille",
  "matériau": "Matériau",
  "style": "Style",
  "format": "Format",
  "épaisseur": "Épaisseur"
};

// Function to get display name for a variant type
export const getVariantDisplayName = (variantType: string): string => {
  return variantDisplayNames[variantType.toLowerCase()] || variantType;
};

// Get a placeholder image when the product variant doesn't have a specific illustration
export const getPlaceholderImage = (category: string): string => {
  const categoryPlaceholders: Record<string, string> = {
    't-shirts': '/placeholder.svg',
    'hoodies': '/placeholder.svg',
    'mugs': '/placeholder.svg',
    'posters': '/placeholder.svg',
    'stickers': '/placeholder.svg',
    'vêtements': '/placeholder.svg',
    'accessoires': '/placeholder.svg',
    'casquettes': '/placeholder.svg',
    // Add more categories as needed
  };
  
  return categoryPlaceholders[category.toLowerCase()] || '/placeholder.svg';
};

// Get normalized variant keys to handle different format of variant data from Supabase
export const getNormalizedVariantKey = (key: string): string => {
  const normalizedKeys: Record<string, string> = {
    "color": "couleur",
    "size": "taille",
    "color_code": "hex_code",
    "hex_color": "hex_code",
    "print_design": "design",
    "paper_type": "paper", 
  };
  
  return normalizedKeys[key.toLowerCase()] || key.toLowerCase();
};

// Extract variant types from a product's variants data
export const getVariantTypesFromProduct = (variants: any): string[] => {
  if (!variants) return [];
  
  try {
    // If variants is a string, try to parse it
    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    
    // Handle array format
    if (Array.isArray(parsedVariants)) {
      // Extract unique keys from all variant objects
      const variantKeys = new Set<string>();
      
      parsedVariants.forEach(variant => {
        Object.keys(variant).forEach(key => {
          // Ignore non-variant properties
          if (!['stock', 'price_adjustment', 'status', 'hex_code', 'hex_color', 'id'].includes(key)) {
            variantKeys.add(key.toLowerCase());
          }
        });
      });
      
      return Array.from(variantKeys);
    }
    
    // Handle object format with variant types as keys
    if (typeof parsedVariants === 'object' && !Array.isArray(parsedVariants)) {
      return Object.keys(parsedVariants);
    }
    
    return [];
  } catch (error) {
    console.error("Error extracting variant types:", error);
    return [];
  }
};

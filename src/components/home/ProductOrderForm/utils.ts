
import { Product } from "@/types/product";

// Define available variants for each product category
const availableVariants: Record<string, string[]> = {
  "vêtements": ["color", "size", "print_design"],
  "t-shirts": ["color", "size", "print_design"],
  "hoodies": ["color", "size", "print_design"],
  "mugs": ["color", "design"],
  "posters": ["size", "paper_type"],
  "stickers": ["size", "finish"],
  "accessoires": ["color", "size"],
  "casquettes": ["color", "size"],
};

// Define variant options for each product category and variant type
const variantOptions: Record<string, Record<string, string[]>> = {
  "vêtements": {
    "color": ["red", "blue", "green", "black", "white", "Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL", "Unique"],
    "print_design": ["logo", "abstract", "photo"],
  },
  "t-shirts": {
    "color": ["red", "blue", "green", "black", "white", "Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL"],
    "print_design": ["logo", "abstract", "photo"],
  },
  "hoodies": {
    "color": ["red", "blue", "green", "black", "white", "Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL"],
    "print_design": ["logo", "abstract", "photo"],
  },
  "mugs": {
    "color": ["white", "black", "blue", "green", "Blanc", "Noir", "Bleu", "Vert"],
    "design": ["funny", "motivational", "custom"],
  },
  "posters": {
    "size": ["A3", "A2", "A1"],
    "paper_type": ["glossy", "matte"],
  },
  "stickers": {
    "size": ["small", "medium", "large"],
    "finish": ["glossy", "matte", "transparent"],
  },
  "accessoires": {
    "color": ["red", "blue", "green", "black", "white", "Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL", "Unique"],
  },
  "casquettes": {
    "color": ["red", "blue", "green", "black", "white", "Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["Unique"],
  },
};

// Define display names for each variant type
const variantDisplayNames: Record<string, string> = {
  "color": "Couleur",
  "size": "Taille",
  "print_design": "Design d'impression",
  "design": "Design",
  "paper_type": "Type de papier",
  "finish": "Finition",
};

// Define quantity options for each product category
const quantityOptions: Record<string, number[]> = {
  "vêtements": [1, 2, 3, 4, 5, 10],
  "t-shirts": [1, 2, 3, 4, 5, 10],
  "hoodies": [1, 2, 3, 4, 5, 10],
  "mugs": [1, 2, 3, 4, 5, 10, 20],
  "posters": [1, 2, 3, 4, 5, 10, 20],
  "stickers": [10, 20, 30, 40, 50, 100],
  "accessoires": [1, 2, 3, 4, 5, 10],
  "casquettes": [1, 2, 3, 4, 5, 10],
};

// Define feature illustrations for each product category
const featureIllustrations: Record<string, string> = {
  "vêtements": "/illustrations/t-shirt.png",
  "t-shirts": "/illustrations/t-shirt.png",
  "hoodies": "/illustrations/hoodie.png",
  "mugs": "/illustrations/mug.png",
  "posters": "/illustrations/poster.png",
  "stickers": "/illustrations/sticker.png",
  "accessoires": "/illustrations/accessory.png",
  "casquettes": "/illustrations/cap.png",
};

// Define variant illustrations for each product category and variant type
const variantIllustrations: Record<string, Record<string, Record<string, string>>> = {
  "vêtements": {
    "color": {
      "red": "/illustrations/t-shirt-red.png",
      "blue": "/illustrations/t-shirt-blue.png",
      "green": "/illustrations/t-shirt-green.png",
      "black": "/illustrations/t-shirt-black.png",
      "white": "/illustrations/t-shirt-white.png",
      "Noir": "/illustrations/t-shirt-black.png",
      "Blanc": "/illustrations/t-shirt-white.png",
      "Bleu": "/illustrations/t-shirt-blue.png",
      "Rouge": "/illustrations/t-shirt-red.png",
      "Vert": "/illustrations/t-shirt-green.png",
    },
  },
  "t-shirts": {
    "color": {
      "red": "/illustrations/t-shirt-red.png",
      "blue": "/illustrations/t-shirt-blue.png",
      "green": "/illustrations/t-shirt-green.png",
      "black": "/illustrations/t-shirt-black.png",
      "white": "/illustrations/t-shirt-white.png",
      "Noir": "/illustrations/t-shirt-black.png",
      "Blanc": "/illustrations/t-shirt-white.png",
      "Bleu": "/illustrations/t-shirt-blue.png",
      "Rouge": "/illustrations/t-shirt-red.png",
      "Vert": "/illustrations/t-shirt-green.png",
    },
  },
  "hoodies": {
    "color": {
      "red": "/illustrations/hoodie-red.png",
      "blue": "/illustrations/hoodie-blue.png",
      "green": "/illustrations/hoodie-green.png",
      "black": "/illustrations/hoodie-black.png",
      "white": "/illustrations/hoodie-white.png",
      "Noir": "/illustrations/hoodie-black.png",
      "Blanc": "/illustrations/hoodie-white.png",
      "Bleu": "/illustrations/hoodie-blue.png",
      "Rouge": "/illustrations/hoodie-red.png",
      "Vert": "/illustrations/hoodie-green.png",
    },
  },
  "mugs": {
    "color": {
      "white": "/illustrations/mug-white.png",
      "black": "/illustrations/mug-black.png",
      "blue": "/illustrations/mug-blue.png",
      "green": "/illustrations/mug-green.png",
      "Blanc": "/illustrations/mug-white.png",
      "Noir": "/illustrations/mug-black.png",
      "Bleu": "/illustrations/mug-blue.png",
      "Vert": "/illustrations/mug-green.png",
    },
  },
  "accessoires": {
    "color": {
      "black": "/illustrations/accessory-black.png",
      "white": "/illustrations/accessory-white.png",
      "blue": "/illustrations/accessory-blue.png",
      "red": "/illustrations/accessory-red.png",
      "green": "/illustrations/accessory-green.png",
      "Noir": "/illustrations/accessory-black.png",
      "Blanc": "/illustrations/accessory-white.png",
      "Bleu": "/illustrations/accessory-blue.png",
      "Rouge": "/illustrations/accessory-red.png",
      "Vert": "/illustrations/accessory-green.png",
    },
  },
  "casquettes": {
    "color": {
      "black": "/illustrations/cap-black.png",
      "white": "/illustrations/cap-white.png",
      "blue": "/illustrations/cap-blue.png",
      "red": "/illustrations/cap-red.png",
      "green": "/illustrations/cap-green.png",
      "Noir": "/illustrations/cap-black.png",
      "Blanc": "/illustrations/cap-white.png",
      "Bleu": "/illustrations/cap-blue.png",
      "Rouge": "/illustrations/cap-red.png",
      "Vert": "/illustrations/cap-green.png",
    },
  },
};

// Function to get available variants for a product category
export const getAvailableVariants = (category: string): string[] => {
  // Vérifier d'abord la catégorie exacte, puis vérifier la subcategory si pas trouvé
  return availableVariants[category] || 
         availableVariants[category.toLowerCase()] || 
         [];
};

// Function to get variant options for a product category and variant type
export const getVariantOptions = (category: string, variantType: string): string[] => {
  // Vérifier d'abord la catégorie exacte, puis vérifier la subcategory si pas trouvé
  return variantOptions[category]?.[variantType] || 
         variantOptions[category.toLowerCase()]?.[variantType] || 
         [];
};

// Function to get display name for a variant type
export const getVariantDisplayName = (variantType: string): string => {
  return variantDisplayNames[variantType] || variantType;
};

// Function to get quantity options for a product category
export const getQuantityOptions = (category: string): number[] => {
  // Vérifier d'abord la catégorie exacte, puis vérifier la subcategory si pas trouvé
  return quantityOptions[category] || 
         quantityOptions[category.toLowerCase()] || 
         [1, 2, 3, 4, 5];
};

// Function to get feature illustration for a product category
export const getFeatureIllustration = (product: Product | undefined, variants: Record<string, string>): string => {
  if (!product) return "/placeholder.svg";
  
  // Si le produit a une subcategory, essayer d'abord avec celle-ci
  const category = product.subcategory || product.category;
  
  // If there are variants selected, try to find a variant-specific illustration
  if (Object.keys(variants).length > 0) {
    if (variants.color) {
      // Vérifier d'abord avec la subcategory
      if (variantIllustrations[category]?.color?.[variants.color]) {
        return variantIllustrations[category].color[variants.color];
      }
      // Si pas trouvé, essayer avec la category principale
      if (variantIllustrations[product.category]?.color?.[variants.color]) {
        return variantIllustrations[product.category].color[variants.color];
      }
    }
  }
  
  // Si pas d'illustration spécifique trouvée, renvoyer l'illustration générique
  return featureIllustrations[category] || 
         featureIllustrations[product.category] || 
         "/placeholder.svg";
};

// Function to get variant illustration for a product category and variant type
export const getVariantIllustration = (category: string, variantType: string, value: string): string => {
  // Vérifier d'abord la catégorie exacte
  const illustration = variantIllustrations[category]?.[variantType]?.[value];
  if (illustration) return illustration;
  
  // Si pas trouvé, vérifier la catégorie en minuscules
  const lowerCaseIllustration = variantIllustrations[category.toLowerCase()]?.[variantType]?.[value];
  if (lowerCaseIllustration) return lowerCaseIllustration;
  
  // Si toujours pas trouvé, renvoyer l'illustration générique
  return featureIllustrations[category] || 
         featureIllustrations[category.toLowerCase()] || 
         "/placeholder.svg";
};

// Add or ensure these utility functions exist for JSON parsing
export const parseVariants = (variantsJson: any): Record<string, string[]> => {
  if (!variantsJson) return {};
  
  try {
    if (typeof variantsJson === 'string') {
      return JSON.parse(variantsJson);
    }
    
    // Si variantsJson est un tableau d'objets avec des propriétés size, color, etc.
    if (Array.isArray(variantsJson)) {
      // Extraire les valeurs uniques pour chaque propriété
      const result: Record<string, string[]> = {};
      
      variantsJson.forEach(variant => {
        Object.entries(variant).forEach(([key, value]) => {
          // Ignorer les propriétés qui ne sont pas des variantes
          if (['stock', 'price_adjustment', 'status', 'hex_color'].includes(key)) return;
          
          if (!result[key]) {
            result[key] = [];
          }
          
          if (typeof value === 'string' && !result[key].includes(value)) {
            result[key].push(value);
          }
        });
      });
      
      return result;
    }
    
    return variantsJson;
  } catch (error) {
    console.error("Error parsing variants:", error);
    return {};
  }
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

// Extract variant options from product data
export const extractVariantOptionsFromProduct = (product: Product): Record<string, string[]> => {
  try {
    if (!product) return {};
    
    // Check if product has variants property - could be string or object
    const productVariants = product.variants as any;
    
    if (!productVariants) return {};
    
    let variants = productVariants;
    if (typeof variants === 'string') {
      variants = JSON.parse(variants);
    }
    
    if (Array.isArray(variants)) {
      const result: Record<string, string[]> = {};
      
      variants.forEach(variant => {
        Object.entries(variant).forEach(([key, value]) => {
          // Ignorer les propriétés qui ne sont pas des variantes
          if (['stock', 'price_adjustment', 'status', 'hex_color'].includes(key)) return;
          
          if (!result[key]) {
            result[key] = [];
          }
          
          if (typeof value === 'string' && !result[key].includes(value)) {
            result[key].push(value as string);
          }
        });
      });
      
      return result;
    }
    
    return {};
  } catch (error) {
    console.error("Error extracting variant options from product:", error);
    return {};
  }
};

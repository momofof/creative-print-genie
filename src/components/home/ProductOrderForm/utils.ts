import { Product } from "@/types/product";

// Define available variants for each product category
const availableVariants: Record<string, string[]> = {
  "t-shirts": ["color", "size", "print_design"],
  "hoodies": ["color", "size", "print_design"],
  "mugs": ["color", "design"],
  "posters": ["size", "paper_type"],
  "stickers": ["size", "finish"],
};

// Define variant options for each product category and variant type
const variantOptions: Record<string, Record<string, string[]>> = {
  "t-shirts": {
    "color": ["red", "blue", "green", "black", "white"],
    "size": ["S", "M", "L", "XL", "XXL"],
    "print_design": ["logo", "abstract", "photo"],
  },
  "hoodies": {
    "color": ["red", "blue", "green", "black", "white"],
    "size": ["S", "M", "L", "XL", "XXL"],
    "print_design": ["logo", "abstract", "photo"],
  },
  "mugs": {
    "color": ["white", "black", "blue", "green"],
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
  "t-shirts": [1, 2, 3, 4, 5, 10],
  "hoodies": [1, 2, 3, 4, 5, 10],
  "mugs": [1, 2, 3, 4, 5, 10, 20],
  "posters": [1, 2, 3, 4, 5, 10, 20],
  "stickers": [10, 20, 30, 40, 50, 100],
};

// Define feature illustrations for each product category
const featureIllustrations: Record<string, string> = {
  "t-shirts": "/illustrations/t-shirt.png",
  "hoodies": "/illustrations/hoodie.png",
  "mugs": "/illustrations/mug.png",
  "posters": "/illustrations/poster.png",
  "stickers": "/illustrations/sticker.png",
};

// Define variant illustrations for each product category and variant type
const variantIllustrations: Record<string, Record<string, Record<string, string>>> = {
  "t-shirts": {
    "color": {
      "red": "/illustrations/t-shirt-red.png",
      "blue": "/illustrations/t-shirt-blue.png",
      "green": "/illustrations/t-shirt-green.png",
      "black": "/illustrations/t-shirt-black.png",
      "white": "/illustrations/t-shirt-white.png",
    },
  },
  "hoodies": {
    "color": {
      "red": "/illustrations/hoodie-red.png",
      "blue": "/illustrations/hoodie-blue.png",
      "green": "/illustrations/hoodie-green.png",
      "black": "/illustrations/hoodie-black.png",
      "white": "/illustrations/hoodie-white.png",
    },
  },
  "mugs": {
    "color": {
      "white": "/illustrations/mug-white.png",
      "black": "/illustrations/mug-black.png",
      "blue": "/illustrations/mug-blue.png",
      "green": "/illustrations/mug-green.png",
    },
  },
};

// Function to get available variants for a product category
export const getAvailableVariants = (category: string): string[] => {
  return availableVariants[category] || [];
};

// Function to get variant options for a product category and variant type
export const getVariantOptions = (category: string, variantType: string): string[] => {
  return variantOptions[category]?.[variantType] || [];
};

// Function to get display name for a variant type
export const getVariantDisplayName = (variantType: string): string => {
  return variantDisplayNames[variantType] || variantType;
};

// Function to get quantity options for a product category
export const getQuantityOptions = (category: string): number[] => {
  return quantityOptions[category] || [1, 2, 3, 4, 5];
};

// Function to get feature illustration for a product category
export const getFeatureIllustration = (product: Product | undefined, variants: Record<string, string>): string => {
  if (!product) return "/placeholder.svg";
  
  // If there are variants selected, try to find a variant-specific illustration
  if (Object.keys(variants).length > 0) {
    if (variants.color && variantIllustrations[product.category]?.color?.[variants.color]) {
      return variantIllustrations[product.category].color[variants.color];
    }
  }
  
  return featureIllustrations[product.category] || "/placeholder.svg";
};

// Function to get variant illustration for a product category and variant type
export const getVariantIllustration = (category: string, variantType: string, value: string): string => {
  return variantIllustrations[category]?.[variantType]?.[value] || featureIllustrations[category] || "/placeholder.svg";
};

// Add or ensure these utility functions exist for JSON parsing
export const parseVariants = (variantsJson: any): Record<string, string[]> => {
  if (!variantsJson) return {};
  
  try {
    if (typeof variantsJson === 'string') {
      return JSON.parse(variantsJson);
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
    // Add more categories as needed
  };
  
  return categoryPlaceholders[category.toLowerCase()] || '/placeholder.svg';
};

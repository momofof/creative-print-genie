
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
  "velo": ["color", "size", "type"],
  "maison": ["color", "design", "size"],
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
  "velo": {
    "color": ["Rouge", "Bleu", "Noir", "Blanc", "Vert", "Jaune"],
    "size": ["S", "M", "L", "XL"],
    "type": ["Ville", "Route", "VTT", "Électrique"],
  },
  "maison": {
    "color": ["Beige", "Blanc", "Gris", "Noir", "Naturel"],
    "design": ["Moderne", "Classique", "Rustique"],
    "size": ["Petit", "Moyen", "Grand"],
  },
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
  "velo": [1, 2, 3],
  "maison": [1, 2, 3, 4, 5],
};

// Function to get available variants for a product category
export const getAvailableVariants = (category: string): string[] => {
  // First check the exact category, then check lowercase
  const exactMatch = availableVariants[category];
  if (exactMatch) return exactMatch;
  
  // Try lowercase match
  const lowercaseMatch = availableVariants[category.toLowerCase()];
  if (lowercaseMatch) return lowercaseMatch;
  
  // Default variants if no match is found - common variants that most products have
  console.log(`No variant config found for category: ${category}, using default variants`);
  return ["color", "size"];
};

// Function to get variant options for a product category and variant type
export const getVariantOptions = (category: string, variantType: string): string[] => {
  // First check for exact category match
  if (variantOptions[category]?.[variantType]) {
    return variantOptions[category][variantType];
  }
  
  // Try lowercase match
  if (variantOptions[category.toLowerCase()]?.[variantType]) {
    return variantOptions[category.toLowerCase()][variantType];
  }
  
  // Default options for common variant types if no match is found
  if (variantType === "color") {
    return ["Noir", "Blanc", "Bleu", "Rouge", "Vert"];
  } else if (variantType === "size") {
    return ["S", "M", "L", "XL"];
  }
  
  console.log(`No options found for category: ${category}, variant type: ${variantType}, using empty array`);
  return [];
};

// Function to get quantity options for a product category
export const getQuantityOptions = (category: string): number[] => {
  // First check for exact category match
  if (quantityOptions[category]) {
    return quantityOptions[category];
  }
  
  // Try lowercase match
  if (quantityOptions[category.toLowerCase()]) {
    return quantityOptions[category.toLowerCase()];
  }
  
  // Default quantity options if no match is found
  console.log(`No quantity options found for category: ${category}, using default quantities`);
  return [1, 2, 3, 4, 5];
};

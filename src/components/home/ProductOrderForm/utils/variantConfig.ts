
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
  "vélo": ["color", "size", "printable_side"],
  "velo": ["color", "size", "printable_side"],
  "sport": ["color", "size", "printable_side"]
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
  "vélo": {
    "color": ["Noir", "Blanc", "Bleu", "Rouge", "Vert", "Jaune", "Orange", "Silver"],
    "size": ["S", "M", "L", "XL"],
    "printable_side": ["face_1", "face_2"],
  },
  "velo": {
    "color": ["Noir", "Blanc", "Bleu", "Rouge", "Vert", "Jaune", "Orange", "Silver"],
    "size": ["S", "M", "L", "XL"],
    "printable_side": ["face_1", "face_2"],
  },
  "sport": {
    "color": ["Noir", "Blanc", "Bleu", "Rouge", "Vert", "Jaune", "Orange", "Silver"],
    "size": ["S", "M", "L", "XL"],
    "printable_side": ["face_1", "face_2"],
  }
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
  "vélo": [1, 2, 3, 4, 5],
  "velo": [1, 2, 3, 4, 5],
  "sport": [1, 2, 3, 4, 5]
};

// Function to get available variants for a product category
export const getAvailableVariants = (category: string): string[] => {
  // Check exact category first, then check lowercase category if not found
  return availableVariants[category] || 
         availableVariants[category.toLowerCase()] || 
         [];
};

// Function to get variant options for a product category and variant type
export const getVariantOptions = (category: string, variantType: string): string[] => {
  // Check exact category first, then check lowercase category if not found
  return variantOptions[category]?.[variantType] || 
         variantOptions[category.toLowerCase()]?.[variantType] || 
         [];
};

// Function to get quantity options for a product category
export const getQuantityOptions = (category: string): number[] => {
  // Check exact category first, then check lowercase category if not found
  return quantityOptions[category] || 
         quantityOptions[category.toLowerCase()] || 
         [1, 2, 3, 4, 5];
};

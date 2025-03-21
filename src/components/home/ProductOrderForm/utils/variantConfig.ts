
// Define available variants for each product category
const availableVariants: Record<string, string[]> = {
  "vêtements": ["color", "size", "print_design"],
  "t-shirts": ["color", "size", "print_design"],
  "hoodies": ["color", "size", "print_design"],
  "mugs": ["color", "design"],
  "posters": ["size", "paper_type", "format", "orientation_impression"],
  "stickers": ["size", "finish", "type_de_materiaux", "details_impression"],
  "accessoires": ["color", "size"],
  "casquettes": ["color", "size"],
  "sport": ["color", "size"],
  "vélo": ["color", "size", "face_a_imprimer"],
  // Add the new variants to all categories
  "impression": ["quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                 "orientation_impression", "prix_selon_quantite", "prix_selon_poids", 
                 "prix_selon_format", "prix_selon_type_de_materiaux", 
                 "prix_selon_delai_production", "types_impression", "echantillon", "bat"],
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
    "format": ["A4", "A3", "A2", "A1", "Personnalisé"],
    "orientation_impression": ["Portrait", "Paysage", "Carré"],
  },
  "stickers": {
    "size": ["small", "medium", "large"],
    "finish": ["glossy", "matte", "transparent"],
    "type_de_materiaux": ["Papier", "Vinyle", "PVC"],
    "details_impression": ["Haute résolution", "Standard", "Économique"],
  },
  "accessoires": {
    "color": ["red", "blue", "green", "black", "white", "Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL", "Unique"],
  },
  "casquettes": {
    "color": ["red", "blue", "green", "black", "white", "Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["Unique"],
  },
  "sport": {
    "color": ["Rouge", "Bleu", "Noir", "Blanc", "Vert"],
    "size": ["S", "M", "L", "XL"],
  },
  "vélo": {
    "color": ["Rouge", "Bleu", "Noir"],
    "size": ["S", "M", "L"],
    "face_a_imprimer": ["Avant", "Arrière", "Les deux côtés"],
  },
  // Add the new variants
  "impression": {
    "quantite": ["Standard", "Premium", "Économique"],
    "format": ["A4", "A3", "A2", "A1", "Personnalisé"],
    "type_de_materiaux": ["Papier", "Carton", "Vinyle", "PVC", "Aluminium"],
    "poids": ["Léger", "Standard", "Lourd", "Extra lourd"],
    "details_impression": ["Haute résolution", "Standard", "Économique"],
    "orientation_impression": ["Portrait", "Paysage", "Carré"],
    "prix_selon_quantite": ["Remise 10%", "Remise 20%", "Remise 30%"],
    "prix_selon_poids": ["Standard", "+10%", "+20%"],
    "prix_selon_format": ["Standard", "+15%", "+30%"],
    "prix_selon_type_de_materiaux": ["Standard", "+5%", "+15%", "+25%"],
    "prix_selon_delai_production": ["Standard", "Express (+20%)", "Urgent (+50%)"],
    "types_impression": ["Numérique", "Offset", "Sérigraphie", "Flexographie"],
    "echantillon": ["Non", "Oui (+10€)"],
    "bat": ["Non", "Numérique (gratuit)", "Physique (+15€)"],
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
  "sport": [1, 2, 3, 4, 5],
  "vélo": [1, 2, 3, 4, 5],
  // Add for the new category
  "impression": [10, 20, 50, 100, 250, 500, 1000],
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

// Function to get quantity options for a product category
export const getQuantityOptions = (category: string): number[] => {
  // Vérifier d'abord la catégorie exacte, puis vérifier la subcategory si pas trouvé
  return quantityOptions[category] || 
         quantityOptions[category.toLowerCase()] || 
         [1, 2, 3, 4, 5];
};

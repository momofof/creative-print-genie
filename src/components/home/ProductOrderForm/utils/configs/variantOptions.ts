
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
  "papier": {
    "format": ["A4", "A3", "A2", "A1", "Personnalisé"],
    "type_de_papier": ["Classique Brillant - Couché brillant", "Demi Matt classique - Revêtement mat"],
    "poids": ["250 g/m²", "300 g/m²", "350 g/m²"],
    "details_impression": ["Différents recto et verso", "Même recto et verso", "Impression recto uniquement"],
    "orientation_impression": ["Paysage", "Portrait"],
    "echantillon": ["Non", "Oui"],
    "bat": ["Non", "Oui"],
  },
  "carte-de-visite": {
    "format": ["5,5 x 8,5 cm", "9 x 5 cm", "8,5 x 5 cm"],
    "type_de_papier": ["Classique Brillant - Couché brillant", "Demi Matt classique - Revêtement mat"],
    "poids": ["250 g/m²", "300 g/m²", "350 g/m²"],
    "details_impression": ["Différents recto et verso", "Même recto et verso", "Impression recto uniquement"],
    "orientation_impression": ["Paysage", "Portrait"],
    "echantillon": ["Non", "Oui"],
    "bat": ["Non", "Oui"],
  },
  "impression": {
    "quantite": ["Standard", "Premium", "Économique"],
    "format": ["A4", "A3", "A2", "A1", "Personnalisé"],
    "type_de_materiaux": ["Papier", "Carton", "Vinyle", "PVC", "Aluminium"],
    "poids": ["Léger", "Standard", "Lourd", "Extra lourd"],
    "details_impression": ["Haute résolution", "Standard", "Économique"],
    "orientation_impression": ["Portrait", "Paysage", "Carré"],
    "types_impression": ["Numérique", "Offset", "Sérigraphie", "Flexographie"],
    "echantillon": ["Non", "Oui (+10€)"],
    "bat": ["Non", "Numérique (gratuit)", "Physique (+15€)"],
  },
  "common": {
    "quantite": ["Standard", "Premium", "Économique"],
    "format": ["A4", "A3", "A2", "A1", "Personnalisé"],
    "type_de_materiaux": ["Papier", "Carton", "Vinyle", "PVC", "Aluminium", "Textile", "Métal"],
    "poids": ["Léger", "Standard", "Lourd", "Extra lourd"],
    "details_impression": ["Haute résolution", "Standard", "Économique"],
    "orientation_impression": ["Portrait", "Paysage", "Carré"],
    "types_impression": ["Numérique", "Offset", "Sérigraphie", "Flexographie"],
    "echantillon": ["Non", "Oui (+10€)"],
    "bat": ["Non", "Numérique (gratuit)", "Physique (+15€)"],
  }
};

// Function to get variant options for a product category and variant type
export const getVariantOptions = (category: string, variantType: string): string[] => {
  // First check if the category has specific options for this variant
  const categoryOptions = variantOptions[category]?.[variantType] || 
                         variantOptions[category.toLowerCase()]?.[variantType];
  
  if (categoryOptions) {
    return categoryOptions;
  }
  
  // If not found in category-specific options, use common options
  return variantOptions["common"]?.[variantType] || [];
};

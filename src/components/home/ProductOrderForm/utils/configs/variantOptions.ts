
// Define variant options for each product category and variant type
const variantOptions: Record<string, Record<string, string[]>> = {
  "vêtements": {
    "color": ["Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL", "Unique"],
  },
  "t-shirts": {
    "color": ["Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL"],
  },
  "hoodies": {
    "color": ["Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL"],
  },
  "mugs": {
    "color": ["Blanc", "Noir", "Bleu", "Vert"],
  },
  "posters": {
    "size": ["A3", "A2", "A1"],
    "format": ["A4", "A3", "A2", "A1", "Personnalisé"],
    "orientation_impression": ["Portrait", "Paysage", "Carré"],
  },
  "stickers": {
    "size": ["Petit", "Moyen", "Grand"],
    "type_de_materiaux": ["Papier", "Vinyle", "PVC"],
    "details_impression": ["Haute résolution", "Standard", "Économique"],
  },
  "accessoires": {
    "color": ["Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL", "Unique"],
  },
  "casquettes": {
    "color": ["Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["Unique"],
  },
  "sport": {
    "color": ["Rouge", "Bleu", "Noir", "Blanc", "Vert"],
    "size": ["S", "M", "L", "XL"],
  },
  "vélo": {
    "color": ["Rouge", "Bleu", "Noir"],
    "size": ["S", "M", "L"],
  },
  "papier": {
    "format": ["A4", "A3", "A2", "A1", "Personnalisé"],
    "poids": ["250 g/m²", "300 g/m²", "350 g/m²"],
    "details_impression": ["Différents recto et verso", "Même recto et verso", "Impression recto uniquement"],
    "orientation_impression": ["Paysage", "Portrait"],
    "echantillon": ["Non", "Oui"],
    "bat": ["Non", "Oui"],
  },
  "carte-de-visite": {
    "format": ["5,5 x 8,5 cm", "9 x 5 cm", "8,5 x 5 cm"],
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
    "echantillon": ["Non", "Oui"],
    "bat": ["Non", "Numérique", "Physique"],
  },
  "common": {
    "color": ["Noir", "Blanc", "Bleu", "Rouge", "Vert"],
    "size": ["S", "M", "L", "XL", "XXL", "Unique"],
    "format": ["A4", "A3", "A2", "A1", "Personnalisé"],
    "type_de_materiaux": ["Papier", "Carton", "Vinyle", "PVC", "Aluminium"],
    "poids": ["Léger", "Standard", "Lourd", "Extra lourd"],
    "details_impression": ["Haute résolution", "Standard", "Économique"],
    "orientation_impression": ["Portrait", "Paysage", "Carré"],
    "types_impression": ["Numérique", "Offset", "Sérigraphie", "Flexographie"],
    "echantillon": ["Non", "Oui"],
    "bat": ["Non", "Numérique", "Physique"],
    "quantite": ["Standard", "Premium", "Économique"]
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

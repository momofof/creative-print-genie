
// Define display names for each variant type
const variantDisplayNames: Record<string, string> = {
  "color": "Couleur",
  "size": "Taille",
  "print_design": "Design d'impression",
  "design": "Design",
  "paper_type": "Type de papier",
  "finish": "Finition",
  "face_a_imprimer": "Face à imprimer",
  // New variants
  "quantite": "Quantité",
  "format": "Format",
  "type_de_materiaux": "Type de matériaux",
  "poids": "Poids",
  "details_impression": "Détails d'impression",
  "orientation_impression": "Orientation d'impression",
  "prix_selon_quantite": "Prix selon quantité",
  "prix_selon_poids": "Prix selon poids",
  "prix_selon_format": "Prix selon format",
  "prix_selon_type_de_materiaux": "Prix selon type de matériaux",
  "prix_selon_delai_production": "Prix selon délai de production",
  "types_impression": "Types d'impression",
  "echantillon": "Échantillon",
  "bat": "B.A.T"
};

// Function to get display name for a variant type
export const getVariantDisplayName = (variantType: string): string => {
  return variantDisplayNames[variantType] || variantType;
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
    'sport': '/placeholder.svg',
    'vélo': '/placeholder.svg',
    'impression': '/placeholder.svg',
    'vinyl': '/placeholder.svg',
    'panneaux': '/placeholder.svg',
    'enseignes': '/placeholder.svg',
    'papier': '/placeholder.svg',
    'textile': '/placeholder.svg',
    // Add more categories as needed
  };
  
  return categoryPlaceholders[category.toLowerCase()] || '/placeholder.svg';
};

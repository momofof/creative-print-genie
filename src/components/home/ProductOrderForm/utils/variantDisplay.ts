
// Define display names for each variant type
const variantDisplayNames: Record<string, string> = {
  "color": "Couleur",
  "size": "Taille",
  "print_design": "Design d'impression",
  "design": "Design",
  "paper_type": "Type de papier",
  "finish": "Finition",
  "type": "Type",
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
    'velo': '/placeholder.svg',
    'maison': '/placeholder.svg',  // Ajout du placeholder pour la catégorie "maison"
    // Add more categories as needed
  };
  
  return categoryPlaceholders[category.toLowerCase()] || '/placeholder.svg';
};

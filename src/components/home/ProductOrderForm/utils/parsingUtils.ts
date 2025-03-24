
import { Product, ProductVariant } from "@/types/product";

// Extract variant options from product and its variants
export const extractVariantOptionsFromProduct = async (product: Product): Promise<Record<string, string[]>> => {
  try {
    if (!product || !product.id) return {};
    
    // Fetch variants directly from the database
    const { data: variants, error } = await fetch(`/api/products/${product.id}/variants`).then(res => res.json());
    
    if (error || !variants || variants.length === 0) return {};
    
    // Extract unique values for each variant property
    const result: Record<string, string[]> = {};
    
    variants.forEach((variant: ProductVariant) => {
      // Add size if it exists and is unique
      if (variant.size && !result['taille']) {
        result['taille'] = [];
      }
      if (variant.size && !result['taille'].includes(variant.size)) {
        result['taille'].push(variant.size);
      }
      
      // Add color if it exists and is unique
      if (variant.color && !result['couleur']) {
        result['couleur'] = [];
      }
      if (variant.color && !result['couleur'].includes(variant.color)) {
        result['couleur'].push(variant.color);
      }
      
      // Add other properties as needed
    });
    
    return result;
  } catch (error) {
    console.error("Error extracting variant options from product:", error);
    return {};
  }
};

// Fonction simplifiée pour obtenir les variantes disponibles par catégorie
export const getAvailableVariants = (category: string): string[] => {
  // Mappez les catégories aux types de variantes disponibles
  const variantsByCategory: Record<string, string[]> = {
    "vêtements": ["taille", "couleur"],
    "accessoires": ["couleur"],
    "électronique": ["taille", "couleur"],
    "papeterie": ["format", "couleur"],
    "goodies": ["taille", "couleur"],
    "high-tech": ["taille", "couleur"],
    // Catégories et sous-catégories
    "t-shirts": ["taille", "couleur"],
    "hoodies": ["taille", "couleur"],
    "sacs": ["taille", "couleur"],
    "casquettes": ["taille", "couleur"],
    "mugs": ["couleur"],
    "posters": ["format", "couleur"],
    "stickers": ["taille", "couleur"],
    "cartes": ["format", "couleur"],
    "bloc-notes": ["format", "couleur"]
  };

  // Retournez les variantes pour cette catégorie, ou un tableau vide si non trouvé
  return variantsByCategory[category.toLowerCase()] || [];
};

// Fonction pour obtenir les options de quantité selon la catégorie
export const getQuantityOptions = (category: string): number[] => {
  switch (category.toLowerCase()) {
    case "t-shirts":
    case "hoodies":
    case "vêtements":
    case "casquettes":
    case "sacs":
      return [1, 2, 3, 4, 5, 10, 25, 50, 100];
    case "stickers":
    case "cartes":
    case "papeterie":
      return [10, 25, 50, 100, 250, 500, 1000];
    case "posters":
    case "mugs":
    case "goodies":
      return [1, 2, 5, 10, 25, 50, 100];
    default:
      return [1, 2, 3, 5, 10, 25, 50, 100];
  }
};

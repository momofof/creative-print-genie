
import { Product } from "@/types/product";

export const getFeatureIllustration = (product: Product | undefined, variants: Record<string, string>): string => {
  // Default placeholder
  if (!product) return "/placeholder.svg";
  
  // If the product has an image, use it
  if (product.image) return product.image;
  
  // Fallback to a generic illustration based on product category
  let category = product.subcategory || product.category || "";
  category = category.toLowerCase();
  
  if (category.includes("t-shirt") || category.includes("textile")) {
    return "/illustrations/tshirt.svg";
  } else if (category.includes("mug") || category.includes("tasse")) {
    return "/illustrations/mug.svg";
  } else if (category.includes("poster") || category.includes("affiche")) {
    return "/illustrations/poster.svg";
  }
  
  // Default illustration
  return "/illustrations/product.svg";
};

export const getVariantIllustration = (
  category: string, 
  variantType: string, 
  variantValue: string
): string => {
  category = category.toLowerCase();
  variantType = variantType.toLowerCase();
  
  // Path pattern: /illustrations/{category}/{variant-type}/{variant-value}.svg
  try {
    // For color variants
    if (variantType === "couleur" || variantType === "color") {
      return `/illustrations/${category}/colors/${variantValue.toLowerCase().replace(/\s+/g, '-')}.svg`;
    }
    
    // For size variants
    if (variantType === "taille" || variantType === "size") {
      return `/illustrations/${category}/sizes/${variantValue.toLowerCase().replace(/\s+/g, '-')}.svg`;
    }
    
    // For format variants
    if (variantType === "format") {
      return `/illustrations/${category}/formats/${variantValue.toLowerCase().replace(/\s+/g, '-')}.svg`;
    }
    
    // Generic fallback
    return `/illustrations/${category}/${variantType}/${variantValue.toLowerCase().replace(/\s+/g, '-')}.svg`;
  } catch (e) {
    console.error("Error getting variant illustration:", e);
    return "/placeholder.svg";
  }
};

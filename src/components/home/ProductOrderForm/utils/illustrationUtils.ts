
// Helper function to get illustration URL for a variant
export const getVariantIllustration = (category: string, variantType: string, value: string): string => {
  // Base illustrations path
  const basePath = "/illustrations";
  
  // Create a clean path segment from value
  const cleanValue = value.toLowerCase().replace(/\s+/g, '-');
  
  // Check for specific illustrations based on category and variant type
  if (variantType === "color") {
    return `${basePath}/colors/${cleanValue}.svg`;
  }
  
  if (variantType === "size") {
    return `${basePath}/sizes/${category.toLowerCase()}/${cleanValue}.svg`;
  }
  
  if (variantType === "format") {
    return `${basePath}/formats/${cleanValue}.svg`;
  }
  
  // Default illustration for unknown variant types
  return `${basePath}/placeholder.svg`;
};

// Helper function to get feature illustration URL
export const getFeatureIllustration = (product: any, variants?: Record<string, string>): string => {
  // Base illustrations path
  const basePath = "/illustrations/features";
  
  // If no product is provided, return placeholder
  if (!product) {
    return `${basePath}/placeholder.svg`;
  }
  
  // Get product category or subcategory
  const category = product.subcategory || product.category;
  
  // Map of feature types to their illustration files
  const illustrationMap: Record<string, string> = {
    "shipping": "shipping.svg",
    "returns": "returns.svg",
    "quality": "quality.svg",
    "support": "support.svg",
    "sizing": "sizing.svg",
    "customization": "customization.svg",
    "material": "material.svg",
    "delivery": "delivery.svg",
  };
  
  // Return specific illustration if available, otherwise placeholder
  return illustrationMap[category] 
    ? `${basePath}/${illustrationMap[category]}` 
    : `${basePath}/placeholder.svg`;
};

// Helper function to get variant image URL for product gallery
export const getVariantImage = (productId: string, variantId: string): string => {
  // Base images path
  const basePath = "/product-images";
  
  // For now, return a placeholder based on IDs
  return `${basePath}/variants/${productId}/${variantId}.jpg`;
};

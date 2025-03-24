import { Product } from "@/types/product";

// This function returns a placeholder or specific variant illustration URL
export const getVariantIllustration = (
  categoryOrSubcategory: string,
  variantType: string,
  variantValue: string
): string => {
  // For demo purposes, return placeholders based on variant type and value
  // In a real implementation, these would come from a product-specific API or database
  
  // Simple mapping for some common variant types
  if (variantType === 'color') {
    // We could return actual color swatches
    return `/placeholder.svg`;
  }
  
  if (variantType === 'size') {
    return `/placeholder.svg`;
  }
  
  if (variantType === 'format') {
    return `/placeholder.svg`;
  }
  
  // Default placeholder
  return `/placeholder.svg`;
};

// Helper function to get feature illustration for product order form
export const getFeatureIllustration = (
  product: Product | undefined,
  variants: Record<string, string>
): string => {
  // Default placeholder
  if (!product) return `/placeholder.svg`;
  
  // If the product has an image, use it
  if (product.image) return product.image;
  
  // Otherwise, use placeholders based on the product category
  return `/placeholder.svg`;
};

// Helper function to get feature illustration for specific features
export const getFeatureIllustration2 = (
  feature: string
): string => {
  // Provide illustrations for specific product features
  switch (feature) {
    case 'eco-friendly':
      return `/placeholder.svg`;
    case 'fast-delivery':
      return `/placeholder.svg`;
    case 'custom-design':
      return `/placeholder.svg`;
    default:
      return `/placeholder.svg`;
  }
};

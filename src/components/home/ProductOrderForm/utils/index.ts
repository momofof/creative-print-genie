
// Re-export utility functions from all utility files
export * from './variantConfig';
export * from './variantDisplay';
export * from './illustrationUtils';
export * from './parsingUtils';

import { Product } from "@/types/product";

// Simplified function to get variant image - uses the direct image URL
export const getVariantImage = (product?: Product, variantType?: string, variantValue?: string) => {
  if (!product || !variantType || !variantValue) return null;
  
  // For color variants, return the variant_image_url if it exists
  if (variantType.toLowerCase() === 'color' && product.variant_image_url) {
    return product.variant_image_url;
  }
  
  return null;
};

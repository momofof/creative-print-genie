
// Export individual utility functions from all utility files
export { getAvailableVariants, getQuantityOptions, extractVariantOptionsFromProduct } from './parsingUtils';
export { getVariantDisplayName } from './variantDisplay';
export { getVariantIllustration, getFeatureIllustration } from './illustrationUtils';
export { parseVariants, extractVariantFields } from './parseUtils';

// Simplified function to get variant image - uses the direct image URL
export const getVariantImage = (product?: any, variantType?: string, variantValue?: string) => {
  if (!product || !variantType || !variantValue) return null;
  
  // For color variants, we'll need to fetch from the variant_images relationship
  if (variantType.toLowerCase() === 'color') {
    return product.image || null;
  }
  
  return null;
};

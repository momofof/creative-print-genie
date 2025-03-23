// Re-export utility functions from all utility files
export * from './variantConfig';
export * from './variantDisplay';
export * from './illustrationUtils';
export * from './parsingUtils';

import { Product } from "@/types/product";

// Add this function to check for variant images
export const getVariantImage = (product?: Product, variantType?: string, variantValue?: string) => {
  if (!product || !variantType || !variantValue) return null;
  
  // For color variants specifically
  if (variantType.toLowerCase() === 'color' && product.variants) {
    // Find the variant ID for this color
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const colorVariant = variants.find(v => 
      v.color && v.color.toLowerCase() === variantValue.toLowerCase()
    );
    
    if (colorVariant && colorVariant.id && product.variant_images) {
      const images = product.variant_images[colorVariant.id];
      // Return the first image if available
      return Array.isArray(images) && images.length > 0 ? images[0] : null;
    }
  }
  
  return null;
};

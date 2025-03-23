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
      let variantImages: Record<string, string[]> = {};
      
      // Handle the case where variant_images is a string (from the database)
      if (typeof product.variant_images === 'string') {
        try {
          variantImages = JSON.parse(product.variant_images);
        } catch (e) {
          console.error('Error parsing variant_images:', e);
          return null;
        }
      } else {
        variantImages = product.variant_images;
      }
      
      const images = variantImages[colorVariant.id];
      // Return the first image if available
      return Array.isArray(images) && images.length > 0 ? images[0] : null;
    }
  }
  
  return null;
};

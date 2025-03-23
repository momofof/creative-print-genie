import { Product } from "@/types/product";
import { getVariantImage } from './index';

// Helper function to get the illustration for a specific variant
export const getVariantIllustration = (
  category: string,
  variantType: string,
  variantValue: string
) => {
  // Default illustration image
  return `/images/illustrations/${category}/${variantType}/${variantValue}.svg`;
};

// Update this function to use variant images from the product when available
export const findVariantImage = (product?: Product, variants?: Record<string, string>): string | null => {
  if (!product || !variants || !product.variants) return null;
  
  // Check if we have a color variant that might have an image
  if (variants.color) {
    const colorImage = getVariantImage(product, 'color', variants.color);
    if (colorImage) return colorImage;
  }
  
  // Original implementation
  const matchingVariant = product.variants.find(
    (v) => v.color === variants.color && v.size === variants.size
  );
  
  if (matchingVariant && matchingVariant.id && product.variant_images && product.variant_images[matchingVariant.id]) {
    // Get the first image from the variant images array
    const images = product.variant_images[matchingVariant.id];
    return Array.isArray(images) && images.length > 0 ? images[0] : null;
  }
  
  return null;
};

// Get the feature illustration for a product based on its category and variants
export const getFeatureIllustration = (product?: Product, variants?: Record<string, string>) => {
  if (!product) return "/images/illustrations/placeholder.svg";
  
  // First check if we have a variant-specific image
  if (variants && Object.keys(variants).length > 0) {
    const variantImage = findVariantImage(product, variants);
    if (variantImage) return variantImage;
  }
  
  // Fallback to the product's main image
  if (product.image) return product.image;
  
  // Default illustration based on category
  return `/images/illustrations/${product.category}/default.svg`;
};

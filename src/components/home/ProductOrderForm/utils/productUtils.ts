
import { Product } from "@/types/product";
import { parseJsonArray } from "@/utils/jsonUtils";

// Extract variant options from product data - optimized version
export const extractVariantOptionsFromProduct = (product: Product): Record<string, string[]> => {
  try {
    if (!product) return {};
    
    // Check if product has variants property
    const productVariants = product.variants;
    
    if (!productVariants) return {};
    
    // Parse the variants to ensure we have an array to work with
    const variants = parseJsonArray(productVariants);
    
    if (!Array.isArray(variants) || variants.length === 0) return {};
    
    const result: Record<string, string[]> = {};
    
    // Process variants in a more efficient way
    variants.forEach(variant => {
      // Skip if variant is not an object
      if (!variant || typeof variant !== 'object') return;
      
      // Process only relevant variant properties
      Object.entries(variant).forEach(([key, value]) => {
        // Ignore properties that are not variants
        if (['stock', 'price_adjustment', 'status', 'hex_color', 'id', 'isNew', 'isDeleted'].includes(key)) return;
        
        // Initialize array if needed
        if (!result[key]) {
          result[key] = [];
        }
        
        // Add value if it's a string and not already in the array
        if (typeof value === 'string' && !result[key].includes(value)) {
          result[key].push(value);
        }
      });
    });
    
    return result;
  } catch (error) {
    console.error("Error extracting variant options from product:", error);
    return {};
  }
};

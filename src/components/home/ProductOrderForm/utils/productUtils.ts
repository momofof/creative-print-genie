
import { Product } from "@/types/product";
import { parseJsonArray } from "@/utils/jsonUtils";

// Extract variant options from product data - optimized and error-proofed version
export const extractVariantOptionsFromProduct = (product: Product): Record<string, string[]> => {
  try {
    // Safety check for product
    if (!product) return {};
    
    // Get variants property from product
    const productVariants = product.variants;
    
    // Early return if no variants
    if (productVariants == null) return {};
    
    // Parse the variants to ensure we have an array to work with
    let variants;
    try {
      variants = parseJsonArray(productVariants);
    } catch (error) {
      console.error("Failed to parse product variants:", error);
      return {};
    }
    
    // Validate we have an array of variants
    if (!Array.isArray(variants) || variants.length === 0) return {};
    
    const result: Record<string, string[]> = {};
    
    // Process variants in a more efficient way
    for (const variant of variants) {
      // Skip if variant is not an object
      if (!variant || typeof variant !== 'object') continue;
      
      // Process only relevant variant properties
      for (const [key, value] of Object.entries(variant)) {
        // Ignore properties that are not variants
        if (['stock', 'price_adjustment', 'status', 'hex_color', 'id', 'isNew', 'isDeleted'].includes(key)) continue;
        
        // Initialize array if needed
        if (!result[key]) {
          result[key] = [];
        }
        
        // Add value if it's a string and not already in the array
        if (typeof value === 'string' && !result[key].includes(value)) {
          result[key].push(value);
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error extracting variant options:", error);
    return {};
  }
};


import { Product } from "@/types/product";

// Extract variant options from product data
export const extractVariantOptionsFromProduct = (product: Product): Record<string, string[]> => {
  try {
    if (!product) return {};
    
    // Check if product has variants property - could be string or object
    const productVariants = product.variants as any;
    
    if (!productVariants) return {};
    
    let variants = productVariants;
    if (typeof variants === 'string') {
      variants = JSON.parse(variants);
    }
    
    if (Array.isArray(variants)) {
      const result: Record<string, string[]> = {};
      
      variants.forEach(variant => {
        Object.entries(variant).forEach(([key, value]) => {
          // Ignorer les propriétés qui ne sont pas des variantes
          if (['stock', 'price_adjustment', 'status', 'hex_color'].includes(key)) return;
          
          if (!result[key]) {
            result[key] = [];
          }
          
          if (typeof value === 'string' && !result[key].includes(value)) {
            result[key].push(value as string);
          }
        });
      });
      
      return result;
    }
    
    return {};
  } catch (error) {
    console.error("Error extracting variant options from product:", error);
    return {};
  }
};

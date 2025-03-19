
import { Product } from "@/types/product";

// Add or ensure these utility functions exist for JSON parsing
export const parseVariants = (variantsJson: any): Record<string, string[]> => {
  if (!variantsJson) return {};
  
  try {
    if (typeof variantsJson === 'string') {
      return JSON.parse(variantsJson);
    }
    
    // If variantsJson is an array of objects with properties like size, color, etc.
    if (Array.isArray(variantsJson)) {
      // Extract unique values for each property
      const result: Record<string, string[]> = {};
      
      variantsJson.forEach(variant => {
        Object.entries(variant).forEach(([key, value]) => {
          // Ignore properties that are not variants
          if (['id', 'product_id', 'stock', 'price_adjustment', 'status', 'hex_color', 'created_at', 'updated_at'].includes(key)) return;
          
          if (!result[key]) {
            result[key] = [];
          }
          
          if (typeof value === 'string' && !result[key].includes(value)) {
            result[key].push(value);
          }
        });
      });
      
      return result;
    }
    
    return variantsJson;
  } catch (error) {
    console.error("Error parsing variants:", error);
    return {};
  }
};

// Extract variant options from product data
export const extractVariantOptionsFromProduct = (product: Product): Record<string, string[]> => {
  try {
    if (!product) return {};
    
    // Check if product has variants property - could be string or object
    const productVariants = product.variants;
    
    if (!productVariants) return {};
    
    let variants = productVariants;
    if (typeof variants === 'string') {
      variants = JSON.parse(variants);
    }
    
    if (Array.isArray(variants)) {
      const result: Record<string, string[]> = {};
      
      variants.forEach(variant => {
        Object.entries(variant).forEach(([key, value]) => {
          // Ignore properties that are not variants
          if (['id', 'product_id', 'stock', 'price_adjustment', 'status', 'hex_color', 'created_at', 'updated_at'].includes(key)) return;
          
          if (!result[key]) {
            result[key] = [];
          }
          
          if (typeof value === 'string' && !result[key].includes(value as string)) {
            result[key].push(value as string);
          }
        });
      });
      
      console.log("Extracted variant options:", result);
      return result;
    }
    
    return {};
  } catch (error) {
    console.error("Error extracting variant options from product:", error);
    return {};
  }
};

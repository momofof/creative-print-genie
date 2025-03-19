
import { Product } from "@/types/product";

// Add or ensure these utility functions exist for JSON parsing
export const parseVariants = (variantsJson: any): Record<string, string[]> => {
  if (!variantsJson) return {};
  
  try {
    if (typeof variantsJson === 'string') {
      return JSON.parse(variantsJson);
    }
    
    // Si variantsJson est un tableau d'objets avec des propriétés size, color, etc.
    if (Array.isArray(variantsJson)) {
      // Extraire les valeurs uniques pour chaque propriété
      const result: Record<string, string[]> = {};
      
      variantsJson.forEach(variant => {
        Object.entries(variant).forEach(([key, value]) => {
          // Ignorer les propriétés qui ne sont pas des variantes
          if (['id', 'stock', 'price_adjustment', 'status', 'hex_color', 'printable_sides', 'shipping_time'].includes(key)) return;
          
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
          if (['id', 'stock', 'price_adjustment', 'status', 'hex_color', 'printable_sides', 'shipping_time'].includes(key)) return;
          
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

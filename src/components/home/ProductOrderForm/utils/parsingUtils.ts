
import { Product } from "@/types/product";
import { getVariantTypesFromProduct } from "./variantDisplay";

// Add or ensure these utility functions exist for JSON parsing
export const parseVariants = (variantsJson: any): Record<string, string[]> => {
  if (!variantsJson) return {};
  
  try {
    // If variantsJson is a string, try to parse it
    if (typeof variantsJson === 'string') {
      variantsJson = JSON.parse(variantsJson);
    }
    
    // If variantsJson is an array of objects with properties like size, color, etc.
    if (Array.isArray(variantsJson)) {
      // Extract unique values for each property
      const result: Record<string, string[]> = {};
      
      // Get all variant types from the product
      const variantTypes = getVariantTypesFromProduct(variantsJson);
      
      // Initialize arrays for each variant type
      variantTypes.forEach(type => {
        result[type] = [];
      });
      
      // Populate arrays with unique values
      variantsJson.forEach(variant => {
        Object.entries(variant).forEach(([key, value]) => {
          const lowerKey = key.toLowerCase();
          // Ignore non-variant properties
          if (['stock', 'price_adjustment', 'status', 'hex_code', 'hex_color', 'id'].includes(lowerKey)) {
            return;
          }
          
          if (!result[lowerKey]) {
            result[lowerKey] = [];
          }
          
          if (typeof value === 'string' && !result[lowerKey].includes(value)) {
            result[lowerKey].push(value);
          }
        });
      });
      
      return result;
    }
    
    // If variantsJson is already an object with variant types as keys
    if (typeof variantsJson === 'object' && !Array.isArray(variantsJson)) {
      return variantsJson;
    }
    
    return {};
  } catch (error) {
    console.error("Error parsing variants:", error);
    return {};
  }
};

// Extract variant options from product data
export const extractVariantOptionsFromProduct = (product: Product): Record<string, string[]> => {
  try {
    if (!product) return {};
    
    // Check if product has variants property
    const productVariants = product.variants;
    
    if (!productVariants) return {};
    
    return parseVariants(productVariants);
  } catch (error) {
    console.error("Error extracting variant options from product:", error);
    return {};
  }
};

// Get unique variant values for a specific variant type from product variants
export const getUniqueVariantValues = (variants: any, variantType: string): string[] => {
  try {
    // If variants is a string, try to parse it
    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    
    if (!Array.isArray(parsedVariants)) return [];
    
    // Extract unique values for the specified variant type
    const uniqueValues = new Set<string>();
    
    parsedVariants.forEach(variant => {
      const value = variant[variantType];
      if (value && typeof value === 'string') {
        uniqueValues.add(value);
      }
    });
    
    return Array.from(uniqueValues);
  } catch (error) {
    console.error(`Error getting unique values for ${variantType}:`, error);
    return [];
  }
};

// Check if two variant objects match
export const doVariantsMatch = (
  variantsA: Record<string, string> | undefined, 
  variantsB: Record<string, string> | undefined
): boolean => {
  if (!variantsA && !variantsB) return true;
  if (!variantsA || !variantsB) return false;
  
  const keysA = Object.keys(variantsA);
  const keysB = Object.keys(variantsB);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key) || variantsA[key] !== variantsB[key]) {
      return false;
    }
  }
  
  return true;
};

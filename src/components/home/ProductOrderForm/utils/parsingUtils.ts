
import { Product } from "@/types/product";

/**
 * Parse variants from a product's JSON data
 */
export const parseVariants = (variants: any): Record<string, any[]> => {
  if (!variants || !Array.isArray(variants)) {
    return {};
  }

  // Group variants by properties
  const result: Record<string, any[]> = {};
  
  variants.forEach(variant => {
    // Process each property in the variant
    Object.keys(variant).forEach(key => {
      // Skip id and non-variant attributes
      if (key === 'id' || key === 'stock' || key === 'price_adjustment' || key === 'status') {
        return;
      }
      
      // Initialize the array if it doesn't exist
      if (!result[key]) {
        result[key] = [];
      }
      
      // Add value to the array if it's not already included
      if (key === 'printable_sides') {
        // Special handling for printable_sides as it's an array
        if (Array.isArray(variant[key])) {
          variant[key].forEach((side: string) => {
            if (!result[key].includes(side)) {
              result[key].push(side);
            }
          });
        }
      } else {
        // Handle regular variant properties
        if (!result[key].includes(variant[key])) {
          result[key].push(variant[key]);
        }
      }
    });
  });
  
  return result;
};

/**
 * Extract variant options from a product's data
 */
export const extractVariantOptionsFromProduct = (product: Product): Record<string, string[]> => {
  if (!product.variants || typeof product.variants !== 'object') {
    return {};
  }
  
  try {
    // If variants is a string, parse it
    const variantsArray = typeof product.variants === 'string' 
      ? JSON.parse(product.variants) 
      : product.variants;
    
    if (!Array.isArray(variantsArray)) {
      return {};
    }
    
    // Extract options for each variant type
    const options: Record<string, string[]> = {};
    
    variantsArray.forEach(variant => {
      if (variant.size && !options.size) {
        options.size = [];
      }
      if (variant.size && !options.size.includes(variant.size)) {
        options.size.push(variant.size);
      }
      
      if (variant.color && !options.color) {
        options.color = [];
      }
      if (variant.color && !options.color.includes(variant.color)) {
        options.color.push(variant.color);
      }
      
      // Handle printable_sides - convert to "printable_side" singular for the UI
      if (variant.printable_sides && Array.isArray(variant.printable_sides)) {
        if (!options.printable_side) {
          options.printable_side = [];
        }
        
        variant.printable_sides.forEach((side: string) => {
          if (!options.printable_side.includes(side)) {
            options.printable_side.push(side);
          }
        });
      }
      
      // Add other variant types as needed
    });
    
    return options;
  } catch (error) {
    console.error("Error parsing product variants:", error);
    return {};
  }
};

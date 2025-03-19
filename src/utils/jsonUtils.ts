
/**
 * Utility functions for converting data to/from JSON
 */

// Convert value to a format that can be safely stored in a JSON database
export const toJsonValue = (value: any): any => {
  if (value === undefined) return null;
  return value;
};

// Parse an array from JSON or object
export const parseJsonArray = (data: any): any[] => {
  if (!data) return [];
  
  if (Array.isArray(data)) {
    return data;
  } else if (typeof data === 'object') {
    return Object.values(data);
  }
  
  try {
    if (typeof data === 'string') {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return Object.values(parsed);
    }
  } catch (e) {
    console.error("Error parsing JSON array:", e);
  }
  
  return [];
};

// Parse product variants from JSON or object - optimized version
export const parseProductVariants = (variants: any): any[] => {
  return parseJsonArray(variants);
};

// Parse customizations from JSON or object - optimized version
export const parseCustomizations = (customizations: any): any[] => {
  return parseJsonArray(customizations);
};

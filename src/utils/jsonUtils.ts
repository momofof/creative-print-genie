
/**
 * Utility functions for converting data to/from JSON
 */

// Convert value to a format that can be safely stored in a JSON database
export const toJsonValue = (value: any): any => {
  if (value === undefined) return null;
  return value;
};

// Parse an array from JSON or object - optimized to prevent infinite recursion
export const parseJsonArray = (data: any): any[] => {
  // Handle null/undefined case
  if (data == null) return [];
  
  // If already an array, return it directly
  if (Array.isArray(data)) {
    return data;
  }
  
  // If it's an object, convert to array of values
  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    return Object.values(data);
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (typeof parsed === 'object' && parsed !== null) {
        return Object.values(parsed);
      }
    } catch (e) {
      // If parsing fails, return empty array rather than throwing
      console.warn("Error parsing JSON string:", e);
      return [];
    }
  }
  
  // If none of the above, return empty array
  return [];
};

// Parse product variants from JSON or object - simplified version
export const parseProductVariants = (variants: any): any[] => {
  return parseJsonArray(variants);
};

// Parse customizations from JSON or object - simplified version
export const parseCustomizations = (customizations: any): any[] => {
  return parseJsonArray(customizations);
};


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

// Parse product variants from JSON or object
export const parseProductVariants = (variants: any): any[] => {
  if (!variants) return [];
  
  if (Array.isArray(variants)) {
    return variants;
  } else if (typeof variants === 'object') {
    return Object.values(variants);
  }
  
  try {
    if (typeof variants === 'string') {
      const parsed = JSON.parse(variants);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return Object.values(parsed);
    }
  } catch (e) {
    console.error("Error parsing variants JSON:", e);
  }
  
  return [];
};

// Parse customizations from JSON or object
export const parseCustomizations = (customizations: any): any[] => {
  if (!customizations) return [];
  
  if (Array.isArray(customizations)) {
    return customizations;
  } else if (typeof customizations === 'object') {
    return Object.values(customizations);
  }
  
  try {
    if (typeof customizations === 'string') {
      const parsed = JSON.parse(customizations);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return Object.values(parsed);
    }
  } catch (e) {
    console.error("Error parsing customizations JSON:", e);
  }
  
  return [];
};

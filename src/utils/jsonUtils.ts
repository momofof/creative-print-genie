
/**
 * Convert a value to a safe JSON value for Supabase storage
 * 
 * @param value The value to convert
 * @returns A JSON-safe value
 */
export const toJsonValue = (value: any): any => {
  // First convert to JSON string and then parse back to ensure all values are JSON compatible
  return JSON.parse(JSON.stringify(value));
};

/**
 * Parse a JSON array safely, returning an empty array if the input is invalid
 * 
 * @param jsonArray The JSON array string or object to parse
 * @returns The parsed array or an empty array if parsing fails
 */
export const parseJsonArray = (jsonArray: any): any[] => {
  if (!jsonArray) return [];
  
  if (Array.isArray(jsonArray)) {
    return jsonArray;
  }
  
  try {
    if (typeof jsonArray === 'string') {
      if (jsonArray.startsWith('[') && jsonArray.endsWith(']')) {
        // Format de liste simple [valeur1, valeur2, ...]
        const content = jsonArray.slice(1, -1);
        if (!content.trim()) return [];
        
        return content.split(',')
          .map(item => item.trim())
          .filter(Boolean);
      } else {
        // Essayer de parser comme JSON
        const parsed = JSON.parse(jsonArray);
        return Array.isArray(parsed) ? parsed : [];
      }
    }
    return Array.isArray(Object.values(jsonArray)) ? Object.values(jsonArray) : [];
  } catch (e) {
    console.error('Error parsing JSON array:', e);
    return [];
  }
};

/**
 * Parse product variants from JSON or string format
 * 
 * @param variants The variants in JSON, string, or object format
 * @returns The parsed variants object or an empty object if parsing fails
 */
export const parseProductVariants = (variants: any): any => {
  if (!variants) return {};
  
  try {
    if (typeof variants === 'string') {
      return JSON.parse(variants);
    }
    return variants;
  } catch (e) {
    console.error('Error parsing product variants:', e);
    return {};
  }
};

/**
 * Parse customizations from JSON or string format
 * 
 * @param customizations The customizations in JSON, string, or object format
 * @returns The parsed customizations array or an empty array if parsing fails
 */
export const parseCustomizations = (customizations: any): any[] => {
  if (!customizations) return [];
  
  try {
    if (typeof customizations === 'string') {
      return JSON.parse(customizations);
    }
    if (Array.isArray(customizations)) {
      return customizations;
    }
    return Object.values(customizations);
  } catch (e) {
    console.error('Error parsing customizations:', e);
    return [];
  }
};

/**
 * Convertit un tableau de valeurs en format liste textuelle "[val1, val2, ...]"
 * 
 * @param values Les valeurs à convertir en liste textuelle
 * @returns Une chaîne de caractères au format liste
 */
export const toListFormat = (values: string[]): string => {
  if (!Array.isArray(values) || values.length === 0) return '[]';
  return `[${values.join(', ')}]`;
};

/**
 * Convertit une liste textuelle "[val1, val2, ...]" en tableau de valeurs
 * 
 * @param listString La chaîne au format liste
 * @returns Un tableau de valeurs
 */
export const fromListFormat = (listString: string): string[] => {
  if (!listString || !listString.trim()) return [];
  
  try {
    if (listString.startsWith('[') && listString.endsWith(']')) {
      const content = listString.slice(1, -1);
      if (!content.trim()) return [];
      
      return content.split(',')
        .map(item => item.trim())
        .filter(Boolean);
    }
    return [];
  } catch (e) {
    console.error('Error parsing list format:', e);
    return [];
  }
};

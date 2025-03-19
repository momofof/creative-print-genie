
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
          if (['stock', 'price_adjustment', 'status', 'hex_color'].includes(key)) return;
          
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

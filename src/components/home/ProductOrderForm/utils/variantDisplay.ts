// Map variant keys to display names
const variantKeyDisplayNames: Record<string, string> = {
  color: "Couleur",
  size: "Taille",
  format: "Format",
  quantity: "Quantité",
  bat: "BAT",
  poids: "Poids",
  echantillon: "Echantillon",
  types_impression: "Types d'impression",
  type_de_materiaux: "Type de matériaux",
  details_impression: "Détails d'impression",
  orientation_impression: "Orientation"
};

/**
 * Get display name for a variant key and value
 */
export const getVariantDisplayName = (key: string, value?: string): string => {
  const displayKey = variantKeyDisplayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  
  // If value is provided, return the full display string, otherwise just the key name
  return value ? `${displayKey}: ${value}` : displayKey;
};

/**
 * Parse a comma-separated or JSON string list of variants into an array
 */
export const parseVariantListString = (variantString?: string): string[] => {
  if (!variantString) return [];
  
  try {
    // Try to parse as JSON first
    if (variantString.startsWith('[') && variantString.endsWith(']')) {
      return JSON.parse(variantString);
    }
    
    // Otherwise split by comma and trim
    return variantString.split(',').map(item => item.trim());
  } catch (error) {
    console.error('Error parsing variant list string:', error);
    return [];
  }
};

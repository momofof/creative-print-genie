// Format variant types for display
export const getVariantDisplayName = (variantType: string, variantValue?: string): string => {
  const displayNameMap: Record<string, string> = {
    color: "Couleur",
    size: "Taille",
    format: "Format",
    quantite: "Quantité",
    bat: "BAT",
    poids: "Poids",
    echantillon: "Échantillon",
    types_impression: "Type d'impression",
    print_design: "Design d'impression",
    design: "Design",
    paper_type: "Type de papier",
    face_a_imprimer: "Face à imprimer",
    type_de_materiaux: "Type de matériaux",
    details_impression: "Détails d'impression",
    orientation_impression: "Orientation",
    finish: "Finition"
  };

  // If variantValue is provided, format as "DisplayName: Value"
  if (variantValue !== undefined) {
    const displayName = displayNameMap[variantType] || variantType.charAt(0).toUpperCase() + variantType.slice(1);
    return `${displayName}: ${variantValue}`;
  }

  // Otherwise just return the display name
  return displayNameMap[variantType] || variantType.charAt(0).toUpperCase() + variantType.slice(1);
};

// Parse a variant list string into an array of strings
export const parseVariantListString = (str: string | null | undefined): string[] => {
  if (!str) return [];
  
  try {
    // Try to parse as JSON array first
    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        return JSON.parse(str);
      } catch (e) {
        // Si l'erreur est liée au parsing JSON, essayons un parsing manuel
        // Supprimer les crochets et diviser par virgules
        const withoutBrackets = str.slice(1, -1);
        return withoutBrackets.split(',').map(item => item.trim());
      }
    }
    
    // Attempt to parse as a comma-separated list
    if (str.includes(',')) {
      return str.split(',').map(item => item.trim());
    }
    
    // Single value
    return [str];
  } catch (error) {
    console.error("Error parsing variant list string:", error);
    // Return the original string as a single element array
    return [str];
  }
};

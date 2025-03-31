
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
export const getVariantDisplayName = (key: string, value: string): string => {
  const displayKey = variantKeyDisplayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  return `${displayKey}: ${value}`;
};

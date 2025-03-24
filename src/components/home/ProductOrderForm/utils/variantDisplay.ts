
export const getVariantDisplayName = (variant: string, value?: string): string => {
  // Maps variant types to display names
  const variantDisplayMap: Record<string, string> = {
    'Taille': 'Taille',
    'Couleur': 'Couleur',
    'Format': 'Format',
    'Quantité': 'Quantité',
    'size': 'Taille',
    'color': 'Couleur',
    'format': 'Format',
    'quantity': 'Quantité',
    'bat': 'BAT',
    'poids': 'Poids',
    'echantillon': 'Échantillon',
    'types_impression': "Types d'impression",
    'type_de_materiaux': 'Type de matériaux',
    'details_impression': "Détails d'impression",
    'orientation_impression': "Orientation d'impression"
  };
  
  const displayName = variantDisplayMap[variant] || variant;
  
  // If value is provided, return "DisplayName: Value", otherwise just return DisplayName
  return value ? `${displayName}: ${value}` : displayName;
};

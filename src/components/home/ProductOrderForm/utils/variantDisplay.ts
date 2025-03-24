
export const getVariantDisplayName = (variant: string, value: string): string => {
  // Maps variant types to display names
  const variantDisplayMap: Record<string, string> = {
    'Taille': 'Taille',
    'Couleur': 'Couleur',
    'Format': 'Format',
    'Quantité': 'Quantité',
    'size': 'Taille',
    'color': 'Couleur',
    'format': 'Format',
    'quantity': 'Quantité'
  };
  
  const displayName = variantDisplayMap[variant] || variant;
  
  return `${displayName}: ${value}`;
};

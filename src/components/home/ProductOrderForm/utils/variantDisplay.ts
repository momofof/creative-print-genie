
// Display names for variant types
export const getVariantDisplayName = (variantType: string): string => {
  const displayNames: Record<string, string> = {
    "color": "Couleur",
    "size": "Taille",
    "print_design": "Type d'impression",
    "design": "Design",
    "paper_type": "Type de papier",
    "finish": "Finition",
    "printable_side": "Face à personnaliser"
  };
  
  return displayNames[variantType] || variantType;
};

// Format variant value for display
export const formatVariantValue = (variantType: string, value: string): string => {
  if (variantType === 'printable_side') {
    if (value === 'face1' || value === 'face_1') return 'Face 1 (cadre)';
    if (value === 'face2' || value === 'face_2') return 'Face 2 (roues)';
  }
  
  return value;
};

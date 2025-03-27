
export const getVariantDisplayName = (variantType: string): string => {
  const displayNames: Record<string, string> = {
    size: "Taille",
    color: "Couleur",
    format: "Format",
    quantite: "Quantité",
    poids: "Grammage",
    bat: "BAT",
    echantillon: "Échantillon",
    types_impression: "Type d'impression",
    type_de_materiaux: "Matériau",
    details_impression: "Détails d'impression",
    orientation_impression: "Orientation"
  };
  
  return displayNames[variantType] || variantType;
};

export const getVariantValueDisplayName = (variantType: string, value: string): string => {
  // Pour certains types de variantes, on peut avoir besoin de transformer les valeurs
  // Par exemple, convertir "XS" en "Extra Small" ou des codes en noms plus lisibles
  
  // Pour l'instant, retourner simplement la valeur telle quelle
  return value;
};

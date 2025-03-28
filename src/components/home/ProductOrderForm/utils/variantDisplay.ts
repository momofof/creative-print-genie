
export const getVariantDisplayName = (variant: string, value?: string): string => {
  // Maps variant types to display names
  const variantDisplayMap: Record<string, string> = {
    // Noms français
    'Taille': 'Taille',
    'Couleur': 'Couleur',
    'Format': 'Format',
    'Quantité': 'Quantité',
    'BAT': 'BAT',
    'Poids': 'Poids',
    'Échantillon': 'Échantillon',
    'Types d\'impression': 'Types d\'impression',
    'Type de matériaux': 'Type de matériaux',
    'Détails d\'impression': 'Détails d\'impression',
    'Orientation d\'impression': 'Orientation d\'impression',
    
    // Clés en anglais/base de données
    'size': 'Taille',
    'color': 'Couleur',
    'format': 'Format',
    'quantity': 'Quantité',
    'quantite': 'Quantité',
    'bat': 'BAT',
    'poids': 'Poids',
    'echantillon': 'Échantillon',
    'types_impression': 'Types d\'impression',
    'type_de_materiaux': 'Type de matériaux',
    'details_impression': 'Détails d\'impression',
    'orientation_impression': 'Orientation d\'impression'
  };
  
  const displayName = variantDisplayMap[variant] || variant;
  
  // If value is provided, return "DisplayName: Value", otherwise just return DisplayName
  return value ? `${displayName}: ${value}` : displayName;
};

// Convertit une chaîne texte de format liste "[valeur1, valeur2, ...]" en tableau JavaScript
export const parseVariantListString = (listString?: string | null): string[] => {
  if (!listString) return [];
  
  // Si c'est déjà un tableau, on le retourne directement
  if (Array.isArray(listString)) return listString;
  
  try {
    // Vérifie si c'est une chaîne au format "[valeur1, valeur2, ...]"
    if (typeof listString === 'string' && listString.trim().startsWith('[') && listString.trim().endsWith(']')) {
      // Enlève les crochets et divise la chaîne en tableau
      const content = listString.trim().slice(1, -1);
      if (!content.trim()) return []; // Cas de "[]" (liste vide)
      
      // Divise la chaîne en éléments, en gérant correctement les guillemets et les espaces
      return content.split(',')
        .map(item => item.trim())
        .map(item => {
          // Retire les guillemets si présents
          if ((item.startsWith('"') && item.endsWith('"')) || 
              (item.startsWith("'") && item.endsWith("'"))) {
            return item.slice(1, -1);
          }
          return item;
        })
        .filter(Boolean); // Filtre les valeurs vides
    }
    
    // Si ce n'est pas une chaîne au format liste, on retourne la valeur dans un tableau
    return [listString];
  } catch (e) {
    console.error("Erreur lors du parsing de la liste de variantes:", e);
    return [];
  }
};

// Convertit un tableau JavaScript en chaîne texte de format liste "[valeur1, valeur2, ...]"
export const stringifyVariantList = (values: string[]): string => {
  if (!Array.isArray(values) || values.length === 0) return '[]';
  return `[${values.map(v => `${v}`).join(', ')}]`;
};


export const useVariantParser = () => {
  const parseVariantsFromJson = (jsonVariants: any): any[] => {
    if (!jsonVariants) return [];
    
    if (Array.isArray(jsonVariants)) {
      return jsonVariants;
    } else if (typeof jsonVariants === 'object') {
      return Object.values(jsonVariants);
    }
    
    try {
      if (typeof jsonVariants === 'string') {
        const parsed = JSON.parse(jsonVariants);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return Object.values(parsed);
      }
    } catch (e) {
      console.error("Error parsing variants JSON:", e);
    }
    
    return [];
  };

  /**
   * Analyse une chaîne contenant des options de variantes et retourne un tableau
   * Format accepté: 
   * - valeur1, valeur2, valeur3
   * - [valeur1, valeur2, valeur3]
   * - valeur unique (retourne un tableau avec un seul élément)
   */
  const parseSimpleArrayString = (input: string | null | undefined): string[] => {
    if (!input) return [];
    
    console.log("Parsing variant string:", input);
    
    // Nettoyer l'entrée de base
    let cleanInput = input.trim();
    
    // Si le format ressemble à [valeur1, valeur2, ...] - retirer les crochets
    if (cleanInput.startsWith('[') && cleanInput.endsWith(']')) {
      cleanInput = cleanInput.substring(1, cleanInput.length - 1);
      console.log("After bracket removal:", cleanInput);
    }
    
    // Diviser par virgules et nettoyer chaque valeur
    const result = cleanInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0); // Ignorer les valeurs vides
    
    console.log("Final parsed array:", result);
    return result;
  };

  /**
   * Convertit un tableau en une chaîne de format visuel simple
   * Exemple: [Rouge, Bleu, Vert]
   */
  const arrayToSimpleString = (array: string[] | null | undefined): string => {
    if (!array || !Array.isArray(array) || array.length === 0) return '';
    
    // Format visuel avec crochets
    return `[${array.join(', ')}]`;
  };

  return { parseVariantsFromJson, parseSimpleArrayString, arrayToSimpleString };
};

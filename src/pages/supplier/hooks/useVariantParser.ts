
export const useVariantParser = () => {
  /**
   * Parse les variantes à partir d'un JSON ou d'un objet
   * et retourne un tableau de valeurs
   */
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
      // Si l'analyse JSON échoue, essayons le format de chaîne simple
      return parseSimpleArrayString(jsonVariants);
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
    
    // Si l'entrée est déjà un tableau, on le renvoie tel quel
    if (Array.isArray(input)) {
      return input.map(item => item.toString().trim()).filter(Boolean);
    }
    
    // Nettoyer l'entrée de base
    let cleanInput = input.trim();
    
    // Si le format ressemble à [valeur1, valeur2, ...] - retirer les crochets
    if (cleanInput.startsWith('[') && cleanInput.endsWith(']')) {
      cleanInput = cleanInput.substring(1, cleanInput.length - 1);
    }
    
    // Diviser par virgules et nettoyer chaque valeur
    const result = cleanInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0); // Ignorer les valeurs vides
    
    console.log("parseSimpleArrayString input:", input, "result:", result);
    
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

  /**
   * Vérifie si une chaîne est au format [valeur1, valeur2, valeur3]
   * et la convertit en tableau si c'est le cas
   */
  const ensureArrayFormat = (value: string | string[] | null | undefined): string[] => {
    if (!value) return [];
    
    if (Array.isArray(value)) {
      return value.map(item => item.toString().trim()).filter(Boolean);
    }
    
    return parseSimpleArrayString(value);
  };
  
  /**
   * Standardise toutes les entrées en format de tableau
   * Accepte n'importe quel format (chaîne, tableau, objet) et retourne un tableau propre
   */
  const standardizeToArray = (input: any): string[] => {
    if (!input) return [];
    
    // Si c'est déjà un tableau
    if (Array.isArray(input)) {
      return input.map(item => item.toString().trim()).filter(Boolean);
    }
    
    // Si c'est une chaîne
    if (typeof input === 'string') {
      // Ajout de logs pour le débogage
      console.log("Options sont une chaîne pour", input);
      return parseSimpleArrayString(input);
    }
    
    // Si c'est un objet
    if (typeof input === 'object') {
      try {
        return Object.values(input).map(item => item.toString().trim()).filter(Boolean);
      } catch (e) {
        console.error("Error converting object to array:", e);
        return [];
      }
    }
    
    // Cas par défaut: convertir en chaîne puis analyser
    return parseSimpleArrayString(String(input));
  };

  return { 
    parseVariantsFromJson, 
    parseSimpleArrayString, 
    arrayToSimpleString,
    ensureArrayFormat,
    standardizeToArray
  };
};

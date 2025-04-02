
import { ProductVariant } from "@/types/dashboard";

export const useVariantParser = () => {
  const parseVariantsFromJson = (jsonVariants: any): ProductVariant[] => {
    if (!jsonVariants) return [];
    
    if (Array.isArray(jsonVariants)) {
      return jsonVariants as ProductVariant[];
    } else if (typeof jsonVariants === 'object') {
      return Object.values(jsonVariants) as ProductVariant[];
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

  // Nouvelle fonction pour analyser les chaînes de variantes simples
  const parseSimpleArrayString = (input: string | null | undefined): string[] => {
    if (!input) return [];
    
    let cleanInput = input.trim();
    
    // Si le format ressemble à [valeur1, valeur2, ...]
    if (cleanInput.startsWith('[') && cleanInput.endsWith(']')) {
      cleanInput = cleanInput.substring(1, cleanInput.length - 1);
    }
    
    // Diviser par des virgules et nettoyer les espaces
    return cleanInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  return { parseVariantsFromJson, parseSimpleArrayString };
};

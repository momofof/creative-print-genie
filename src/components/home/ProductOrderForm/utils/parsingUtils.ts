
import { Product } from "@/types/product";
import { parseVariantListString } from "./variantDisplay";

// Re-exporting necessary functions for compatibility
export { getAvailableVariants } from './configs/availableVariants';
export { getVariantOptions } from './configs/variantOptions';
export { getQuantityOptions } from './configs/quantityOptions';

// Helper function to handle variant fields that might have different formats
const processVariantField = (value: any): string[] => {
  if (!value) return [];
  
  // If it's already an array, return it
  if (Array.isArray(value)) return value.map(item => String(item));
  
  // Handle the special object format from the database
  if (typeof value === 'object' && value !== null) {
    // Handle the case with _type and value properties
    if (value._type === 'undefined' && value.value === 'undefined') {
      return [];
    }
    // Try to convert to string first for any object
    try {
      const stringValue = JSON.stringify(value);
      return parseVariantListString(stringValue);
    } catch (e) {
      return [];
    }
  }
  
  // For string values, use the parseVariantListString function
  if (typeof value === 'string') {
    return parseVariantListString(value);
  }
  
  // For numbers, convert to string
  if (typeof value === 'number') {
    return [String(value)];
  }
  
  // For anything else, return empty array
  return [];
};

// Extract variant options from product data
export const extractVariantOptionsFromProduct = async (product: Product): Promise<Record<string, string[] | number[]>> => {
  const result: Record<string, string[] | number[]> = {};
  
  // Champs de variantes disponibles dans le produit
  const variantFields = [
    "size", "color", "format", "quantite", "bat", "poids",
    "echantillon", "types_impression", "type_de_materiaux",
    "details_impression", "orientation_impression"
  ];
  
  // Process fields from the main product object
  variantFields.forEach(field => {
    const fieldValue = (product as any)[field];
    if (fieldValue) {
      // Si le champ est "quantite" et c'est un nombre ou un tableau de nombres, le traiter différemment
      if (field === "quantite" && (typeof fieldValue === 'number' || (Array.isArray(fieldValue) && typeof fieldValue[0] === 'number'))) {
        if (Array.isArray(fieldValue)) {
          result[field] = fieldValue;
        } else {
          result[field] = [fieldValue];
        }
      } else {
        // Convertir la valeur en tableau de strings
        const parsedValues = processVariantField(fieldValue);
        if (parsedValues.length > 0) {
          result[field] = parsedValues;
        }
      }
    }
  });
  
  // Process fields from the variants array
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      variantFields.forEach(field => {
        const variantValue = (variant as any)[field];
        if (variantValue) {
          // Si le champ est "quantite" et c'est un nombre, le traiter différemment
          if (field === "quantite" && (typeof variantValue === 'number' || (Array.isArray(variantValue) && typeof variantValue[0] === 'number'))) {
            if (!result[field]) {
              result[field] = Array.isArray(variantValue) ? variantValue : [variantValue];
            } else {
              // Ajouter les valeurs uniques
              const existingValues = result[field] as number[];
              const newValues = Array.isArray(variantValue) ? variantValue : [variantValue];
              result[field] = Array.from(new Set([...existingValues, ...newValues]));
            }
          } else {
            // Convertir la valeur en tableau
            const parsedValues = processVariantField(variantValue);
            if (parsedValues.length > 0) {
              // Ajouter les valeurs uniques au résultat
              if (!result[field]) {
                result[field] = parsedValues;
              } else {
                // Convertir toutes les valeurs en chaînes pour la déduplication
                const existingValues = (result[field] as string[]).map(String);
                const stringValues = parsedValues.map(String);
                result[field] = Array.from(new Set([...existingValues, ...stringValues]));
              }
            }
          }
        }
      });
    });
  }
  
  console.log("Extracted product variant options:", result);
  return result;
};


import { Product } from "@/types/product";

export const parseVariants = (variants: Record<string, string>): string => {
  return Object.entries(variants)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
};

export const extractVariantFields = (
  product: Product,
  prefix: string = ""
): Record<string, string> => {
  const result: Record<string, string> = {};
  
  if (!product) return result;
  
  // Extract fields that might be variant-related
  const variantFields = [
    "color", "size", "format", "quantite", "bat", "poids",
    "echantillon", "types_impression", "type_de_materiaux",
    "details_impression", "orientation_impression"
  ];
  
  variantFields.forEach(field => {
    const fieldName = prefix ? `${prefix}_${field}` : field;
    const value = (product as any)[field];
    if (value) {
      result[fieldName] = value;
    }
  });
  
  return result;
};

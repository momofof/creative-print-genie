
import { Product } from "@/types/product";
import { ProductVariant } from "@/pages/supplier/hooks/types/productTypes";

export const getAvailableVariants = (product: Product | undefined): Record<string, string[]> => {
  const variants: Record<string, string[]> = {};
  
  if (!product) return variants;
  
  // Extract variant fields from the product
  const variantFields = extractVariantOptionsFromProduct(product);
  
  // Process each variant field
  Object.entries(variantFields).forEach(([field, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      variants[field] = values;
    }
  });
  
  return variants;
};

export const getQuantityOptions = (max: number = 10): number[] => {
  return Array.from({ length: max }, (_, i) => i + 1);
};

export const extractVariantOptionsFromProduct = (product: Product | undefined): Record<string, string[]> => {
  if (!product) return {};
  
  const options: Record<string, string[]> = {};
  
  // Fields to extract from the product object
  const fieldsToExtract = [
    { key: "size", label: "Taille" },
    { key: "color", label: "Couleur" },
    { key: "format", label: "Format" },
    { key: "quantite", label: "Quantité" }
  ];
  
  // For each field, try to extract values from the product
  fieldsToExtract.forEach(field => {
    if ((product as any)[field.key]) {
      options[field.label] = [(product as any)[field.key]];
    }
  });
  
  return options;
};

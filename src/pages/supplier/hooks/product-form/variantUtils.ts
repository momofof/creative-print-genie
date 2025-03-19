import { ProductVariant } from "./types";

export const addVariant = (variants: ProductVariant[]): ProductVariant[] => {
  const newVariant: ProductVariant = {
    size: "M",
    color: "Noir",
    hex_color: "#000000",
    stock: 10,
    price_adjustment: null,
    status: "in_stock",
    printable_sides: [],
    isNew: true
  };
  
  return [...variants, newVariant];
};

export const removeVariant = (variants: ProductVariant[], index: number): ProductVariant[] => {
  // If the variant has an ID (exists in the database), mark it as deleted
  if (variants[index].id) {
    return variants.map((variant, i) => 
      i === index ? { ...variant, isDeleted: true } : variant
    );
  }
  
  // Otherwise, remove it from the array
  return variants.filter((_, i) => i !== index);
};

export const updateVariant = (
  variants: ProductVariant[], 
  index: number, 
  field: keyof ProductVariant, 
  value: string | number | string[]
): ProductVariant[] => {
  return variants.map((variant, i) => {
    if (i === index) {
      return { ...variant, [field]: value };
    }
    return variant;
  });
};

import { ProductVariant } from './types';

export const parseVariantsFromJson = (jsonVariants: any): ProductVariant[] => {
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

export const addVariant = (variants: ProductVariant[]): ProductVariant[] => {
  return [
    ...variants,
    {
      size: "M",
      color: "Noir",
      hex_color: "#000000",
      stock: 0,
      price_adjustment: 0,
      status: "in_stock",
      isNew: true
    }
  ];
};

export const removeVariant = (variants: ProductVariant[], index: number): ProductVariant[] => {
  const updated = [...variants];
  
  // If it's an existing variant from the database, mark it for deletion
  if (updated[index].id) {
    updated[index] = {
      ...updated[index],
      isDeleted: true
    };
    return updated;
  }
  
  // Otherwise just remove it from the array
  updated.splice(index, 1);
  return updated;
};

export const updateVariant = (
  variants: ProductVariant[], 
  index: number, 
  field: keyof ProductVariant, 
  value: string | number
): ProductVariant[] => {
  const updated = [...variants];
  updated[index] = {
    ...updated[index],
    [field]: field === "stock" || field === "price_adjustment" 
      ? parseFloat(value as string) || 0 
      : value
  };
  return updated;
};

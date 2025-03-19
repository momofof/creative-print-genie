import { useState } from "react";

export interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment: number | null;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  isNew?: boolean;
  isDeleted?: boolean;
}

export const useProductVariants = (initialVariants: ProductVariant[] = []) => {
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  
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

  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        size: "M",
        color: "Noir",
        hex_color: "#000000",
        stock: 0,
        price_adjustment: 0,
        status: "in_stock",
        isNew: true
      }
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => {
      const updated = [...prev];
      
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
    });
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "stock" || field === "price_adjustment" 
          ? parseFloat(value as string) || 0 
          : value
      };
      return updated;
    });
  };
  
  return {
    variants,
    setVariants,
    parseVariantsFromJson,
    addVariant,
    removeVariant,
    handleVariantChange
  };
};

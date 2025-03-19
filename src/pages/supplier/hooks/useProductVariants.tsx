import { useState } from "react";
import { ProductVariant } from "./types";

export const useProductVariants = (initialVariants: ProductVariant[] = []) => {
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);

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
    addVariant,
    removeVariant,
    handleVariantChange
  };
};

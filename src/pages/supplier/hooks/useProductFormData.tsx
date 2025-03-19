
import { useState } from "react";

export interface ProductData {
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  description: string | null;
  image: string | null;
  status: 'draft' | 'published' | 'archived';
  is_customizable: boolean;
}

export const useProductFormData = (initialData?: Partial<ProductData>) => {
  const [productData, setProductData] = useState<ProductData>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    original_price: initialData?.original_price || null,
    category: initialData?.category || "",
    subcategory: initialData?.subcategory || null,
    description: initialData?.description || null,
    image: initialData?.image || null,
    status: initialData?.status || "draft",
    is_customizable: initialData?.is_customizable || false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setProductData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setProductData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return {
    productData,
    setProductData,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange
  };
};

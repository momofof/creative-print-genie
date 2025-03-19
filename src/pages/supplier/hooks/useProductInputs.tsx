
import { useState } from "react";
import { ProductData } from "./types";

export const useProductInputs = (initialData: ProductData) => {
  const [productData, setProductData] = useState<ProductData>(initialData);

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

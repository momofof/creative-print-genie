
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface ProductFormProps {
  // This component is no longer used directly, but kept as a placeholder
  // in case there are references to it elsewhere in the codebase
  products: Product[];
  selectedProduct: Product | undefined;
  setSelectedProduct: (product: Product | undefined) => void;
  selectedQuantity: number | null;
  setSelectedQuantity: (quantity: number | null) => void;
  variants: Record<string, string>;
  setVariants: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  availableVariants: string[];
  setAvailableVariants: React.Dispatch<React.SetStateAction<string[]>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  editMode?: boolean;
  productSelectionDisabled?: boolean;
}

const ProductForm = (props: ProductFormProps) => {
  console.warn("ProductForm component is deprecated. Please use the multi-step form components instead.");
  
  return <div className="text-center py-4">This component has been replaced by the multi-step form.</div>;
};

export default ProductForm;

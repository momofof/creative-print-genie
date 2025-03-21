
import React from "react";
import { Product } from "@/types/product";
import Step1ProductSelection from "./Step1ProductSelection";
import Step2ProductOptions from "./Step2ProductOptions";
import Step3OrderSummary from "./Step3OrderSummary";

interface StepContentProps {
  currentStep: number;
  products: Product[];
  selectedProduct: Product | undefined;
  setSelectedProduct: (product: Product | undefined) => void;
  selectedQuantity: number | null;
  setSelectedQuantity: (quantity: number | null) => void;
  variants: Record<string, string>;
  setVariants: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  availableVariants: string[];
  setAvailableVariants: React.Dispatch<React.SetStateAction<string[]>>;
  productVariantOptions: Record<string, string[]>;
  isSubmitting: boolean;
  editMode: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  onEditComplete?: (productId: string, quantity: number, variants: Record<string, string>) => void;
}

const StepContent = ({
  currentStep,
  products,
  selectedProduct,
  setSelectedProduct,
  selectedQuantity,
  setSelectedQuantity,
  variants,
  setVariants,
  availableVariants,
  setAvailableVariants,
  productVariantOptions,
  isSubmitting,
  editMode,
  handleSubmit,
  onEditComplete
}: StepContentProps) => {
  // Handle edit completion
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onEditComplete && selectedProduct && selectedQuantity) {
      onEditComplete(selectedProduct.id, selectedQuantity, variants);
    }
  };

  // Render different steps based on currentStep
  switch (currentStep) {
    case 0:
      return (
        <Step1ProductSelection
          products={products}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          productSelectionDisabled={editMode}
        />
      );
      
    case 1:
      return (
        <Step2ProductOptions
          selectedProduct={selectedProduct}
          selectedQuantity={selectedQuantity}
          setSelectedQuantity={setSelectedQuantity}
          variants={variants}
          setVariants={setVariants}
          availableVariants={availableVariants}
          setAvailableVariants={setAvailableVariants}
          productVariantOptions={productVariantOptions}
        />
      );
      
    case 2:
      return (
        <Step3OrderSummary
          selectedProduct={selectedProduct}
          selectedQuantity={selectedQuantity}
          variants={variants}
          isSubmitting={isSubmitting}
          editMode={editMode}
          handleSubmit={editMode ? handleUpdateProduct : handleSubmit}
        />
      );
      
    default:
      return null;
  }
};

export default StepContent;

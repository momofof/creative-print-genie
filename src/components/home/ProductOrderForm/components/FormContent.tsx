
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Product } from "@/types/product";
import ProductIllustration from "../ProductIllustration";
import Step1ProductSelection from "./Step1ProductSelection";
import Step2ProductOptions from "./Step2ProductOptions";
import Step3OrderSummary from "./Step3OrderSummary";
import StepButtons from "./StepButtons";

interface FormContentProps {
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
  openIllustration: boolean;
  setOpenIllustration: (open: boolean) => void;
  editMode: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onEditComplete?: (productId: string, quantity: number, variants: Record<string, string>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  disableNextSteps: () => boolean;
}

const FormContent = ({
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
  openIllustration,
  setOpenIllustration,
  editMode,
  handleSubmit,
  isSubmitting,
  onEditComplete,
  goToNextStep,
  goToPreviousStep,
  disableNextSteps
}: FormContentProps) => {
  const isMobile = useIsMobile();
  
  // Handle edit completion
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onEditComplete && selectedProduct && selectedQuantity) {
      onEditComplete(selectedProduct.id, selectedQuantity, variants);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      {/* Form Content Column */}
      <div>
        {/* Step 1: Product Selection */}
        {currentStep === 0 && (
          <Step1ProductSelection
            products={products}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            productSelectionDisabled={editMode}
          />
        )}
        
        {/* Step 2: Options and Variants */}
        {currentStep === 1 && (
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
        )}
        
        {/* Step 3: Order Summary */}
        {currentStep === 2 && (
          <Step3OrderSummary
            selectedProduct={selectedProduct}
            selectedQuantity={selectedQuantity}
            variants={variants}
            isSubmitting={isSubmitting}
            editMode={editMode}
            handleSubmit={editMode ? handleUpdateProduct : handleSubmit}
          />
        )}
        
        {/* Step navigation buttons */}
        <StepButtons
          currentStep={currentStep}
          goToPreviousStep={goToPreviousStep}
          goToNextStep={goToNextStep}
          disableNext={disableNextSteps()}
        />
      </div>

      {/* Illustration Column - Hidden on mobile, replaced with sheet/drawer */}
      {!isMobile && (
        <ProductIllustration
          selectedProduct={selectedProduct}
          variants={variants}
          openIllustration={openIllustration}
          setOpenIllustration={setOpenIllustration}
        />
      )}
    </div>
  );
};

export default FormContent;

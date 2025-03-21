
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import OrderFormHeader from "./OrderFormHeader";
import StepNavigation from "./StepNavigation";
import MobilePreviewContainer from "./MobilePreviewContainer";
import { Product } from "@/types/product";

interface FormHeaderProps {
  editMode: boolean;
  currentStep: number;
  onStepChange: (step: number) => void;
  disableNextSteps: boolean;
  selectedProduct: Product | undefined;
  variants: Record<string, string>;
  onShowPreview: () => void;
}

const FormHeader = ({
  editMode,
  currentStep,
  onStepChange,
  disableNextSteps,
  selectedProduct,
  variants,
  onShowPreview
}: FormHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative">
      <OrderFormHeader editMode={editMode} />
      
      {/* Mobile preview illustration - Positioned inside the form below the title */}
      {isMobile && selectedProduct && (
        <MobilePreviewContainer 
          selectedProduct={selectedProduct} 
          variants={variants}
          onShowPreview={onShowPreview}
        />
      )}
      
      {/* Multi-step navigation */}
      <StepNavigation 
        currentStep={currentStep} 
        onStepChange={onStepChange}
        disableNextSteps={disableNextSteps}
      />
    </div>
  );
};

export default FormHeader;

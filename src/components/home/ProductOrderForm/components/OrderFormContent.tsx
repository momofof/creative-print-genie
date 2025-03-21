import { useState } from "react";
import { Product, CartItem } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";

// Import components
import MobilePreviewContainer from "./MobilePreviewContainer";
import OrderSummaryHandler from "./OrderSummaryHandler";
import StepNavigation from "./StepNavigation";
import Step1ProductSelection from "./Step1ProductSelection";
import Step2ProductOptions from "./Step2ProductOptions";
import Step3OrderSummary from "./Step3OrderSummary";
import ProductIllustration from "../ProductIllustration";
import OrderFormHeader from "./OrderFormHeader";

interface OrderFormContentProps {
  products: Product[];
  editMode: boolean;
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
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onEditComplete?: (productId: string, quantity: number, variants: Record<string, string>) => void;
}

const OrderFormContent = ({
  products,
  editMode,
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
  handleSubmit,
  isSubmitting,
  onEditComplete
}: OrderFormContentProps) => {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderSummaryItems, setOrderSummaryItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  
  // Handle step navigation
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };
  
  // Determine if next steps should be disabled
  const disableNextSteps = () => {
    if (currentStep === 0 && !selectedProduct) return true;
    if (currentStep === 1 && (!selectedProduct || !selectedQuantity)) return true;
    return false;
  };
  
  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleShowOrderSummary = (items: CartItem[], total: number) => {
    setOrderSummaryItems(items);
    setOrderTotal(total);
    setShowOrderSummary(true);
  };
  
  // Handle edit completion
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onEditComplete && selectedProduct && selectedQuantity) {
      onEditComplete(selectedProduct.id, selectedQuantity, variants);
    }
  };

  // Show step navigation buttons
  const renderStepButtons = () => {
    return (
      <div className="flex justify-between mt-6">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={goToPreviousStep}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Précédent
          </button>
        )}
        
        {currentStep < 2 && (
          <button
            type="button"
            onClick={goToNextStep}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 ml-auto"
            disabled={
              (currentStep === 0 && !selectedProduct) ||
              (currentStep === 1 && !selectedQuantity)
            }
          >
            Suivant
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        <OrderFormHeader editMode={editMode} />
        
        {/* Mobile preview illustration - Positioned inside the form below the title */}
        {isMobile && selectedProduct && (
          <MobilePreviewContainer 
            selectedProduct={selectedProduct} 
            variants={variants}
            onShowPreview={() => setOpenIllustration(true)}
          />
        )}
        
        {/* Multi-step navigation */}
        <StepNavigation 
          currentStep={currentStep} 
          onStepChange={handleStepChange}
          disableNextSteps={disableNextSteps()}
        />
      </div>
      
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
          {renderStepButtons()}
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

      {/* Mobile illustration sheet */}
      {isMobile && (
        <ProductIllustration
          selectedProduct={selectedProduct}
          variants={variants}
          openIllustration={openIllustration}
          setOpenIllustration={setOpenIllustration}
        />
      )}
      
      {/* Order Success Dialog */}
      <OrderSummaryHandler
        showOrderSummary={showOrderSummary}
        setShowOrderSummary={setShowOrderSummary}
        orderSummaryItems={orderSummaryItems}
        orderTotal={orderTotal}
      />
    </>
  );
};

export default OrderFormContent;

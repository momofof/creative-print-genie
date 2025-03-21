
import { useIsMobile } from "@/hooks/use-mobile";
import { Product, CartItem } from "@/types/product";
import { useState, useEffect } from "react";

// Import components
import ProductIllustration from "./ProductIllustration";
import OrderFormHeader from "./components/OrderFormHeader";
import MobilePreviewContainer from "./components/MobilePreviewContainer";
import OrderSummaryHandler from "./components/OrderSummaryHandler";
import StepNavigation from "./components/StepNavigation";
import Step1ProductSelection from "./components/Step1ProductSelection";
import Step2ProductOptions from "./components/Step2ProductOptions";
import Step3OrderSummary from "./components/Step3OrderSummary";

// Import hooks and utils
import { useOrderFormState } from "./hooks/useOrderFormState";
import { useOrderSubmission } from "./hooks/useOrderSubmission";
import { extractVariantOptionsFromProduct, getAvailableVariants } from "./utils";

interface OrderFormProps {
  products: Product[];
  editMode?: boolean;
  initialProductId?: string;
  initialVariants?: Record<string, string>;
  initialQuantity?: number;
  onEditComplete?: (productId: string, quantity: number, variants: Record<string, string>) => void;
}

const OrderForm = ({ 
  products, 
  editMode = false, 
  initialProductId, 
  initialVariants = {}, 
  initialQuantity,
  onEditComplete 
}: OrderFormProps) => {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderSummaryItems, setOrderSummaryItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [productVariantOptions, setProductVariantOptions] = useState<Record<string, string[]>>({});
  
  // Use custom hook for form state
  const {
    selectedProduct,
    setSelectedProduct,
    selectedQuantity,
    setSelectedQuantity,
    variants,
    setVariants,
    availableVariants,
    setAvailableVariants,
    userId,
    openIllustration,
    setOpenIllustration
  } = useOrderFormState();
  
  // Set initial values if in edit mode
  useEffect(() => {
    if (editMode && initialProductId) {
      const product = products.find(p => p.id === initialProductId);
      if (product) {
        setSelectedProduct(product);
        if (initialQuantity) setSelectedQuantity(initialQuantity);
        if (initialVariants) setVariants({...initialVariants});
        
        // Set available variants based on the product
        const productVariants = getAvailableVariants(product.subcategory || product.category);
        setAvailableVariants(productVariants);
      }
    }
  }, [editMode, initialProductId, initialQuantity, initialVariants, products, setSelectedProduct, setSelectedQuantity, setVariants, setAvailableVariants]);
  
  // Update available variants when product changes
  useEffect(() => {
    if (selectedProduct) {
      // Set available variants based on product category
      const productVariants = getAvailableVariants(selectedProduct.subcategory || selectedProduct.category);
      setAvailableVariants(productVariants);
      
      // Extract variant options from product data if available
      const productOptions = extractVariantOptionsFromProduct(selectedProduct);
      setProductVariantOptions(productOptions);
    }
  }, [selectedProduct, setAvailableVariants]);
  
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
  
  // Use custom hook for order submission
  const { handleSubmit, isSubmitting } = useOrderSubmission({
    selectedProduct,
    selectedQuantity,
    variants,
    userId,
    onOrderSuccess: () => {
      // Reset form
      setSelectedProduct(undefined);
      setSelectedQuantity(null);
      setVariants({});
      setCurrentStep(0);
    },
    onShowOrderSummary: handleShowOrderSummary
  });
  
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
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-4xl mx-auto my-6 md:my-10">
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
    </div>
  );
};

export default OrderForm;


import { useState } from "react";
import { Product, CartItem } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";

// Import components
import FormHeader from "./FormHeader";
import FormContent from "./FormContent";
import OrderSummaryHandler from "./OrderSummaryHandler";
import ProductIllustration from "../ProductIllustration";

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

  return (
    <>
      {/* Header and step navigation */}
      <FormHeader 
        editMode={editMode}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        disableNextSteps={disableNextSteps()}
        selectedProduct={selectedProduct}
        variants={variants}
        onShowPreview={() => setOpenIllustration(true)}
      />
      
      {/* Form content and product illustration */}
      <FormContent 
        currentStep={currentStep}
        products={products}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        variants={variants}
        setVariants={setVariants}
        availableVariants={availableVariants}
        setAvailableVariants={setAvailableVariants}
        productVariantOptions={productVariantOptions}
        openIllustration={openIllustration}
        setOpenIllustration={setOpenIllustration}
        editMode={editMode}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onEditComplete={onEditComplete}
        goToNextStep={goToNextStep}
        goToPreviousStep={goToPreviousStep}
        disableNextSteps={disableNextSteps}
      />

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

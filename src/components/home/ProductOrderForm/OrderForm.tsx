
import { useIsMobile } from "@/hooks/use-mobile";
import { Product, CartItem } from "@/types/product";
import { useState, useEffect } from "react";

// Import components
import ProductIllustration from "./ProductIllustration";
import ProductForm from "./components/ProductForm";
import OrderFormHeader from "./components/OrderFormHeader";
import MobilePreviewContainer from "./components/MobilePreviewContainer";
import OrderSummaryHandler from "./components/OrderSummaryHandler";

// Import hooks
import { useOrderFormState } from "./hooks/useOrderFormState";
import { useOrderSubmission } from "./hooks/useOrderSubmission";

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
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderSummaryItems, setOrderSummaryItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  
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
      }
    }
  }, [editMode, initialProductId, initialQuantity, initialVariants, products, setSelectedProduct, setSelectedQuantity, setVariants]);
  
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Product Form Column */}
        <div>
          <ProductForm
            products={products}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedQuantity={selectedQuantity}
            setSelectedQuantity={setSelectedQuantity}
            variants={variants}
            setVariants={setVariants}
            availableVariants={availableVariants}
            setAvailableVariants={setAvailableVariants}
            handleSubmit={editMode ? handleUpdateProduct : handleSubmit}
            isSubmitting={isSubmitting}
            editMode={editMode}
            productSelectionDisabled={editMode}
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

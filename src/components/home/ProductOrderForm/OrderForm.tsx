
import { useIsMobile } from "@/hooks/use-mobile";
import { Product, CartItem } from "@/types/product";
import { useState } from "react";

// Import components
import ProductIllustration from "./ProductIllustration";
import ProductForm from "./components/ProductForm";
import MobilePreview from "./components/MobilePreview";
import OrderSuccessDialog from "../../cart/OrderSuccessDialog";

// Import hooks
import { useOrderFormState } from "./hooks/useOrderFormState";
import { useOrderSubmission } from "./hooks/useOrderSubmission";

interface OrderFormProps {
  products: Product[];
}

const OrderForm = ({ products }: OrderFormProps) => {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-4xl mx-auto my-6 md:my-10">
      <div className="relative">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Commander vos produits</h2>
        
        {/* Mobile preview illustration - Positioned inside the form below the title */}
        {isMobile && selectedProduct && Object.keys(variants).length > 0 && (
          <div className="mb-6">
            <MobilePreview selectedProduct={selectedProduct} variants={variants} />
          </div>
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
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Illustration Column - Hidden on mobile, replaced with sheet/drawer */}
        {isMobile ? (
          <div className="md:hidden">
            <button
              className="w-full mt-4 py-2.5 px-4 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium flex items-center justify-center"
              onClick={() => setOpenIllustration(true)}
            >
              <span>Voir l'aperçu du produit</span>
            </button>
          </div>
        ) : (
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
      <OrderSuccessDialog
        open={showOrderSummary}
        onOpenChange={setShowOrderSummary}
        cartItems={orderSummaryItems}
        totalPrice={orderTotal}
      />
    </div>
  );
};

export default OrderForm;

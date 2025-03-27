
import { useIsMobile } from "@/hooks/use-mobile";
import { Product, CartItem } from "@/types/product";
import { useState, useEffect } from "react";

import ProductIllustration from "./ProductIllustration";
import ProductForm from "./components/ProductForm";
import OrderFormHeader from "./components/OrderFormHeader";
import MobilePreviewContainer from "./components/MobilePreviewContainer";
import OrderSummaryHandler from "./components/OrderSummaryHandler";
import SupplierSelector from "./components/SupplierSelector";
import ProductFormSubmitButton from "./components/ProductFormSubmitButton";

import { useOrderFormState } from "./hooks/useOrderFormState";
import { useOrderSubmission } from "./hooks/useOrderSubmission";

interface OrderFormProps {
  products: Product[];
  editMode?: boolean;
  initialProductId?: string;
  initialVariants?: Record<string, string>;
  initialQuantity?: number;
  onEditComplete?: (productId: string, quantity: number, variants: Record<string, string>) => void;
  onProductSelect?: (productId: string | undefined) => void;
}

const OrderForm = ({ 
  products, 
  editMode = false, 
  initialProductId, 
  initialVariants = {}, 
  initialQuantity,
  onEditComplete,
  onProductSelect
}: OrderFormProps) => {
  const isMobile = useIsMobile();
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderSummaryItems, setOrderSummaryItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  
  const {
    selectedProduct,
    setSelectedProduct,
    selectedQuantity,
    setSelectedQuantity,
    variants,
    setVariants,
    availableVariants,
    setAvailableVariants,
    selectedSupplierId,
    setSelectedSupplierId,
    userId,
    openIllustration,
    setOpenIllustration
  } = useOrderFormState();
  
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
  
  useEffect(() => {
    if (onProductSelect && selectedProduct) {
      onProductSelect(selectedProduct.id);
    } else if (onProductSelect && !selectedProduct) {
      onProductSelect(undefined);
    }
  }, [selectedProduct, onProductSelect]);
  
  // Set supplier ID when product is selected and it has a supplier_id
  useEffect(() => {
    if (selectedProduct?.supplier_id && !selectedSupplierId) {
      setSelectedSupplierId(selectedProduct.supplier_id);
    }
  }, [selectedProduct, selectedSupplierId, setSelectedSupplierId]);
  
  const handleShowOrderSummary = (items: CartItem[], total: number) => {
    setOrderSummaryItems(items);
    setOrderTotal(total);
    setShowOrderSummary(true);
  };
  
  const { handleSubmit, isSubmitting } = useOrderSubmission({
    selectedProduct,
    selectedQuantity,
    variants,
    userId,
    selectedSupplierId,
    onOrderSuccess: () => {
      setSelectedProduct(undefined);
      setSelectedQuantity(null);
      setVariants({});
      setSelectedSupplierId(null);
    },
    onShowOrderSummary: handleShowOrderSummary
  });
  
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onEditComplete && selectedProduct && selectedQuantity) {
      onEditComplete(selectedProduct.id, selectedQuantity, variants);
    }
  };

  const handleProductSelect = (product: Product | undefined) => {
    setSelectedProduct(product);
    
    if (onProductSelect && product) {
      onProductSelect(product.id);
    } else if (onProductSelect && !product) {
      onProductSelect(undefined);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-4xl mx-auto my-6 md:my-10">
      <div className="relative">
        <OrderFormHeader editMode={editMode} />
        
        {isMobile && selectedProduct && (
          <MobilePreviewContainer 
            selectedProduct={selectedProduct} 
            variants={variants}
            onShowPreview={() => setOpenIllustration(true)}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div>
          <ProductForm
            products={products}
            selectedProduct={selectedProduct}
            setSelectedProduct={handleProductSelect}
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
          
          {selectedProduct && (
            <>
              <SupplierSelector 
                productId={selectedProduct.id}
                onSupplierSelect={setSelectedSupplierId}
                initialSupplierId={selectedProduct.supplier_id}
              />
              
              <div className="mt-6">
                <ProductFormSubmitButton
                  isSubmitting={isSubmitting}
                  disabled={!selectedProduct || !selectedQuantity || !selectedSupplierId}
                  editMode={editMode}
                />
              </div>
            </>
          )}
        </div>

        {!isMobile && (
          <ProductIllustration
            selectedProduct={selectedProduct}
            variants={variants}
            openIllustration={openIllustration}
            setOpenIllustration={setOpenIllustration}
          />
        )}
      </div>

      {isMobile && (
        <ProductIllustration
          selectedProduct={selectedProduct}
          variants={variants}
          openIllustration={openIllustration}
          setOpenIllustration={setOpenIllustration}
        />
      )}
      
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

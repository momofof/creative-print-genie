
import { useEffect, useState } from "react";
import { Product, CartItem } from "@/types/product";

// Import components
import OrderFormContent from "./components/OrderFormContent";

// Import hooks and utils
import { useOrderFormState } from "./hooks/useOrderFormState";
import { useOrderSubmission } from "./hooks/useOrderSubmission";
import { extractVariantOptionsFromProduct, getAvailableVariants } from "./utils";

interface OrderFormContainerProps {
  products: Product[];
  editMode?: boolean;
  initialProductId?: string;
  initialVariants?: Record<string, string>;
  initialQuantity?: number;
  onEditComplete?: (productId: string, quantity: number, variants: Record<string, string>) => void;
}

const OrderFormContainer = ({
  products,
  editMode = false,
  initialProductId,
  initialVariants = {},
  initialQuantity,
  onEditComplete
}: OrderFormContainerProps) => {
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
    onShowOrderSummary: (items: CartItem[], total: number) => {
      // This will be passed to the OrderFormContent component
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-4xl mx-auto my-6 md:my-10">
      <OrderFormContent
        products={products}
        editMode={editMode}
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
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onEditComplete={onEditComplete}
      />
    </div>
  );
};

export default OrderFormContainer;

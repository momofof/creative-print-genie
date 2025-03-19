
import { useIsMobile } from "@/hooks/use-mobile";

// Import components
import ProductIllustration from "./ProductIllustration";
import ProductForm from "./components/ProductForm";
import MobilePreview from "./components/MobilePreview";

// Import hooks
import { useOrderFormState } from "./hooks/useOrderFormState";
import { useOrderSubmission } from "./hooks/useOrderSubmission";

const OrderForm = () => {
  const isMobile = useIsMobile();
  
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
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-4xl mx-auto my-6 md:my-10">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Commander vos produits</h2>
      
      {/* Mobile preview illustration */}
      {isMobile && selectedProduct && Object.keys(variants).length > 0 && (
        <MobilePreview selectedProduct={selectedProduct} variants={variants} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Product Form Column */}
        <div>
          <ProductForm
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
    </div>
  );
};

export default OrderForm;

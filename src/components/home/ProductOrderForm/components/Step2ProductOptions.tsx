
import { Product } from "@/types/product";
import QuantitySelector from "../QuantitySelector";
import ProductFormVariants from "./ProductFormVariants";
import { getQuantityOptions } from "../utils";

interface Step2ProductOptionsProps {
  selectedProduct: Product | undefined;
  selectedQuantity: number | null;
  setSelectedQuantity: (quantity: number | null) => void;
  variants: Record<string, string>;
  setVariants: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  availableVariants: string[];
  productVariantOptions: Record<string, string[]>;
}

const Step2ProductOptions = ({
  selectedProduct,
  selectedQuantity,
  setSelectedQuantity,
  variants,
  setVariants,
  availableVariants,
  productVariantOptions
}: Step2ProductOptionsProps) => {
  const handleVariantChange = (variantType: string, value: string) => {
    setVariants(prev => ({ ...prev, [variantType]: value }));
  };

  if (!selectedProduct) {
    return <div className="text-center py-6">Veuillez d'abord sélectionner un produit</div>;
  }

  return (
    <div className="space-y-6">
      <QuantitySelector
        quantityOptions={getQuantityOptions(selectedProduct.subcategory || selectedProduct.category)}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
      />
      
      {availableVariants.length > 0 && (
        <ProductFormVariants
          selectedProduct={selectedProduct}
          variants={variants}
          availableVariants={availableVariants}
          onVariantChange={handleVariantChange}
          productVariantOptions={productVariantOptions}
        />
      )}
    </div>
  );
};

export default Step2ProductOptions;

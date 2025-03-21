
import { Product } from "@/types/product";
import SearchableDropdown from "../SearchableDropdown";
import ProductDescription from "./ProductDescription";

interface Step1ProductSelectionProps {
  products: Product[];
  selectedProduct: Product | undefined;
  setSelectedProduct: (product: Product | undefined) => void;
  productSelectionDisabled?: boolean;
}

const Step1ProductSelection = ({
  products,
  selectedProduct,
  setSelectedProduct,
  productSelectionDisabled = false
}: Step1ProductSelectionProps) => {
  return (
    <div className="space-y-4">
      <SearchableDropdown
        label="Sélectionnez un produit"
        placeholder="Choisir un produit..."
        products={products} 
        selectedProduct={selectedProduct}
        onSelect={setSelectedProduct}
        disabled={productSelectionDisabled}
      />
      
      {selectedProduct && (
        <ProductDescription product={selectedProduct} />
      )}
    </div>
  );
};

export default Step1ProductSelection;

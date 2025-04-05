
import { Product } from "@/types/product";

interface ProductFormPriceProps {
  selectedProduct: Product;
  selectedQuantity: number | null;
}

const ProductFormPrice = ({
  selectedProduct,
  selectedQuantity
}: ProductFormPriceProps) => {
  // Calcul du prix total
  const calculateTotalPrice = () => {
    if (!selectedProduct || !selectedQuantity) return 0;
    return selectedProduct.price * selectedQuantity;
  };
  
  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex justify-between items-center">
        <span className="text-gray-700 font-medium">Prix unitaire:</span>
        <span className="font-semibold">{selectedProduct.price.toLocaleString('fr-FR')} FCFA</span>
      </div>
      
      {selectedQuantity && selectedQuantity > 0 && (
        <>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-700 font-medium">Quantité:</span>
            <span>{selectedQuantity}</span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
            <span className="text-gray-800 font-medium">Total:</span>
            <span className="text-lg font-bold text-accent">{calculateTotalPrice().toLocaleString('fr-FR')} FCFA</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductFormPrice;

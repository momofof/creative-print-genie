
import { Product } from "@/types/product";
import ProductFormPrice from "./ProductFormPrice";
import ProductFormSubmitButton from "./ProductFormSubmitButton";

interface Step3OrderSummaryProps {
  selectedProduct: Product | undefined;
  selectedQuantity: number | null;
  variants: Record<string, string>;
  isSubmitting: boolean;
  editMode?: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const Step3OrderSummary = ({
  selectedProduct,
  selectedQuantity,
  variants,
  isSubmitting,
  editMode = false,
  handleSubmit
}: Step3OrderSummaryProps) => {
  if (!selectedProduct || !selectedQuantity) {
    return <div className="text-center py-6">Veuillez d'abord compléter les étapes précédentes</div>;
  }

  // Create a list of selected options for display
  const selectedOptions = Object.entries(variants).map(([key, value]) => (
    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
      <span className="font-medium">{value}</span>
    </div>
  ));

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Récapitulatif de la commande</h3>
        
        <div className="mb-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Produit:</span>
            <span className="font-medium">{selectedProduct.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Quantité:</span>
            <span className="font-medium">{selectedQuantity}</span>
          </div>
          
          {selectedOptions}
        </div>
        
        <ProductFormPrice 
          selectedProduct={selectedProduct}
          selectedQuantity={selectedQuantity}
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <ProductFormSubmitButton
          isSubmitting={isSubmitting}
          disabled={!selectedProduct || !selectedQuantity}
          editMode={editMode}
        />
      </form>
    </div>
  );
};

export default Step3OrderSummary;

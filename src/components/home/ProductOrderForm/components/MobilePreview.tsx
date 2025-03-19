
import { Product } from "@/types/product";
import { getFeatureIllustration, getVariantDisplayName } from "../utils";

interface MobilePreviewProps {
  selectedProduct: Product;
  variants: Record<string, string>;
}

const MobilePreview = ({ selectedProduct, variants }: MobilePreviewProps) => {
  if (!selectedProduct || Object.keys(variants).length === 0) return null;
  
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg -mt-2 relative z-10">
      <div className="flex flex-col items-center">
        <img 
          src={getFeatureIllustration(selectedProduct, variants)} 
          alt="Aperçu produit" 
          className="max-h-40 object-contain mb-3" 
        />
        <div className="text-center">
          <h3 className="font-medium text-gray-800">{selectedProduct.name}</h3>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {Object.entries(variants).map(([type, value]) => (
              <span key={type} className="text-xs bg-white px-2 py-1 rounded-full border">
                {getVariantDisplayName(type)}: {value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;

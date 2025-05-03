
import { Product } from "@/types/product";
import { getFeatureIllustration, getVariantDisplayName } from "../utils";
import { Eye } from "lucide-react";

interface MobilePreviewContainerProps {
  selectedProduct: Product | undefined;
  variants: Record<string, string>;
  onShowPreview: () => void;
}

const MobilePreviewContainer = ({
  selectedProduct,
  variants,
  onShowPreview
}: MobilePreviewContainerProps) => {
  if (!selectedProduct || Object.keys(variants).length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-6">
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm relative z-10">
          <div className="flex flex-col items-center">
            <div className="h-40 flex items-center justify-center">
              <img 
                src={getFeatureIllustration(selectedProduct, variants)} 
                alt="Aperçu produit" 
                className="max-h-36 object-contain" 
              />
            </div>
            <div className="text-center mt-2">
              <h3 className="font-medium text-gray-800">{selectedProduct.name}</h3>
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {Object.entries(variants).map(([type, value]) => (
                  <div key={type} className="flex items-center text-xs bg-white px-2 py-1 rounded-full border">
                    <span>{getVariantDisplayName(type)}: {value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <button
          className="w-full mt-4 py-2.5 px-4 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium flex items-center justify-center"
          onClick={onShowPreview}
        >
          <Eye className="mr-2 h-4 w-4" />
          <span>Voir l'aperçu du produit</span>
        </button>
      </div>
    </>
  );
};

export default MobilePreviewContainer;

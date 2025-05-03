
import { Product } from "@/types/product";
import { getVariantDisplayName } from "../utils";
import ProductPreviewImage from "./ProductPreviewImage";
import VariantPreviewButtons from "./VariantPreviewButtons";
import { Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DesktopProductViewProps {
  selectedProduct?: Product;
  variants: Record<string, string>;
  activeVariant: { type: string, value: string } | null;
  setActiveVariant: (variant: { type: string, value: string } | null) => void;
}

const DesktopProductView = ({
  selectedProduct,
  variants,
  activeVariant,
  setActiveVariant
}: DesktopProductViewProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 md:p-6 flex flex-col items-center justify-center relative">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Aperçu des options</h3>
      <div className="border border-gray-200 rounded-lg w-full h-auto min-h-64 md:min-h-80 flex items-center justify-center overflow-hidden bg-white">
        {selectedProduct ? (
          <div className="flex flex-col items-center p-4 w-full">
            <div className="flex justify-center items-center w-full h-64 md:h-80">
              <ProductPreviewImage 
                selectedProduct={selectedProduct}
                variants={variants}
                activeVariant={activeVariant}
                className="max-w-full max-h-60 md:max-h-72 object-contain"
              />
            </div>
            <div className="mt-3 md:mt-4 text-center">
              <h4 className="font-medium">{selectedProduct.name}</h4>
              {activeVariant ? (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">{getVariantDisplayName(activeVariant.type)}:</span> {activeVariant.value}
                </p>
              ) : (
                <div className="text-sm text-gray-600 max-w-xs mt-2 flex flex-wrap justify-center gap-1">
                  {Object.entries(variants).map(([type, value]) => (
                    <div key={type} className="inline-block px-2 py-1 bg-gray-100 rounded-full mr-1 mb-1">
                      <span className="font-medium">{getVariantDisplayName(type)}:</span> {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <ProductPreviewImage 
            selectedProduct={selectedProduct}
            variants={variants}
            activeVariant={activeVariant}
          />
        )}
      </div>

      {/* Variant illustrations */}
      {selectedProduct && Object.keys(variants).length > 0 && (
        <div className="mt-4 w-full">
          <TooltipProvider>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(variants).map(([type, value]) => (
                <Tooltip key={`${type}-${value}`}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (activeVariant && activeVariant.type === type && activeVariant.value === value) {
                          setActiveVariant(null);
                        } else {
                          setActiveVariant({ type, value });
                        }
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                        activeVariant && activeVariant.type === type ? 'bg-accent text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span>{getVariantDisplayName(type)}: {value}</span>
                      <Eye className="ml-1 h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Voir l'aperçu de cette option
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default DesktopProductView;

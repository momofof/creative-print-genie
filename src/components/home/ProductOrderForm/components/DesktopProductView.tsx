
import { Product } from "@/types/product";
import { getVariantDisplayName } from "../utils";
import ProductPreviewImage from "./ProductPreviewImage";
import VariantPreviewButtons from "./VariantPreviewButtons";

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
      <div className="border border-gray-200 rounded-lg w-full h-64 md:h-80 flex items-center justify-center overflow-hidden bg-white">
        {selectedProduct ? (
          <div className="flex flex-col items-center p-4">
            <ProductPreviewImage 
              selectedProduct={selectedProduct}
              variants={variants}
              activeVariant={activeVariant}
            />
            <div className="mt-3 md:mt-4 text-center">
              <h4 className="font-medium">{selectedProduct.name}</h4>
              {activeVariant ? (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">{getVariantDisplayName(activeVariant.type)}:</span> {activeVariant.value}
                </p>
              ) : (
                <div className="text-sm text-gray-600 max-w-xs mt-2">
                  {Object.entries(variants).map(([type, value]) => (
                    <div key={type} className="inline-block mr-2 mb-1">
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
        <VariantPreviewButtons 
          selectedProduct={selectedProduct}
          variants={variants}
          setActiveVariant={setActiveVariant}
        />
      )}
    </div>
  );
};

export default DesktopProductView;

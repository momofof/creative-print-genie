
import { Product } from "@/types/product";
import { getVariantDisplayName, getVariantIllustration } from "../utils";
import { Eye } from "lucide-react";

interface VariantPreviewGridProps {
  selectedProduct: Product;
  variants: Record<string, string>;
  activeVariant: { type: string, value: string } | null;
  setActiveVariant: (variant: { type: string, value: string } | null) => void;
}

const VariantPreviewGrid = ({
  selectedProduct,
  variants,
  activeVariant,
  setActiveVariant
}: VariantPreviewGridProps) => {
  return (
    <div className="mt-4 border-t border-gray-200 pt-4 pb-6">
      <h4 className="font-medium text-sm mb-3 px-4">Aperçu des variantes</h4>
      <div className="px-4 grid grid-cols-2 gap-3">
        {Object.entries(variants).map(([type, value]) => (
          <button
            key={`${type}-${value}`}
            className={`bg-white rounded-lg border ${activeVariant && activeVariant.type === type ? 'border-accent ring-1 ring-accent' : 'border-gray-200'} p-2 text-left relative`}
            onClick={() => {
              if (activeVariant && activeVariant.type === type && activeVariant.value === value) {
                setActiveVariant(null);
              } else {
                setActiveVariant({ type, value });
              }
            }}
          >
            <div className="text-center">
              <div className="h-24 flex items-center justify-center">
                <img 
                  src={getVariantIllustration(selectedProduct.subcategory || selectedProduct.category, type, value)} 
                  alt={`${getVariantDisplayName(type)}: ${value}`} 
                  className="max-w-full max-h-20 object-contain" 
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs font-medium truncate">
                  {getVariantDisplayName(type)}: {value}
                </p>
                <Eye className="h-4 w-4 ml-1 text-gray-500" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariantPreviewGrid;

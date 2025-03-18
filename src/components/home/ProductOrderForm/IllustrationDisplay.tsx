
import { getVariantDisplayName } from "./utils";
import { ProductWithVariants, VariantProps } from "./types";

interface IllustrationDisplayProps {
  selectedProduct: ProductWithVariants;
  currentIllustration: string;
  activeVariant: VariantProps;
}

const IllustrationDisplay = ({ 
  selectedProduct, 
  currentIllustration, 
  activeVariant 
}: IllustrationDisplayProps) => {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden">
      <img
        src={currentIllustration}
        alt={selectedProduct.name}
        className="w-full h-64 object-contain"
      />
      {activeVariant.type && (
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
          {getVariantDisplayName(activeVariant.type)}: {activeVariant.value}
        </div>
      )}
    </div>
  );
};

export default IllustrationDisplay;

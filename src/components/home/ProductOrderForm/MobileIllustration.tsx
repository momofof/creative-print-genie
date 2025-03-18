
import { DrawerContent } from "@/components/ui/drawer";
import IllustrationDisplay from "./IllustrationDisplay";
import VariantButtons from "./VariantButtons";
import { ProductWithVariants, VariantProps } from "./types";

interface MobileIllustrationProps {
  selectedProduct: ProductWithVariants;
  variants: Record<string, string>;
  activeVariant: VariantProps;
  currentIllustration: string;
  handleVariantClick: (variantType: string, variantValue: string) => void;
}

const MobileIllustration = ({
  selectedProduct,
  variants,
  activeVariant,
  currentIllustration,
  handleVariantClick
}: MobileIllustrationProps) => {
  return (
    <DrawerContent className="p-4 max-h-[80vh]">
      <div className="space-y-4">
        <IllustrationDisplay 
          selectedProduct={selectedProduct}
          currentIllustration={currentIllustration}
          activeVariant={activeVariant}
        />
        
        <VariantButtons 
          variants={variants}
          activeVariant={activeVariant}
          onVariantClick={handleVariantClick}
        />
      </div>
    </DrawerContent>
  );
};

export default MobileIllustration;

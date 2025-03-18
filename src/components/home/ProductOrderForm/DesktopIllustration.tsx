
import { DialogContent } from "@/components/ui/dialog";
import IllustrationDisplay from "./IllustrationDisplay";
import VariantButtons from "./VariantButtons";
import { ProductWithVariants, VariantProps } from "./types";

interface DesktopIllustrationProps {
  selectedProduct: ProductWithVariants;
  variants: Record<string, string>;
  activeVariant: VariantProps;
  currentIllustration: string;
  handleVariantClick: (variantType: string, variantValue: string) => void;
}

const DesktopIllustration = ({
  selectedProduct,
  variants,
  activeVariant,
  currentIllustration,
  handleVariantClick
}: DesktopIllustrationProps) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
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
    </DialogContent>
  );
};

export default DesktopIllustration;

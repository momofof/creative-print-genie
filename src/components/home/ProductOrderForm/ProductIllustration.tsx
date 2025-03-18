
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Drawer } from "@/components/ui/drawer";
import { getVariantIllustration } from "./utils";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileIllustration from "./MobileIllustration";
import DesktopIllustration from "./DesktopIllustration";
import { IllustrationProps, VariantProps } from "./types";

const ProductIllustration = ({
  selectedProduct,
  variants,
  openIllustration,
  setOpenIllustration,
  activeVariantType,
  activeVariantValue
}: IllustrationProps) => {
  const [activeVariant, setActiveVariant] = useState<VariantProps>({});
  const isMobile = useIsMobile();

  useEffect(() => {
    if (activeVariantType && activeVariantValue) {
      setActiveVariant({
        type: activeVariantType,
        value: activeVariantValue
      });
    } else {
      setActiveVariant({});
    }
  }, [activeVariantType, activeVariantValue]);

  if (!selectedProduct) return null;

  const handleVariantClick = (variantType: string, variantValue: string) => {
    if (activeVariant.type === variantType && activeVariant.value === variantValue) {
      // If the same variant is clicked again, clear the active variant
      setActiveVariant({});
    } else {
      // Set the new active variant
      setActiveVariant({
        type: variantType,
        value: variantValue
      });
    }
  };

  const getCurrentIllustration = () => {
    if (activeVariant.type && activeVariant.value && selectedProduct.category) {
      return getVariantIllustration(
        selectedProduct.category,
        activeVariant.type,
        activeVariant.value
      );
    }
    return selectedProduct.image;
  };

  // Render for mobile (Drawer)
  if (isMobile) {
    return (
      <Drawer open={openIllustration} onOpenChange={setOpenIllustration}>
        <MobileIllustration
          selectedProduct={selectedProduct}
          variants={variants}
          activeVariant={activeVariant}
          currentIllustration={getCurrentIllustration()}
          handleVariantClick={handleVariantClick}
        />
      </Drawer>
    );
  }

  // Render for desktop (Dialog)
  return (
    <Dialog open={openIllustration} onOpenChange={setOpenIllustration}>
      <DesktopIllustration
        selectedProduct={selectedProduct}
        variants={variants}
        activeVariant={activeVariant}
        currentIllustration={getCurrentIllustration()}
        handleVariantClick={handleVariantClick}
      />
    </Dialog>
  );
};

export default ProductIllustration;

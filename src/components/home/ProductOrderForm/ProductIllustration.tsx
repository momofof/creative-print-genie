
import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopProductView from "./components/DesktopProductView";
import MobileProductSheet from "./components/MobileProductSheet";

interface ProductIllustrationProps {
  selectedProduct?: Product;
  variants: Record<string, string>;
  openIllustration: boolean;
  setOpenIllustration: (open: boolean) => void;
}

const ProductIllustration = ({
  selectedProduct,
  variants,
  openIllustration,
  setOpenIllustration
}: ProductIllustrationProps) => {
  const isMobile = useIsMobile();
  const [activeVariant, setActiveVariant] = useState<{type: string, value: string} | null>(null);

  return (
    <>
      {/* Desktop view */}
      {!isMobile && (
        <DesktopProductView 
          selectedProduct={selectedProduct}
          variants={variants}
          activeVariant={activeVariant}
          setActiveVariant={setActiveVariant}
        />
      )}

      {/* Mobile view trigger button - handled by parent component */}
      
      {/* Mobile view: Sheet component */}
      {isMobile && (
        <MobileProductSheet 
          selectedProduct={selectedProduct}
          variants={variants}
          activeVariant={activeVariant}
          setActiveVariant={setActiveVariant}
          openIllustration={openIllustration}
          setOpenIllustration={setOpenIllustration}
        />
      )}
    </>
  );
};

export default ProductIllustration;

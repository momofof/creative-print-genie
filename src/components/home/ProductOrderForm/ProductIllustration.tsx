
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { getVariantIllustration, getVariantDisplayName } from "./utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductWithVariants {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  image: string;
}

interface ProductIllustrationProps {
  selectedProduct?: ProductWithVariants;
  variants: Record<string, string>;
  openIllustration: boolean;
  setOpenIllustration: (open: boolean) => void;
  activeVariantType?: string;
  activeVariantValue?: string;
}

const ProductIllustration = ({
  selectedProduct,
  variants,
  openIllustration,
  setOpenIllustration,
  activeVariantType,
  activeVariantValue
}: ProductIllustrationProps) => {
  const [activeVariant, setActiveVariant] = useState<{type?: string; value?: string}>({});
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
        <DrawerContent className="p-4 max-h-[80vh]">
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden">
              <img
                src={getCurrentIllustration()}
                alt={selectedProduct.name}
                className="w-full h-64 object-contain"
              />
              {activeVariant.type && (
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
                  {getVariantDisplayName(activeVariant.type)}: {activeVariant.value}
                </div>
              )}
            </div>
            
            {Object.keys(variants).length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Options sélectionnées</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(variants).map(([type, value]) => (
                    <Button
                      key={type}
                      variant={activeVariant.type === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVariantClick(type, value)}
                      className="text-xs"
                    >
                      {getVariantDisplayName(type)}: {value}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Render for desktop (Dialog)
  return (
    <Dialog open={openIllustration} onOpenChange={setOpenIllustration}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4">
          <div className="bg-white rounded-lg overflow-hidden">
            <img
              src={getCurrentIllustration()}
              alt={selectedProduct.name}
              className="w-full h-64 object-contain"
            />
            {activeVariant.type && (
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
                {getVariantDisplayName(activeVariant.type)}: {activeVariant.value}
              </div>
            )}
          </div>
          
          {Object.keys(variants).length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Options sélectionnées</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(variants).map(([type, value]) => (
                  <Button
                    key={type}
                    variant={activeVariant.type === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVariantClick(type, value)}
                    className="text-xs"
                  >
                    {getVariantDisplayName(type)}: {value}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductIllustration;

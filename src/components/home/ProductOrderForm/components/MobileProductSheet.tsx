
import { Product } from "@/types/product";
import { getVariantDisplayName } from "../utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductPreviewImage from "./ProductPreviewImage";
import VariantPreviewGrid from "./VariantPreviewGrid";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileProductSheetProps {
  selectedProduct?: Product;
  variants: Record<string, string>;
  activeVariant: { type: string, value: string } | null;
  setActiveVariant: (variant: { type: string, value: string } | null) => void;
  openIllustration: boolean;
  setOpenIllustration: (open: boolean) => void;
}

const MobileProductSheet = ({
  selectedProduct,
  variants,
  activeVariant,
  setActiveVariant,
  openIllustration,
  setOpenIllustration
}: MobileProductSheetProps) => {
  return (
    <Sheet open={openIllustration} onOpenChange={setOpenIllustration}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-xl pt-6">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-xl">Aperçu des options</SheetTitle>
          <SheetDescription>
            {selectedProduct ? 
              `${selectedProduct.name} avec vos options personnalisées` : 
              "Sélectionnez un produit pour voir l'aperçu"}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(80vh-120px)]">
          <div className="flex items-center justify-center overflow-visible py-4">
            {selectedProduct ? (
              <div className="flex flex-col items-center">
                <ProductPreviewImage 
                  selectedProduct={selectedProduct}
                  variants={variants}
                  activeVariant={activeVariant}
                  className="max-w-full max-h-[40vh] object-contain"
                />
                <div className="mt-4 text-center px-4">
                  <h4 className="font-medium text-lg">{selectedProduct.name}</h4>
                  {activeVariant ? (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-100 px-2 py-1 rounded inline-block">
                      <span className="font-medium">{getVariantDisplayName(activeVariant.type)}:</span> {activeVariant.value}
                    </p>
                  ) : (
                    <div className="text-sm text-gray-600 mt-2 flex flex-wrap justify-center gap-2">
                      {Object.entries(variants).map(([type, value]) => (
                        <div key={type} className="bg-gray-100 px-2 py-1 rounded">
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
                className="max-w-full max-h-[40vh] object-contain"
              />
            )}
          </div>

          {/* Variant illustrations on mobile */}
          {selectedProduct && Object.keys(variants).length > 0 && (
            <VariantPreviewGrid 
              selectedProduct={selectedProduct}
              variants={variants}
              activeVariant={activeVariant}
              setActiveVariant={setActiveVariant}
            />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileProductSheet;

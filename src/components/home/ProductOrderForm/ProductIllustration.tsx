
import { useState } from "react";
import { Product } from "@/types/product";
import { Image } from "lucide-react";
import { getFeatureIllustration, getVariantDisplayName, getVariantIllustration } from "./utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductIllustrationProps {
  selectedProduct?: Product;
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
  const isMobile = useIsMobile();
  const [activeVariant, setActiveVariant] = useState<{type: string, value: string} | null>(
    activeVariantType && activeVariantValue 
      ? {type: activeVariantType, value: activeVariantValue} 
      : null
  );
  const [showPopover, setShowPopover] = useState<string | null>(null);

  // Function to get the currently displayed illustration
  const getCurrentIllustration = () => {
    if (activeVariant && selectedProduct) {
      return getVariantIllustration(
        selectedProduct.category, 
        activeVariant.type, 
        activeVariant.value
      );
    }
    return getFeatureIllustration(selectedProduct, variants);
  };

  return (
    <>
      {/* Desktop view */}
      {!isMobile && (
        <div className="bg-gray-50 rounded-lg p-4 md:p-6 flex flex-col items-center justify-center relative">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Aperçu des options</h3>
          <div className="border border-gray-200 rounded-lg w-full h-64 md:h-80 flex items-center justify-center overflow-hidden bg-white">
            {selectedProduct ? (
              <div className="flex flex-col items-center p-4">
                <img 
                  src={activeVariant ? getCurrentIllustration() : getFeatureIllustration(selectedProduct, variants)} 
                  alt="Option aperçu" 
                  className="max-w-full max-h-52 md:max-h-64 object-contain" 
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
              <div className="text-center p-4">
                <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">Sélectionnez un produit et ses options pour visualiser l'aperçu</p>
              </div>
            )}
          </div>

          {/* Variant illustrations */}
          {selectedProduct && Object.keys(variants).length > 0 && (
            <div className="flex flex-wrap mt-4 gap-2 justify-center">
              {Object.entries(variants).map(([type, value]) => (
                <Popover 
                  key={`${type}-${value}`}
                  open={showPopover === `${type}-${value}`}
                  onOpenChange={(open) => {
                    if (open) {
                      setShowPopover(`${type}-${value}`);
                      setActiveVariant({ type, value });
                    } else if (showPopover === `${type}-${value}`) {
                      setShowPopover(null);
                      setActiveVariant(null);
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      {getVariantDisplayName(type)}: {value}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="text-center">
                      <img 
                        src={getVariantIllustration(selectedProduct.category, type, value)} 
                        alt={`${getVariantDisplayName(type)}: ${value}`} 
                        className="max-w-full h-32 object-contain mx-auto" 
                      />
                      <p className="mt-2 text-sm font-medium">{getVariantDisplayName(type)}: {value}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile view: Sheet component */}
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
          <div className="flex-1 flex items-center justify-center overflow-auto py-4">
            {selectedProduct ? (
              <div className="flex flex-col items-center">
                <img 
                  src={activeVariant ? getCurrentIllustration() : getFeatureIllustration(selectedProduct, variants)} 
                  alt="Option aperçu" 
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
              <div className="text-center py-8 px-4">
                <Image className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500">Sélectionnez un produit et ses options pour visualiser l'aperçu</p>
              </div>
            )}
          </div>

          {/* Variant illustrations on mobile - With interactive buttons */}
          {selectedProduct && Object.keys(variants).length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4 pb-6">
              <h4 className="font-medium text-sm mb-3 px-4">Aperçu des variantes</h4>
              <div className="px-4 grid grid-cols-2 gap-3">
                {Object.entries(variants).map(([type, value]) => (
                  <button
                    key={`${type}-${value}`}
                    className={`bg-white rounded-lg border ${
                      activeVariant && activeVariant.type === type ? 
                      'border-accent ring-1 ring-accent' : 
                      'border-gray-200'
                    } p-2 text-left`}
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
                          src={getVariantIllustration(selectedProduct.category, type, value)} 
                          alt={`${getVariantDisplayName(type)}: ${value}`} 
                          className="max-w-full max-h-20 object-contain" 
                        />
                      </div>
                      <p className="mt-2 text-xs font-medium truncate">
                        {getVariantDisplayName(type)}: {value}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProductIllustration;

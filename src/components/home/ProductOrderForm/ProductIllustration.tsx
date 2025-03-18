
import { Product } from "@/types/product";
import { Image } from "lucide-react";
import { getFeatureIllustration, getVariantDisplayName } from "./utils";
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
}

const ProductIllustration = ({
  selectedProduct,
  variants,
  openIllustration,
  setOpenIllustration
}: ProductIllustrationProps) => {
  const isMobile = useIsMobile();

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
                  src={getFeatureIllustration(selectedProduct, variants)} 
                  alt="Option aperçu" 
                  className="max-w-full max-h-52 md:max-h-64 object-contain" 
                />
                <div className="mt-3 md:mt-4 text-center">
                  <h4 className="font-medium">{selectedProduct.name}</h4>
                  <div className="text-sm text-gray-600 max-w-xs mt-2">
                    {Object.entries(variants).map(([type, value]) => (
                      <div key={type} className="inline-block mr-2 mb-1">
                        <span className="font-medium">{getVariantDisplayName(type)}:</span> {value}
                      </div>
                    ))}
                  </div>
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
                <Popover key={`${type}-${value}`}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      {getVariantDisplayName(type)}: {value}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="text-center">
                      <img 
                        src={getFeatureIllustration(selectedProduct, { [type]: value })} 
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
      <Sheet open={openIllustration && isMobile} onOpenChange={setOpenIllustration}>
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
                  src={getFeatureIllustration(selectedProduct, variants)} 
                  alt="Option aperçu" 
                  className="max-w-full max-h-[40vh] object-contain" 
                />
                <div className="mt-4 text-center px-4">
                  <h4 className="font-medium text-lg">{selectedProduct.name}</h4>
                  <div className="text-sm text-gray-600 mt-2 flex flex-wrap justify-center gap-2">
                    {Object.entries(variants).map(([type, value]) => (
                      <div key={type} className="bg-gray-100 px-2 py-1 rounded">
                        <span className="font-medium">{getVariantDisplayName(type)}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <Image className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500">Sélectionnez un produit et ses options pour visualiser l'aperçu</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProductIllustration;

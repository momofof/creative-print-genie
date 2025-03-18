
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
  return (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center relative">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Aperçu des options</h3>
      <div className="border border-gray-200 rounded-lg w-full h-80 flex items-center justify-center overflow-hidden bg-white">
        {selectedProduct ? (
          <div className="flex flex-col items-center">
            <img 
              src={getFeatureIllustration(selectedProduct, variants)} 
              alt="Option aperçu" 
              className="max-w-full max-h-64 object-contain" 
            />
            <div className="mt-4 text-center">
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

      {/* Mobile view: show illustration in a sheet */}
      <div className="md:hidden mt-4 w-full">
        <Sheet open={openIllustration} onOpenChange={setOpenIllustration}>
          <SheetTrigger asChild>
            <Button className="w-full" variant="outline">
              Voir l'aperçu
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <SheetHeader>
              <SheetTitle>Aperçu des options</SheetTitle>
              <SheetDescription>
                {selectedProduct ? 
                  `${selectedProduct.name} avec vos options personnalisées` : 
                  "Sélectionnez un produit pour voir l'aperçu"}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 flex items-center justify-center p-6">
              {selectedProduct ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={getFeatureIllustration(selectedProduct, variants)} 
                    alt="Option aperçu" 
                    className="max-w-full max-h-64 object-contain" 
                  />
                  <div className="mt-4 text-center">
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
                <div className="text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>Sélectionnez un produit et ses options pour visualiser l'aperçu</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Variant illustrations (hidden on mobile) */}
      {selectedProduct && Object.keys(variants).length > 0 && (
        <div className="hidden md:flex flex-wrap mt-4 gap-2 justify-center">
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
  );
};

export default ProductIllustration;

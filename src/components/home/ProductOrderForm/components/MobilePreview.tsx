
import { Product } from "@/types/product";
import { getFeatureIllustration, getVariantDisplayName, getVariantIllustration } from "../utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobilePreviewProps {
  selectedProduct: Product;
  variants: Record<string, string>;
}

const MobilePreview = ({ selectedProduct, variants }: MobilePreviewProps) => {
  const [activeVariant, setActiveVariant] = useState<{ type: string, value: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  if (!selectedProduct || Object.keys(variants).length === 0) return null;
  
  // Function to get the currently displayed illustration
  const getCurrentIllustration = () => {
    if (activeVariant) {
      return getVariantIllustration(
        selectedProduct.category, 
        activeVariant.type, 
        activeVariant.value
      );
    }
    return getFeatureIllustration(selectedProduct, variants);
  };
  
  const handleVariantClick = (type: string, value: string) => {
    if (activeVariant && activeVariant.type === type && activeVariant.value === value) {
      setActiveVariant(null);
    } else {
      setActiveVariant({ type, value });
      setIsPreviewOpen(true);
    }
  };
  
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative z-10">
      <div className="flex flex-col items-center">
        <img 
          src={getFeatureIllustration(selectedProduct, variants)} 
          alt="Aperçu produit" 
          className="max-h-40 object-contain mb-3" 
        />
        <div className="text-center">
          <h3 className="font-medium text-gray-800">{selectedProduct.name}</h3>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {Object.entries(variants).map(([type, value]) => (
              <button
                key={type}
                className="text-xs bg-white px-2 py-1 rounded-full border hover:bg-gray-100 transition-colors"
                onClick={() => handleVariantClick(type, value)}
              >
                {getVariantDisplayName(type)}: {value}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Preview Sheet for variants */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-xl pt-6">
          <SheetHeader className="text-left pb-4">
            <SheetTitle className="text-xl">Aperçu {activeVariant ? getVariantDisplayName(activeVariant.type) : "du produit"}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center h-full p-4">
            <img 
              src={getCurrentIllustration()} 
              alt={activeVariant ? `${getVariantDisplayName(activeVariant.type)}: ${activeVariant.value}` : "Aperçu produit"} 
              className="max-h-[40vh] object-contain" 
            />
            <div className="mt-4 text-center">
              <h3 className="font-medium text-lg">{selectedProduct.name}</h3>
              {activeVariant ? (
                <div className="mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block">
                  <span className="font-medium">{getVariantDisplayName(activeVariant.type)}:</span> {activeVariant.value}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {Object.entries(variants).map(([type, value]) => (
                    <span key={type} className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {getVariantDisplayName(type)}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobilePreview;

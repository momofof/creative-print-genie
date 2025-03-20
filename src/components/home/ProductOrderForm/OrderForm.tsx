
import { useState, useRef, useEffect } from "react";
import { Product, CartItem } from "@/types/product";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductForm from "./components/ProductForm";
import DesktopProductView from "./components/DesktopProductView";
import MobilePreview from "./components/MobilePreview";
import MobileProductSheet from "./components/MobileProductSheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderFormProps {
  products: Product[];
  loadingProducts: boolean;
  selectedProduct: Product | undefined;
  setSelectedProduct: (product: Product | undefined) => void;
  selectedQuantity: number | null;
  setSelectedQuantity: (quantity: number | null) => void;
  variants: Record<string, string>;
  setVariants: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  availableVariants: string[];
  setAvailableVariants: React.Dispatch<React.SetStateAction<string[]>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  orderSummaryOpen: boolean;
  setOrderSummaryOpen: (open: boolean) => void;
  summaryItems: CartItem[];
  summaryTotal: number;
  isEditMode?: boolean;
}

const OrderForm = ({
  products,
  loadingProducts,
  selectedProduct,
  setSelectedProduct,
  selectedQuantity,
  setSelectedQuantity,
  variants,
  setVariants,
  availableVariants,
  setAvailableVariants,
  handleSubmit,
  isSubmitting,
  orderSummaryOpen,
  setOrderSummaryOpen,
  summaryItems,
  summaryTotal,
  isEditMode = false
}: OrderFormProps) => {
  const isMobile = useIsMobile();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeVariant, setActiveVariant] = useState<string>("");
  const [activeValue, setActiveValue] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const togglePreview = (variantName: string, variantValue: string) => {
    setActiveVariant(variantName);
    setActiveValue(variantValue);
    setPreviewOpen(true);
  };
  
  return (
    <div ref={containerRef} className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product form section */}
        <div className="order-2 md:order-1">
          <ProductForm
            products={products}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedQuantity={selectedQuantity}
            setSelectedQuantity={setSelectedQuantity}
            variants={variants}
            setVariants={setVariants}
            availableVariants={availableVariants}
            setAvailableVariants={setAvailableVariants}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        </div>
        
        {/* Product preview section */}
        {selectedProduct && (
          <div className="order-1 md:order-2">
            {/* Desktop preview */}
            <div className="hidden md:block">
              <DesktopProductView
                selectedProduct={selectedProduct}
                variants={variants}
                activeVariant={activeVariant ? {type: activeVariant, value: activeValue} : null}
                setActiveVariant={(variant) => {
                  if (variant) {
                    setActiveVariant(variant.type);
                    setActiveValue(variant.value);
                  } else {
                    setActiveVariant("");
                    setActiveValue("");
                  }
                }}
              />
            </div>
            
            {/* Mobile preview */}
            <div className="md:hidden">
              <MobilePreview
                selectedProduct={selectedProduct}
                variants={variants}
                onPreviewClick={togglePreview}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile product view sheet */}
      {isMobile && (
        <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <MobileProductSheet
              selectedProduct={selectedProduct}
              variants={variants}
              activeVariant={activeVariant ? {type: activeVariant, value: activeValue} : null}
              setActiveVariant={(variant) => {
                if (variant) {
                  setActiveVariant(variant.type);
                  setActiveValue(variant.value);
                } else {
                  setActiveVariant("");
                  setActiveValue("");
                }
              }}
              openIllustration={previewOpen}
              setOpenIllustration={setPreviewOpen}
            />
          </SheetContent>
        </Sheet>
      )}
      
      {/* Order summary dialog */}
      <Dialog open={orderSummaryOpen} onOpenChange={setOrderSummaryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Récapitulatif de votre commande</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-2">
              {summaryItems.map((item, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img 
                        src={item.image || "/placeholder.svg"} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                      
                      {item.variants && Object.keys(item.variants).length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {Object.entries(item.variants).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(item.price * item.quantity).toLocaleString('fr-FR')} €</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t pt-3">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{summaryTotal.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setOrderSummaryOpen(false)}
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderForm;

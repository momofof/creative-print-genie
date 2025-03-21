
import { useState } from "react";
import { Product } from "@/types/product";
import { getVariantDisplayName, getVariantIllustration } from "../utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface VariantPreviewButtonsProps {
  selectedProduct: Product;
  variants: Record<string, string>;
  setActiveVariant: (variant: { type: string, value: string } | null) => void;
}

const VariantPreviewButtons = ({
  selectedProduct,
  variants,
  setActiveVariant
}: VariantPreviewButtonsProps) => {
  const [showPopover, setShowPopover] = useState<string | null>(null);

  return (
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
                src={getVariantIllustration(selectedProduct.subcategory || selectedProduct.category, type, value)} 
                alt={`${getVariantDisplayName(type)}: ${value}`} 
                className="max-w-full h-32 object-contain mx-auto" 
              />
              <p className="mt-2 text-sm font-medium">{getVariantDisplayName(type)}: {value}</p>
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};

export default VariantPreviewButtons;

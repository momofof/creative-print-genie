
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuantitySelectorProps {
  quantityOptions: number[];
  selectedQuantity: number | null;
  setSelectedQuantity: (quantity: number) => void;
}

const QuantitySelector = ({
  quantityOptions,
  selectedQuantity,
  setSelectedQuantity
}: QuantitySelectorProps) => {
  const isMobile = useIsMobile();
  
  // On mobile, use a smaller grid
  const gridCols = isMobile ? 
    (quantityOptions.length <= 3 ? "grid-cols-3" : "grid-cols-4") : 
    (quantityOptions.length <= 6 ? "grid-cols-6" : "grid-cols-8");

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Quantité
      </label>
      <div className={`grid ${gridCols} gap-2`}>
        {quantityOptions.map((quantity) => (
          <Button
            key={quantity}
            type="button"
            variant={selectedQuantity === quantity ? "default" : "outline"}
            onClick={() => setSelectedQuantity(quantity)}
            className={cn(
              "py-2 md:min-w-[50px]",
              isMobile && "text-sm h-10"
            )}
          >
            {quantity}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuantitySelector;

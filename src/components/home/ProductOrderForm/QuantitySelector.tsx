
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Quantité
      </label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {quantityOptions.map((quantity) => (
          <Button
            key={quantity}
            type="button"
            variant={selectedQuantity === quantity ? "default" : "outline"}
            onClick={() => setSelectedQuantity(quantity)}
            className="py-2"
          >
            {quantity}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuantitySelector;

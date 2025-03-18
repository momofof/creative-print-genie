
import { Button } from "@/components/ui/button";
import { getVariantDisplayName } from "./utils";

interface VariantButtonsProps {
  variants: Record<string, string>;
  activeVariant: { type?: string; value?: string };
  onVariantClick: (variantType: string, variantValue: string) => void;
}

const VariantButtons = ({ 
  variants, 
  activeVariant, 
  onVariantClick 
}: VariantButtonsProps) => {
  if (Object.keys(variants).length === 0) return null;
  
  return (
    <div>
      <h3 className="font-medium mb-2">Options sélectionnées</h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(variants).map(([type, value]) => (
          <Button
            key={type}
            variant={activeVariant.type === type ? "default" : "outline"}
            size="sm"
            onClick={() => onVariantClick(type, value)}
            className="text-xs"
          >
            {getVariantDisplayName(type)}: {value}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VariantButtons;

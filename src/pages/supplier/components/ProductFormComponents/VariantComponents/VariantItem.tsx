
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductVariant } from "../../../hooks/product-form/types";
import VariantSizeField from "./VariantSizeField";
import VariantColorField from "./VariantColorField";
import VariantStockField from "./VariantStockField";
import VariantPrintableSides from "./VariantPrintableSides";

interface VariantItemProps {
  variant: ProductVariant;
  index: number;
  onRemove: () => void;
  onChange: (index: number, field: keyof ProductVariant, value: string | number | string[]) => void;
  isVelo?: boolean;
}

const VariantItem = ({ variant, index, onRemove, onChange, isVelo = false }: VariantItemProps) => {
  return (
    <div className="border rounded-md p-4 mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Variante #{index + 1}</h3>
        <Button
          type="button"
          onClick={onRemove}
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <VariantSizeField 
          value={variant.size} 
          onChange={(value) => onChange(index, "size", value)} 
          isVelo={isVelo}
        />
        
        <VariantColorField 
          colorName={variant.color}
          hexColor={variant.hex_color}
          onColorNameChange={(value) => onChange(index, "color", value)}
          onHexColorChange={(value) => onChange(index, "hex_color", value)}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <VariantStockField 
          stock={variant.stock}
          onChange={(value) => onChange(index, "stock", value)}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ajustement prix (€)
          </label>
          <Input
            type="number"
            step="0.01"
            value={variant.price_adjustment || 0}
            onChange={(e) => onChange(index, "price_adjustment", e.target.value)}
            className="mt-1 w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <Select
            value={variant.status}
            onValueChange={(value) => onChange(index, "status", value as 'in_stock' | 'low_stock' | 'out_of_stock')}
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_stock">En stock</SelectItem>
              <SelectItem value="low_stock">Stock faible</SelectItem>
              <SelectItem value="out_of_stock">En rupture</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isVelo && (
        <VariantPrintableSides
          printableSides={variant.printable_sides || []}
          onChange={(sides) => onChange(index, "printable_sides", sides)}
          index={index}
        />
      )}
    </div>
  );
};

export default VariantItem;

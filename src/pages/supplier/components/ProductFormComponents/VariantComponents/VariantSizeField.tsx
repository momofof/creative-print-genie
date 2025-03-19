
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VariantSizeFieldProps {
  value: string;
  onChange: (value: string) => void;
  isVelo?: boolean;
}

const VariantSizeField = ({ value, onChange, isVelo = false }: VariantSizeFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Taille
      </label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="mt-1 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {isVelo ? (
            <>
              <SelectItem value="S">S (16-18 pouces)</SelectItem>
              <SelectItem value="M">M (18-20 pouces)</SelectItem>
              <SelectItem value="L">L (20-22 pouces)</SelectItem>
              <SelectItem value="XL">XL (22-24 pouces)</SelectItem>
            </>
          ) : (
            <>
              <SelectItem value="XS">XS</SelectItem>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
              <SelectItem value="XXL">XXL</SelectItem>
              <SelectItem value="Unique">Taille unique</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VariantSizeField;

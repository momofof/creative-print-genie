
import React from "react";
import { Input } from "@/components/ui/input";

interface VariantStockFieldProps {
  stock: number;
  onChange: (value: string | number) => void;
}

const VariantStockField = ({ stock, onChange }: VariantStockFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Stock
      </label>
      <Input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full"
      />
    </div>
  );
};

export default VariantStockField;

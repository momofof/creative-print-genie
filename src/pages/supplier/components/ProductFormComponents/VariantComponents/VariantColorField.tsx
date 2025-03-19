
import React from "react";
import { Input } from "@/components/ui/input";

interface VariantColorFieldProps {
  colorName: string;
  hexColor: string;
  onColorNameChange: (value: string) => void;
  onHexColorChange: (value: string) => void;
}

const VariantColorField = ({ 
  colorName, 
  hexColor, 
  onColorNameChange, 
  onHexColorChange 
}: VariantColorFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Couleur
      </label>
      <div className="flex mt-1">
        <Input
          type="color"
          value={hexColor}
          onChange={(e) => onHexColorChange(e.target.value)}
          className="w-10 h-10 p-0 border-0 rounded-l-md"
        />
        <Input
          value={colorName}
          onChange={(e) => onColorNameChange(e.target.value)}
          className="flex-1 rounded-l-none"
          placeholder="Nom de la couleur"
        />
      </div>
    </div>
  );
};

export default VariantColorField;

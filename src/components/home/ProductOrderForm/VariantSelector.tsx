
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VariantSelectorProps {
  variantType: string;
  displayName: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  productCategory: string;
}

const VariantSelector = ({
  variantType,
  displayName,
  options,
  selectedValue,
  onChange,
  productCategory
}: VariantSelectorProps) => {
  if (!options || options.length === 0) {
    return null;
  }
  
  // Format each option for display
  const formatOptionLabel = (option: string): string => {
    // Special handling for printable sides options
    if (variantType === 'printable_side') {
      if (option === 'face1' || option === 'face_1') return 'Face 1 (cadre)';
      if (option === 'face2' || option === 'face_2') return 'Face 2 (roues)';
    }
    
    // Default formatting
    return option;
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {displayName}
      </label>
      <Select
        value={selectedValue}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Choisir ${displayName.toLowerCase()}...`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {formatOptionLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VariantSelector;


import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface VariantPrintableSidesProps {
  printableSides: string[];
  onChange: (sides: string[]) => void;
  index: number;
}

const VariantPrintableSides = ({ printableSides, onChange, index }: VariantPrintableSidesProps) => {
  const handlePrintableSideChange = (side: string) => {
    const newSides = printableSides.includes(side)
      ? printableSides.filter(s => s !== side)
      : [...printableSides, side];
    
    onChange(newSides);
  };

  const isSideSelected = (side: string) => {
    return printableSides.includes(side);
  };

  return (
    <div className="border-t pt-4 mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Faces personnalisables
      </label>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`face1-${index}`} 
            checked={isSideSelected('face1')}
            onCheckedChange={() => handlePrintableSideChange('face1')}
          />
          <label htmlFor={`face1-${index}`} className="text-sm">Face 1 (cadre)</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`face2-${index}`} 
            checked={isSideSelected('face2')}
            onCheckedChange={() => handlePrintableSideChange('face2')}
          />
          <label htmlFor={`face2-${index}`} className="text-sm">Face 2 (roues)</label>
        </div>
      </div>
    </div>
  );
};

export default VariantPrintableSides;

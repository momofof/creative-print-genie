
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getVariantIllustration } from "./utils";

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
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {displayName}
      </label>
      <div className="flex gap-2">
        <div className="flex-grow">
          <Select
            onValueChange={onChange}
            value={selectedValue || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Choisir ${displayName.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedValue && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="px-2">
                <span className="sr-only">Aperçu</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="text-center">
                <img 
                  src={getVariantIllustration(productCategory, variantType, selectedValue)}
                  alt={`${displayName}: ${selectedValue}`} 
                  className="max-w-full h-32 object-contain mx-auto" 
                />
                <p className="mt-2 text-sm font-medium">{displayName}: {selectedValue}</p>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default VariantSelector;

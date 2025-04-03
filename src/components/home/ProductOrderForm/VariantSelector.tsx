
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useVariantParser } from "@/pages/supplier/hooks/useVariantParser";

interface VariantSelectorProps {
  variantType: string;
  displayName: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  productCategory: string;
  disabled?: boolean;
}

const VariantSelector = ({
  variantType,
  displayName,
  options,
  selectedValue,
  onChange,
  disabled = false
}: VariantSelectorProps) => {
  const { parseSimpleArrayString } = useVariantParser();
  
  // Ensure options are processed correctly, handling string format like "[option1, option2]"
  const processedOptions = Array.isArray(options) 
    ? options 
    : typeof options === 'string' 
      ? parseSimpleArrayString(options)
      : [];

  if (!processedOptions || processedOptions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`variant-${variantType}`} className="text-sm font-medium">
        {displayName}
      </Label>
      <Select
        value={selectedValue}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id={`variant-${variantType}`} className="w-full">
          <SelectValue placeholder={`Choisir ${displayName.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {processedOptions.map((option, index) => (
            <SelectItem key={`${option}-${index}`} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VariantSelector;

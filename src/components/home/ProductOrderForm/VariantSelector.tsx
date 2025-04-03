
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useVariantParser } from "@/pages/supplier/hooks/useVariantParser";
import { useEffect } from "react";

interface VariantSelectorProps {
  variantType: string;
  displayName: string;
  options: string[] | string;
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
  
  // Logs pour le déboggage
  useEffect(() => {
    console.log(`VariantSelector - ${variantType}:`, options);
  }, [variantType, options]);
  
  // Traitement amélioré des options pour supporter différents formats
  const processOptions = (inputOptions: string[] | string): string[] => {
    // Si c'est déjà un tableau
    if (Array.isArray(inputOptions)) {
      return inputOptions.filter(Boolean);
    }
    
    // Si c'est une chaîne
    if (typeof inputOptions === 'string') {
      // Vérifier si c'est déjà au format [option1, option2]
      if (inputOptions.trim().startsWith('[') && inputOptions.trim().endsWith(']')) {
        return parseSimpleArrayString(inputOptions);
      }
      
      // Si c'est une seule option, on la met dans un tableau
      if (inputOptions.trim()) {
        return [inputOptions.trim()];
      }
    }
    
    return [];
  };
  
  const processedOptions = processOptions(options);
  
  if (!processedOptions || processedOptions.length === 0) {
    console.log(`Aucune option trouvée pour ${variantType}`);
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
        <SelectContent className="bg-white">
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

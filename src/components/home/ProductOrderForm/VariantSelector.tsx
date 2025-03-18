
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { getVariantIllustration } from "./utils";
import { Search, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  
  // Filter options by search term
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <SelectContent className={`${isMobile ? 'pb-10' : 'max-h-[300px]'}`}>
              <div className="p-2 sticky top-0 bg-white z-10 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8 pr-8 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchTerm('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className={`overflow-y-auto pt-1 ${isMobile ? 'max-h-[30vh]' : 'max-h-[200px]'}`}>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <SelectItem key={option} value={option} className="py-3">
                      {option}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-3 px-2 text-center text-sm text-gray-500">
                    Aucune option trouvée
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
        </div>
        
        {selectedValue && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="px-2 h-10">
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

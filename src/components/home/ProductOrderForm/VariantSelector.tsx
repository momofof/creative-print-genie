
import { useState, useRef } from "react";
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
import { Eye, ChevronUp, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getVariantIllustration } from "./utils";
import VariantSearch from "./components/VariantSearch";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [showIllustration, setShowIllustration] = useState(false);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Filter options by search term
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine if we need scroll buttons (5 or more options)
  const needsScrollButtons = filteredOptions.length >= 5;
  
  // Scroll handlers
  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };
  
  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

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
            defaultValue={selectedValue || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Choisir ${displayName.toLowerCase()}...`}>
                {selectedValue}
              </SelectValue>
            </SelectTrigger>
            <SelectContent 
              className={`${isMobile ? 'pb-10' : 'max-h-[300px]'} bg-white shadow-lg border border-gray-200 ${needsScrollButtons ? 'py-0' : ''}`}
              position={isMobile ? "popper" : "item-aligned"}
              sideOffset={isMobile ? 5 : 0}
              align={isMobile ? "start" : "center"}
            >
              <VariantSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              
              {needsScrollButtons && (
                <div className="flex justify-center pt-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-full rounded-none hover:bg-gray-100"
                    onClick={scrollUp}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div 
                ref={scrollContainerRef}
                className={`overflow-y-auto pt-1 ${isMobile ? 'max-h-[30vh]' : (needsScrollButtons ? 'max-h-[150px]' : 'max-h-[200px]')} bg-white`}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <SelectItem key={option} value={option} className="py-3 hover:bg-gray-100">
                      {option}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-3 px-2 text-center text-sm text-gray-500">
                    Aucune option trouvée
                  </div>
                )}
              </div>
              
              {needsScrollButtons && (
                <div className="flex justify-center pb-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-full rounded-none hover:bg-gray-100"
                    onClick={scrollDown}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {selectedValue && (
          <Popover open={showIllustration} onOpenChange={setShowIllustration}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="px-2 h-10" onClick={() => setShowIllustration(true)}>
                <span className="sr-only">Aperçu</span>
                <Eye className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-64 p-2 bg-white shadow-lg border border-gray-200"
              sideOffset={5}
              align={isMobile ? "start" : "center"}
            >
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

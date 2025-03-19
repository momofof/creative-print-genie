
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface VariantSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const VariantSearch = ({ searchTerm, setSearchTerm }: VariantSearchProps) => {
  return (
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
  );
};

export default VariantSearch;

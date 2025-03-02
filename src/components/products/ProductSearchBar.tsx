
import React from "react";
import { Search } from "lucide-react";

interface ProductSearchBarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

const ProductSearchBar = ({ onSearch, searchTerm }: ProductSearchBarProps) => {
  return (
    <div className="relative flex-1 max-w-xs">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Rechercher..."
        className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Search className="h-4 w-4" />
      </div>
    </div>
  );
};

export default ProductSearchBar;

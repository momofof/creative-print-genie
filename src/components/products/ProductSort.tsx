
import React from "react";
import { ChevronDown } from "lucide-react";

interface SortOption {
  id: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { id: "relevance", label: "Pertinence" },
  { id: "newest", label: "Nouveautés" },
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
  { id: "rating", label: "Avis clients" },
  { id: "bestseller", label: "Meilleures ventes" }
];

interface ProductSortProps {
  onSortChange: (sortId: string) => void;
  selectedSort: string;
}

const ProductSort = ({ onSortChange, selectedSort }: ProductSortProps) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort-by" className="text-sm text-gray-600 whitespace-nowrap">
        Trier par:
      </label>
      <div className="relative inline-block">
        <select
          id="sort-by"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default ProductSort;

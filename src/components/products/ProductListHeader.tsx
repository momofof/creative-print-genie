
import React from 'react';
import ProductSearchBar from './ProductSearchBar';
import ProductViewToggle from './ProductViewToggle';
import ProductSort from './ProductSort';

interface ProductListHeaderProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  viewMode: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  selectedSort: string;
  onSortChange: (sortOption: string) => void;
  productCount: number;
}

const ProductListHeader = ({
  searchTerm,
  onSearch,
  viewMode,
  onViewChange,
  selectedSort,
  onSortChange,
  productCount
}: ProductListHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-4">
        <ProductSearchBar onSearch={onSearch} searchTerm={searchTerm} />
        <ProductViewToggle view={viewMode} onViewChange={onViewChange} />
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">
          {productCount} produits
        </span>
        <ProductSort onSortChange={onSortChange} selectedSort={selectedSort} />
      </div>
    </div>
  );
};

export default ProductListHeader;

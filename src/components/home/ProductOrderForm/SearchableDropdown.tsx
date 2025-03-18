
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, X } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  products: Product[];
  onSelect: (product: Product) => void;
  selectedProduct?: Product;
}

const SearchableDropdown = ({
  label,
  placeholder,
  products,
  onSelect,
  selectedProduct
}: SearchableDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Filter products by search term
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center justify-between w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-left text-sm"
            aria-haspopup="listbox"
          >
            <span className={cn("block truncate", !selectedProduct && "text-gray-500")}>
              {selectedProduct ? selectedProduct.name : placeholder}
            </span>
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white p-1" 
          align="start"
          sideOffset={4}
          style={{ maxHeight: isMobile ? '50vh' : '400px', overflowY: 'auto' }}
        >
          <div className="p-2">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                className="pl-8 pr-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="max-h-[200px] overflow-auto">
              {filteredProducts.length > 0 ? (
                <div className="space-y-1">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      className={cn(
                        "w-full text-left px-2 py-2.5 text-sm rounded hover:bg-gray-100",
                        selectedProduct?.id === product.id && "bg-gray-100 font-medium"
                      )}
                      onClick={() => {
                        onSelect(product);
                        setIsOpen(false);
                      }}
                    >
                      <span className="font-medium">{product.name}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        {product.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-sm text-gray-500">
                  Aucun produit trouvé
                </div>
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchableDropdown;

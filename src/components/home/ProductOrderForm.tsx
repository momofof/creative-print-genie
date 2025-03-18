
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import { allProducts } from "@/data/productData";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  category: string;
  onSelect: (product: Product) => void;
  selectedProduct?: Product;
}

const SearchableDropdown = ({
  label,
  placeholder,
  category,
  onSelect,
  selectedProduct
}: SearchableDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter products by category and search term
  const filteredProducts = allProducts
    .filter(product => product.category === category)
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white p-1" align="start">
          <div className="p-2">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-[200px] overflow-auto">
              {filteredProducts.length > 0 ? (
                <div className="space-y-1">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100",
                        selectedProduct?.id === product.id && "bg-gray-100 font-medium"
                      )}
                      onClick={() => {
                        onSelect(product);
                        setIsOpen(false);
                      }}
                    >
                      {product.name}
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

const ProductOrderForm = () => {
  const [selectedProducts, setSelectedProducts] = useState<{
    textile: Product | undefined;
    papier: Product | undefined;
    vinyl: Product | undefined;
    accessoires: Product | undefined;
    emballage: Product | undefined;
  }>({
    textile: undefined,
    papier: undefined,
    vinyl: undefined,
    accessoires: undefined,
    emballage: undefined
  });
  
  const handleSelectProduct = (category: keyof typeof selectedProducts, product: Product) => {
    setSelectedProducts(prev => ({
      ...prev,
      [category]: product
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically process the order
    // For demo purposes, we'll just log the selected products
    console.log("Order submitted:", selectedProducts);
    
    // You could also show a success message
    alert("Commande envoyée avec succès !");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Commander vos produits</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <SearchableDropdown
            label="Sélectionnez un produit textile"
            placeholder="Choisir un t-shirt, sweat, casquette..."
            category="textile"
            selectedProduct={selectedProducts.textile}
            onSelect={(product) => handleSelectProduct('textile', product)}
          />
          
          <SearchableDropdown
            label="Sélectionnez un produit papier"
            placeholder="Choisir une carte de visite, flyer..."
            category="papier"
            selectedProduct={selectedProducts.papier}
            onSelect={(product) => handleSelectProduct('papier', product)}
          />
          
          <SearchableDropdown
            label="Sélectionnez un produit vinyl"
            placeholder="Choisir un autocollant, vinyle adhésif..."
            category="vinyl"
            selectedProduct={selectedProducts.vinyl}
            onSelect={(product) => handleSelectProduct('vinyl', product)}
          />
          
          <SearchableDropdown
            label="Sélectionnez un accessoire"
            placeholder="Choisir un mug, badge, porte-clés..."
            category="accessoires"
            selectedProduct={selectedProducts.accessoires}
            onSelect={(product) => handleSelectProduct('accessoires', product)}
          />
          
          <SearchableDropdown
            label="Sélectionnez un produit d'emballage"
            placeholder="Choisir une boîte, papier cadeau..."
            category="emballage"
            selectedProduct={selectedProducts.emballage}
            onSelect={(product) => handleSelectProduct('emballage', product)}
          />
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white py-3 px-6 rounded-md font-medium transition-colors"
          >
            Commander
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductOrderForm;

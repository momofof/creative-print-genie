
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Image } from "lucide-react";
import { allProducts } from "@/data/productData";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

// Quantity options for different product categories
const quantityOptions = {
  textile: [1, 5, 10, 25, 50, 100],
  papier: [50, 100, 250, 500, 1000, 2000],
  vinyl: [1, 5, 10, 25, 50, 100],
  accessoires: [1, 5, 10, 25, 50],
  emballage: [10, 25, 50, 100, 200]
};

// Category-specific variants
const categoryVariants = {
  textile: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: ["Blanc", "Noir", "Bleu", "Rouge", "Vert", "Jaune", "Gris"],
    materials: ["Coton", "Polyester", "Coton Bio", "Mélange", "Lycra", "Lin"],
    styles: ["T-shirt", "Polo", "Sweat", "Hoodie", "Débardeur", "Chemise"]
  },
  papier: {
    sizes: ["A6", "A5", "A4", "A3", "A2", "A1", "Carte de visite", "Flyer"],
    colors: ["Blanc", "Ivoire", "Recyclé", "Coloré", "Kraft"],
    thickness: ["80g", "100g", "120g", "170g", "250g", "300g", "350g"],
    printDetails: ["Recto", "Recto-Verso", "Quadri", "Pantone", "Vernis"],
    paperTypes: ["Standard", "Recyclé", "Créatif", "Couché Mat", "Couché Brillant", "Texturé"],
    folding: ["Sans pli", "Pli simple", "Pli accordéon", "Pli roulé", "Pli fenêtre"],
    foldingStyles: ["2 volets", "3 volets", "4 volets", "Dépliant", "Livret", "Z-fold"]
  },
  vinyl: {
    sizes: ["Petit (10x10cm)", "Moyen (30x30cm)", "Grand (50x50cm)", "XL (100x100cm)", "Sur mesure"],
    colors: ["Transparent", "Blanc", "Noir", "Couleur unie", "Multicolore"],
    materials: ["PVC", "Vinyle monomère", "Vinyle polymère", "Microperforé", "Adhésif"],
    finishes: ["Mat", "Brillant", "Satiné", "Anti-UV", "Anti-rayures"]
  },
  accessoires: {
    colors: ["Blanc", "Noir", "Bleu", "Rouge", "Vert", "Multicolore", "Naturel"],
    materials: ["Céramique", "Plastique", "Métal", "Verre", "Bois", "Silicone", "Textile"],
    sizes: ["Standard", "Mini", "Maxi", "Voyage", "XL"],
    styles: ["Classique", "Moderne", "Vintage", "Sport", "Luxe", "Minimaliste"]
  },
  emballage: {
    sizes: ["XS", "S", "M", "L", "XL", "Sur mesure"],
    materials: ["Carton", "Kraft", "Recyclé", "Papier", "Plastique biodégradable"],
    colors: ["Blanc", "Kraft", "Noir", "Coloré", "Transparent"],
    finishes: ["Mat", "Brillant", "Satiné", "Soft-touch", "Métallisé"],
    techniques: ["Impression quadri", "Dorure", "Gaufrage", "Vernis sélectif", "Découpe forme"]
  }
};

// Illustration images for variants
const variantIllustrations = {
  textile: {
    sizes: {
      "XS": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "S": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "M": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "L": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "XL": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "XXL": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "3XL": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
    },
    colors: {
      "Blanc": "/lovable-uploads/5c3e6357-3bff-4033-85a4-fc23513fc793.png",
      "Noir": "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
      "Bleu": "/lovable-uploads/1365a433-cc0b-4382-8d64-0402ccf2eccd.png",
      "Rouge": "/lovable-uploads/9c50297c-4e85-4eba-92cf-1786dbe7853d.png",
      "Vert": "/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png",
      "Jaune": "/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png",
      "Gris": "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    },
    materials: {
      "Coton": "/lovable-uploads/d28240cb-3480-4969-9eaf-7e5a3db73a93.png",
      "Polyester": "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
      "Coton Bio": "/lovable-uploads/d28240cb-3480-4969-9eaf-7e5a3db73a93.png",
      "Mélange": "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
      "Lycra": "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
      "Lin": "/lovable-uploads/d28240cb-3480-4969-9eaf-7e5a3db73a93.png",
    },
    styles: {
      "T-shirt": "/lovable-uploads/9850efb4-ef57-4de7-8707-ef1e82277265.png",
      "Polo": "/lovable-uploads/694400ee-4ddd-4bce-8e5e-3941e06b6777.png",
      "Sweat": "/lovable-uploads/c00742ed-9c77-47e2-97c4-41a9401e0f18.png",
      "Hoodie": "/lovable-uploads/c00742ed-9c77-47e2-97c4-41a9401e0f18.png",
      "Débardeur": "/lovable-uploads/9850efb4-ef57-4de7-8707-ef1e82277265.png",
      "Chemise": "/lovable-uploads/694400ee-4ddd-4bce-8e5e-3941e06b6777.png",
    }
  },
  papier: {
    sizes: {
      "A6": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A5": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A4": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A3": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A2": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A1": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "Carte de visite": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "Flyer": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
    },
    // Add other papier variant illustrations
  },
  // Add other category illustrations
};

// Default fallback image
const defaultIllustration = "/lovable-uploads/42f681a1-997f-45a3-aaf6-b01d41e79b33.png";

const ProductOrderForm = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [openIllustration, setOpenIllustration] = useState(false);
  
  // Get quantity options based on selected product category
  const getQuantityOptions = (category: string) => {
    const categoryKey = category as keyof typeof quantityOptions;
    return quantityOptions[categoryKey] || quantityOptions.textile;
  };

  // Update available variants when product category changes
  useEffect(() => {
    if (selectedProduct) {
      const category = selectedProduct.category as keyof typeof categoryVariants;
      const variantKeys = categoryVariants[category] ? Object.keys(categoryVariants[category]) : [];
      setAvailableVariants(variantKeys);
      
      // Reset variant selections when product changes
      setVariants({});
    } else {
      setAvailableVariants([]);
    }
  }, [selectedProduct]);

  const handleVariantChange = (variantType: string, value: string) => {
    setVariants(prev => ({ ...prev, [variantType]: value }));
  };

  const getVariantOptions = (variantType: string) => {
    if (!selectedProduct) return [];
    
    const category = selectedProduct.category as keyof typeof categoryVariants;
    if (!categoryVariants[category]) return [];
    
    // TypeScript needs this type assertion to access the dynamic property
    return (categoryVariants[category] as any)[variantType] || [];
  };

  const getVariantDisplayName = (variantType: string): string => {
    const displayNames: Record<string, string> = {
      sizes: "Taille",
      colors: "Couleur",
      materials: "Matériau",
      styles: "Style",
      thickness: "Épaisseur",
      printDetails: "Détails d'impression",
      paperTypes: "Type de papier",
      folding: "Pliage",
      foldingStyles: "Style de pliage",
      finishes: "Finition",
      techniques: "Technique"
    };
    
    return displayNames[variantType] || variantType;
  };

  // Get illustration image for a specific variant
  const getVariantIllustration = (variantType: string, variantValue: string): string => {
    if (!selectedProduct) return defaultIllustration;
    
    const category = selectedProduct.category as keyof typeof variantIllustrations;
    
    if (
      variantIllustrations[category] && 
      (variantIllustrations[category] as any)[variantType] && 
      (variantIllustrations[category] as any)[variantType][variantValue]
    ) {
      return (variantIllustrations[category] as any)[variantType][variantValue];
    }
    
    return defaultIllustration;
  };

  // Get the currently featured illustration based on most recently selected variant
  const getFeatureIllustration = (): string => {
    if (!selectedProduct || Object.keys(variants).length === 0) return defaultIllustration;
    
    // Get the last selected variant for illustration
    const variantKeys = Object.keys(variants);
    if (variantKeys.length > 0) {
      const lastVariantType = variantKeys[variantKeys.length - 1];
      const lastVariantValue = variants[lastVariantType];
      return getVariantIllustration(lastVariantType, lastVariantValue);
    }
    
    return defaultIllustration;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedQuantity) {
      toast.error("Veuillez sélectionner un produit et une quantité");
      return;
    }
    
    // Here you would typically process the order with the variants
    console.log("Order submitted:", {
      product: selectedProduct,
      quantity: selectedQuantity,
      variants: variants
    });
    
    // Show success message
    toast.success(`Commande de ${selectedQuantity} ${selectedProduct.name} envoyée avec succès !`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Commander vos produits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Form Column */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <SearchableDropdown
                label="Sélectionnez un produit"
                placeholder="Choisir un produit..."
                products={allProducts}
                selectedProduct={selectedProduct}
                onSelect={setSelectedProduct}
              />
              
              {selectedProduct && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {getQuantityOptions(selectedProduct.category).map((quantity) => (
                        <Button
                          key={quantity}
                          type="button"
                          variant={selectedQuantity === quantity ? "default" : "outline"}
                          onClick={() => setSelectedQuantity(quantity)}
                          className="py-2"
                        >
                          {quantity}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Variant selectors */}
                  {availableVariants.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Options spécifiques</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableVariants.map((variantType) => (
                          <div key={variantType}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {getVariantDisplayName(variantType)}
                            </label>
                            <Select
                              onValueChange={(value) => handleVariantChange(variantType, value)}
                              value={variants[variantType] || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Choisir ${getVariantDisplayName(variantType).toLowerCase()}...`} />
                              </SelectTrigger>
                              <SelectContent>
                                {getVariantOptions(variantType).map((option: string) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={!selectedProduct || !selectedQuantity}
                className={cn(
                  "w-full bg-accent text-white py-3 px-6 rounded-md font-medium transition-colors",
                  (!selectedProduct || !selectedQuantity) ? 
                    "opacity-50 cursor-not-allowed" : 
                    "hover:bg-accent/90"
                )}
              >
                Commander
              </button>
            </div>
          </form>
        </div>

        {/* Illustration Column */}
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center relative">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Aperçu des options</h3>
          <div className="border border-gray-200 rounded-lg w-full h-80 flex items-center justify-center overflow-hidden bg-white">
            {selectedProduct ? (
              <div className="flex flex-col items-center">
                <img 
                  src={getFeatureIllustration()} 
                  alt="Option aperçu" 
                  className="max-w-full max-h-64 object-contain" 
                />
                <div className="mt-4 text-center">
                  <h4 className="font-medium">{selectedProduct.name}</h4>
                  <div className="text-sm text-gray-600 max-w-xs mt-2">
                    {Object.entries(variants).map(([type, value]) => (
                      <div key={type} className="inline-block mr-2 mb-1">
                        <span className="font-medium">{getVariantDisplayName(type)}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">Sélectionnez un produit et ses options pour visualiser l'aperçu</p>
              </div>
            )}
          </div>

          {/* Mobile view: show illustration in a sheet */}
          <div className="md:hidden mt-4 w-full">
            <Sheet open={openIllustration} onOpenChange={setOpenIllustration}>
              <SheetTrigger asChild>
                <Button className="w-full" variant="outline">
                  Voir l'aperçu
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh]">
                <SheetHeader>
                  <SheetTitle>Aperçu des options</SheetTitle>
                  <SheetDescription>
                    {selectedProduct ? 
                      `${selectedProduct.name} avec vos options personnalisées` : 
                      "Sélectionnez un produit pour voir l'aperçu"}
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 flex items-center justify-center p-6">
                  {selectedProduct ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={getFeatureIllustration()} 
                        alt="Option aperçu" 
                        className="max-w-full max-h-64 object-contain" 
                      />
                      <div className="mt-4 text-center">
                        <h4 className="font-medium">{selectedProduct.name}</h4>
                        <div className="text-sm text-gray-600 max-w-xs mt-2">
                          {Object.entries(variants).map(([type, value]) => (
                            <div key={type} className="inline-block mr-2 mb-1">
                              <span className="font-medium">{getVariantDisplayName(type)}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p>Sélectionnez un produit et ses options pour visualiser l'aperçu</p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Variant illustrations (hidden on mobile) */}
          {selectedProduct && Object.keys(variants).length > 0 && (
            <div className="hidden md:flex flex-wrap mt-4 gap-2 justify-center">
              {Object.entries(variants).map(([type, value]) => (
                <Popover key={`${type}-${value}`}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      {getVariantDisplayName(type)}: {value}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="text-center">
                      <img 
                        src={getVariantIllustration(type, value)} 
                        alt={`${getVariantDisplayName(type)}: ${value}`} 
                        className="max-w-full h-32 object-contain mx-auto" 
                      />
                      <p className="mt-2 text-sm font-medium">{getVariantDisplayName(type)}: {value}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOrderForm;

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useShoppingCart } from "@/hooks/use-shopping-cart";
import { useToast } from "@/hooks/use-toast";
import {
  getQuantityOptions,
  getVariantDisplayName,
  getVariantOptions,
  getAvailableVariants
} from "./utils";
import VariantSelector from "./VariantSelector";
import ProductIllustration from "./ProductIllustration";
import { useIsMobile } from "@/hooks/use-mobile";

const ProductOrderForm = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [openIllustration, setOpenIllustration] = useState(false);
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  const [activeVariantType, setActiveVariantType] = useState<string | undefined>();
  const [activeVariantValue, setActiveVariantValue] = useState<string | undefined>();
  
  const { addItem } = useShoppingCart();
  const { toast } = useToast();

  // Mock product data (replace with actual data fetching)
  const products: Product[] = [
    {
      id: "1",
      name: "T-shirt Premium Bio",
      description: "Un t-shirt doux et confortable en coton biologique.",
      price: 16.99,
      category: "textile",
      subcategory: "t-shirts",
      variants: {
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blanc", "Noir", "Gris"]
      },
      images: [
        "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      ],
    },
    {
      id: "2",
      name: "Mug personnalisé",
      description: "Un mug en céramique pour toutes vos boissons chaudes.",
      price: 9.99,
      category: "accessoires",
      subcategory: "mugs",
      variants: {
        colors: ["Blanc", "Noir", "Rouge", "Bleu"]
      },
      images: [
        "/lovable-uploads/42f681a1-997f-45a3-aaf6-b01d41e79b33.png",
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1555864432-95c2dca5c9ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1576566529644-4e3a570b8267?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1563734247033-9ca7a6cb3329?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      ],
    },
  ];

  useEffect(() => {
    // Simulate fetching products from an API
    const fetchedProduct = products.find(p => p.id === "1");
    setSelectedProduct(fetchedProduct);

    if (fetchedProduct) {
      setAvailableVariants(getAvailableVariants(fetchedProduct.category));
    }
  }, []);

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setSelectedVariants({}); // Reset selected variants when product changes

    if (product) {
      setAvailableVariants(getAvailableVariants(product.category));
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleVariantChange = (variantType: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantType]: value }));
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast({
        title: "Erreur!",
        description: "Veuillez sélectionner un produit.",
        variant: "destructive",
      });
      return;
    }

    // Basic validation: Check if all required variants are selected
    const requiredVariants = getAvailableVariants(selectedProduct.category);
    const missingVariants = requiredVariants.filter(variant => !selectedVariants[variant]);

    if (missingVariants.length > 0) {
      toast({
        title: "Erreur!",
        description: `Veuillez sélectionner toutes les options: ${missingVariants.map(getVariantDisplayName).join(', ')}.`,
        variant: "destructive",
      });
      return;
    }

    // Construct the item to add to the cart
    const item = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: quantity,
      variants: selectedVariants,
      images: selectedProduct.images,
    };

    addItem(item);
    toast({
      description: "Produit ajouté au panier!",
    });
  };

  // Handle viewing an illustration for a specific variant
  const handleViewVariantIllustration = (variantType: string, value: string) => {
    setActiveVariantType(variantType);
    setActiveVariantValue(value);
    setOpenIllustration(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Configurez votre produit</h2>
        <p className="text-gray-600">Choisissez les options et quantités pour personnaliser votre commande.</p>
      </div>
      
      {/* Preview button for mobile */}
      {isMobile && (
        <div className="mb-4">
          <Button onClick={() => setOpenIllustration(true)} className="w-full">
            Aperçu des options
          </Button>
        </div>
      )}
      
      {/* Product illustration component */}
      <ProductIllustration
        selectedProduct={selectedProduct}
        variants={selectedVariants}
        openIllustration={openIllustration}
        setOpenIllustration={setOpenIllustration}
        activeVariantType={activeVariantType}
        activeVariantValue={activeVariantValue}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="font-medium text-lg mb-4">Sélection du produit</h3>
          <Select onValueChange={handleProductSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un produit..." />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {/* Variants Selection */}
          {selectedProduct && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-medium text-lg mb-4">Options personnalisables</h3>
              <div className="space-y-4">
                {availableVariants.map((variantType) => (
                  <VariantSelector
                    key={variantType}
                    variantType={variantType}
                    displayName={getVariantDisplayName(variantType)}
                    options={getVariantOptions(selectedProduct.category, variantType)}
                    selectedValue={selectedVariants[variantType] || ''}
                    onChange={(value) => handleVariantChange(variantType, value)}
                    productCategory={selectedProduct.category}
                    onViewIllustration={handleViewVariantIllustration}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="font-medium text-lg mb-4">Quantité</h3>
            <Select onValueChange={(value) => handleQuantityChange(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une quantité..." />
              </SelectTrigger>
              <SelectContent>
                {selectedProduct && getQuantityOptions(selectedProduct.category).map((qty) => (
                  <SelectItem key={qty} value={String(qty)}>
                    {qty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleAddToCart}>
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderForm;

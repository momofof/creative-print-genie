
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import VariantSelector from "../home/ProductOrderForm/VariantSelector";

interface ProductCardProps {
  product: Product;
  showVariants?: boolean;
}

const ProductCard = ({ product, showVariants = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [selectedVariantOptions, setSelectedVariantOptions] = useState<Record<string, string>>({});

  // Extraire les options de variantes disponibles
  const variantOptions: Record<string, string[]> = {};
  
  if (product.variants && product.variants.length > 0) {
    // Collecter les options uniques pour chaque type de variante
    product.variants.forEach(variant => {
      // Couleur
      if (variant.color && !variantOptions['color']) {
        variantOptions['color'] = [];
      }
      if (variant.color && !variantOptions['color'].includes(variant.color)) {
        variantOptions['color'].push(variant.color);
      }
      
      // Taille
      if (variant.size && !variantOptions['size']) {
        variantOptions['size'] = [];
      }
      if (variant.size && !variantOptions['size'].includes(variant.size)) {
        variantOptions['size'].push(variant.size);
      }
      
      // Format
      if (variant.format && !variantOptions['format']) {
        variantOptions['format'] = [];
      }
      if (variant.format && !variantOptions['format'].includes(variant.format)) {
        variantOptions['format'].push(variant.format);
      }
    });
  }

  const handleVariantChange = (variantType: string, value: string) => {
    setSelectedVariantOptions(prev => ({
      ...prev,
      [variantType]: value
    }));

    // Trouver la variante correspondante
    if (product.variants && product.variants.length > 0) {
      const matchingVariant = product.variants.find(variant => 
        (variantType === 'color' ? variant.color === value : true) &&
        (variantType === 'size' ? variant.size === value : true) &&
        (variantType === 'format' ? variant.format === value : true)
      );
      
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      }
    }
  };

  const handleViewProduct = () => {
    navigate(`/products/${product.id}`);
  };

  const handleOrderNow = () => {
    navigate(`/order/${product.id}`);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md">
      <div className="relative pt-[100%]">
        <img
          src={selectedVariant?.imageUrl || product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {product.originalPrice && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            Promo
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {product.category} {product.subcategory ? `· ${product.subcategory}` : ''}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-bold text-lg">
            {formatPrice(product.price + (selectedVariant?.priceAdjustment || 0))}
          </span>
          
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Affichage des variantes */}
        {showVariants && Object.keys(variantOptions).length > 0 && (
          <div className="space-y-3 mt-3">
            {Object.entries(variantOptions).map(([variantType, options]) => (
              <div key={variantType} className="space-y-1">
                <VariantSelector
                  variantType={variantType}
                  displayName={
                    variantType === 'color' ? 'Couleur' :
                    variantType === 'size' ? 'Taille' :
                    variantType === 'format' ? 'Format' : 
                    variantType
                  }
                  options={options}
                  selectedValue={selectedVariantOptions[variantType] || ''}
                  onChange={(value) => handleVariantChange(variantType, value)}
                  productCategory={product.category}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleViewProduct}
        >
          Détails
        </Button>
        <Button 
          className="flex-1"
          onClick={handleOrderNow}
        >
          Commander
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

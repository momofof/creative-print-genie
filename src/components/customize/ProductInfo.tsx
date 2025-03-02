
import React from "react";
import { Button } from "@/components/ui/button";
import { Star, Truck, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, Color } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  colors: Color[];
  selectedColor: string;
  setSelectedColor: (colorId: string) => void;
  onChooseQuantityAndSize: () => void;
}

const ProductInfo = ({ 
  product, 
  colors, 
  selectedColor, 
  setSelectedColor,
  onChooseQuantityAndSize
}: ProductInfoProps) => {
  const deliveryDate = "13 - 27 mars";
  
  return (
    <div className="w-full max-w-sm p-6 border-l border-gray-200 bg-white">
      <h1 className="text-xl font-bold mb-2">
        {product.name}
      </h1>
      
      <div className="flex items-center mb-4">
        <Truck className="w-4 h-4 mr-2 text-gray-600" />
        <div className="text-sm">
          <span className="font-medium">Livraison:</span> {deliveryDate}
        </div>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${
                i < Math.floor(product.rating) 
                  ? "text-yellow-400 fill-yellow-400" 
                  : i < product.rating 
                    ? "text-yellow-400 fill-yellow-400" 
                    : "text-gray-300"
              }`} 
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">({product.reviewCount})</span>
      </div>
      
      <div className="mb-4">
        <h2 className="font-medium mb-2">Couleur du produit: {colors.find(c => c.id === selectedColor)?.name}</h2>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              className={`w-8 h-8 rounded-full focus:outline-none ${
                selectedColor === color.id ? "ring-2 ring-accent ring-offset-2" : ""
              } ${!color.available ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ backgroundColor: color.hex, border: color.id === 'white' ? '1px solid #e5e7eb' : 'none' }}
              onClick={() => color.available && setSelectedColor(color.id)}
              disabled={!color.available}
              aria-label={`Couleur ${color.name}`}
            />
          ))}
        </div>
      </div>
      
      <Link to={`/products/detail/${product.id}`}>
        <div className="text-accent hover:underline flex items-center mb-6">
          <span>Voir les détails du produit</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </Link>
      
      <Button 
        className="w-full py-6 bg-teal-600 hover:bg-teal-700"
        onClick={onChooseQuantityAndSize}
      >
        Choisir la quantité & taille
      </Button>
    </div>
  );
};

export default ProductInfo;

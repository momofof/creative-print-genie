
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";

interface ProductActionsProps {
  productId?: string;
  productName?: string;
  productPrice?: number;
  selectedColor?: string;
  selectedSize?: string;
  quantity?: number;
}

const ProductActions = ({ 
  productId = "", 
  productName = "Produit",
  productPrice = 0,
  selectedColor,
  selectedSize,
  quantity = 1
}: ProductActionsProps) => {
  const { addToCart, isLoading } = useCart();
  const { addToFavorites } = useFavorites();

  const handleAddToCart = async () => {
    await addToCart({
      productId,
      productName,
      productPrice,
      quantity,
      selectedColor,
      selectedSize
    });
  };

  const handleAddToFavorites = async () => {
    await addToFavorites(productId);
  };
  
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <Button 
        className="w-full py-6 text-base font-medium flex items-center gap-2 bg-accent hover:bg-accent/90"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Ajout en cours...
          </span>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Ajouter au panier
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full py-6 text-base font-medium flex items-center justify-center gap-2"
        onClick={handleAddToFavorites}
      >
        <Heart className="w-5 h-5" />
        Ajouter aux favoris
      </Button>
      
      <Link to={`/customize/${productId || ''}`}>
        <Button 
          className="w-full py-6 text-base font-medium bg-teal-600 hover:bg-teal-700"
        >
          Personnaliser
        </Button>
      </Link>
    </div>
  );
};

export default ProductActions;

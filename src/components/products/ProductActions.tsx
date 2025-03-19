
import React from "react";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { 
  AddToCartButton, 
  AddToFavoritesButton, 
  CustomizeProductButton 
} from "./ActionButtons";

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
  const { addToFavorites, isFavoriteLoading } = useFavorites();

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
      <AddToCartButton 
        onClick={handleAddToCart}
        isLoading={isLoading}
      />
      
      <AddToFavoritesButton 
        onClick={handleAddToFavorites}
        isLoading={isFavoriteLoading}
      />
      
      <CustomizeProductButton productId={productId} />
    </div>
  );
};

export default ProductActions;

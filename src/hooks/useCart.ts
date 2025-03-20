
import { useEffect } from "react";
import { useCartState } from "./cart/useCartState";
import { useCartOperations } from "./cart/useCartOperations";
import { useCartLoader } from "./cart/useCartLoader";
import { UseCartReturn } from "@/types/cart";

export const useCart = (): UseCartReturn => {
  const { 
    isLoading, 
    setIsLoading, 
    cartItems, 
    setCartItems, 
    userId 
  } = useCartState();
  
  const { 
    addToCart, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    editCartItem, 
    totalPrice 
  } = useCartOperations({
    cartItems,
    setCartItems,
    userId,
    setIsLoading
  });

  const { loadCart } = useCartLoader({
    userId,
    setCartItems,
    setIsLoading
  });

  // Load cart items when user ID changes
  useEffect(() => {
    loadCart();
  }, [userId]);

  return {
    cartItems,
    isLoading,
    totalPrice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    loadCart,
    editCartItem
  };
};


import { useEffect } from "react";
import { calculateTotalPrice } from "@/utils/cartCalculations";
import { useCartState } from "./cart/useCartState";
import { useCartOperations } from "./cart/useCartOperations";
import { usePendingCartItem } from "./cart/usePendingCartItem";
import { useCartLoading } from "./cart/useCartLoading";

export const useCart = () => {
  const {
    cartItems,
    setCartItems,
    isLoading,
    setIsLoading,
    userId,
    pendingItemProcessed,
    setPendingItemProcessed
  } = useCartState();
  
  const { loadCart } = useCartLoading({
    userId,
    setCartItems,
    setIsLoading
  });
  
  const {
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    editCartItem
  } = useCartOperations({
    cartItems,
    setCartItems,
    isLoading,
    setIsLoading,
    userId
  });
  
  // Process pending cart items when user logs in
  usePendingCartItem({
    userId,
    cartItems,
    pendingItemProcessed,
    setPendingItemProcessed,
    addToCart
  });
  
  // Load cart when userId changes
  useEffect(() => {
    loadCart();
  }, [userId]);
  
  // Calculate total price
  const totalPrice = calculateTotalPrice(cartItems);
  
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


import { useEffect } from "react";
import { UseCartReturn } from "@/types/cart";
import { useCartOperations } from "./useCartOperations";
import { calculateTotalPrice } from "@/utils/cartCalculations";

// Main hook that combines cart storage and operations
export const useCart = (): UseCartReturn => {
  const {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    editCartItem,
    loadCart
  } = useCartOperations();

  // Load cart items when cart is initialized
  useEffect(() => {
    loadCart();
  }, []);

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

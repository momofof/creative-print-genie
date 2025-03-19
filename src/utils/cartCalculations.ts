
import { CartItem } from "@/types/product";

export const calculateTotalPrice = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

export const findExistingItemIndex = (
  cartItems: CartItem[], 
  productId: string, 
  variants?: Record<string, string>
): number => {
  return cartItems.findIndex((item) => 
    item.id === productId && 
    JSON.stringify(item.variants || {}) === JSON.stringify(variants || {})
  );
};

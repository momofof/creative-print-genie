
import { CartItem } from "@/types/product";

/**
 * Sauvegarde le panier dans le localStorage
 */
export const saveCartToLocalStorage = (cartItems: CartItem[]): void => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

/**
 * Récupère le panier depuis le localStorage
 */
export const getCartFromLocalStorage = (): CartItem[] => {
  try {
    const cart = localStorage.getItem("cart");
    if (cart) {
      return JSON.parse(cart) as CartItem[];
    }
  } catch (error) {
    console.error("Error getting cart from localStorage:", error);
  }
  return [];
};

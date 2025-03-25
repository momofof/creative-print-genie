
import { CartItem } from "@/types/product";

export const saveCartToLocalStorage = (cartItems: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

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

export const addItemToLocalCart = (item: CartItem) => {
  const cart = getCartFromLocalStorage();
  const existingItem = cart.find(
    (cartItem) => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.variants || {}) === JSON.stringify(item.variants || {})
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCartToLocalStorage(cart);
};

export const removeItemFromLocalCart = (index: number) => {
  const cart = getCartFromLocalStorage();
  cart.splice(index, 1);
  saveCartToLocalStorage(cart);
};

export const updateItemQuantityInLocalCart = (index: number, quantity: number) => {
  const cart = getCartFromLocalStorage();
  if (cart[index]) {
    cart[index].quantity = quantity;
    saveCartToLocalStorage(cart);
  }
};

export const clearLocalCart = () => {
  localStorage.removeItem("cart");
};

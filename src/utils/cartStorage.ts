
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
  try {
    const cart = getCartFromLocalStorage();
    const existingItemIndex = cart.findIndex(
      (cartItem) => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.variants || {}) === JSON.stringify(item.variants || {})
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    saveCartToLocalStorage(cart);
    console.log("Item added to local cart:", item, "New cart:", cart);
  } catch (error) {
    console.error("Error adding item to local cart:", error);
  }
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

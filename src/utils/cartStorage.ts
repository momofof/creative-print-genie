
import { CartItem } from "@/types/product";

export const saveCartToLocalStorage = (cartItems: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    console.log("Cart saved to localStorage:", cartItems);
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const getCartFromLocalStorage = (): CartItem[] => {
  try {
    const cart = localStorage.getItem("cart");
    if (cart) {
      const parsedCart = JSON.parse(cart) as CartItem[];
      console.log("Cart loaded from localStorage:", parsedCart);
      return parsedCart;
    }
  } catch (error) {
    console.error("Error getting cart from localStorage:", error);
  }
  return [];
};

export const addItemToLocalCart = (item: CartItem) => {
  try {
    console.log("Adding item to local cart:", item);
    const cart = getCartFromLocalStorage();
    const existingItemIndex = cart.findIndex(
      (cartItem) => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.variants || {}) === JSON.stringify(item.variants || {})
    );

    if (existingItemIndex >= 0) {
      console.log("Found existing item at index:", existingItemIndex);
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      console.log("Adding new item to cart");
      cart.push(item);
    }

    saveCartToLocalStorage(cart);
    console.log("Updated local cart:", cart);
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
  console.log("Cart cleared from localStorage");
};

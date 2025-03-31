
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { AddToCartProps, UseCartReturn } from "@/types/cart";
import { calculateTotalPrice, findExistingItemIndex } from "@/utils/cartCalculations";
import { useCartAuth } from "@/hooks/useCartAuth";
import { loadCartItems, saveCart, addLegacyCartItem } from "@/utils/cartOperations";

export const useCart = (): UseCartReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { userId, isLoading, setIsLoading } = useCartAuth();

  // Load cart items when user ID changes
  useEffect(() => {
    loadCart();
  }, [userId]);

  const loadCart = async () => {
    setIsLoading(true);
    
    try {
      const loadedItems = await loadCartItems(userId);
      setCartItems(loadedItems);
    } catch (error) {
      console.error("Failed to load cart:", error);
      toast.error("Unable to load your cart");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async ({
    productId,
    productName,
    productPrice,
    quantity,
    selectedColor,
    selectedSize
  }: AddToCartProps): Promise<boolean> => {
    if (!productId) {
      toast.error("Cannot add to cart: Missing product ID");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Use our utility function to add the item to the cart
      const updatedCart = await addLegacyCartItem({
        cartItems,
        productId,
        productName,
        productPrice,
        quantity,
        selectedColor,
        selectedSize
      });
      
      // Update cart state
      setCartItems(updatedCart);
      
      // Save updated cart
      await saveCart(updatedCart, userId);
      
      toast.success(`${productName} added to cart`);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    saveCart(updatedCart, userId);
    
    toast.success("Quantity updated");
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    saveCart(updatedCart, userId);
    
    toast.success("Product removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([], userId);
    toast.success("Cart cleared");
  };

  const editCartItem = (id: string, newQuantity: number, options?: Record<string, string>) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { 
          ...item, 
          quantity: newQuantity,
          variants: options || item.variants
        };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    saveCart(updatedCart, userId);
    
    toast.success("Panier mis à jour");
  };

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

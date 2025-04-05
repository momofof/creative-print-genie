
import { useState } from "react";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { saveCartItemsToDatabase } from "@/services/cartAPI";
import { saveCartToLocalStorage } from "@/services/cartStorage";
import { findExistingItemIndex } from "@/utils/cartCalculations";
import { AddToCartProps } from "@/types/cart";

interface UseCartOperationsProps {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  userId: string | null;
}

export const useCartOperations = ({
  cartItems,
  setCartItems,
  isLoading,
  setIsLoading,
  userId
}: UseCartOperationsProps) => {
  
  const saveCart = async (updatedCartItems: CartItem[]) => {
    try {
      if (userId) {
        await saveCartItemsToDatabase(userId, updatedCartItems);
      } else {
        saveCartToLocalStorage(updatedCartItems);
      }
      
      setCartItems(updatedCartItems);
      return true;
    } catch (error) {
      console.error("Failed to save cart:", error);
      toast.error("Impossible de sauvegarder votre panier");
      return false;
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
    setIsLoading(true);
    
    try {
      const variants: Record<string, string> = {};
      if (selectedColor) variants.color = selectedColor;
      if (selectedSize) variants.size = selectedSize;
      
      const newItem: CartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: "/placeholder.svg",
        variants: Object.keys(variants).length > 0 ? variants : undefined
      };
      
      const currentCart = [...cartItems];
      
      const existingItemIndex = findExistingItemIndex(currentCart, productId, variants);
      
      if (existingItemIndex >= 0) {
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        currentCart.push(newItem);
      }
      
      await saveCart(currentCart);
      
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Erreur lors de l'ajout au panier");
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
    
    saveCart(updatedCart);
    toast.success("Quantité mise à jour");
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    saveCart(updatedCart);
    toast.success("Produit retiré du panier");
  };

  const clearCart = () => {
    saveCart([]);
    toast.success("Panier vidé");
  };

  const editCartItem = (id: string, newQuantity: number, variants?: Record<string, string>) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { 
          ...item, 
          quantity: newQuantity,
          variants: variants || item.variants
        };
      }
      return item;
    });
    
    saveCart(updatedCart);
    toast.success("Panier mis à jour");
  };

  return {
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    saveCart,
    editCartItem
  };
};

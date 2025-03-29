
import { useState } from "react";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { AddToCartProps } from "@/types/cart";
import { findExistingItemIndex } from "@/utils/cartCalculations";
import { useCartStorage } from "./useCartStorage";

interface UseCartOperationsReturn {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (props: AddToCartProps) => Promise<boolean>;
  updateQuantity: (id: string, newQuantity: number, variants?: Record<string, string>) => void;
  removeItem: (id: string, variants?: Record<string, string>) => void;
  clearCart: () => void;
  editCartItem: (id: string, newQuantity: number, options?: Record<string, string>) => void;
  loadCart: () => Promise<void>;
}

export const useCartOperations = (): UseCartOperationsReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isLoading, saveCart, loadCart: loadCartStorage } = useCartStorage();

  const loadCart = async (): Promise<void> => {
    const items = await loadCartStorage();
    setCartItems(items);
  };

  const addToCart = async ({
    productId,
    productName,
    productPrice,
    quantity,
    selectedColor,
    selectedSize,
    productImage,
    supplierId,
    variants = {}
  }: AddToCartProps): Promise<boolean> => {
    if (!productId) {
      toast.error("Impossible d'ajouter au panier: ID du produit manquant");
      return false;
    }

    try {
      // Prepare the item variants as a Record<string, string>
      const itemVariants: Record<string, string> = { ...variants };
      
      // Add selectedColor and selectedSize to variants if provided
      if (selectedColor) itemVariants.color = selectedColor;
      if (selectedSize) itemVariants.size = selectedSize;
      
      const newItem: CartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: productImage || "/placeholder.svg",
        supplier_id: supplierId,
        variants: Object.keys(itemVariants).length > 0 ? itemVariants : undefined
      };
      
      // Copy current cart
      const currentCart = [...cartItems];
      
      // Check if item already exists in cart
      const existingItemIndex = findExistingItemIndex(currentCart, productId, itemVariants);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        currentCart.push(newItem);
      }
      
      // Update cart state
      setCartItems(currentCart);
      
      // Save updated cart
      await saveCart(currentCart);
      
      toast.success(`${productName} ajouté au panier`);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Erreur lors de l'ajout au panier");
      return false;
    }
  };

  const updateQuantity = (id: string, newQuantity: number, variants: Record<string, string> = {}) => {
    if (newQuantity < 1) return;
    
    const existingItemIndex = findExistingItemIndex(cartItems, id, variants);
    
    if (existingItemIndex === -1) return;
    
    const updatedCart = [...cartItems];
    updatedCart[existingItemIndex].quantity = newQuantity;
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Quantité mise à jour");
  };

  const removeItem = (id: string, variants: Record<string, string> = {}) => {
    const existingItemIndex = findExistingItemIndex(cartItems, id, variants);
    
    if (existingItemIndex === -1) return;
    
    const updatedCart = [...cartItems];
    updatedCart.splice(existingItemIndex, 1);
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Produit retiré du panier");
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
    toast.success("Panier vidé");
  };

  const editCartItem = (id: string, newQuantity: number, options: Record<string, string> = {}) => {
    const existingItemIndex = findExistingItemIndex(cartItems, id, options);
    
    if (existingItemIndex === -1) return;
    
    const updatedCart = [...cartItems];
    const item = updatedCart[existingItemIndex];
    
    item.quantity = newQuantity;
    if (options) {
      item.variants = { ...item.variants, ...options } as Record<string, string>;
    }
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Panier mis à jour");
  };

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    editCartItem,
    loadCart
  };
};

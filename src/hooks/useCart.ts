
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { AddToCartProps, UseCartReturn } from "@/types/cart";
import { 
  saveCartToSupabase, 
  saveCartToLocalStorage, 
  loadCartFromSupabase, 
  loadCartFromLocalStorage 
} from "@/utils/cartStorage";
import { calculateTotalPrice, findExistingItemIndex } from "@/utils/cartCalculations";

export const useCart = (): UseCartReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if user is logged in and get their ID
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Load cart items when user ID changes
  useEffect(() => {
    loadCart();
  }, [userId]);

  const loadCart = async () => {
    setIsLoading(true);
    
    try {
      let loadedItems: CartItem[] = [];
      
      if (userId) {
        // Load cart from Supabase for logged-in users
        loadedItems = await loadCartFromSupabase(userId);
      } else {
        // Load cart from localStorage for anonymous users
        loadedItems = loadCartFromLocalStorage();
      }
      
      setCartItems(loadedItems);
    } catch (error) {
      console.error("Failed to load cart data:", error);
      toast.error("Unable to load your cart");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save cart items
  const saveCart = async (updatedCartItems: CartItem[]) => {
    try {
      if (userId) {
        await saveCartToSupabase(userId, updatedCartItems);
      } else {
        saveCartToLocalStorage(updatedCartItems);
      }
    } catch (error) {
      console.error("Failed to save cart:", error);
      toast.error("Unable to save your cart");
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
      // Create variants object if color or size is selected
      const variants: Record<string, string> = {};
      if (selectedColor) variants['couleur'] = selectedColor;
      if (selectedSize) variants['taille'] = selectedSize;
      
      const newItem: CartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: "/placeholder.svg", // Default image
        variants: Object.keys(variants).length > 0 ? variants : undefined
      };
      
      // Copy current cart
      const currentCart = [...cartItems];
      
      // Check if item already exists in cart
      const existingItemIndex = findExistingItemIndex(
        currentCart, 
        productId, 
        newItem.variants
      );
      
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
    saveCart(updatedCart);
    
    toast.success("Quantity updated");
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Product removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
    toast.success("Cart cleared");
  };

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
    loadCart
  };
};

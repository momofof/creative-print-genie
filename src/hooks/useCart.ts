
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { AddToCartProps, UseCartReturn } from "@/types/cart";
import { calculateTotalPrice, findExistingItemIndex } from "@/utils/cartCalculations";
import { saveCartToLocalStorage, getCartFromLocalStorage } from "@/utils/cartStorage";

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
        // Load cart from database for logged-in users
        const { data, error } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", userId);
        
        if (error) throw error;
        
        // Process database items into CartItem objects with explicit typing
        loadedItems = data.map((item: any) => {
          // First create a basic cart item without variants
          const cartItem: CartItem = {
            id: item.product_id || "",
            name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || "/placeholder.svg",
            supplier_id: item.supplier_id
          };
          
          // Separately build variant options to avoid recursion
          const variantOptions: Record<string, string> = {};
          
          // Only add properties if they exist
          if (item.option_color) variantOptions.color = item.option_color;
          if (item.option_size) variantOptions.size = item.option_size;
          if (item.option_format) variantOptions.format = item.option_format;
          if (item.option_quantity) variantOptions.quantity = item.option_quantity;
          
          // Only assign variants property if we have any options
          if (Object.keys(variantOptions).length > 0) {
            cartItem.variants = variantOptions;
          }
          
          return cartItem;
        });
      } else {
        // Load cart from localStorage for anonymous users
        loadedItems = getCartFromLocalStorage();
      }
      
      setCartItems(loadedItems);
    } catch (error) {
      console.error("Failed to load cart data:", error);
      toast.error("Impossible de charger votre panier");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCart = async (updatedCartItems: CartItem[]) => {
    try {
      if (userId) {
        // For logged-in users, save to database
        // First, delete all existing items
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", userId);
          
        if (updatedCartItems.length > 0) {
          // Then insert the updated cart items
          const cartData = updatedCartItems.map(item => ({
            user_id: userId,
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            supplier_id: item.supplier_id,
            option_color: item.variants?.color,
            option_size: item.variants?.size,
            option_format: item.variants?.format,
            option_quantity: item.variants?.quantity
          }));
          
          const { error } = await supabase
            .from("cart_items")
            .insert(cartData);
            
          if (error) throw error;
        }
      } else {
        // For anonymous users, save to localStorage
        saveCartToLocalStorage(updatedCartItems);
      }
      
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Failed to save cart:", error);
      toast.error("Impossible de sauvegarder votre panier");
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
        image: "/placeholder.svg", // Image par défaut
        variants: Object.keys(variants).length > 0 ? variants : undefined
      };
      
      // Copier le panier actuel
      const currentCart = [...cartItems];
      
      // Vérifier si l'article existe déjà dans le panier
      const existingItemIndex = findExistingItemIndex(currentCart, productId, variants);
      
      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité si l'article existe
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Ajouter un nouvel article
        currentCart.push(newItem);
      }
      
      // Sauvegarder le panier mis à jour
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

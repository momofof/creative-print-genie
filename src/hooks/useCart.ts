
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { AddToCartProps, UseCartReturn } from "@/types/cart";
import { fetchCartItems, saveCartItemsToDatabase } from "@/services/cartAPI";
import { saveCartToLocalStorage, getCartFromLocalStorage } from "@/services/cartStorage";
import { calculateTotalPrice, findExistingItemIndex } from "@/utils/cartCalculations";

export const useCart = (): UseCartReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [pendingItemProcessed, setPendingItemProcessed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    checkAuth();
    
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

  useEffect(() => {
    loadCart();
  }, [userId]);

  useEffect(() => {
    const handlePendingCartItem = async () => {
      if (userId && !pendingItemProcessed) {
        const pendingCartItem = localStorage.getItem("pendingCartItem");
        if (pendingCartItem) {
          try {
            // Mark as processed to prevent multiple processing attempts
            setPendingItemProcessed(true);
            localStorage.removeItem("pendingCartItem");
            
            const item = JSON.parse(pendingCartItem);
            
            const existingItemIndex = findExistingItemIndex(
              cartItems,
              item.productId,
              item.variants || {}
            );
            
            if (existingItemIndex === -1) {
              console.log("Adding pending item to cart:", item);
              await addToCart({
                productId: item.productId,
                productName: item.productName,
                productPrice: item.productPrice,
                quantity: item.quantity,
                selectedColor: item.variants?.color,
                selectedSize: item.variants?.size
              });
              
              toast.success(`${item.productName} ajouté au panier`);
            } else {
              console.log("Item already exists in cart, not adding duplicate");
            }
          } catch (error) {
            console.error("Erreur lors du traitement de l'article en attente:", error);
          } finally {
            // Reset processing flag after a delay to prevent immediate re-processing
            setTimeout(() => setPendingItemProcessed(false), 2000);
          }
        }
      }
    };

    handlePendingCartItem();
  }, [userId, cartItems]);

  const loadCart = async () => {
    setIsLoading(true);
    
    try {
      let loadedItems: CartItem[] = [];
      
      if (userId) {
        loadedItems = await fetchCartItems(userId);
      } else {
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
        await saveCartItemsToDatabase(userId, updatedCartItems);
      } else {
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

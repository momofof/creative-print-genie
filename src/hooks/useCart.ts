
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { AddToCartProps, UseCartReturn } from "@/types/cart";
import { calculateTotalPrice, findExistingItemIndex } from "@/utils/cartCalculations";
import { saveCartToLocalStorage, getCartFromLocalStorage } from "@/utils/cartStorage";

// Interface pour les données reçues de la base de données
interface CartItemImproved {
  id: string;
  user_id: string | null;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image: string | null;
  supplier_id: string | null;
  variants: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export const useCart = (): UseCartReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

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

  const loadCart = async () => {
    setIsLoading(true);
    
    try {
      let loadedItems: CartItem[] = [];
      
      if (userId) {
        const { data, error } = await supabase
          .from("cart_items_improved")
          .select("*")
          .eq("user_id", userId);
        
        if (error) throw error;
        
        // Conversion explicite des données de Supabase
        const cartData = data as unknown as CartItemImproved[];
        
        // Transformation en CartItem
        loadedItems = cartData.map((item) => ({
          id: item.product_id,
          name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "/placeholder.svg",
          supplier_id: item.supplier_id || undefined,
          variants: item.variants && Object.keys(item.variants).length > 0 ? item.variants : undefined
        }));
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
        await supabase
          .from("cart_items_improved")
          .delete()
          .eq("user_id", userId);
          
        if (updatedCartItems.length > 0) {
          const cartData = updatedCartItems.map(item => ({
            user_id: userId,
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            supplier_id: item.supplier_id,
            variants: item.variants || {}
          }));
          
          const { error } = await supabase
            .from("cart_items_improved")
            .insert(cartData);
            
          if (error) throw error;
        }
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


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { AddToCartProps, UseCartReturn } from "@/types/cart";
import { calculateTotalPrice, findExistingItemIndex } from "@/utils/cartCalculations";
import { saveCartToLocalStorage, getCartFromLocalStorage } from "@/utils/cartStorage";

// Interface simplifiée pour les données reçues de la base de données
interface CartItemResponse {
  id: string;
  user_id: string | null;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  image: string | null;
  supplier_id: string | null;
  option_color: string | null;
  option_size: string | null;
  option_format: string | null;
  option_quantity: string | null;
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
        // Avoid type instantiation issues by using explicit typing
        const { data, error } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", userId);
        
        if (error) throw error;
        
        // Convert the data safely with proper typing
        loadedItems = (data as any[]).map((item): CartItem => ({
          id: item.product_id || '',
          name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "/placeholder.svg",
          supplier_id: item.supplier_id,
          variants: item.option_color || item.option_size || item.option_format || item.option_quantity ? 
            {
              color: item.option_color,
              size: item.option_size,
              format: item.option_format,
              quantity: item.option_quantity
            } : undefined
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
        // Supprimer les anciens éléments
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", userId);
          
        if (updatedCartItems.length > 0) {
          // Préparer les données pour l'insertion
          const cartData = updatedCartItems.map(item => {
            // Extraire les variantes si elles existent
            const variants = item.variants || {};
            
            return {
              user_id: userId,
              product_id: item.id,
              product_name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              supplier_id: item.supplier_id,
              option_color: variants.color,
              option_size: variants.size,
              option_format: variants.format,
              option_quantity: variants.quantity
            };
          });
          
          const { error } = await supabase
            .from("cart_items")
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
      // Créer un objet variants seulement si nécessaire
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

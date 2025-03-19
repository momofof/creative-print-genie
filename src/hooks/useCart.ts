
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toJsonValue, parseJsonArray } from "@/utils/jsonUtils";
import { CartItem } from "@/types/product";

interface AddToCartProps {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export const useCart = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = async ({
    productId,
    productName,
    productPrice,
    quantity,
    selectedColor,
    selectedSize
  }: AddToCartProps) => {
    if (!productId) {
      toast.error("Impossible d'ajouter au panier: ID du produit manquant");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create cart item with variants
      const variants: Record<string, string> = {};
      if (selectedColor) variants['couleur'] = selectedColor;
      if (selectedSize) variants['taille'] = selectedSize;
      
      const newItem: CartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: "/placeholder.svg", // Default image, could be improved
        variants: Object.keys(variants).length > 0 ? variants : undefined
      };
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get current cart from Supabase
        const { data: cartData } = await supabase
          .from('user_carts')
          .select('cart_items')
          .eq('user_id', user.id)
          .single();
        
        // Parse cart items using our utility function
        let existingCartItems = parseJsonArray(cartData?.cart_items);
        
        // Check if item already exists in cart
        const existingItemIndex = existingCartItems.findIndex((item: any) => 
          item.id === productId && 
          JSON.stringify(item.variants || {}) === JSON.stringify(newItem.variants || {})
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          existingCartItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          existingCartItems.push(newItem);
        }
        
        // Convert to JSON-safe format before sending to Supabase
        const jsonSafeCartItems = toJsonValue(existingCartItems);
        
        // Update cart in Supabase
        await supabase
          .from('user_carts')
          .upsert({
            user_id: user.id,
            cart_items: jsonSafeCartItems
          }, {
            onConflict: 'user_id'
          });
      } else {
        // Anonymous user, use localStorage
        const savedCart = localStorage.getItem("cart");
        const existingCartItems = savedCart ? JSON.parse(savedCart) : [];
        
        // Check if item already exists
        const existingItemIndex = existingCartItems.findIndex((item: any) => 
          item.id === productId && 
          JSON.stringify(item.variants || {}) === JSON.stringify(newItem.variants || {})
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          existingCartItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          existingCartItems.push(newItem);
        }
        
        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(existingCartItems));
      }
      
      toast.success(`${productName} ajouté au panier`);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Erreur lors de l'ajout au panier");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addToCart,
    isLoading
  };
};


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/product";
import { toast } from "sonner";

// Interface for the return value of the hook
interface UseCartStorageReturn {
  userId: string | null;
  isLoading: boolean;
  loadCart: () => Promise<CartItem[]>;
  saveCart: (cartItems: CartItem[]) => Promise<void>;
}

// Convert a CartItem to DB format
const cartItemToDBFormat = (item: CartItem, userId: string) => {
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
    option_quantity: variants.quantity,
    option_bat: variants.bat,
    option_poids: variants.poids,
    option_echantillon: variants.echantillon,
    option_types_impression: variants.types_impression,
    option_type_de_materiaux: variants.type_de_materiaux,
    option_details_impression: variants.details_impression,
    option_orientation_impression: variants.orientation_impression
  };
};

export const useCartStorage = (): UseCartStorageReturn => {
  const [isLoading, setIsLoading] = useState(false);
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

  const loadCart = async (): Promise<CartItem[]> => {
    setIsLoading(true);
    
    try {
      let loadedItems: CartItem[] = [];
      
      if (userId) {
        // Load cart from cart_items table
        const { data, error } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", userId);
        
        if (error) throw error;
        
        // Convert the database format to CartItem
        loadedItems = data.map((item: any): CartItem => {
          // Create a variants object for the cart item
          const variants: Record<string, string> = {};
          
          // Add non-null variant options to the variants object
          if (item.option_color) variants.color = item.option_color;
          if (item.option_size) variants.size = item.option_size;
          if (item.option_format) variants.format = item.option_format;
          if (item.option_quantity) variants.quantity = item.option_quantity;
          if (item.option_bat) variants.bat = item.option_bat;
          if (item.option_poids) variants.poids = item.option_poids;
          if (item.option_echantillon) variants.echantillon = item.option_echantillon;
          if (item.option_types_impression) variants.types_impression = item.option_types_impression;
          if (item.option_type_de_materiaux) variants.type_de_materiaux = item.option_type_de_materiaux;
          if (item.option_details_impression) variants.details_impression = item.option_details_impression;
          if (item.option_orientation_impression) variants.orientation_impression = item.option_orientation_impression;
          
          return {
            id: item.product_id || "",
            name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || "/placeholder.svg",
            supplier_id: item.supplier_id,
            variants: Object.keys(variants).length > 0 ? variants : undefined
          };
        });
      } else {
        // Load cart from localStorage for anonymous users
        const savedCart = localStorage.getItem("cart");
        loadedItems = savedCart ? JSON.parse(savedCart) : [];
      }
      
      return loadedItems;
    } catch (error) {
      console.error("Failed to load cart data:", error);
      toast.error("Impossible de charger votre panier");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Save cart items
  const saveCart = async (cartItems: CartItem[]): Promise<void> => {
    try {
      if (userId) {
        // Delete existing cart items
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", userId);
        
        // Insert new cart items
        if (cartItems.length > 0) {
          const cartData = cartItems.map(item => cartItemToDBFormat(item, userId));
          
          const { error } = await supabase
            .from("cart_items")
            .insert(cartData);
          
          if (error) throw error;
        }
      } else {
        // Save to localStorage for anonymous users
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error("Failed to save cart:", error);
      toast.error("Impossible de sauvegarder votre panier");
    }
  };

  return {
    userId,
    isLoading,
    loadCart,
    saveCart
  };
};

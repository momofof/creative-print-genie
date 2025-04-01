
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/types/product";

// Interface pour les données reçues de la base de données
interface CartItemResponse {
  id: string;
  user_id: string | null;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  image: string | null;
  supplier_id: string | null;
  variants?: Record<string, string> | null;
}

/**
 * Convertit un élément de panier de la base de données en type CartItem
 */
const mapCartItemFromResponse = (item: CartItemResponse): CartItem => {
  return {
    id: item.product_id || '',
    name: item.product_name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || "/placeholder.svg",
    supplier_id: item.supplier_id,
    variants: item.variants || undefined
  };
};

/**
 * Charge les éléments du panier pour un utilisateur connecté
 */
export const fetchCartItems = async (userId: string | null): Promise<CartItem[]> => {
  try {
    if (!userId) return [];
    
    // Utiliser la table cart_items_improved
    const { data, error } = await supabase
      .from("cart_items_improved")
      .select("*")
      .eq("user_id", userId);
    
    if (error) throw error;
    
    // Conversion de type sécurisée
    return (data as unknown as CartItemResponse[]).map(mapCartItemFromResponse);
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    toast.error("Impossible de charger votre panier");
    return [];
  }
};

/**
 * Enregistre les éléments du panier dans Supabase
 */
export const saveCartItemsToDatabase = async (
  userId: string, 
  cartItems: CartItem[]
): Promise<boolean> => {
  try {
    // Supprimer les anciens éléments
    await supabase
      .from("cart_items_improved")
      .delete()
      .eq("user_id", userId);
      
    if (cartItems.length > 0) {
      // Préparer les données pour l'insertion
      const cartData = cartItems.map(item => {
        return {
          user_id: userId,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          supplier_id: item.supplier_id,
          variants: item.variants || {}
        };
      });
      
      const { error } = await supabase
        .from("cart_items_improved")
        .insert(cartData);
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to save cart to database:", error);
    toast.error("Impossible de sauvegarder votre panier");
    return false;
  }
};

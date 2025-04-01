
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
  option_color?: string | null;
  option_size?: string | null;
  option_format?: string | null;
  option_quantity?: string | null;
  option_bat?: string | null;
  option_poids?: string | null;
  option_echantillon?: string | null;
  option_types_impression?: string | null;
  option_type_de_materiaux?: string | null;
  option_details_impression?: string | null;
  option_orientation_impression?: string | null;
}

/**
 * Convertit un élément de panier de la base de données en type CartItem
 */
const mapCartItemFromResponse = (item: CartItemResponse): CartItem => {
  // Extraire les options de l'ancienne structure
  const variants: Record<string, string> = {};
  
  if (item.option_color) variants.color = item.option_color;
  if (item.option_size) variants.size = item.option_size;
  if (item.option_format) variants.format = item.option_format;
  if (item.option_quantity) variants.quantity = item.option_quantity;
  
  return {
    id: item.product_id || '',
    name: item.product_name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || "/placeholder.svg",
    supplier_id: item.supplier_id,
    variants: Object.keys(variants).length > 0 ? variants : undefined
  };
};

/**
 * Charge les éléments du panier pour un utilisateur connecté
 */
export const fetchCartItems = async (userId: string | null): Promise<CartItem[]> => {
  try {
    if (!userId) return [];
    
    // Utiliser une requête typée de manière sûre
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId);
    
    if (error) throw error;
    
    // Convertir les données avec un casting de sécurité
    return (data as CartItemResponse[] || []).map(mapCartItemFromResponse);
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
      .from("cart_items")
      .delete()
      .eq("user_id", userId);
      
    if (cartItems.length > 0) {
      // Préparer les données pour l'insertion
      const cartData = cartItems.map(item => {
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
    
    return true;
  } catch (error) {
    console.error("Failed to save cart to database:", error);
    toast.error("Impossible de sauvegarder votre panier");
    return false;
  }
};


import { supabase } from "@/integrations/supabase/client";
import { CartItem, CartItemOption } from "@/types/product";

// Fonction pour convertir les items du panier avec les options pour le stockage
const convertCartItemsForStorage = async (
  userId: string, 
  cartItems: CartItem[]
): Promise<boolean> => {
  try {
    // Supprimer les éléments existants en utilisant cart_complete
    await supabase
      .from('cart_complete')
      .delete()
      .eq('user_id', userId);
    
    // 2. Insérer les nouveaux éléments
    for (const item of cartItems) {
      // Ajouter l'élément de panier
      const insertData = {
        user_id: userId,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_image: item.image || null,
        option_color: item.option_color || null,
        option_size: item.option_size || null,
        option_format: item.option_format || null,
        option_quantity: item.option_quantity || null
      };
      
      const { error: itemError } = await supabase
        .from('cart_complete')
        .insert(insertData);
      
      if (itemError) {
        console.error("Erreur lors de l'ajout de l'élément au panier:", itemError);
        continue;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la conversion des éléments du panier:", error);
    return false;
  }
};

// Fonction pour convertir les données de la base en objets CartItem
const convertStorageToCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    // Récupérer les éléments du panier depuis cart_complete
    const { data: items, error: itemsError } = await supabase
      .from('cart_complete')
      .select('*')
      .eq('user_id', userId);
    
    if (itemsError || !items) {
      console.error("Erreur lors de la récupération des éléments du panier:", itemsError);
      return [];
    }
    
    // Convertir les éléments en CartItem
    const cartItems: CartItem[] = items.map(item => ({
      id: item.product_id || "",
      name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      image: item.product_image || "/placeholder.svg",
      option_color: item.option_color,
      option_size: item.option_size,
      option_format: item.option_format,
      option_quantity: item.option_quantity
    }));
    
    return cartItems;
  } catch (error) {
    console.error("Erreur lors de la conversion du stockage en éléments du panier:", error);
    return [];
  }
};

export const saveCartToSupabase = async (userId: string, cartItems: CartItem[]): Promise<void> => {
  await convertCartItemsForStorage(userId, cartItems);
};

export const saveCartToLocalStorage = (cartItems: CartItem[]): void => {
  localStorage.setItem("cart", JSON.stringify(cartItems));
};

export const loadCartFromSupabase = async (userId: string): Promise<CartItem[]> => {
  try {
    return await convertStorageToCartItems(userId);
  } catch (error) {
    console.error("Erreur lors du chargement du panier:", error);
    return [];
  }
};

export const loadCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

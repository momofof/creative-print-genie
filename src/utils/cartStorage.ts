
import { supabase } from "@/integrations/supabase/client";
import { CartItem, CartItemOption } from "@/types/product";

// Fonction pour convertir les items du panier avec les options pour le stockage
const convertCartItemsForStorage = async (
  userId: string, 
  cartItems: CartItem[]
): Promise<boolean> => {
  try {
    // 1. Récupérer le cart_id existant ou en créer un nouveau
    let cartId: string;
    const { data: existingCart, error: cartError } = await supabase
      .from('user_carts')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (cartError || !existingCart) {
      // Créer un nouveau panier
      const { data: newCart, error: createError } = await supabase
        .from('user_carts')
        .insert({ user_id: userId })
        .select('id')
        .single();
      
      if (createError || !newCart) {
        console.error("Erreur lors de la création du panier:", createError);
        return false;
      }
      
      cartId = newCart.id;
    } else {
      cartId = existingCart.id;
      
      // Supprimer les éléments existants
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);
    }
    
    // 2. Insérer les nouveaux éléments
    for (const item of cartItems) {
      // Ajouter l'élément de panier
      const { data: cartItem, error: itemError } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cartId,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || null
        })
        .select('id')
        .single();
      
      if (itemError || !cartItem) {
        console.error("Erreur lors de l'ajout de l'élément au panier:", itemError);
        continue;
      }
      
      // Ajouter les options de l'élément si nécessaire
      if (item.variants) {
        const options: { cart_item_id: string; option_name: string; option_value: string }[] = [];
        
        Object.entries(item.variants).forEach(([key, value]) => {
          if (typeof value === 'string') {
            options.push({
              cart_item_id: cartItem.id,
              option_name: key,
              option_value: value
            });
          }
        });
        
        if (options.length > 0) {
          const { error: optionsError } = await supabase
            .from('cart_item_options')
            .insert(options);
          
          if (optionsError) {
            console.error("Erreur lors de l'ajout des options:", optionsError);
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la conversion des éléments du panier:", error);
    return false;
  }
};

// Fonction pour convertir les données de la base en objets CartItem
const convertStorageToCartItems = async (cartId: string): Promise<CartItem[]> => {
  try {
    // 1. Récupérer les éléments du panier
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId);
    
    if (itemsError || !items) {
      console.error("Erreur lors de la récupération des éléments du panier:", itemsError);
      return [];
    }
    
    // 2. Récupérer les options pour chaque élément
    const cartItems: CartItem[] = [];
    
    for (const item of items) {
      const { data: options, error: optionsError } = await supabase
        .from('cart_item_options')
        .select('*')
        .eq('cart_item_id', item.id);
      
      // Construire l'objet variants à partir des options
      const variants: Record<string, string> = {};
      
      if (!optionsError && options) {
        options.forEach((option: CartItemOption) => {
          variants[option.option_name] = option.option_value;
        });
      }
      
      // Ajouter l'élément au panier
      cartItems.push({
        id: item.product_id,
        name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variants: Object.keys(variants).length > 0 ? variants : undefined
      });
    }
    
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
    const { data: cart, error: cartError } = await supabase
      .from('user_carts')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (cartError || !cart) {
      console.error("Erreur lors de la récupération du panier:", cartError);
      return [];
    }
    
    return await convertStorageToCartItems(cart.id);
  } catch (error) {
    console.error("Erreur lors du chargement du panier:", error);
    return [];
  }
};

export const loadCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};


import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/product";
import { toJsonValue, parseJsonArray } from "@/utils/jsonUtils";

export const saveCartToSupabase = async (userId: string, cartItems: CartItem[]): Promise<void> => {
  // Convert the cart items to JSON-safe format
  const jsonSafeCartItems = toJsonValue(cartItems);
  
  // Save to Supabase for logged-in users
  await supabase
    .from('user_carts')
    .upsert({
      user_id: userId,
      cart_items: jsonSafeCartItems
    }, {
      onConflict: 'user_id'
    });
};

export const saveCartToLocalStorage = (cartItems: CartItem[]): void => {
  localStorage.setItem("cart", JSON.stringify(cartItems));
};

export const loadCartFromSupabase = async (userId: string): Promise<CartItem[]> => {
  const { data: cartData } = await supabase
    .from('user_carts')
    .select('cart_items')
    .eq('user_id', userId)
    .single();
  
  return parseJsonArray(cartData?.cart_items) || [];
};

export const loadCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

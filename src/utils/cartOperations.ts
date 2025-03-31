
import { CartItem } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DBCartItem } from "@/types/cart";

// Save cart items to database or localStorage
export const saveCart = async (updatedCartItems: CartItem[], userId: string | null) => {
  try {
    if (userId) {
      // Delete existing cart items
      await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", userId);
      
      // Insert new cart items
      if (updatedCartItems.length > 0) {
        const cartData = updatedCartItems.map(item => ({
          cart_id: userId,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          option_color: item.variants?.color,
          option_size: item.variants?.size,
          option_format: item.variants?.format,
          option_quantity: item.variants?.quantity,
          option_bat: item.variants?.bat,
          option_poids: item.variants?.poids,
          option_echantillon: item.variants?.echantillon,
          supplier_id: item.supplier_id
        }));
        
        const { error } = await supabase
          .from("cart_items")
          .insert(cartData);
        
        if (error) throw error;
      }
    } else {
      // Save to localStorage for anonymous users
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    }
  } catch (error) {
    console.error("Failed to save cart:", error);
    toast.error("Unable to save your cart");
  }
};

// Load cart items from database or localStorage
export const loadCartItems = async (userId: string | null): Promise<CartItem[]> => {
  try {
    let loadedItems: CartItem[] = [];
    
    if (userId) {
      // Load cart from cart_items table
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", userId);
      
      if (error) throw error;
      
      // Convert the database format to CartItem with explicit typing
      loadedItems = data.map((item: DBCartItem): CartItem => ({
        id: item.product_id || "",
        name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "/placeholder.svg",
        variants: {
          ...(item.option_color ? { color: item.option_color } : {}),
          ...(item.option_size ? { size: item.option_size } : {}),
          ...(item.option_format ? { format: item.option_format } : {}),
          ...(item.option_quantity ? { quantity: item.option_quantity } : {}),
          ...(item.option_bat ? { bat: item.option_bat } : {}),
          ...(item.option_poids ? { poids: item.option_poids } : {}),
          ...(item.option_echantillon ? { echantillon: item.option_echantillon } : {})
        },
        supplier_id: item.supplier_id
      }));
    } else {
      // Load cart from localStorage for anonymous users
      const savedCart = localStorage.getItem("cart");
      loadedItems = savedCart ? JSON.parse(savedCart) : [];
    }
    
    return loadedItems;
  } catch (error) {
    console.error("Failed to load cart data:", error);
    toast.error("Unable to load your cart");
    return [];
  }
};

// Add legacy cart item to cart
export const addLegacyCartItem = async ({
  cartItems,
  productId,
  productName,
  productPrice,
  quantity,
  selectedColor,
  selectedSize
}: {
  cartItems: CartItem[],
  productId: string,
  productName: string,
  productPrice: number,
  quantity: number,
  selectedColor?: string,
  selectedSize?: string
}): Promise<CartItem[]> => {
  const newItem: CartItem = {
    id: productId,
    name: productName,
    price: productPrice,
    quantity: quantity,
    image: "/placeholder.svg", // Default image
    option_color: selectedColor,
    option_size: selectedSize
  };
  
  // Copy current cart
  const currentCart = [...cartItems];
  
  // Check if item already exists in cart
  const existingItemIndex = currentCart.findIndex(item => 
    item.id === productId && 
    item.option_color === selectedColor && 
    item.option_size === selectedSize
  );
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    currentCart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    currentCart.push(newItem);
  }
  
  return currentCart;
};

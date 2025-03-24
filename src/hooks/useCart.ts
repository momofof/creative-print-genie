
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { AddToCartProps, UseCartReturn } from "@/types/cart";
import { calculateTotalPrice } from "@/utils/cartCalculations";

export const useCart = (): UseCartReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  // Load cart items when user ID changes
  useEffect(() => {
    loadCart();
  }, [userId]);

  const loadCart = async () => {
    setIsLoading(true);
    
    try {
      let loadedItems: CartItem[] = [];
      
      if (userId) {
        // Load cart from cart_complete table
        const { data, error } = await supabase
          .from("cart_complete")
          .select("*")
          .eq("user_id", userId);
        
        if (error) throw error;
        
        loadedItems = data.map(item => ({
          id: item.product_id || item.id,
          name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          image: item.product_image || "/placeholder.svg",
          option_color: item.option_color,
          option_size: item.option_size,
          option_format: item.option_format,
          option_quantity: item.option_quantity
        }));
      } else {
        // Load cart from localStorage for anonymous users
        const savedCart = localStorage.getItem("cart");
        loadedItems = savedCart ? JSON.parse(savedCart) : [];
      }
      
      setCartItems(loadedItems);
    } catch (error) {
      console.error("Failed to load cart data:", error);
      toast.error("Unable to load your cart");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save cart items
  const saveCart = async (updatedCartItems: CartItem[]) => {
    try {
      if (userId) {
        // Delete existing cart items
        await supabase
          .from("cart_complete")
          .delete()
          .eq("user_id", userId);
        
        // Insert new cart items
        if (updatedCartItems.length > 0) {
          const cartData = updatedCartItems.map(item => ({
            user_id: userId,
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
            product_image: item.image,
            option_color: item.option_color,
            option_size: item.option_size,
            option_format: item.option_format,
            option_quantity: item.option_quantity
          }));
          
          const { error } = await supabase
            .from("cart_complete")
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

  const addToCart = async ({
    productId,
    productName,
    productPrice,
    quantity,
    selectedColor,
    selectedSize
  }: AddToCartProps): Promise<boolean> => {
    if (!productId) {
      toast.error("Cannot add to cart: Missing product ID");
      return false;
    }

    setIsLoading(true);
    
    try {
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
      
      // Update cart state
      setCartItems(currentCart);
      
      // Save updated cart
      await saveCart(currentCart);
      
      toast.success(`${productName} added to cart`);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart");
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
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Quantity updated");
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Product removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
    toast.success("Cart cleared");
  };

  const editCartItem = (id: string, newQuantity: number, options?: Record<string, string>) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { 
          ...item, 
          quantity: newQuantity,
          option_color: options?.color,
          option_size: options?.size,
          option_format: options?.format,
          option_quantity: options?.quantity
        };
      }
      return item;
    });
    
    setCartItems(updatedCart);
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

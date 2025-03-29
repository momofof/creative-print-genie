
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { AddToCartProps, UseCartReturn } from "@/types/cart";
import { calculateTotalPrice, findExistingItemIndex } from "@/utils/cartCalculations";

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
        // Load cart from cart_items table
        const { data, error } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", userId);
        
        if (error) throw error;
        
        // Convert the database format to CartItem
        loadedItems = data.map((item: any) => {
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
      
      setCartItems(loadedItems);
    } catch (error) {
      console.error("Failed to load cart data:", error);
      toast.error("Impossible de charger votre panier");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Save cart items
  const saveCart = async (updatedCartItems: CartItem[]) => {
    try {
      if (userId) {
        // Delete existing cart items
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", userId);
        
        // Insert new cart items
        if (updatedCartItems.length > 0) {
          const cartData = updatedCartItems.map(item => cartItemToDBFormat(item, userId));
          
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
      toast.error("Impossible de sauvegarder votre panier");
    }
  };

  const addToCart = async ({
    productId,
    productName,
    productPrice,
    quantity,
    selectedColor,
    selectedSize,
    productImage,
    supplierId,
    variants = {}
  }: AddToCartProps): Promise<boolean> => {
    if (!productId) {
      toast.error("Impossible d'ajouter au panier: ID du produit manquant");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Prepare the item variants as a Record<string, string>
      const itemVariants: Record<string, string> = { ...variants };
      
      // Add selectedColor and selectedSize to variants if provided
      if (selectedColor) itemVariants.color = selectedColor;
      if (selectedSize) itemVariants.size = selectedSize;
      
      const newItem: CartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: productImage || "/placeholder.svg",
        supplier_id: supplierId,
        variants: Object.keys(itemVariants).length > 0 ? itemVariants : undefined
      };
      
      // Copy current cart
      const currentCart = [...cartItems];
      
      // Check if item already exists in cart
      const existingItemIndex = findExistingItemIndex(currentCart, productId, itemVariants);
      
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

  const updateQuantity = (id: string, newQuantity: number, variants: Record<string, string> = {}) => {
    if (newQuantity < 1) return;
    
    const existingItemIndex = findExistingItemIndex(cartItems, id, variants);
    
    if (existingItemIndex === -1) return;
    
    const updatedCart = [...cartItems];
    updatedCart[existingItemIndex].quantity = newQuantity;
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Quantité mise à jour");
  };

  const removeItem = (id: string, variants: Record<string, string> = {}) => {
    const existingItemIndex = findExistingItemIndex(cartItems, id, variants);
    
    if (existingItemIndex === -1) return;
    
    const updatedCart = [...cartItems];
    updatedCart.splice(existingItemIndex, 1);
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Produit retiré du panier");
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
    toast.success("Panier vidé");
  };

  const editCartItem = (id: string, newQuantity: number, options: Record<string, string> = {}) => {
    const existingItemIndex = findExistingItemIndex(cartItems, id, options);
    
    if (existingItemIndex === -1) return;
    
    const updatedCart = [...cartItems];
    const item = updatedCart[existingItemIndex];
    
    item.quantity = newQuantity;
    if (options) {
      item.variants = { ...item.variants, ...options } as Record<string, string>;
    }
    
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

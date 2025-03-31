
import { Product, CartItem } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addItemToLocalCart } from "@/utils/cartStorage";
import { NavigateFunction } from "react-router-dom";

interface CartParams {
  product: Product;
  quantity: number;
  variants: Record<string, string>;
  supplierId: string;
  userId: string | null;
}

interface UseCartAdditionProps {
  navigate: NavigateFunction;
}

export const useCartAddition = ({ navigate }: UseCartAdditionProps) => {
  const addToCart = async ({
    product,
    quantity,
    variants,
    supplierId,
    userId
  }: CartParams): Promise<boolean> => {
    try {
      console.log("Adding to cart:", { product, quantity, variants, supplierId });
      
      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image || "/placeholder.svg",
        variants: Object.keys(variants).length > 0 ? variants : undefined,
        supplier_id: supplierId
      };
      
      // For logged in users
      if (userId) {
        const variantFields: Record<string, any> = {};
        
        // Add variant fields with option_ prefix
        if (Object.keys(variants).length > 0) {
          Object.entries(variants).forEach(([key, value]) => {
            variantFields[`option_${key}`] = value;
          });
        }
        
        console.log("Inserting into cart_items with fields:", {
          cart_id: userId,
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image || "/placeholder.svg",
          supplier_id: supplierId,
          ...variantFields
        });
        
        // Insert directly into cart_items table
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            cart_id: userId,
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image || "/placeholder.svg",
            supplier_id: supplierId,
            ...variantFields
          });
          
        if (error) {
          console.error("Supabase cart insert error:", error);
          throw error;
        }
        
        console.log("Cart item added successfully:", data);
        toast.success("Produit ajouté au panier");
      } else {
        // For anonymous users, use localStorage via our utility
        addItemToLocalCart(newCartItem);
        console.log("Product added to local cart");
        toast.success("Produit ajouté au panier");
      }

      // Automatically navigate to cart after a short delay
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
      
      return true;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Erreur lors de l'ajout au panier");
      return false;
    }
  };

  return { addToCart };
};

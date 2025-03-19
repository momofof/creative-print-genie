
import { useState } from "react";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { orderService, OrderItem } from "@/services/orderService";
import { toast } from "sonner";
import { parseJsonArray } from "@/utils/jsonUtils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Define a type for cart items
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variants?: Record<string, string>;
}

interface UseOrderSubmissionProps {
  selectedProduct: Product | undefined;
  selectedQuantity: number | null;
  variants: Record<string, string>;
  onOrderSuccess: () => void;
}

export const useOrderSubmission = ({
  selectedProduct,
  selectedQuantity,
  variants,
  onOrderSuccess
}: UseOrderSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn, userId } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedQuantity) {
      toast.error("Veuillez sélectionner un produit et une quantité");
      return;
    }
    
    // Vérifier si l'utilisateur est connecté
    if (!isLoggedIn) {
      toast.error("Veuillez vous connecter pour passer commande");
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order item from the selected product
      const orderItem: OrderItem = {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        quantity: selectedQuantity,
        price: selectedProduct.price,
        variants: Object.keys(variants).length > 0 ? variants : undefined
      };
      
      // Calculate total price
      const totalPrice = orderItem.price * orderItem.quantity;
      
      // Create the order
      const result = await orderService.createOrder({
        customer_id: userId || undefined,
        items: [orderItem],
        total: totalPrice,
        status: 'pending',
        shipping_address: {
          name: "",
          address: "",
          city: "",
          postal_code: "",
          country: ""
        }
      });
      
      if (result.success) {
        toast.success(`Commande de ${selectedQuantity} ${selectedProduct.name} envoyée avec succès !`);
        
        // Reset form via callback
        onOrderSuccess();
        
        // Add to cart too if user is logged in
        if (userId) {
          try {
            // Get current cart
            const { data: cartData } = await supabase
              .from('user_carts')
              .select('cart_items')
              .eq('user_id', userId)
              .single();
            
            // Use the parseJsonArray utility to safely convert the JSON data to an array
            const rawCartItems = parseJsonArray(cartData?.cart_items);
            
            // Map the raw items to our CartItem type to ensure type safety
            const cartItems: CartItem[] = rawCartItems.map(item => ({
              id: String(item.id || ''),
              name: String(item.name || ''),
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 0),
              image: item.image ? String(item.image) : undefined,
              variants: item.variants as Record<string, string> | undefined
            }));
            
            // Add order to cart
            const newCartItem: CartItem = {
              id: selectedProduct.id,
              name: selectedProduct.name,
              price: selectedProduct.price,
              quantity: selectedQuantity,
              image: "/placeholder.svg",
              ...(Object.keys(variants).length > 0 && { variants })
            };
            
            // Check if product already exists in cart
            const existingItemIndex = cartItems.findIndex((item: CartItem) => 
              item.id === selectedProduct.id && 
              JSON.stringify(item.variants || {}) === JSON.stringify(variants || {})
            );
            
            let updatedCart;
            if (existingItemIndex >= 0) {
              // Update quantity
              updatedCart = [...cartItems];
              updatedCart[existingItemIndex].quantity += selectedQuantity;
            } else {
              // Add new item
              updatedCart = [...cartItems, newCartItem];
            }
            
            // Update cart in Supabase
            await supabase
              .from('user_carts')
              .upsert({
                user_id: userId,
                cart_items: updatedCart
              }, {
                onConflict: 'user_id'
              });
              
          } catch (cartError) {
            console.error("Failed to update cart:", cartError);
            // Don't show error since the order was successful
          }
        }
      } else {
        toast.error("La commande n'a pas pu être traitée. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Une erreur est survenue lors de la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};

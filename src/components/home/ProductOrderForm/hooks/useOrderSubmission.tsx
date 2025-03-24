
import { useState } from "react";
import { Product, CartItem } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { orderService, OrderItem } from "@/services/orderService";
import { toast } from "sonner";
import { parseJsonArray, toJsonValue } from "@/utils/jsonUtils";
import { useNavigate } from "react-router-dom";

interface UseOrderSubmissionProps {
  selectedProduct: Product | undefined;
  selectedQuantity: number | null;
  variants: Record<string, string>;
  userId: string | null;
  onOrderSuccess: () => void;
  onShowOrderSummary: (items: CartItem[], total: number) => void;
}

export const useOrderSubmission = ({
  selectedProduct,
  selectedQuantity,
  variants,
  userId,
  onOrderSuccess,
  onShowOrderSummary
}: UseOrderSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!userId) {
      toast.info("Veuillez vous connecter pour passer une commande");
      navigate("/login");
      return;
    }
    
    if (!selectedProduct || !selectedQuantity) {
      toast.error("Veuillez sélectionner un produit et une quantité");
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
        // Create a CartItem to display in the summary
        const cartItem: CartItem = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: selectedQuantity,
          image: selectedProduct.image || "/placeholder.svg",
          variants: Object.keys(variants).length > 0 ? variants : undefined
        };
        
        // Show order summary dialog
        onShowOrderSummary([cartItem], totalPrice);
        
        toast.success(`Commande de ${selectedQuantity} ${selectedProduct.name} envoyée avec succès !`);
        
        // Add to cart automatically
        await addToCart(selectedProduct, selectedQuantity, variants, userId);
        
        // Reset form via callback
        onOrderSuccess();
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
  
  const addToCart = async (
    product: Product,
    quantity: number,
    variants: Record<string, string>,
    userId: string | null
  ) => {
    try {
      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image || "/placeholder.svg",
        variants: Object.keys(variants).length > 0 ? variants : undefined
      };
      
      // For logged in users
      if (userId) {
        // Get current cart from Supabase
        const { data: cartData } = await supabase
          .from('user_carts')
          .select('cart_items')
          .eq('user_id', userId)
          .single();
        
        // Parse the cart items
        const existingCartItems = parseJsonArray(cartData?.cart_items);
        
        // Check if product already exists in cart
        const existingItemIndex = existingCartItems.findIndex((item: CartItem) => 
          item.id === product.id && 
          JSON.stringify(item.variants || {}) === JSON.stringify(variants || {})
        );
        
        let updatedCart;
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          updatedCart = [...existingCartItems];
          updatedCart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          updatedCart = [...existingCartItems, newCartItem];
        }
        
        // Convert to JSON-safe format before sending to Supabase
        const jsonSafeUpdatedCart = toJsonValue(updatedCart);
        
        // Update cart in Supabase
        await supabase
          .from('user_carts')
          .upsert({
            user_id: userId,
            cart_items: jsonSafeUpdatedCart
          }, {
            onConflict: 'user_id'
          });
          
        toast.success("Produit ajouté au panier");
      } else {
        // For anonymous users, use localStorage
        const savedCart = localStorage.getItem("cart");
        const existingCartItems = savedCart ? JSON.parse(savedCart) : [];
        
        // Check if product already exists
        const existingItemIndex = existingCartItems.findIndex((item: CartItem) => 
          item.id === product.id && 
          JSON.stringify(item.variants || {}) === JSON.stringify(variants || {})
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          existingCartItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          existingCartItems.push(newCartItem);
        }
        
        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(existingCartItems));
        toast.success("Produit ajouté au panier");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  return { handleSubmit, isSubmitting };
};

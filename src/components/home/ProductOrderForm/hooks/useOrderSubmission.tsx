
import { useState } from "react";
import { Product, CartItem } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { orderService, OrderItem } from "@/services/orderService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UseOrderSubmissionProps {
  selectedProduct: Product | undefined;
  selectedQuantity: number | null;
  variants: Record<string, string>;
  userId: string | null;
  selectedSupplierId: string | null;
  onOrderSuccess: () => void;
  onShowOrderSummary: (items: CartItem[], total: number) => void;
}

export const useOrderSubmission = ({
  selectedProduct,
  selectedQuantity,
  variants,
  userId,
  selectedSupplierId,
  onOrderSuccess,
  onShowOrderSummary
}: UseOrderSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect to login page if user is not logged in
    if (!userId) {
      toast.info("Veuillez vous connecter pour passer une commande");
      navigate("/login");
      return;
    }
    
    if (!selectedProduct || !selectedQuantity) {
      toast.error("Veuillez sélectionner un produit et une quantité");
      return;
    }
    
    if (!selectedSupplierId) {
      toast.warning("Veuillez sélectionner un fournisseur");
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
      
      // Get user's name if available
      let customerName = "";
      if (userId) {
        const { data: userData } = await supabase
          .from('users_complete')
          .select('first_name, last_name')
          .eq('id', userId)
          .single();
        
        if (userData) {
          customerName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
        }
      }
      
      // Create the order with supplier info
      const result = await orderService.createOrder({
        customer_id: userId,
        items: [orderItem],
        total: totalPrice,
        status: 'pending',
        shipping_address: {
          name: customerName,
          address: "",
          city: "",
          postal_code: "",
          country: "",
          supplier_id: selectedSupplierId
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
          variants: Object.keys(variants).length > 0 ? variants : undefined,
          supplier_id: selectedSupplierId
        };
        
        // Show order summary dialog
        onShowOrderSummary([cartItem], totalPrice);
        
        toast.success(`Commande de ${selectedQuantity} ${selectedProduct.name} envoyée avec succès !`);
        
        // Add to cart automatically
        await addToCart(selectedProduct, selectedQuantity, variants, selectedSupplierId, userId);
        
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
    supplierId: string,
    userId: string | null
  ) => {
    try {
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
        // Transform variants to individual option fields
        const cartItemData = {
          user_id: userId,
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image || "/placeholder.svg",
          supplier_id: supplierId,
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
          
        const { error } = await supabase
          .from('cart_items')
          .insert(cartItemData);
          
        if (error) throw error;
        
        // Notify the cart was updated
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

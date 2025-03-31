
import { useState } from "react";
import { Product, CartItem } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useOrderCreation } from "./order/useOrderCreation";
import { useCartAddition } from "./cart/useCartAddition";

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
  
  // Use dedicated hooks for order creation and cart addition
  const { createOrder } = useOrderCreation();
  const { addToCart } = useCartAddition({ navigate });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Button clicked, starting order submission");
    console.log("Selected product:", selectedProduct);
    console.log("Selected quantity:", selectedQuantity);
    console.log("Selected supplier:", selectedSupplierId);
    console.log("Variants:", variants);
    
    // Basic validation
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
      // Calculate the total price
      const totalPrice = selectedProduct.price * selectedQuantity;
      
      // Create the cart item
      const cartItem: CartItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: selectedQuantity,
        image: selectedProduct.image || "/placeholder.svg",
        variants: Object.keys(variants).length > 0 ? variants : undefined,
        supplier_id: selectedSupplierId
      };
      
      // Create order in database
      const result = await createOrder({
        product: selectedProduct,
        quantity: selectedQuantity,
        variants,
        supplierId: selectedSupplierId,
        userId
      });
      
      if (result.success) {
        // Show order summary dialog
        onShowOrderSummary([cartItem], totalPrice);
        
        toast.success(`Commande de ${selectedQuantity} ${selectedProduct.name} envoyée avec succès !`);
        
        // Add to cart
        await addToCart({
          product: selectedProduct,
          quantity: selectedQuantity,
          variants,
          supplierId: selectedSupplierId,
          userId
        });
        
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

  return { handleSubmit, isSubmitting };
};

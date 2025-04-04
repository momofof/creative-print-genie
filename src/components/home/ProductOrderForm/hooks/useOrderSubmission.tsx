
import { useState } from "react";
import { Product, CartItem } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { orderService, OrderItem } from "@/services/orderService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

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
  const { addToCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedQuantity) {
      toast.error("Veuillez sélectionner un produit et une quantité");
      return;
    }
    
    if (!selectedSupplierId) {
      toast.warning("Veuillez sélectionner un fournisseur");
      return;
    }
    
    // Vérifier si l'utilisateur est connecté
    if (!userId) {
      // Sauvegarder les détails du produit dans localStorage pour les récupérer après connexion
      localStorage.setItem("pendingCartItem", JSON.stringify({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        quantity: selectedQuantity,
        variants,
        supplierId: selectedSupplierId,
        image: selectedProduct.image || "/placeholder.svg"
      }));
      
      // Définir la page à rediriger après connexion
      localStorage.setItem("redirectAfterLogin", "/cart");
      
      toast.info("Veuillez vous connecter pour ajouter des articles au panier");
      navigate("/login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Créer l'élément panier
      const cartItem: CartItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: selectedQuantity,
        image: selectedProduct.image || "/placeholder.svg",
        variants: Object.keys(variants).length > 0 ? variants : undefined,
        supplier_id: selectedSupplierId
      };
      
      // Calculer le prix total
      const totalPrice = cartItem.price * cartItem.quantity;
      
      // Ajouter au panier
      const addedToCart = await addToCart({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        quantity: selectedQuantity,
        selectedColor: variants.color,
        selectedSize: variants.size
      });
      
      if (addedToCart) {
        // Montrer la boîte de dialogue récapitulative
        onShowOrderSummary([cartItem], totalPrice);
        toast.success(`${selectedProduct.name} ajouté au panier`);
        
        // Réinitialiser le formulaire
        onOrderSuccess();
      } else {
        toast.error("Impossible d'ajouter le produit au panier. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};

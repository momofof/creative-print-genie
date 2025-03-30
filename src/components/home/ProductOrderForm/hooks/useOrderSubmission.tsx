
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
    
    // Validation de base
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
      // Création de l'élément de commande à partir du produit sélectionné
      const orderItem: OrderItem = {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        quantity: selectedQuantity,
        price: selectedProduct.price,
        variants: Object.keys(variants).length > 0 ? variants : {}
      };
      
      // Calcul du prix total
      const totalPrice = orderItem.price * orderItem.quantity;
      
      // Créer la commande avec les informations fournisseur dans shipping_address
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
          country: "",
          supplier_id: selectedSupplierId
        }
      });
      
      if (result.success) {
        // Création d'un CartItem pour afficher dans le récapitulatif
        const cartItem: CartItem = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: selectedQuantity,
          image: selectedProduct.image || "/placeholder.svg",
          variants: Object.keys(variants).length > 0 ? variants : undefined,
          supplier_id: selectedSupplierId
        };
        
        // Afficher la boîte de dialogue de récapitulatif de la commande
        onShowOrderSummary([cartItem], totalPrice);
        
        toast.success(`Commande de ${selectedQuantity} ${selectedProduct.name} envoyée avec succès !`);
        
        // Ajouter au panier automatiquement
        await addToCart(selectedProduct, selectedQuantity, variants, selectedSupplierId, userId);
        
        // Réinitialiser le formulaire via la fonction de rappel
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
      
      // Pour les utilisateurs connectés
      if (userId) {
        const variantFields: Record<string, any> = {};
        
        // Ajouter les champs de variantes avec le préfixe option_
        if (variants) {
          Object.entries(variants).forEach(([key, value]) => {
            variantFields[`option_${key}`] = value;
          });
        }
        
        // Insérer directement dans la table cart_items
        const { error } = await supabase
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
          
        if (error) throw error;
        toast.success("Produit ajouté au panier");
      } else {
        // Pour les utilisateurs anonymes, utiliser localStorage
        const savedCart = localStorage.getItem("cart");
        const existingCartItems = savedCart ? JSON.parse(savedCart) : [];
        
        // Vérifier si le produit existe déjà
        const existingItemIndex = existingCartItems.findIndex((item: CartItem) => 
          item.id === product.id && 
          JSON.stringify(item.variants || {}) === JSON.stringify(variants || {})
        );
        
        if (existingItemIndex >= 0) {
          // Mettre à jour la quantité si l'article existe
          existingCartItems[existingItemIndex].quantity += quantity;
        } else {
          // Ajouter un nouvel article
          existingCartItems.push(newCartItem);
        }
        
        // Sauvegarder dans localStorage
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

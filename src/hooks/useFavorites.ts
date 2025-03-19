
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFavorites = () => {
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const addToFavorites = async (productId: string) => {
    if (!productId) {
      toast.error("Impossible d'ajouter aux favoris: ID du produit manquant");
      return;
    }
    
    setIsFavoriteLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Add to favorites in Supabase
        const { error } = await supabase.from('likes')
          .insert({
            user_id: user.id,
            product_id: productId
          });
          
        if (error) {
          // Check if it's a duplicate (product already in favorites)
          if (error.code === '23505') {
            toast.info("Ce produit est déjà dans vos favoris");
          } else {
            throw error;
          }
        } else {
          toast.success("Produit ajouté aux favoris");
        }
      } else {
        // Prompt to login if not authenticated
        toast.info("Veuillez vous connecter pour ajouter aux favoris");
      }
      
      return true;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Erreur lors de l'ajout aux favoris");
      return false;
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return {
    addToFavorites,
    isFavoriteLoading
  };
};

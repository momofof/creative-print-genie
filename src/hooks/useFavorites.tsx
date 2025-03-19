
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Favorite {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  product_name?: string;
  product_image?: string;
  product_price?: number;
  product_category?: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  // Récupère la liste des favoris de l'utilisateur connecté
  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setFavorites([]);
        return [];
      }

      const { data, error } = await supabase
        .from('likes')
        .select(`
          *,
          products_master(
            name,
            image,
            price,
            category
          )
        `)
        .eq('user_id', sessionData.session.user.id);

      if (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
        toast.error("Impossible de charger vos favoris");
        setIsLoading(false);
        return [];
      }

      // Transformer les données pour avoir une structure plus simple
      const formattedFavorites = data.map(fav => ({
        id: fav.id,
        product_id: fav.product_id,
        user_id: fav.user_id,
        created_at: fav.created_at,
        product_name: fav.products_master?.name,
        product_image: fav.products_master?.image,
        product_price: fav.products_master?.price,
        product_category: fav.products_master?.category
      }));

      setFavorites(formattedFavorites);
      setIsLoading(false);
      return formattedFavorites;
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      setIsLoading(false);
      return [];
    }
  };

  // Vérifie si un produit est dans les favoris
  const isProductInFavorites = (productId: string): boolean => {
    return favorites.some(fav => fav.product_id === productId);
  };

  // Ajoute un produit aux favoris
  const addToFavorites = async (productId: string) => {
    setIsAddingToFavorites(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Vous devez être connecté pour ajouter aux favoris");
        setIsAddingToFavorites(false);
        return false;
      }

      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: sessionData.session.user.id,
          product_id: productId
        });

      if (error) {
        console.error("Erreur lors de l'ajout aux favoris:", error);
        toast.error("Impossible d'ajouter aux favoris");
        setIsAddingToFavorites(false);
        return false;
      }

      // Mettre à jour la liste des favoris
      await fetchFavorites();
      toast.success("Produit ajouté aux favoris");
      setIsAddingToFavorites(false);
      return true;
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      setIsAddingToFavorites(false);
      return false;
    }
  };

  // Supprime un produit des favoris
  const removeFromFavorites = async (productId: string) => {
    setIsAddingToFavorites(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Vous devez être connecté pour gérer vos favoris");
        setIsAddingToFavorites(false);
        return false;
      }

      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', sessionData.session.user.id)
        .eq('product_id', productId);

      if (error) {
        console.error("Erreur lors de la suppression des favoris:", error);
        toast.error("Impossible de supprimer des favoris");
        setIsAddingToFavorites(false);
        return false;
      }

      // Mettre à jour la liste des favoris
      setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
      toast.success("Produit retiré des favoris");
      setIsAddingToFavorites(false);
      return true;
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      setIsAddingToFavorites(false);
      return false;
    }
  };

  // Toggle (ajouter/supprimer) un produit des favoris
  const toggleFavorite = async (productId: string) => {
    if (isProductInFavorites(productId)) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    isLoading,
    isAddingToFavorites,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isProductInFavorites
  };
};

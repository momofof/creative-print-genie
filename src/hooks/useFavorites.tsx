
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
        setIsLoading(false);
        return [];
      }

      // Using reviews_comments table as this is what's available
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews_comments')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .eq('is_review', false)
        .eq('content', 'favorited');
      
      if (reviewsError) {
        console.error("Erreur lors de la récupération des favoris:", reviewsError);
        toast.error("Impossible de charger vos favoris");
        setIsLoading(false);
        return [];
      }

      // Then, for each liked product, get the product details
      const formattedFavorites: Favorite[] = [];
      
      if (reviewsData && reviewsData.length > 0) {
        // Get all product ids from likes
        const productIds = reviewsData.map((review: any) => review.product_id);
        
        // Fetch product details for all liked products from products_complete
        const { data: productsData, error: productsError } = await supabase
          .from('products_complete')
          .select('id, name, image, price, category')
          .in('id', productIds);
          
        if (productsError) {
          console.error("Erreur lors de la récupération des produits:", productsError);
          toast.error("Impossible de charger les détails des produits");
        } else if (productsData) {
          // Map products to reviews
          for (const review of reviewsData) {
            const product = productsData.find((p: any) => p.id === review.product_id);
            if (product) {
              formattedFavorites.push({
                id: review.id,
                product_id: review.product_id,
                user_id: review.user_id,
                created_at: review.created_at,
                product_name: product.name,
                product_image: product.image,
                product_price: product.price,
                product_category: product.category
              });
            }
          }
        }
      }

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
    if (!productId) {
      toast.error("Impossible d'ajouter aux favoris: ID du produit manquant");
      return false;
    }
    
    setIsAddingToFavorites(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Vous devez être connecté pour ajouter aux favoris");
        setIsAddingToFavorites(false);
        return false;
      }

      // Add favorite using reviews_comments table
      const { error } = await supabase
        .from('reviews_comments')
        .insert({
          user_id: sessionData.session.user.id,
          product_id: productId,
          content: 'favorited',
          is_review: false
        });

      if (error) {
        // Check if it's a duplicate error, different database engines use different error indicators
        if (error.message && error.message.includes('duplicate')) {
          toast.info("Ce produit est déjà dans vos favoris");
        } else {
          throw error;
        }
      } else {
        toast.success("Produit ajouté aux favoris");
        await fetchFavorites();
      }
      
      setIsAddingToFavorites(false);
      return true;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Erreur lors de l'ajout aux favoris");
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

      // Remove the favorite from reviews_comments table
      const { error } = await supabase
        .from('reviews_comments')
        .delete()
        .eq('user_id', sessionData.session.user.id)
        .eq('product_id', productId)
        .eq('content', 'favorited')
        .eq('is_review', false);

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

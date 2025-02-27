
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Like {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  product_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_id?: string;
}

export function useProductInteractions(productId: string) {
  const queryClient = useQueryClient();

  // Fetch likes
  const { data: likes = [] } = useQuery({
    queryKey: ["likes", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("product_id", productId);

      if (error) {
        toast.error("Erreur lors du chargement des likes");
        throw error;
      }
      return data as Like[];
    }
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId);

      if (error) {
        toast.error("Erreur lors du chargement des avis");
        throw error;
      }
      return data as Review[];
    }
  });

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ["comments", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("product_id", productId);

      if (error) {
        toast.error("Erreur lors du chargement des commentaires");
        throw error;
      }
      return data as Comment[];
    }
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("likes")
        .insert([{ product_id: productId }]);

      if (error) {
        if (error.code === '23505') {
          toast.error("Vous avez déjà aimé ce produit");
        } else {
          toast.error("Erreur lors de l'ajout du like");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", productId] });
      toast.success("Like ajouté");
    }
  });

  // Unlike mutation
  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("product_id", productId);

      if (error) {
        toast.error("Erreur lors de la suppression du like");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", productId] });
      toast.success("Like supprimé");
    }
  });

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async ({ rating, content }: { rating: number; content: string }) => {
      const { error } = await supabase
        .from("reviews")
        .insert([{ product_id: productId, rating, content }]);

      if (error) {
        if (error.code === '23505') {
          toast.error("Vous avez déjà donné votre avis sur ce produit");
        } else {
          toast.error("Erreur lors de l'ajout de l'avis");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast.success("Avis ajouté");
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { error } = await supabase
        .from("comments")
        .insert([{ 
          product_id: productId, 
          content,
          parent_id: parentId 
        }]);

      if (error) {
        toast.error("Erreur lors de l'ajout du commentaire");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
      toast.success("Commentaire ajouté");
    }
  });

  return {
    likes,
    reviews,
    comments,
    likeMutation,
    unlikeMutation,
    addReviewMutation,
    addCommentMutation
  };
}

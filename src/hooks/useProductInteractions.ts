
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUser } from "@supabase/auth-helpers-react";

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
  const user = useUser();
  const queryClient = useQueryClient();

  // Fetch likes
  const { data: likes = [], isLoading: likesLoading } = useQuery({
    queryKey: ["likes", productId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("likes")
          .select("*")
          .eq("product_id", productId);

        if (error) throw error;
        return data as Like[];
      } catch (error: any) {
        toast.error("Erreur lors du chargement des likes");
        console.error(error);
        return [];
      }
    }
  });

  // Fetch reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", productId);

        if (error) throw error;
        return data as Review[];
      } catch (error: any) {
        toast.error("Erreur lors du chargement des avis");
        console.error(error);
        return [];
      }
    }
  });

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", productId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("product_id", productId);

        if (error) throw error;
        return data as Comment[];
      } catch (error: any) {
        toast.error("Erreur lors du chargement des commentaires");
        console.error(error);
        return [];
      }
    }
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User must be authenticated");

      try {
        const { error } = await supabase
          .from("likes")
          .insert([{ 
            product_id: productId,
            user_id: user.id
          }]);

        if (error) {
          if (error.code === '23505') {
            toast.error("Vous avez déjà aimé ce produit");
          } else {
            toast.error("Erreur lors de l'ajout du like");
          }
          throw error;
        }
      } catch (error) {
        console.error(error);
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
      if (!user) throw new Error("User must be authenticated");

      try {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("product_id", productId)
          .eq("user_id", user.id);

        if (error) {
          toast.error("Erreur lors de la suppression du like");
          throw error;
        }
      } catch (error) {
        console.error(error);
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
      if (!user) throw new Error("User must be authenticated");

      try {
        const { error } = await supabase
          .from("reviews")
          .insert([{ 
            product_id: productId,
            rating,
            content,
            user_id: user.id
          }]);

        if (error) {
          if (error.code === '23505') {
            toast.error("Vous avez déjà donné votre avis sur ce produit");
          } else {
            toast.error("Erreur lors de l'ajout de l'avis");
          }
          throw error;
        }
      } catch (error) {
        console.error(error);
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
      if (!user) throw new Error("User must be authenticated");

      try {
        const { error } = await supabase
          .from("comments")
          .insert([{ 
            product_id: productId,
            content,
            parent_id: parentId,
            user_id: user.id
          }]);

        if (error) {
          toast.error("Erreur lors de l'ajout du commentaire");
          throw error;
        }
      } catch (error) {
        console.error(error);
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
    isLoading: likesLoading || reviewsLoading || commentsLoading,
    likeMutation,
    unlikeMutation,
    addReviewMutation,
    addCommentMutation
  };
}

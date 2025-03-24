
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUser } from "@supabase/auth-helpers-react";
import { ReviewComment } from "@/types/dashboard";

export function useProductInteractions(productId: string) {
  const user = useUser();
  const queryClient = useQueryClient();

  // Fetch likes
  const { data: likes = [], isLoading: likesLoading } = useQuery({
    queryKey: ["likes", productId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("reviews_comments")
          .select("*")
          .eq("product_id", productId)
          .eq("is_review", false)
          .is("rating", null);

        if (error) throw error;
        return data as ReviewComment[];
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
          .from("reviews_comments")
          .select("*")
          .eq("product_id", productId)
          .eq("is_review", true);

        if (error) throw error;
        return data as ReviewComment[];
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
          .from("reviews_comments")
          .select("*")
          .eq("product_id", productId)
          .eq("is_review", false)
          .not("rating", "is", null);

        if (error) throw error;
        return data as ReviewComment[];
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
          .from("reviews_comments")
          .insert([{ 
            product_id: productId,
            user_id: user.id,
            content: "like",
            is_review: false
          }]);

        if (error) {
          toast.error("Erreur lors de l'ajout du like");
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
          .from("reviews_comments")
          .delete()
          .eq("product_id", productId)
          .eq("user_id", user.id)
          .eq("content", "like")
          .is("rating", null);

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
          .from("reviews_comments")
          .insert([{ 
            product_id: productId,
            user_id: user.id,
            rating,
            content,
            is_review: true
          }]);

        if (error) {
          toast.error("Erreur lors de l'ajout de l'avis");
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
          .from("reviews_comments")
          .insert([{ 
            product_id: productId,
            user_id: user.id,
            content,
            parent_id: parentId,
            is_review: false
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

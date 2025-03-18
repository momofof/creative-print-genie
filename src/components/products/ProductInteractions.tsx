
import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useProductInteractions } from "@/hooks/useProductInteractions";
import { ThumbsUp, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductInteractionsProps {
  productId: string;
}

export function ProductInteractions({ productId }: ProductInteractionsProps) {
  const user = useUser();
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [commentContent, setCommentContent] = useState("");

  const {
    likes,
    reviews,
    comments,
    likeMutation,
    unlikeMutation,
    addReviewMutation,
    addCommentMutation
  } = useProductInteractions(productId);

  const handleLikeToggle = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour aimer un produit");
      return;
    }

    const hasLiked = likes.some(like => like.user_id === user.id);
    if (hasLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vous devez être connecté pour laisser un avis");
      return;
    }

    addReviewMutation.mutate();
  };

  const handleAddComment = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vous devez être connecté pour commenter");
      return;
    }

    addCommentMutation.mutate();
  };

  return (
    <div className="space-y-8">
      {/* Likes Section */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLikeToggle}
          className={user && likes.some(like => like.user_id === user.id) ? "text-accent" : ""}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          {likes.length} like{likes.length !== 1 ? "s" : ""}
        </Button>
      </div>

      {/* Reviews Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Avis ({reviews.length})</h3>
        <form onSubmit={handleAddReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>
                  {rating} {rating === 1 ? "étoile" : "étoiles"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Votre avis</label>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              rows={3}
              required
            />
          </div>
          <Button type="submit" disabled={!user}>
            Publier l'avis
          </Button>
        </form>
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Commentaires ({comments.length})</h3>
        <form onSubmit={(e) => handleAddComment(e)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Votre commentaire</label>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              rows={3}
              required
            />
          </div>
          <Button type="submit" disabled={!user}>
            Publier le commentaire
          </Button>
        </form>
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="border rounded-lg p-4">
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

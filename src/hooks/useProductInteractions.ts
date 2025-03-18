
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
  // Return empty mock data
  return {
    likes: [],
    reviews: [],
    comments: [],
    likeMutation: {
      mutate: () => console.log("Like mutation called"),
      isLoading: false
    },
    unlikeMutation: {
      mutate: () => console.log("Unlike mutation called"),
      isLoading: false
    },
    addReviewMutation: {
      mutate: () => console.log("Add review mutation called"),
      isLoading: false
    },
    addCommentMutation: {
      mutate: () => console.log("Add comment mutation called"),
      isLoading: false
    }
  };
}

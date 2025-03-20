
import { toast } from "sonner";
import { CartItem } from "@/types/cart";
import { 
  loadCartFromSupabase, 
  loadCartFromLocalStorage 
} from "@/utils/cartStorage";

interface CartLoaderProps {
  userId: string | null;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCartLoader = ({
  userId,
  setCartItems,
  setIsLoading
}: CartLoaderProps) => {

  const loadCart = async () => {
    setIsLoading(true);
    
    try {
      let loadedItems: CartItem[] = [];
      
      if (userId) {
        // Load cart from Supabase for logged-in users
        loadedItems = await loadCartFromSupabase(userId);
      } else {
        // Load cart from localStorage for anonymous users
        loadedItems = loadCartFromLocalStorage();
      }
      
      setCartItems(loadedItems);
    } catch (error) {
      console.error("Failed to load cart data:", error);
      toast.error("Unable to load your cart");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { loadCart };
};


import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { fetchCartItems } from "@/services/cartAPI";
import { getCartFromLocalStorage } from "@/services/cartStorage";

interface UseCartLoadingProps {
  userId: string | null;
  setCartItems: (items: CartItem[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCartLoading = ({
  userId,
  setCartItems,
  setIsLoading
}: UseCartLoadingProps) => {
  
  const loadCart = async () => {
    setIsLoading(true);
    
    try {
      let loadedItems: CartItem[] = [];
      
      if (userId) {
        loadedItems = await fetchCartItems(userId);
      } else {
        loadedItems = getCartFromLocalStorage();
      }
      
      setCartItems(loadedItems);
    } catch (error) {
      console.error("Failed to load cart data:", error);
      toast.error("Impossible de charger votre panier");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { loadCart };
};

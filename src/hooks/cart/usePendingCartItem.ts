
import { useEffect } from "react";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { findExistingItemIndex } from "@/utils/cartCalculations";
import { AddToCartProps } from "@/types/cart";

interface UsePendingCartItemProps {
  userId: string | null;
  cartItems: CartItem[];
  pendingItemProcessed: boolean;
  setPendingItemProcessed: (processed: boolean) => void;
  addToCart: (props: AddToCartProps) => Promise<boolean>;
}

export const usePendingCartItem = ({
  userId,
  cartItems,
  pendingItemProcessed,
  setPendingItemProcessed,
  addToCart
}: UsePendingCartItemProps) => {
  
  useEffect(() => {
    const handlePendingCartItem = async () => {
      if (userId && !pendingItemProcessed) {
        const pendingCartItem = localStorage.getItem("pendingCartItem");
        if (pendingCartItem) {
          try {
            // Mark as processed to prevent multiple processing attempts
            setPendingItemProcessed(true);
            localStorage.removeItem("pendingCartItem");
            
            const item = JSON.parse(pendingCartItem);
            
            const existingItemIndex = findExistingItemIndex(
              cartItems,
              item.productId,
              item.variants || {}
            );
            
            if (existingItemIndex === -1) {
              console.log("Adding pending item to cart:", item);
              await addToCart({
                productId: item.productId,
                productName: item.productName,
                productPrice: item.productPrice,
                quantity: item.quantity,
                selectedColor: item.variants?.color,
                selectedSize: item.variants?.size
              });
              
              toast.success(`${item.productName} ajouté au panier`);
            } else {
              console.log("Item already exists in cart, not adding duplicate");
            }
          } catch (error) {
            console.error("Erreur lors du traitement de l'article en attente:", error);
          } finally {
            // Reset processing flag after a delay to prevent immediate re-processing
            setTimeout(() => setPendingItemProcessed(false), 2000);
          }
        }
      }
    };

    handlePendingCartItem();
  }, [userId, cartItems, pendingItemProcessed, setPendingItemProcessed, addToCart]);
};

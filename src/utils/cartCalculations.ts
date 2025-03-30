
import { CartItem } from "@/types/product";

export const calculateTotalPrice = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

export const findExistingItemIndex = (
  cartItems: CartItem[], 
  productId: string, 
  variants?: Record<string, string>
): number => {
  console.log("Finding item with ID:", productId, "and variants:", variants);
  
  return cartItems.findIndex((item) => {
    // Basic check on product ID
    if (item.id !== productId) return false;
    
    // If no variants specified for either, just check the ID
    if (!variants && !item.variants) return true;
    
    // If one has variants and the other doesn't, they're different
    if ((!variants && item.variants) || (variants && !item.variants)) return false;
    
    // Compare variants (if both exist)
    if (variants && item.variants) {
      const variantsA = JSON.stringify(variants);
      const variantsB = JSON.stringify(item.variants);
      console.log("Comparing variants:", variantsA, "vs", variantsB);
      return variantsA === variantsB;
    }
    
    return true;
  });
};

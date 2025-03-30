
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
  return cartItems.findIndex((item) => {
    // Vérification de base sur l'ID du produit
    if (item.id !== productId) return false;
    
    // Si aucun variant n'est spécifié pour l'un ou l'autre, on vérifie juste l'ID
    if (!variants && !item.variants) return true;
    
    // Si l'un a des variants et l'autre non, ils sont différents
    if ((!variants && item.variants) || (variants && !item.variants)) return false;
    
    // Comparaison des variants (si les deux existent)
    if (variants && item.variants) {
      const variantsA = JSON.stringify(variants);
      const variantsB = JSON.stringify(item.variants);
      return variantsA === variantsB;
    }
    
    return true;
  });
};

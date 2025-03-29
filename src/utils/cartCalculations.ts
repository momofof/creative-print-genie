
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
  variants: Record<string, string>
): number => {
  return cartItems.findIndex((item) => {
    // Vérification de base sur l'ID du produit
    if (item.id !== productId) return false;
    
    // Si les deux articles ont un supplier_id différent, ils sont considérés comme différents
    if (item.supplier_id && variants.supplier_id && item.supplier_id !== variants.supplier_id) {
      return false;
    }
    
    // Si aucun variant n'est spécifié, on vérifie juste l'ID et le fournisseur
    if (Object.keys(variants).length === 0 && (!item.variants || Object.keys(item.variants).length === 0)) {
      return true;
    }
    
    // Si l'un a des variants et l'autre non, ils sont différents
    if ((!variants || Object.keys(variants).length === 0) && item.variants && Object.keys(item.variants).length > 0) {
      return false;
    }
    if ((variants && Object.keys(variants).length > 0) && (!item.variants || Object.keys(item.variants).length === 0)) {
      return false;
    }
    
    // Comparaison des variants (si les deux existent)
    if (variants && item.variants) {
      const variantKeys = new Set([
        ...Object.keys(variants),
        ...Object.keys(item.variants)
      ]);
      
      // Ignorer la clé supplier_id pour la comparaison
      variantKeys.delete("supplier_id");
      
      // Vérifier que toutes les variantes sont identiques
      for (const key of variantKeys) {
        if (variants[key] !== item.variants[key]) {
          return false;
        }
      }
      
      return true;
    }
    
    return true;
  });
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  });
};

export const calculateItemSubtotal = (price: number, quantity: number): number => {
  return price * quantity;
};

export const groupCartItems = (cartItems: CartItem[]): CartItem[] => {
  const groupedItems: CartItem[] = [];
  
  cartItems.forEach(item => {
    const existingItemIndex = findExistingItemIndex(
      groupedItems, 
      item.id, 
      item.variants || {}
    );
    
    if (existingItemIndex >= 0) {
      groupedItems[existingItemIndex].quantity += item.quantity;
    } else {
      groupedItems.push({ ...item });
    }
  });
  
  return groupedItems;
};

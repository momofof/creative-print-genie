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
  variants: Record<string, string> = {}
): number => {
  return cartItems.findIndex((item) => {
    // Basic check on product ID
    if (item.id !== productId) return false;
    
    // If both items have different supplier_id, they are considered different
    if (item.supplier_id && variants.supplier_id && item.supplier_id !== variants.supplier_id) {
      return false;
    }
    
    // If no variants specified, just check ID and supplier
    if (Object.keys(variants).length === 0 && (!item.variants || Object.keys(item.variants || {}).length === 0)) {
      return true;
    }
    
    // If one has variants and the other doesn't, they are different
    if ((!variants || Object.keys(variants).length === 0) && item.variants && Object.keys(item.variants).length > 0) {
      return false;
    }
    if ((variants && Object.keys(variants).length > 0) && (!item.variants || Object.keys(item.variants || {}).length === 0)) {
      return false;
    }
    
    // Compare variants (if both exist)
    if (variants && item.variants) {
      const variantKeys = new Set([
        ...Object.keys(variants),
        ...Object.keys(item.variants)
      ]);
      
      // Ignore supplier_id for comparison
      variantKeys.delete("supplier_id");
      
      // Check that all variants are identical
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

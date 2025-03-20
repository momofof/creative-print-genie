
import { toast } from "sonner";
import { CartItem, AddToCartProps } from "@/types/cart";
import { 
  saveCartToSupabase, 
  saveCartToLocalStorage
} from "@/utils/cartStorage";
import { calculateTotalPrice, findExistingItemIndex } from "@/utils/cartCalculations";

interface CartOperationsProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  userId: string | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCartOperations = ({ 
  cartItems,
  setCartItems,
  userId,
  setIsLoading
}: CartOperationsProps) => {
  // Save cart items
  const saveCart = async (updatedCartItems: CartItem[]) => {
    try {
      if (userId) {
        await saveCartToSupabase(userId, updatedCartItems);
      } else {
        saveCartToLocalStorage(updatedCartItems);
      }
    } catch (error) {
      console.error("Failed to save cart:", error);
      toast.error("Unable to save your cart");
    }
  };

  const addToCart = async ({
    productId,
    productName,
    productPrice,
    quantity,
    selectedColor,
    selectedSize
  }: AddToCartProps): Promise<boolean> => {
    if (!productId) {
      toast.error("Cannot add to cart: Missing product ID");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Create variants object if color or size is selected
      const variants: Record<string, string> = {};
      if (selectedColor) variants['couleur'] = selectedColor;
      if (selectedSize) variants['taille'] = selectedSize;
      
      const newItem: CartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: "/placeholder.svg", // Default image
        variants: Object.keys(variants).length > 0 ? variants : undefined
      };
      
      // Copy current cart
      const currentCart = [...cartItems];
      
      // Check if item already exists in cart
      const existingItemIndex = findExistingItemIndex(
        currentCart, 
        productId, 
        newItem.variants
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        currentCart.push(newItem);
      }
      
      // Update cart state
      setCartItems(currentCart);
      
      // Save updated cart
      await saveCart(currentCart);
      
      toast.success(`${productName} added to cart`);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Quantity updated");
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Product removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
    toast.success("Cart cleared");
  };

  // Function to edit an existing cart item
  const editCartItem = (id: string, newQuantity: number, variants?: Record<string, string>) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { 
          ...item, 
          quantity: newQuantity,
          ...(variants && { variants })
        };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Panier mis à jour");
  };

  // Calculate total price
  const totalPrice = calculateTotalPrice(cartItems);

  return {
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    editCartItem,
    totalPrice,
    saveCart
  };
};

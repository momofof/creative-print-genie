
import { Product } from "./product";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  originalPrice?: number;
  category?: string;
  subcategory?: string;
  description?: string;
  variants?: Record<string, string>;
  [key: string]: any; // Add index signature for Json compatibility
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

// Add missing types that are being imported in useCart.ts
export interface AddToCartProps {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface UseCartReturn {
  cartItems: CartItem[];
  isLoading: boolean;
  totalPrice: number;
  addToCart: (props: AddToCartProps) => Promise<boolean>;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  loadCart: () => Promise<void>;
  editCartItem: (id: string, newQuantity: number, variants?: Record<string, string>) => void;
}

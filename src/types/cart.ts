
import { CartItem } from "@/types/product";

export interface AddToCartProps {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  productImage?: string;
  supplierId?: string;
  variants?: Record<string, string>;
}

export interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  totalPrice: number;
}

export interface CartOperations {
  addToCart: (props: AddToCartProps) => Promise<boolean>;
  updateQuantity: (id: string, newQuantity: number, variants?: Record<string, string>) => void;
  removeItem: (id: string, variants?: Record<string, string>) => void;
  clearCart: () => void;
  loadCart: () => Promise<void>;
  editCartItem: (id: string, newQuantity: number, variants?: Record<string, string>) => void;
}

export type UseCartReturn = CartState & CartOperations;

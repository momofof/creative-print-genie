
import { CartItem } from "@/types/product";

export interface AddToCartProps {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  totalPrice: number;
}

export interface CartOperations {
  addToCart: (props: AddToCartProps) => Promise<boolean>;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  loadCart: () => Promise<void>;
}

export type UseCartReturn = CartState & CartOperations;

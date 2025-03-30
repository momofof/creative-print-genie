
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
  editCartItem: (id: string, newQuantity: number, variants?: Record<string, string>) => void;
}

export type UseCartReturn = CartState & CartOperations;

// Interface pour les éléments du panier tels qu'ils sont stockés dans la base de données
export interface DBCartItem {
  cart_id?: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image?: string;
  option_color?: string;
  option_size?: string;
  option_format?: string;
  option_quantity?: string;
  option_bat?: string;
  option_poids?: string;
  option_echantillon?: string;
  option_types_impression?: string;
  option_type_de_materiaux?: string;
  option_details_impression?: string;
  option_orientation_impression?: string;
  supplier_id?: string;
}

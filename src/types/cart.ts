
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

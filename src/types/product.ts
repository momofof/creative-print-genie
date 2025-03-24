
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  is_customizable?: boolean;
  color?: string;
  size?: string;
  format?: string;
  created_at?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  option_color?: string;
  option_size?: string;
  option_format?: string;
  option_quantity?: string;
}

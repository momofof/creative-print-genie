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
  variants: ProductVariant[];
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
  variants?: Record<string, string>;
}

export interface Color {
  name: string;
  hex: string;
  id: string;
  available: boolean;
}

export interface SizeGuideItem {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  a: string;
  b: string;
  c: string;
  size2?: string;
}

export interface Review {
  id: number;
  userName?: string;
  author: string;
  date: string;
  rating: number;
  comment?: string;
  content: string;
}

export interface RelatedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size?: string;
  color?: string;
  hex_color?: string;
  stock: number;
  price_adjustment: number;
  status: string;
  bat?: string;
  poids?: string;
  format?: string;
  quantite?: string;
  echantillon?: string;
  types_impression?: string;
  type_de_materiaux?: string;
  details_impression?: string;
  orientation_impression?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomizableProduct extends Product {
  views?: ProductView[];
  colors?: Color[];
  customizableAreas?: string[];
  selectedView?: string;
  price: number;
}

export interface ProductView {
  id: string;
  name: string;
  image: string;
}

export interface CustomizationElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: {
    bold?: boolean;
    italic?: boolean;
    alignment?: 'left' | 'center' | 'right';
  };
}

export interface DesignCategory {
  id: string;
  name: string;
  items?: DesignItem[];
  designs?: DesignItem[]; // For compatibility
}

export interface DesignItem {
  id: string;
  name: string;
  thumbnail?: string;
  image?: string; // For compatibility
  designUrl?: string;
  category?: string;
}

export interface CartItemOption {
  id: string;
  cart_item_id: string;
  option_name: string;
  option_value: string;
}

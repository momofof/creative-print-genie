
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
  variants?: Record<string, string>; // Ajout de cette propriété pour compatibilité
}

// Types requis pour les composants de customisation
export interface Color {
  name: string;
  hex: string;
}

export interface SizeGuideItem {
  size: string;
  chest: string;
  waist: string;
  hips: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
}

export interface CustomizableProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  views: ProductView[];
  colors: Color[];
  customizableAreas: string[];
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
}

export interface DesignCategory {
  id: string;
  name: string;
  items: DesignItem[];
}

export interface DesignItem {
  id: string;
  name: string;
  thumbnail: string;
  designUrl: string;
}

export interface CartItemOption {
  id: string;
  cart_item_id: string;
  option_name: string;
  option_value: string;
}

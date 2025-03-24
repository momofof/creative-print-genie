
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  subcategory?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  is_customizable?: boolean;
  color?: string;
  size?: string;
  format?: string;
  created_at?: string;
  // For variants compatibility
  variants?: Record<string, string>;
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
  variants?: Record<string, string>; // Property for compatibility
}

// Types for the customize components
export interface Color {
  name: string;
  hex: string;
  id: string; // Make id required
  available?: boolean; // Make available optional for compatibility
}

export interface SizeGuideItem {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  a: string; // Make required
  b: string; // Make required
  c: string; // Make required
  size2?: string; // For compatibility
}

export interface Review {
  id: number; // Changed to number
  userName?: string;
  author: string; // Make required
  date?: string;
  rating: number;
  comment?: string;
  content: string; // Make required
}

export interface RelatedProduct {
  id: number; // Changed to number
  name: string;
  price: string | number;
  image: string;
}

export interface ProductVariant {
  id: string;
  name?: string;
  value?: string;
  // Database fields
  product_id?: string;
  size?: string;
  color?: string;
  hex_color?: string;
  stock?: number;
  price_adjustment?: number;
  status?: string;
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
  created_at?: string;
  updated_at?: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface CustomizableProduct extends Product {
  views?: ProductView[];
  colors?: Color[];
  customizableAreas?: string[];
  price: number; // Make price required to match Product
  selectedView?: string; // Add this property
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
  fontStyle?: {  // Add this back
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

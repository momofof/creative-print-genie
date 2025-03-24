
export interface Color {
  id: string;
  name: string;
  hex: string;
  available: boolean;
}

export interface SizeGuideItem {
  size: string;
  size2?: string;
  a: string;
  b: string;
  c: string;
}

export interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  content: string;
}

export interface RelatedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
}

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
  color?: string; // Added for compatibility with productTypeConverter
  date?: string;  // Added for compatibility
  created_at?: string; // Added for compatibility with dashboard
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  bat?: string;
  poids?: string;
  format?: string;
  quantite?: string;
  echantillon?: string;
  types_impression?: string;
  type_de_materiaux?: string;
  details_impression?: string;
  orientation_impression?: string;
}

export interface VariantImage {
  id: string;
  variant_id: string;
  product_id: string;
  image_url: string;
}

export interface ProductView {
  id: string;
  name: string;
  image: string;
}

export interface CustomizableProduct extends Product {
  views: ProductView[];
  selectedView: string;
  customizationElements: CustomizationElement[];
}

export interface CustomizationElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    alignment?: 'left' | 'center' | 'right';
  };
  color?: string;
}

export interface Customization {
  id: string;
  product_id: string;
  name: string;
  description?: string;
  type: 'text' | 'image';
  position?: string;
  price_adjustment?: number;
  is_required?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FontOption {
  id: string;
  name: string;
}

export interface DesignCategory {
  id: string;
  name: string;
  designs: DesignItem[];
}

export interface DesignItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

// Updated CartItem interface for the relational tables
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variants?: Record<string, string>;
  options?: CartItemOption[];
}

export interface CartItemOption {
  id: string;
  cart_item_id: string;
  option_name: string;
  option_value: string;
}

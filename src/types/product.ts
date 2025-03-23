
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
  variants?: any;  // This holds variant data in JSONB format
  variant_images?: Record<string, string[]> | string; // String from DB or parsed object
  variant_image_url?: string | null; // Added for variant image URL (simplified)
  is_customizable?: boolean;
  customizations?: any; // This holds customization options in JSONB format
  color?: string; // Added for compatibility with productTypeConverter
  date?: string;  // Added for compatibility
  created_at?: string; // Added for compatibility with dashboard
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

// Updated CartItem interface to be compatible with Supabase's Json type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variants?: Record<string, string>;
  [key: string]: any; // Add index signature for Json compatibility
}

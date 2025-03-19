
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
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  subcategory: string;
  description?: string;
  color?: string;
  date?: string;
  isNew?: boolean;
  customizationViews?: ProductView[];
  variants?: any; // Added variants property
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

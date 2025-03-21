
// Types for the supplier dashboard
export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image: string | null;
  category: string;
  subcategory?: string | null;
  status: "draft" | "published" | "archived";
  stock?: number | null;
  created_at?: string | null;
  description?: string | null;
  is_customizable?: boolean | null;
  supplier_id?: string | null;
  updated_at?: string | null;
  variants: ProductVariant[];
  variant_images?: Record<string, string> | null;
  customizations?: Customization[];
}

export interface ProductVariant {
  id: string;
  product_id?: string;
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment?: number | null;
  status: "in_stock" | "low_stock" | "out_of_stock";
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

export interface ProFeature {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface Customization {
  id: string;
  name: string;
  description?: string | null;
  product_id?: string | null;
  type: "text" | "image";
  position?: "front" | "back" | "sleeve" | "collar" | null;
  price_adjustment?: number | null;
  is_required?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}


import { LucideIcon } from "lucide-react";

export interface ProductVariant {
  id: string;
  product_id?: string;
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment?: number;
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
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface Customization {
  id: string;
  product_id?: string;
  name: string;
  description?: string;
  type: "text" | "image";
  position?: string;
  price_adjustment?: number;
  is_required?: boolean;
  created_at: string;
  updated_at: string;
}

export interface VariantImage {
  id: string;
  variant_id: string;
  product_id: string;
  image_url: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category: string;
  subcategory?: string;
  description?: string;
  status: "draft" | "published" | "archived";
  image?: string | null;
  supplier_id?: string;
  is_customizable?: boolean;
  stock?: number;
  // Champs spécifiques aux variantes
  size?: string;
  color?: string;
  hex_color?: string;
  variant_status?: string;
  // Arrays for related data
  variants: ProductVariant[];
  customizations: Customization[];
  variantImages: VariantImage[];
  // Additional fields for compatibility
  created_at?: string;
  updated_at?: string;
}

// Order related types
export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
}

// Stats type for dashboard
export interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

// ProFeature type for the supplier dashboard
export interface ProFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

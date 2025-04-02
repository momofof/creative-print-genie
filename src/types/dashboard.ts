
import { LucideIcon } from "lucide-react";

export interface ProductComplete {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number | null;
  category: string;
  subcategory?: string | null;
  image?: string | null;
  status: "draft" | "published" | "archived";
  is_customizable?: boolean;
  supplier_id?: string;
  stock?: number | null;
  variants?: ProductVariant[];
  
  // Champs de variants
  size?: string | null;
  color?: string | null;
  hex_color?: string | null;
  bat?: string | null;
  poids?: string | null;
  format?: string | null;
  quantite?: string | null;
  echantillon?: string | null;
  types_impression?: string | null;
  type_de_materiaux?: string | null;
  details_impression?: string | null;
  orientation_impression?: string | null;
  variant_status?: "in_stock" | "low_stock" | "out_of_stock" | null;
  price_adjustment?: number | null;
  
  // Options des variantes (nouveaux champs)
  size_options?: string[] | null;
  color_options?: string[] | null;
  format_options?: string[] | null;
  poids_options?: string[] | null;
  bat_options?: string[] | null;
  quantite_options?: string[] | null;
  echantillon_options?: string[] | null;
  types_impression_options?: string[] | null;
  type_de_materiaux_options?: string[] | null;
  details_impression_options?: string[] | null;
  orientation_impression_options?: string[] | null;
  
  // Customisations
  customization_name?: string;
  customization_description?: string;
  customization_type?: string;
  customization_position?: string;
  customization_price_adjustment?: number;
  customization_required?: boolean;
  
  // Image de variante
  variant_image_url?: string | null;
  
  created_at?: string;
  updated_at?: string;
}

// Pour la compatibilité avec le code existant
export type Product = ProductComplete;

// Product Variant type
export interface ProductVariant {
  id: string;
  product_id?: string;
  size?: string | null;
  color?: string | null;
  hex_color?: string | null;
  stock?: number | null;
  price_adjustment?: number | null;
  status?: string | null;
  bat?: string | null;
  poids?: string | null;
  format?: string | null;
  quantite?: string | null;
  echantillon?: string | null;
  types_impression?: string | null;
  type_de_materiaux?: string | null;
  details_impression?: string | null;
  orientation_impression?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

// Order related types
export interface OrderComplete {
  id: string;
  customer_id?: string;
  customer_name?: string;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  
  // Adresse de livraison
  shipping_address_street?: string;
  shipping_address_city?: string;
  shipping_address_state?: string;
  shipping_address_zip?: string;
  shipping_address_country?: string;
  
  // Détails de la commande
  product_id?: string;
  product_name?: string;
  product_quantity?: number;
  product_price?: number;
  product_options?: string;
  
  created_at?: string;
  updated_at?: string;
}

// Pour la compatibilité avec le code existant
export type Order = OrderComplete;

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

// Type pour les images de variantes
export interface VariantImage {
  id: string;
  product_id?: string;
  variant_id?: string;
  image_url: string;
  created_at?: string;
}

// Type pour les customisations
export interface Customization {
  id: string;
  product_id?: string;
  name: string;
  description?: string;
  type: string;
  position?: string;
  price_adjustment?: number;
  is_required?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Type for reviews and comments
export interface ReviewComment {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string;
  rating?: number | null;
  content: string;
  is_review: boolean;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

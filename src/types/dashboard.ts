
import { LucideIcon } from "lucide-react";

export interface ProductComplete {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category: string;
  subcategory?: string;
  image?: string;
  status: "draft" | "published" | "archived";
  is_customizable?: boolean;
  supplier_id?: string;
  stock?: number;
  
  // Champs de variants
  size?: string;
  color?: string;
  hex_color?: string;
  bat?: string;
  poids?: string;
  format?: string;
  quantite?: string;
  echantillon?: string;
  types_impression?: string;
  type_de_materiaux?: string;
  details_impression?: string;
  orientation_impression?: string;
  variant_status?: "in_stock" | "low_stock" | "out_of_stock";
  
  // Customisations
  customization_name?: string;
  customization_description?: string;
  customization_type?: string;
  customization_position?: string;
  customization_price_adjustment?: number;
  customization_required?: boolean;
  
  // Image de variante
  variant_image_url?: string;
  
  created_at?: string;
  updated_at?: string;
}

// Pour la compatibilité avec le code existant
export type Product = ProductComplete;

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

// Cart type
export interface CartComplete {
  id: string;
  user_id: string;
  product_id?: string;
  product_name: string;
  price: number;
  quantity: number;
  product_image?: string;
  
  // Options spécifiques
  option_color?: string;
  option_size?: string;
  option_format?: string;
  option_quantity?: string;
  
  created_at?: string;
  updated_at?: string;
}

// User type
export interface UserComplete {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

// Review et Comment combinés
export interface ReviewComment {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string;
  content: string;
  rating?: number;
  parent_id?: string;
  is_review: boolean;
  created_at?: string;
  updated_at?: string;
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

// Type pour les variantes de produit
export interface ProductVariant {
  id: string;
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
  // Pour le frontend uniquement
  isNew?: boolean;
  isDeleted?: boolean;
}

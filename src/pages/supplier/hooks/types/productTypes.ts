
export interface ProductData {
  id?: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  image: string | null;
  status: "draft" | "published" | "archived";
  is_customizable: boolean;
  supplier_id?: string | null;
  
  // Variant fields
  size: string | null;
  color: string | null;
  hex_color: string | null;
  bat: string | null;
  poids: string | null;
  format: string | null;
  quantite: string | null;
  echantillon: string | null;
  types_impression: string | null;
  type_de_materiaux: string | null;
  details_impression: string | null;
  orientation_impression: string | null;
  
  // Added missing fields
  stock: number | null;
  price_adjustment: number | null;
  variant_status: "in_stock" | "low_stock" | "out_of_stock";
  variant_image_url: string | null;
}

export interface ProductVariant {
  id: string;
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
  // Pour le frontend uniquement
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price?: number | null;
  image?: string | null;
  category: string;
  subcategory?: string | null;
  status: string;
  supplier_id?: string | null;
  is_customizable?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  customizations?: any;
  variants?: any;
  // Image URL en texte simple pour les variantes
  variant_image_url?: string | null;
  variant_images?: string | null;
  // Additional fields that might be used
  stock?: number | null;
  size?: string | null;
  color?: string | null;
  hex_color?: string | null;
  variant_status?: string | null;
  price_adjustment?: number | null;
  bat?: string | null;
  poids?: string | null;
  format?: string | null;
  quantite?: string | null;
  echantillon?: string | null;
  types_impression?: string | null;
  type_de_materiaux?: string | null;
  details_impression?: string | null;
  orientation_impression?: string | null;
}

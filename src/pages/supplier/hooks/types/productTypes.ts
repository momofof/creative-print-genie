
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
  stock: number;
  price_adjustment: number;
  variant_status: "in_stock" | "low_stock" | "out_of_stock";
  variant_image_url: string | null;
}

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

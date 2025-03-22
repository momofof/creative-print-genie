
export interface ProductData {
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  image: string | null;
  status: 'draft' | 'published' | 'archived';
  is_customizable: boolean;
  // Champs de variantes
  size: string | null;
  color: string | null;
  hex_color: string | null;
  stock: number | null;
  price_adjustment: number | null;
  variant_status: 'in_stock' | 'low_stock' | 'out_of_stock' | null;
  bat: string | null;
  poids: string | null;
  format: string | null;
  quantite: string | null;
  echantillon: string | null;
  types_impression: string | null;
  type_de_materiaux: string | null;
  details_impression: string | null;
  orientation_impression: string | null;
}

export interface ProductVariant {
  id: string;
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
  // Pour le frontend uniquement
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface SupabaseProduct extends ProductData {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  supplier_id: string | null;
  variants: ProductVariant[] | string | null;
  customizations: any[] | string | null;
  variant_images?: Record<string, string[]> | null;
}

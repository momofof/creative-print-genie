
export interface ProductData {
  name: string;
  price: number;
  original_price: number;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  image?: string | null;
  status: 'draft' | 'published' | 'archived';
  is_customizable: boolean;
  // Champs de variantes maintenant intégrés directement
  size?: string | null;
  color?: string | null;
  hex_color?: string | null;
  stock?: number | null;
  price_adjustment?: number | null;
  variant_status?: 'in_stock' | 'low_stock' | 'out_of_stock' | null;
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

export interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  image?: string | null;
  status: string;
  is_customizable: boolean;
  supplier_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  stock?: number | null;
  // Champs de variantes
  size?: string | null;
  color?: string | null;
  hex_color?: string | null;
  price_adjustment?: number | null;
  variant_status?: string | null;
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

// Cette interface n'est plus nécessaire car les variantes sont désormais intégrées
// dans le produit, mais nous la conservons pour la rétrocompatibilité
export interface ProductVariant {
  id: string;
  size?: string | null;
  color?: string | null;
  hex_color?: string | null;
  stock?: number | null;
  price_adjustment?: number | null;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock' | null;
  bat?: string | null;
  poids?: string | null;
  format?: string | null;
  quantite?: string | null;
  echantillon?: string | null;
  types_impression?: string | null;
  type_de_materiaux?: string | null;
  details_impression?: string | null;
  orientation_impression?: string | null;
  isNew?: boolean;
  isDeleted?: boolean;
}

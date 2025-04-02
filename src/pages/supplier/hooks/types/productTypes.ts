
export interface ProductData {
  id?: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  image: string | null;
  status: 'draft' | 'published' | 'archived';
  is_customizable: boolean;
  
  // Champs de variants
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
  variant_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  
  // Options des variantes
  size_options?: string[];
  color_options?: string[];
  format_options?: string[];
  poids_options?: string[];
  bat_options?: string[];
  quantite_options?: string[];
  echantillon_options?: string[];
  types_impression_options?: string[];
  type_de_materiaux_options?: string[];
  details_impression_options?: string[];
  orientation_impression_options?: string[];
  
  // Image de variante
  variant_image_url: string | null;
}

export type VariantOption = {
  id: string;
  name: string;
  value: string;
};

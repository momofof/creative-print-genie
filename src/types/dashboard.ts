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
  name: string;
  description?: string;
  type: "text" | "image";
  position?: "front" | "back" | "sleeve" | "collar";
  price_adjustment?: number;
  is_required?: boolean;
  created_at: string;
  updated_at: string;
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
  // Tableaux de données complexes
  variants: ProductVariant[];
  customizations: Customization[];
  // Nouvelle propriété pour stocker les images des variantes
  variant_images?: Record<string, string[]>;
}

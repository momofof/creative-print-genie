
import { Json } from "@/integrations/supabase/types";

export interface ProductData {
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  description: string | null;
  image: string | null;
  variant_images: Record<string, string> | null;
  status: 'draft' | 'published' | 'archived';
  is_customizable: boolean;
}

export interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment: number | null;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  image?: string | null;
  isNew?: boolean;
  isDeleted?: boolean;
}

// Define a type for the product data returned from Supabase
export interface SupabaseProduct {
  category: string;
  created_at: string | null;
  customizations: Json | null;
  description: string | null;
  id: string;
  image: string | null;
  is_customizable: boolean | null;
  name: string;
  original_price: number | null;
  price: number;
  status: string;
  stock: number | null;
  subcategory: string | null;
  supplier_id: string | null;
  updated_at: string | null;
  variants: Json | null;
  variant_images?: Json | null;
}

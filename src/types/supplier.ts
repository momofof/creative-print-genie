
export interface ProductData {
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  description: string | null;
  image: string | null;
  status: 'draft' | 'published' | 'archived';
  is_customizable: boolean;
  stock: number;
}

export interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment: number | null;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface ProFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Customization {
  id: string;
  name: string;
  description: string;
  type: string;
  position: string;
  price_adjustment: number;
  is_required: boolean;
}
